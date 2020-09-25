import { firestore } from 'firebase/app'
import { map } from 'rxjs/operators'

export const mapQuerySnapToDoc = <T>() => {
  return map((querySnapshot: firestore.QuerySnapshot) => {
    return querySnapshot.empty ? null : (querySnapshot.docs[0].data() as T)
  })
}
