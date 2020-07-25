import { firestore, storage } from 'firebase/app'
import { useEffect, useState } from 'react'
import { docData } from 'rxfire/firestore'
import { put } from 'rxfire/storage'
import { createId } from '../../firestore/createId'
import { File as DocFile } from '../../firestore/types/file'
import { filterEmpty } from '../../operators/filterEmpty'

export const useFile = (
  next: (image: DocFile) => void
): [boolean, (file: File) => void] => {
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (!file) return

    const fileId = createId()

    const ref = storage().ref(`posts/${fileId}`)

    put(ref, file).subscribe()

    const subscription = docData<DocFile>(
      firestore()
        .collection('files')
        .doc(fileId)
    )
      .pipe(filterEmpty())
      .subscribe(image => {
        subscription.unsubscribe()
        setFile(null)
        next(image)
      })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  const run = (_file: File) => {
    if (file !== null) {
      return
    }

    setFile(_file)
  }

  return [file !== null, run]
}
