import { defineMiddleware } from "void"
import { idSchema } from "@/api/id-schema"
import { notFoundResponse } from "@/service/not-found-response"
import { loadBoard, type BoardData } from "@/service/load-board"

declare module "void" {
  interface CloudContextVariables {
    shared: { board?: BoardData }
  }
}

export default defineMiddleware(async (c, next) => {
  const path = c.req.path
  const match = /^\/threads\/([^/]+)$/.exec(path)
  if (!["/", "/threads"].includes(path) && !match) return next()
  if (!["GET", "HEAD"].includes(c.req.method)) return next()

  if (!match) {
    const legacyId = idSchema.safeParse(c.req.query("threadId"))
    if (legacyId.success) {
      // Void's c.redirect carries the original query; the canonical URL must drop threadId.
      return new Response(null, {
        status: 308,
        headers: { Location: `/threads/${encodeURIComponent(legacyId.data)}` },
      })
    }
  }
  const id = match ? idSchema.safeParse(match[1]) : null
  const board = id?.success === false ? null : await loadBoard(id?.data ?? null)
  if (!board) return notFoundResponse()
  c.set("shared", { board })
  await next()
})
