import { spyOn } from "bun:test"

export function mockFetch(
  handler: (...args: Parameters<typeof fetch>) => ReturnType<typeof fetch>,
) {
  return spyOn(globalThis, "fetch").mockImplementation(
    Object.assign(handler, { preconnect: fetch.preconnect }),
  )
}
