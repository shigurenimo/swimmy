import { getApps, initializeApp } from "firebase/app"
import { connectStorageEmulator, getStorage } from "firebase/storage"
import { firebaseConfig } from "@/lib/firebase"

export function getFirebaseStorage() {
  const app = getApps()[0] ?? initializeApp(firebaseConfig)
  const storage = getStorage(app)

  if (process.env.NODE_ENV === "development") {
    connectStorageEmulator(storage, "localhost", 9199)
  }

  return storage
}
