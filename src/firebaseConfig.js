import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyClyYGT48WiyqbbqEAZ5RsqRZgUGQulk3I',
  authDomain: 'taskmaster-pro-4370e.firebaseapp.com',
  projectId: 'taskmaster-pro-4370e',
  storageBucket: 'taskmaster-pro-4370e',
  messagingSenderId: '177675917268',
  appId: '1:177675917268:web:ed209ebb97d3aeed7ce841',
  measurementId: 'G-LL18Q2QV8G',
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export { auth, googleProvider, analytics }
