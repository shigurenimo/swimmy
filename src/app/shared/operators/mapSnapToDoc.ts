import { firestore } from 'firebase/app'
import { map } from 'rxjs/operators'

export const mapSnapToDoc = <T>() => {
  return map((documentSnapshot: firestore.DocumentSnapshot): T | null => {
    return documentSnapshot.exists ? (documentSnapshot.data() as T) : null
  })
}
