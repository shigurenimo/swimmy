import { IdFactory } from "core"

describe("IdFactory", () => {
  test("create", () => {
    const id = IdFactory.create()

    expect(id.value.length).toBe(21)
  })
})
