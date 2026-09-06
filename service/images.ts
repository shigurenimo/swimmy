import { nanoid } from "nanoid"

export function imageContentType(bytes: Uint8Array) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg"
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value))
    return "image/png"
  const header = new TextDecoder().decode(bytes.slice(0, 12))
  if (header.startsWith("GIF87a") || header.startsWith("GIF89a")) return "image/gif"
  if (header.startsWith("RIFF") && header.slice(8) === "WEBP") return "image/webp"
  return null
}

export async function storeImage(bytes: Uint8Array, contentType: string) {
  const { env } = await import("cloudflare:workers")
  const fileId = nanoid(20)
  await env.BUCKET.put(fileId, bytes, {
    httpMetadata: { contentType, cacheControl: "public, max-age=86400" },
  })
  return fileId
}

export async function readImage(props: { fileId: string; width: number; quality: number }) {
  const { env } = await import("cloudflare:workers")
  const object = await env.BUCKET.get(props.fileId)
  if (!object) return Response.json({ message: "画像が見つかりません" }, { status: 404 })

  const image = await env.IMAGES.input(object.body)
    .transform({ width: props.width })
    .output({ format: "image/png", quality: props.quality })
  return image.response({ headers: { "Cache-Control": "public, max-age=86400" } })
}
