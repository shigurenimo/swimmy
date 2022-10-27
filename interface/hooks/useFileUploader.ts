import { useMutation } from "@tanstack/react-query"
import { getStorage, ref, uploadBytes } from "firebase/storage"
import { createDocId } from "interface/utils/createDocId"

export const useFileUploader = () => {
  const upload = async (file: File) => {
    const storage = getStorage()

    const fileId = createDocId()

    const fileRef = ref(storage, fileId)

    await uploadBytes(fileRef, file)

    return fileId
  }

  return useMutation(upload)
}
