import { captureException } from "@sentry/node"
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { z } from "zod"

export class FirebaseAdapter {
  async initialize() {
    try {
      if (getApps().length !== 0) {
        return null
      }

      if (process.env.NODE_ENV === "development") {
        process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099"
        process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080"
        process.env.FIREBASE_STORAGE_EMULATOR_HOST = "localhost:9199"
      }

      const zCredentials = z.object({
        projectId: z.string(),
        clientEmail: z.string().email(),
        privateKey: z.string(),
      })

      const { projectId, clientEmail, privateKey } = zCredentials.parse({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      })

      initializeApp({
        credential: cert({
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n").replace(/\\/g, ""),
          projectId,
        }),
        storageBucket: `${projectId}.appspot.com`,
      })
    } catch (error) {
      captureException(error)

      if (error instanceof Error) {
        return new Error(error.message)
      }

      throw error
    }
  }
}
