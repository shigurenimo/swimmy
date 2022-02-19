import { getApps, initializeApp } from "firebase/app"
import {
  connectAuthEmulator,
  getAuth,
  inMemoryPersistence,
  setPersistence,
} from "firebase/auth"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"
import { getPerformance } from "firebase/performance"
import { connectStorageEmulator, getStorage } from "firebase/storage"
import "integrations/errors"
import { useEffect } from "react"

export const useFirebase = () => {
  useEffect(() => {
    if (typeof window === "undefined" || getApps().length !== 0) return

    const app = initializeApp({
      apiKey: "AIzaSyBCojMAj-JQxc4-Ceu8nppJO_qx-gKYliU",
      authDomain: "fqcwljdj7qt9rphssvk3.firebaseapp.com",
      projectId: "fqcwljdj7qt9rphssvk3",
      storageBucket: "fqcwljdj7qt9rphssvk3.appspot.com",
      messagingSenderId: "511409109964",
      appId: "1:511409109964:web:1e5502c45cb09581223b69",
      measurementId: "G-HEP2VBXJZR",
    })

    getPerformance(app)

    setPersistence(getAuth(), inMemoryPersistence)

    if (process.env.NODE_ENV === "development") {
      connectAuthEmulator(getAuth(), "http://localhost:9099")
      connectFirestoreEmulator(getFirestore(), "localhost", 8080)
      connectStorageEmulator(getStorage(), "localhost", 9199)
    }
  }, [])
}
