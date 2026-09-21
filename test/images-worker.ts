import { imageContentType, readImage, storeImage } from "@/service/images"

export default {
  async fetch(request: Request) {
    if (request.method === "GET") {
      return readImage({ fileId: new URL(request.url).pathname.slice(1), width: 640, quality: 75 })
    }
    const bytes = new Uint8Array(await request.arrayBuffer())
    const contentType = imageContentType(bytes)
    if (!contentType) return new Response(null, { status: 400 })
    const fileId = await storeImage(bytes, contentType)
    return Response.json({ fileId }, { status: fileId ? 201 : 400 })
  },
}
