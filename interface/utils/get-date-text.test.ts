import { expect, test } from "bun:test"
import { getDateText } from "@/interface/utils/get-date-text"

const postedAt = new Date(2024, 0, 2, 12)

test.each([
  [0, "いま"],
  [59_999, "いま"],
  [60_000, "1分前"],
  [3_599_999, "59分前"],
  [3_600_000, "1時間前"],
  [86_399_999, "23時間前"],
  [86_400_000, "1日前（1月2日）"],
  [30 * 86_400_000, "30日前（1月2日）"],
  [(365 / 12) * 86_400_000, "1ヶ月前（2024年1月2日）"],
  [364 * 86_400_000, "11ヶ月前（2024年1月2日）"],
  [365 * 86_400_000, "2024年01月02日"],
])("formats elapsed time %d", (milliseconds, expected) => {
  expect(getDateText(postedAt, new Date(postedAt.getTime() + milliseconds))).toBe(expected)
})
