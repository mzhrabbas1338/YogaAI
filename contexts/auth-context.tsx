"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { demoAuth, type DemoUser } from "@/lib/demo-auth"

// Firebase types for compatibility
interface FirebaseUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  metadata: {
    creationTime?: string
    lastSignInTime?: string
  }
}

type User = DemoUser | FirebaseUser

interface AuthContextType {
  currentUser: User | null
  loading: boolean
  signup: (email: string, password: string, name: string) => Promise<User>
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  googleSignIn: () => Promise<User>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>
  isDemo: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const [firebaseAuth, setFirebaseAuth] = useState<any>(null)

  // Check if Firebase is configured
  const isFirebaseConfigured = () => {
    return !!(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    )
  }

  // Initialize auth (Firebase or Demo)
  useEffect(() => {
    const initAuth = async () => {
      if (isFirebaseConfigured()) {
        try {
          // Try to initialize Firebase
          const { auth } = await import("@/lib/firebase")
          const { onAuthStateChanged } = await import("firebase/auth")

          setFirebaseAuth(auth)
          setIsDemo(false)

          const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setLoading(false)
          })

          return unsubscribe
        } catch (error) {
          console.warn("Firebase initialization failed, using demo mode:", error)
          initDemoMode()
        }
      } else {
        console.log("Firebase not configured, using demo mode")
        initDemoMode()
      }
    }

    const initDemoMode = () => {
      setIsDemo(true)
      const unsubscribe = demoAuth.onAuthStateChanged((user) => {
        setCurrentUser(user)
        setLoading(false)
      })
      return unsubscribe
    }

    initAuth()
  }, [])

  // Auth functions
  async function signup(email: string, password: string, name: string): Promise<User> {
    if (isDemo) {
      const result = await demoAuth.createUserWithEmailAndPassword(email, password)
      await demoAuth.updateProfile({ displayName: name })
      return result.user
    } else if (firebaseAuth) {
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password)
      await updateProfile(userCredential.user, { displayName: name })
      return userCredential.user
    }
    throw new Error("Auth not initialized")
  }

  async function login(email: string, password: string): Promise<User> {
    if (isDemo) {
      const result = await demoAuth.signInWithEmailAndPassword(email, password)
      return result.user
    } else if (firebaseAuth) {
      const { signInWithEmailAndPassword } = await import("firebase/auth")
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password)
      return userCredential.user
    }
    throw new Error("Auth not initialized")
  }

  async function logout(): Promise<void> {
    if (isDemo) {
      await demoAuth.signOut()
    } else if (firebaseAuth) {
      const { signOut } = await import("firebase/auth")
      await signOut(firebaseAuth)
    }
  }

  async function googleSignIn(): Promise<User> {
    if (isDemo) {
      const result = await demoAuth.signInWithPopup()
      return result.user
    } else if (firebaseAuth) {
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth")
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(firebaseAuth, provider)
      return result.user
    }
    throw new Error("Auth not initialized")
  }

  async function resetPassword(email: string): Promise<void> {
    if (isDemo) {
      // Simulate password reset
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return
    } else if (firebaseAuth) {
      const { sendPasswordResetEmail } = await import("firebase/auth")
      await sendPasswordResetEmail(firebaseAuth, email)
    }
  }

  async function updateUserProfile(displayName: string, photoURL?: string): Promise<void> {
    if (isDemo) {
      await demoAuth.updateProfile({ displayName, photoURL })
    } else if (currentUser && firebaseAuth) {
      const { updateProfile } = await import("firebase/auth")
      await updateProfile(currentUser as any, { displayName, photoURL })
    }
  }

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    googleSignIn,
    resetPassword,
    updateUserProfile,
    isDemo,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
