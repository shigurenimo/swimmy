import { createHash } from "node:crypto"
import { createReadStream } from "node:fs"
import { chmod, mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { z } from "zod"
import { createBackupDirectory } from "@/scripts/migration/postgres-snapshot"

const metadataSchema = z.object({
  contentType: z.string().optional(),
  contentDisposition: z.string().optional(),
  contentEncoding: z.string().optional(),
  contentLanguage: z.string().optional(),
  cacheControl: z.string().optional(),
  timeDeleted: z.string().optional(),
})

export const storageManifestSchema = z.object({
  version: z.literal(1),
  bucket: z.string().min(1),
  objects: z.array(
    z.object({
      key: z.string().min(1),
      generation: z.string().regex(/^\d+$/),
      path: z.string().regex(/^objects\/[a-f0-9]{64}$/),
      size: z.number().int().nonnegative(),
      sha256: z.string().regex(/^[a-f0-9]{64}$/),
      metadata: metadataSchema,
    }),
  ),
})

export function storageTargets(manifest: z.infer<typeof storageManifestSchema>) {
  const targets = manifest.objects.map((object) => ({
    ...object,
    targetKey: object.metadata.timeDeleted
      ? `_migration_archive/${manifest.bucket}/${object.path.slice("objects/".length)}`
      : object.key,
  }))
  if (
    new Set(targets.map((object) => object.targetKey)).size !== targets.length ||
    new Set(targets.map((object) => object.path)).size !== targets.length
  )
    throw new Error("現行画像とアーカイブの保存キーが重複しています")
  return targets
}

async function digest(path: string) {
  const hash = createHash("sha256")
  let size = 0
  for await (const chunk of createReadStream(path)) {
    hash.update(chunk)
    size += chunk.length
  }
  return { sha256: hash.digest("hex"), size }
}

async function runWrangler(args: string[]) {
  const child = Bun.spawn(["bunx", "wrangler", ...args], {
    stdout: "pipe",
    stderr: "pipe",
  })
  const [stdout, , status] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ])
  if (status) throw new Error(`Wrangler ${args.slice(0, 3).join(" ")} が失敗しました`)
  return stdout
}

const remoteObjectsSchema = z.object({
  success: z.literal(true),
  result: z.array(
    z.object({
      key: z.string(),
      size: z.number(),
      http_metadata: metadataSchema.omit({ timeDeleted: true }).optional(),
    }),
  ),
  result_info: z
    .object({ cursor: z.string().optional(), is_truncated: z.boolean().optional() })
    .optional(),
})

async function listObjects(account: string, bucket: string) {
  // Wranglerには一覧コマンドがないため、公式APIを既存の認証で呼び出す。
  const auth = z
    .object({ token: z.string().min(1) })
    .parse(JSON.parse(await runWrangler(["auth", "token", "--json"])))
  const objects = []
  let cursor: string | undefined
  do {
    const url = new URL(
      `https://api.cloudflare.com/client/v4/accounts/${account}/r2/buckets/${bucket}/objects`,
    )
    url.searchParams.set("per_page", "1000")
    if (cursor) url.searchParams.set("cursor", cursor)
    const response = await fetch(url, { headers: { Authorization: `Bearer ${auth.token}` } })
    if (!response.ok) throw new Error(`R2一覧の取得に失敗しました: HTTP ${response.status}`)
    const page = remoteObjectsSchema.parse(await response.json())
    objects.push(...page.result)
    const next = page.result_info?.is_truncated ? page.result_info.cursor : undefined
    if (page.result_info?.is_truncated && (!next || next === cursor))
      throw new Error("R2一覧の継続カーソルが不正です")
    cursor = next
  } while (cursor)
  return objects
}

