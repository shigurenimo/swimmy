import { doc, getFirestore } from 'firebase/firestore'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { docData } from 'rxfire/firestore'
import { File as DocFile } from 'src/core/types/file'
import { createId } from 'src/core/utils/createId'
import { filterEmpty } from 'src/post/utils/filterEmpty'

type State = [(file: File) => void, { isLoading: boolean }]

export const useFile = (next: (image: DocFile) => void): State => {
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (!file) return

    const fileId = createId()

    const storageRef = ref(getStorage(), `posts/${fileId}`)

    uploadBytes(storageRef, file)

    const docRef = doc(getFirestore(), 'files', fileId) as any

    const subscription = docData<DocFile>(docRef)
      .pipe(filterEmpty())
      .subscribe((image) => {
        subscription.unsubscribe()
        setFile(null)
        next(image)
      })

    return () => {
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  const uploadFile = (_file: File) => {
    if (file !== null) {
      return
    }

    setFile(_file)
  }

  const isLoading = file !== null

  return [uploadFile, { isLoading }]
}
