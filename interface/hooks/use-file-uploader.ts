import { useMutation } from "@tanstack/react-query"
import { getStorage, ref, uploadBytes } from "firebase/storage"
import { nanoid } from "nanoid"

export const useFileUploader = () => {
  const upload = async (file: File) => {
    const storage = getStorage()

    const fileId = nanoid(20)

    const fileRef = ref(storage, fileId)

    await uploadBytes(fileRef, file)

    return fileId
  }

  return useMutation({ mutationFn: upload })
}
