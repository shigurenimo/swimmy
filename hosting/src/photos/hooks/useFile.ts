import firebase from 'firebase/app'
import { useEffect, useState } from 'react'
import { docData } from 'rxfire/firestore'
import { put } from 'rxfire/storage'
import { createId } from '../../firebase/createId'
import { File as DocFile } from '../../firebase/types/file'
import { filterEmpty } from '../../post/helpers/filterEmpty'

export const useFile = (
  next: (image: DocFile) => void
): [boolean, (file: File) => void] => {
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (!file) return

    const fileId = createId()

    const ref = firebase.storage().ref(`posts/${fileId}`)

    put(ref, file).subscribe()

    const subscription = docData<DocFile>(
      firebase.firestore().collection('files').doc(fileId)
    )
      .pipe(filterEmpty())
      .subscribe((image) => {
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
