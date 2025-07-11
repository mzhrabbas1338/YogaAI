"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase-config"
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  resetPassword,
  updateUserProfile,
  changePassword,
  deleteUserAccount,
  getUserProfile,
  resendEmailVerification,
  type UserProfile,
} from "@/lib/firebase-auth"


interface AuthContextType {
  // User state
  currentUser: User | null
  userProfile: UserProfile | null
  loading: boolean

  // Authentication methods
  signUp: (email: string, password: string, displayName: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<User>
  signInWithGoogle: () => Promise<User>
  signOut: () => Promise<void>

  // Profile management
  updateProfile: (updates: {
    displayName?: string
    photoURL?: string
    fitnessGoals?: string[]
  }) => Promise<string>

  // Password management
  resetPassword: (email: string) => Promise<string>
  changePassword: (currentPassword: string, newPassword: string) => Promise<string>

  // Account management
  deleteAccount: (password: string) => Promise<string>
  resendVerification: () => Promise<string>

  // Utility
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useFirebaseAuth must be used within a FirebaseAuthProvider")
  }
  return context
}

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (user) {
        // Load user profile from Firestore
        const profile = await getUserProfile(user.uid)
        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (currentUser) {
      const profile = await getUserProfile(currentUser.uid)
      setUserProfile(profile)
    }
  }

  // Authentication methods
  const signUp = async (email: string, password: string, displayName: string) => {
    const result = await signUpWithEmail(email, password, displayName)
    return result
  }

  const signIn = async (email: string, password: string) => {
    const user = await signInWithEmail(email, password)
    return user
  }

  const signOut = async () => {
    await signOutUser()
  }

  const updateProfile = async (updates: {
    displayName?: string
    photoURL?: string
    fitnessGoals?: string[]
  }) => {
    const message = await updateUserProfile(updates)
    await refreshUserProfile() // Refresh profile data
    return message
  }

  const value: AuthContextType = {
    // User state
    currentUser,
    userProfile,
    loading,

    // Authentication methods
    signUp,
    signIn,
    signInWithGoogle,
    signOut,

    // Profile management
    updateProfile,

    // Password management
    resetPassword,
    changePassword,

    // Account management
    deleteAccount: deleteUserAccount,
    resendVerification: resendEmailVerification,

    // Utility
    refreshUserProfile,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
