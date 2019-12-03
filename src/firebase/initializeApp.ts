import 'firebase/analytics'
import {
  analytics,
  firestore,
  initializeApp,
  performance,
  remoteConfig,
} from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/performance'
import 'firebase/remote-config'
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

analytics()

analytics().setUserProperties({ userAgent: window.navigator.userAgent })

remoteConfig().settings = {
  fetchTimeoutMillis: 4000,
  minimumFetchIntervalMillis: 3600000,
}

remoteConfig().defaultConfig = {
  // eslint-disable-next-line @typescript-eslint/camelcase
  home_posts_limit: 16,
}

remoteConfig().fetchAndActivate()

/*
auth()
  .signInAnonymously()
  .then(res => {
    if (res.user) {
      console.log(auth().currentUser)
    }
  })
*/
