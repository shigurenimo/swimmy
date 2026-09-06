import { createHash } from "node:crypto"
import { createReadStream, existsSync } from "node:fs"
import { chmod, mkdir, stat, writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import { resolve } from "node:path"
import { applicationDefault, cert, deleteApp, initializeApp } from "firebase-admin/app"
import { getStorage } from "firebase-admin/storage"
import { firebaseConfig } from "@/lib/firebase"
import { createBackupDirectory } from "@/scripts/migration/postgres-snapshot"

async function checksum(path: string) {
  const sha256 = createHash("sha256")
  const md5 = createHash("md5")
  for await (const chunk of createReadStream(path)) {
    sha256.update(chunk)
    md5.update(chunk)
  }
  return { sha256: sha256.digest("hex"), md5: md5.digest("base64") }
}

async function backupStorage(destination: string) {
  if (process.env.FIREBASE_STORAGE_EMULATOR_HOST || process.env.STORAGE_EMULATOR_HOST) {
    throw new Error("本番バックアップではStorageエミュレーターの環境変数を解除してください")
  }
  const email = process.env.FIREBASE_CLIENT_EMAIL
  const key = process.env.FIREBASE_PRIVATE_KEY
  if (
    !(email && key) &&
    !process.env.GOOGLE_APPLICATION_CREDENTIALS &&
    !existsSync(resolve(homedir(), ".config/gcloud/application_default_credentials.json"))
  ) {
    throw new Error(
      "既存の読み取り用Google資格情報が必要です。GOOGLE_APPLICATION_CREDENTIALSなどで指定してください",
    )
  }
  const app = initializeApp(
    {
      credential:
        email && key
          ? cert({
              projectId: firebaseConfig.projectId,
              clientEmail: email,
              privateKey: key.replaceAll("\\n", "\n"),
            })
          : applicationDefault(),
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
    },
    "migration-backup",
  )
  try {
    const bucket = getStorage(app).bucket()
    const [bucketMetadata] = await bucket.getMetadata()
    const objects = []
    let pageToken: string | undefined
    do {
      const [files, next] = await bucket.getFiles({
        autoPaginate: false,
        maxResults: 1000,
        versions: true,
        pageToken,
      })
      for (const file of files) {
        const metadata = file.metadata
        const generation = String(metadata.generation ?? "")
        if (!generation || metadata.size === undefined || !metadata.crc32c)
          throw new Error("世代・サイズ・CRC32Cを取得できないオブジェクトがあります")
        const localName = createHash("sha256").update(`${file.name}\0${generation}`).digest("hex")
        objects.push({ key: file.name, generation, path: `objects/${localName}`, metadata })
      }
      pageToken = next?.pageToken
    } while (pageToken)

    const directory = await createBackupDirectory(destination)
    await mkdir(resolve(directory, "objects"), { mode: 0o700 })
    await writeFile(
      resolve(directory, "inventory.json"),
      JSON.stringify(
        {
          version: 1,
          capturedAt: new Date().toISOString(),
          bucket: bucket.name,
          bucketMetadata,
          objects,
        },
        null,
        2,
      ),
      { mode: 0o600, flag: "wx" },
    )
    const completed = []
    let bytes = 0
    for (const object of objects) {
      const path = resolve(directory, object.path)
      await bucket
        .file(object.key, { generation: object.generation })
        .download({ destination: path, validation: "crc32c", decompress: false })
      await chmod(path, 0o600)
      const size = (await stat(path)).size
      const hashes = await checksum(path)
      if (
        String(size) !== String(object.metadata.size) ||
        (object.metadata.md5Hash && hashes.md5 !== object.metadata.md5Hash)
      )
        throw new Error("保存した画像のサイズまたはチェックサムが一致しません")
      completed.push({ ...object, size, ...hashes })
      bytes += size
    }
    await writeFile(
      resolve(directory, "manifest.json"),
      JSON.stringify(
        {
          version: 1,
          completedAt: new Date().toISOString(),
          bucket: bucket.name,
          bytes,
          objects: completed,
        },
        null,
        2,
      ),
      { mode: 0o600, flag: "wx" },
    )
    console.log(JSON.stringify({ directory, objects: completed.length, bytes }))
  } finally {
    await deleteApp(app)
  }
}

if (import.meta.main) {
  try {
    const destination = process.argv[2]
    if (!destination)
      throw new Error("使い方: bun scripts/migration/backup-storage.ts <新しい保存ディレクトリ>")
    await backupStorage(destination)
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Storageバックアップに失敗しました")
    process.exitCode = 1
  }
}
