import { expect, test } from "bun:test"

test("image decoding rejects corrupt files and preserves valid uploads in R2", async () => {
  const build = await Bun.build({
    entrypoints: ["test/images-worker.ts"],
    target: "browser",
    external: ["cloudflare:workers"],
  })
  expect(build.success).toBe(true)
  // Miniflare's image decoder needs Node; Bun cannot run its native image processing.
  const process = Bun.spawn(["node", "test/images-integration.mjs"], {
    stdin: build.outputs[0],
    stdout: "pipe",
    stderr: "pipe",
  })
  const [exitCode, stderr] = await Promise.all([
    process.exited,
    new Response(process.stderr).text(),
  ])
  expect({ exitCode, stderr }).toEqual({ exitCode: 0, stderr: "" })
}, 15000)
