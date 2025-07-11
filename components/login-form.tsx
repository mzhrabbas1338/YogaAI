"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Lock, User, Chrome, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DemoBanner } from "@/components/demo-banner"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { login, signup, googleSignIn, isDemo } = useAuth()

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Signup form state
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login(loginEmail, loginPassword)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      setError(getAuthErrorMessage(error.message || error.code))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password strength
    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      await signup(signupEmail, signupPassword, signupName)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(getAuthErrorMessage(error.message || error.code))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setIsLoading(true)

    try {
      await googleSignIn()
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Google sign-in error:", error)
      setError(getAuthErrorMessage(error.message || error.code))
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to get user-friendly error messages
  const getAuthErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email"
      case "auth/wrong-password":
        return "Incorrect password"
      case "auth/email-already-in-use":
        return "Email already in use"
      case "auth/invalid-email":
        return "Invalid email address"
      case "auth/weak-password":
        return "Password is too weak"
      case "auth/popup-closed-by-user":
        return "Sign-in popup was closed before completing"
      case "Auth not initialized":
        return "Authentication service is not ready. Please refresh the page."
      default:
        return "An error occurred. Please try again"
    }
  }

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <Card className="w-full shadow-xl">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {isDemo && <DemoBanner />}

      <Card className="w-full shadow-xl">
        <CardHeader className="text-center">
          <CardTitle>Welcome to FitAI</CardTitle>
          <CardDescription>
            {isDemo ? "Demo Mode - Try any email/password" : "Sign in to your account or create a new one"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={isDemo ? "demo@example.com" : "Enter your email"}
                      className="pl-10"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder={isDemo ? "password123" : "Enter your password"}
                      className="pl-10"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      className="pl-10"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-4 00" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10"
                      required
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent" onClick={handleGoogleSignIn} disabled={isLoading}>
            <Chrome className="mr-2 h-4 w-4" />
            {isDemo ? "Demo Google Sign-in" : "Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
