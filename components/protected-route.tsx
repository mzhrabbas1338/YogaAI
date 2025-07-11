"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !currentUser) {
      router.push("/")
    }
  }, [currentUser, loading, router, mounted])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return currentUser ? <>{children}</> : null
}
