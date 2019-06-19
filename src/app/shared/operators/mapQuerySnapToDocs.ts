import { firestore } from 'firebase/app'
import { map } from 'rxjs/operators'

export const mapQuerySnapToDocs = <T>() => {
  return map((querySnapshot: firestore.QuerySnapshot): T[] => {
    return querySnapshot.docs.map(doc => doc.data() as T)
  })
}
