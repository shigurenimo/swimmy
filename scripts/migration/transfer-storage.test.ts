import { expect, test } from "bun:test"
import { storageManifestSchema, storageTargets } from "@/scripts/migration/transfer-storage"

const current = {
  key: "original-image",
  generation: "2",
  path: `objects/${"a".repeat(64)}`,
  size: 100,
  sha256: "c".repeat(64),
  metadata: { contentType: "image/png" },
}

test("旧世代を現行キーに上書きせず、削除済み画像もアーカイブする", () => {
  const manifest = storageManifestSchema.parse({
    version: 1,
    bucket: "source.example.com",
    objects: [
      current,
      {
        ...current,
        generation: "1",
        path: `objects/${"b".repeat(64)}`,
        metadata: { timeDeleted: "2026-09-06T00:00:00Z" },
      },
    ],
  })
  const targets = storageTargets(manifest)
  expect(targets[0]?.targetKey).toBe(current.key)
  expect(targets[1]?.targetKey).toBe(`_migration_archive/source.example.com/${"b".repeat(64)}`)
})

test("転送先が衝突するマニフェストを拒否する", () => {
  expect(() =>
    storageTargets({ version: 1, bucket: "source", objects: [current, current] }),
  ).toThrow("重複")
})

test("バックアップ外へのパストラバーサルを拒否する", () => {
  expect(
    storageManifestSchema.safeParse({
      version: 1,
      bucket: "source",
      objects: [{ ...current, path: "../../secret" }],
    }).success,
  ).toBe(false)
})
