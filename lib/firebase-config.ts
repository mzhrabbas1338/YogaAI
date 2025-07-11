import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"


// Check if Firebase is properly configured
export function isFirebaseConfigured(): boolean {
  const requiredEnvVars = [
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  ]

  const isConfigured = requiredEnvVars.every((envVar) => envVar && envVar.length > 0)

  if (!isConfigured) {
    console.warn("Firebase configuration is incomplete. Missing environment variables:")
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) console.warn("- NEXT_PUBLIC_FIREBASE_API_KEY")
    if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) console.warn("- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN")
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) console.warn("- NEXT_PUBLIC_FIREBASE_PROJECT_ID")
    if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) console.warn("- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET")
    if (!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID)
      console.warn("- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID")
    if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) console.warn("- NEXT_PUBLIC_FIREBASE_APP_ID")
  }

  return isConfigured
}

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase only if properly configured
let app: any = null
let auth: any = null
let db: any = null

if (isFirebaseConfigured()) {
  try {
    // Initialize Firebase (only once)
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

    // Initialize Firebase services
    auth = getAuth(app)
    db = getFirestore(app)

    console.log("Firebase initialized successfully")
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
} else {
  console.warn("Firebase not initialized due to missing configuration")
}

export { auth, db }
export default app
