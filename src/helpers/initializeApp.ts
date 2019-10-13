import { firestore, initializeApp, performance } from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/performance'
import 'firebase/storage'

initializeApp({
  apiKey: 'AIzaSyD5ApayvhirvS8kST4l3VyyTwUUWQZXgWU',
  authDomain: 'umfzwkzvrtpe.firebaseapp.com',
  databaseURL: 'https://umfzwkzvrtpe.firebaseio.com',
  projectId: 'umfzwkzvrtpe',
  storageBucket: 'umfzwkzvrtpe.appspot.com',
  messagingSenderId: '974311466905',
  appId: '1:974311466905:web:c7fc0cc24a15e6cb'
})

firestore()
  .enablePersistence({ synchronizeTabs: true })
  .catch(err => {
    console.error(err)
  })

performance()
