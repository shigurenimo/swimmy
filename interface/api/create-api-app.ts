import { Hono } from "hono"
import { bodyLimit } from "hono/body-limit"
import { z } from "zod"
import { createPostInputSchema } from "@/interface/api/create-post-input-schema"
import { createReactionInputSchema } from "@/interface/api/create-reaction-input-schema"
import { idSchema } from "@/interface/api/id-schema"
import { toPostsPage } from "@/interface/api/to-posts-page"
import { imageContentType, imagesExist, readImage, storeImage } from "@/service/images"
import {
  addReaction,
  countPosts,
  countResponses,
  createPost,
  listPosts,
  listResponses,
  readPost,
} from "@/service/posts"

const pageSize = 40

export function createApiApp() {
  const app = new Hono().basePath("/api")

  app.onError((error, context) => {
    console.error(error)
    return context.json({ message: "サーバーエラーが発生しました" }, 500)
  })

  for (const resource of ["posts", "threads"]) {
    app.get(`/${resource}`, async (context) => {
      const cursor = idSchema.nullable().safeParse(context.req.query("after") ?? null)

      if (!cursor.success) {
        return context.json({ message: "リクエストが不正です" }, 400)
      }

      const threadsOnly = resource === "threads"
      const [nodes, totalCount] = await Promise.all([
        listPosts({ cursor: cursor.data, limit: pageSize + 1, threadsOnly }),
        countPosts(threadsOnly),
      ])

      return context.json(toPostsPage({ nodes, totalCount, take: pageSize }))
    })
  }

  app.post("/posts", async (context) => {
    const input = createPostInputSchema.safeParse(await context.req.json().catch(() => null))

    if (!input.success) {
      return context.json({ message: "リクエストが不正です" }, 400)
    }

    if (!(await imagesExist(input.data.fileIds))) {
      return context.json(
        { message: "添付画像が見つかりません。画像を再アップロードしてください" },
        400,
      )
    }

    const postId = await createPost(input.data)
    if (postId === null) {
      return context.json({ message: "返信先の投稿が見つかりません" }, 404)
    }
    const post = await readPost(postId)

    return post ? context.json(post, 201) : context.json({ message: "投稿が見つかりません" }, 500)
  })

  app.post("/posts/:postId/reactions", async (context) => {
    const params = idSchema.safeParse(context.req.param("postId"))
    const input = createReactionInputSchema.safeParse(await context.req.json().catch(() => null))

    if (!params.success || !input.success) {
      return context.json({ message: "リクエストが不正です" }, 400)
    }

    await addReaction(params.data, input.data.text)
    const post = await readPost(params.data)

    return post ? context.json(post, 201) : context.json({ message: "投稿が見つかりません" }, 404)
  })

  app.get("/threads/:threadId", async (context) => {
    const threadId = idSchema.safeParse(context.req.param("threadId"))

    if (!threadId.success) {
      return context.json({ message: "リクエストが不正です" }, 400)
    }

    const post = await readPost(threadId.data)

    return post ? context.json(post) : context.json({ message: "スレッドが見つかりません" }, 404)
  })

  app.get("/threads/:threadId/responses", async (context) => {
    const threadId = idSchema.safeParse(context.req.param("threadId"))
    const cursor = idSchema.nullable().safeParse(context.req.query("after") ?? null)

    if (!threadId.success || !cursor.success) {
      return context.json({ message: "リクエストが不正です" }, 400)
    }

    const [nodes, totalCount] = await Promise.all([
      listResponses({ threadId: threadId.data, cursor: cursor.data, limit: pageSize + 1 }),
      countResponses(threadId.data),
    ])

    return context.json(toPostsPage({ nodes, totalCount, take: pageSize }))
  })

  app.get("/images/:fileId", async (context) => {
    const params = z
      .object({
        fileId: idSchema,
        width: z.coerce.number().int().min(1).max(3840),
        quality: z.coerce.number().int().min(1).max(100),
      })
      .safeParse({
        fileId: context.req.param("fileId"),
        width: context.req.query("w") ?? "640",
        quality: context.req.query("q") ?? "75",
      })

    if (!params.success) {
      return context.json({ message: "リクエストが不正です" }, 400)
    }

    return readImage(params.data)
  })

  app.post(
    "/images",
    bodyLimit({
      maxSize: 8 * 1024 * 1024,
      onError: (context) => context.json({ message: "画像は8 MiB以下にしてください" }, 413),
    }),
    async (context) => {
      const bytes = new Uint8Array(await context.req.arrayBuffer())
      const contentType = imageContentType(bytes)
      if (!contentType)
        return context.json({ message: "JPEG・PNG・GIF・WebP画像を選択してください" }, 400)
      const fileId = await storeImage(bytes, contentType)
      return context.json({ fileId }, 201)
    },
  )

  return app
}
