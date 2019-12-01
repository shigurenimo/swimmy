import { firestore, initializeApp, performance } from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/performance'
import 'firebase/storage'

initializeApp({
  apiKey: 'AIzaSyD5ApayvhirvS8kST4l3VyyTwUUWQZXgWU',
  appId: '1:974311466905:web:c7fc0cc24a15e6cb',
  authDomain: 'umfzwkzvrtpe.firebaseapp.com',
  databaseURL: 'https://umfzwkzvrtpe.firebaseio.com',
  measurementId: 'G-7Z9GJX22M5',
  messagingSenderId: '974311466905',
  projectId: 'umfzwkzvrtpe',
  storageBucket: 'umfzwkzvrtpe.appspot.com',
})

firestore()
  .enablePersistence({ synchronizeTabs: true })
  .catch(err => {
    console.error(err)
  })

performance()
