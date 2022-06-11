import { IdFactory } from "app/domain"

describe("IdFactory", () => {
  test("create", () => {
    const id = IdFactory.create()

    expect(id.value.length).toBe(21)
  })
})
