import { afterEach, expect, mock, spyOn, test } from "bun:test"
import * as storageSdk from "firebase/storage"
import { getFirebaseStorage } from "@/lib/firebase-storage"

const environment = process.env.NODE_ENV

afterEach(() => {
  Object.assign(process.env, { NODE_ENV: environment })
  mock.restore()
})

test("development uploads use the same localhost emulator as image downloads", () => {
  Object.assign(process.env, { NODE_ENV: "development" })
  const connect = spyOn(storageSdk, "connectStorageEmulator").mockImplementation(() => {})
  const storage = getFirebaseStorage()

  expect(connect).toHaveBeenCalledWith(storage, "localhost", 9199)
  expect(getFirebaseStorage()).toBe(storage)
})

test("production uploads keep using cloud storage", () => {
  Object.assign(process.env, { NODE_ENV: "production" })
  const connect = spyOn(storageSdk, "connectStorageEmulator").mockImplementation(() => {})

  getFirebaseStorage()

  expect(connect).not.toHaveBeenCalled()
})
