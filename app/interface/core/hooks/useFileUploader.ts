import { createDocId } from "app/interface/core/utils/createDocId"
import { getStorage, ref, uploadBytes } from "firebase/storage"
import { useMutation } from "react-query"

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