async function transferStorage(manifestPath: string, bucket: string, destination: string) {
  if (!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(bucket)) throw new Error("R2バケット名が不正です")
  const account = "5b7537bae3233beb7ebbcdb7f47c3ec0"
  const manifest = storageManifestSchema.parse(await Bun.file(manifestPath).json())
  const targets = storageTargets(manifest)
  const expected = new Map(targets.map((object) => [object.targetKey, object]))
  for (const object of await listObjects(account, bucket)) {
    if (!expected.has(object.key)) throw new Error("移行先にマニフェスト外の画像があります")
  }
  // 転送前に全バックアップを検査し、壊れた入力による部分更新を防ぐ。
  for (const object of targets) {
    const actual = await digest(resolve(dirname(manifestPath), object.path))
    if (actual.sha256 !== object.sha256 || actual.size !== object.size)
      throw new Error("バックアップの内容がマニフェストと一致しません")
  }
  const directory = await createBackupDirectory(destination)
  await mkdir(resolve(directory, "objects"), { mode: 0o700 })
  const headerFlags = new Map([
    ["contentType", "--content-type"],
    ["contentDisposition", "--content-disposition"],
    ["contentEncoding", "--content-encoding"],
    ["contentLanguage", "--content-language"],
    ["cacheControl", "--cache-control"],
  ])
  for (let offset = 0; offset < targets.length; offset += 4) {
    const completed = await Promise.allSettled(
      targets.slice(offset, offset + 4).map(async (object) => {
        const args = [
          "r2",
          "object",
          "put",
          `${bucket}/${object.targetKey}`,
          "--remote",
          "--file",
          resolve(dirname(manifestPath), object.path),
        ]
        for (const [name, value] of Object.entries(object.metadata)) {
          const flag = headerFlags.get(name)
          if (flag && value) args.push(flag, value)
        }
        await runWrangler(args)
        const download = resolve(directory, object.path)
        await runWrangler([
          "r2",
          "object",
          "get",
          `${bucket}/${object.targetKey}`,
          "--remote",
          "--file",
          download,
        ])
        await chmod(download, 0o600)
        const actual = await digest(download)
        if (actual.sha256 !== object.sha256 || actual.size !== object.size)
          throw new Error("R2から読み戻した画像の内容が一致しません")
      }),
    )
    const failure = completed.find((result) => result.status === "rejected")
    if (failure?.status === "rejected") throw failure.reason
    console.log(
      JSON.stringify({ verified: Math.min(offset + 4, targets.length), total: targets.length }),
    )
  }
  const remote = await listObjects(account, bucket)
  if (
    remote.length !== targets.length ||
    new Set(remote.map((object) => object.key)).size !== targets.length ||
    remote.some((object) => expected.get(object.key)?.size !== object.size)
  )
    throw new Error("R2のキー集合またはサイズが一致しません")
  for (const object of remote) {
    const source = expected.get(object.key)
    if (!source) throw new Error("R2にマニフェスト外の画像があります")
    const actual = new Map(Object.entries(object.http_metadata ?? {}))
    for (const [name, value] of Object.entries(source.metadata)) {
      if (headerFlags.has(name) && actual.get(name) !== value)
        throw new Error("R2の配信メタデータが一致しません")
    }
  }
  await writeFile(
    resolve(directory, "verification.json"),
    JSON.stringify(
      {
        verifiedAt: new Date().toISOString(),
        bucket,
        objects: targets.length,
        archived: targets.filter((object) => object.metadata.timeDeleted).length,
        bytes: targets.reduce((sum, object) => sum + object.size, 0),
        contents: "match",
        keys: "match",
        metadata: "match",
      },
      null,
      2,
    ),
    { mode: 0o600, flag: "wx" },
  )
}

if (import.meta.main) {
  try {
    const [manifest, bucket, destination] = process.argv.slice(2)
    if (!manifest || !bucket || !destination)
      throw new Error(
        "使い方: bun scripts/migration/transfer-storage.ts <manifest.json> <R2バケット> <新しい検証保存先>",
      )
    await transferStorage(resolve(manifest), bucket, destination)
  } catch (error) {
    console.error(error instanceof Error ? error.message : "R2転送・照合に失敗しました")
    process.exitCode = 1
  }
}
