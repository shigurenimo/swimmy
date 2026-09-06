import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getStorage } from "firebase-admin/storage"
import sharp from "sharp"
import { z } from "zod"
import { firebaseConfig } from "@/lib/firebase"

function initializeFirebase() {
  if (getApps().length > 0) {
    return
  }

  if (process.env.NODE_ENV === "development") {
    process.env.FIREBASE_AUTH_EMULATOR_HOST ??= "localhost:9099"
    process.env.FIRESTORE_EMULATOR_HOST ??= "localhost:8080"
    process.env.FIREBASE_STORAGE_EMULATOR_HOST ??= "localhost:9199"

    initializeApp({
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
    })
    return
  }

  const credentials = z
    .object({
      clientEmail: z.email(),
      privateKey: z.string().min(1),
    })
    .parse({
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    })

  initializeApp({
    credential: cert({
      clientEmail: credentials.clientEmail,
      privateKey: credentials.privateKey.replace(/\\n/g, "\n"),
      projectId: firebaseConfig.projectId,
    }),
    storageBucket: firebaseConfig.storageBucket,
  })
}

export async function readImage(props: { fileId: string; width: number; quality: number }) {
  initializeFirebase()

  const [file] = await getStorage().bucket().file(props.fileId).download({ validation: false })

  return sharp(file).resize(props.width).png({ quality: props.quality }).toBuffer()
}
