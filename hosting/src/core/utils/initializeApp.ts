import { initializeApp } from 'firebase/app'
import { getPerformance } from 'firebase/performance'

const app = initializeApp({
  apiKey: 'AIzaSyD5ApayvhirvS8kST4l3VyyTwUUWQZXgWU',
  appId: '1:974311466905:web:c7fc0cc24a15e6cb',
  authDomain: 'umfzwkzvrtpe.firebaseapp.com',
  databaseURL: 'https://umfzwkzvrtpe.firebaseio.com',
  measurementId: 'G-7Z9GJX22M5',
  messagingSenderId: '974311466905',
  projectId: 'umfzwkzvrtpe',
  storageBucket: 'umfzwkzvrtpe.appspot.com',
})

getPerformance(app)
