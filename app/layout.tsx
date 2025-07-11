import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
// import { FirebaseAuthProvider } from "@/contexts/firebase-auth-context"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FitAI - Your AI-Powered Fitness Companion",
  description: "Practice yoga poses and track workouts with AI-powered feedback",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>  {/* ✅ This fixes your useAuth() error */}
      </body>
    </html>
  )
}
