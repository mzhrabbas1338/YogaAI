"use client"

import { useState, useEffect } from "react"
import { FirebaseLoginForm } from "@/components/firebase-login-form"
import { FirebaseSetupGuide } from "@/components/firebase-setup-guide"
import { isFirebaseConfigured } from "@/lib/firebase-config"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // Show setup guide if Firebase is not configured
  if (!isFirebaseConfigured()) {
    return <FirebaseSetupGuide />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🧘‍♂️ FitAI</h1>
          <p className="text-gray-600">Your AI-powered fitness companion</p>
        </div>
        <FirebaseLoginForm />
      </div>
    </div>
  )
}
