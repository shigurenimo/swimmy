import { firestore, initializeApp } from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

initializeApp({
  apiKey: 'AIzaSyD5ApayvhirvS8kST4l3VyyTwUUWQZXgWU',
  authDomain: 'umfzwkzvrtpe.firebaseapp.com',
  databaseURL: 'https://umfzwkzvrtpe.firebaseio.com',
  projectId: 'umfzwkzvrtpe',
  storageBucket: 'umfzwkzvrtpe.appspot.com',
  messagingSenderId: '974311466905'
})

firestore().settings({ timestampsInSnapshots: true })

firestore()
  .enablePersistence({ experimentalTabSynchronization: true })
  .catch(err => {
    console.log(err)
  })
