import { useMutation } from "@tanstack/react-query"
import { ref, uploadBytes } from "firebase/storage"
import { nanoid } from "nanoid"
import { getFirebaseStorage } from "@/lib/firebase-storage"

export const useFileUploader = () => {
  const upload = async (file: File) => {
    const storage = getFirebaseStorage()

    const fileId = nanoid(20)

    const fileRef = ref(storage, fileId)

    await uploadBytes(fileRef, file)

    return fileId
  }

  return useMutation({ mutationFn: upload })
}
