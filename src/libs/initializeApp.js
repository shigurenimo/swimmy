import { firestore, initializeApp } from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'
import { environment } from '../environment'

initializeApp(environment.firebase)

firestore().settings({ timestampsInSnapshots: true })
