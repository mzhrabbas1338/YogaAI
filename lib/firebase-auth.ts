import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "./firebase-config"

// User profile interface
export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: any
  lastLoginAt: any
  emailVerified: boolean
  fitnessGoals?: string[]
  preferences?: {
    notifications: boolean
    theme: "light" | "dark"
    units: "metric" | "imperial"
  }
}

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string, displayName: string) {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update user profile
    await updateProfile(user, {
      displayName: displayName,
    })

    // Send email verification
    await sendEmailVerification(user)

    // Create user document in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName,
      photoURL: user.photoURL || undefined,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      emailVerified: false,
      preferences: {
        notifications: true,
        theme: "light",
        units: "metric",
      },
    }

    await setDoc(doc(db, "users", user.uid), userProfile)

    return {
      user,
      message: "Account created successfully! Please check your email to verify your account.",
    }
  } catch (error: any) {
    console.error("Sign up error:", error)
    throw error
  }
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update last login time
    await updateDoc(doc(db, "users", user.uid), {
      lastLoginAt: serverTimestamp(),
    })

    return user
  } catch (error: any) {
    console.error("Sign in error:", error)
    throw error
  }
}

// Sign in with Google
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider()
    provider.addScope("email")
    provider.addScope("profile")

    const result = await signInWithPopup(auth, provider)
    const user = result.user

    // Check if user document exists, create if not
    const userDoc = await getDoc(doc(db, "users", user.uid))

    if (!userDoc.exists()) {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || "User",
        photoURL: user.photoURL || undefined,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        emailVerified: user.emailVerified,
        preferences: {
          notifications: true,
          theme: "light",
          units: "metric",
        },
      }

      await setDoc(doc(db, "users", user.uid), userProfile)
    } else {
      // Update last login time
      await updateDoc(doc(db, "users", user.uid), {
        lastLoginAt: serverTimestamp(),
      })
    }

    return user
  } catch (error: any) {
    console.error("Google sign in error:", error)
    throw error
  }
}

// Sign out
export async function signOutUser() {
  try {
    await signOut(auth)
  } catch (error: any) {
    console.error("Sign out error:", error)
    throw error
  }
}

// Send password reset email
export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email)
    return "Password reset email sent! Check your inbox."
  } catch (error: any) {
    console.error("Password reset error:", error)
    throw error
  }
}

// Update user profile
export async function updateUserProfile(updates: {
  displayName?: string
  photoURL?: string
  fitnessGoals?: string[]
}) {
  try {
    const user = auth.currentUser
    if (!user) throw new Error("No user logged in")

    // Update Firebase Auth profile
    if (updates.displayName || updates.photoURL) {
      await updateProfile(user, {
        displayName: updates.displayName || user.displayName,
        photoURL: updates.photoURL || user.photoURL,
      })
    }

    // Update Firestore document
    await updateDoc(doc(db, "users", user.uid), {
      ...updates,
      updatedAt: serverTimestamp(),
    })

    return "Profile updated successfully!"
  } catch (error: any) {
    console.error("Profile update error:", error)
    throw error
  }
}

// Change password
export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    const user = auth.currentUser
    if (!user || !user.email) throw new Error("No user logged in")

    // Re-authenticate user
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    await reauthenticateWithCredential(user, credential)

    // Update password
    await updatePassword(user, newPassword)

    return "Password changed successfully!"
  } catch (error: any) {
    console.error("Password change error:", error)
    throw error
  }
}

// Delete user account
export async function deleteUserAccount(password: string) {
  try {
    const user = auth.currentUser
    if (!user || !user.email) throw new Error("No user logged in")

    // Re-authenticate user
    const credential = EmailAuthProvider.credential(user.email, password)
    await reauthenticateWithCredential(user, credential)

    // Delete user document from Firestore
    // Note: You might want to keep some data for analytics
    // await deleteDoc(doc(db, "users", user.uid))

    // Delete user account
    await deleteUser(user)

    return "Account deleted successfully!"
  } catch (error: any) {
    console.error("Account deletion error:", error)
    throw error
  }
}

// Get user profile from Firestore
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    }
    return null
  } catch (error: any) {
    console.error("Get user profile error:", error)
    return null
  }
}

// Resend email verification
export async function resendEmailVerification() {
  try {
    const user = auth.currentUser
    if (!user) throw new Error("No user logged in")

    await sendEmailVerification(user)
    return "Verification email sent!"
  } catch (error: any) {
    console.error("Resend verification error:", error)
    throw error
  }
}
