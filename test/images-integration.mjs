import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { Miniflare } from "miniflare"

const runtime = new Miniflare({
  workers: [
    {
      config: {
        name: "images-test",
        type: "worker",
        compatibilityDate: "2026-09-06",
        manifest: {
          mainModule: "index.js",
          modules: {
            "index.js": { type: "esm", contents: readFileSync(0, "utf8") },
          },
        },
        env: { BUCKET: { type: "r2", name: "images-test" }, IMAGES: { type: "images" } },
      },
    },
  ],
})
try {
  const bucket = await runtime.getR2Bucket("BUCKET")
  for (const bytes of [
    [137, 80, 78, 71, 13, 10, 26, 10],
    readFileSync("public/icons/icon-192.png").subarray(0, 64),
    [255, 216, 255],
    new TextEncoder().encode("GIF89a"),
    new TextEncoder().encode("RIFF0000WEBP"),
  ]) {
    const response = await runtime.dispatchFetch("http://localhost/", {
      method: "POST",
      body: new Uint8Array(bytes),
    })
    assert.equal(response.status, 400, await response.text())
    assert.equal((await bucket.list()).objects.length, 0)
  }
  const bytes = readFileSync("public/icons/icon-192.png")
  const response = await runtime.dispatchFetch("http://localhost/", { method: "POST", body: bytes })
  assert.equal(response.status, 201)
  const { fileId } = await response.json()
  const stored = await bucket.get(fileId)
  assert.ok(stored)
  assert.deepEqual(Buffer.from(await stored.arrayBuffer()), bytes)
  const image = await runtime.dispatchFetch(`http://localhost/${fileId}`)
  assert.equal(image.status, 200)
  assert.equal(image.headers.get("content-type"), "image/png")
  assert.ok((await image.arrayBuffer()).byteLength > 8)
} finally {
  await runtime.dispose()
}
