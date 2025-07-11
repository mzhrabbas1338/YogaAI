import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Analytics } from "@vercel/analytics/react"  // ✅ Import Analytics

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
        <AuthProvider>{children}</AuthProvider>
        <Analytics /> {/* ✅ Add this for tracking page views */}
      </body>
    </html>
  )
}
