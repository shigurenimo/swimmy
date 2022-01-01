import { IdFactory } from "integrations/domain"

describe("IdFactory", () => {
  test("create", () => {
    const id = IdFactory.create()

    expect(id.value.length).toBe(21)
  })
})
