"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock, User, Chrome, AlertCircle, CheckCircle, Eye, EyeOff, Settings } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"


import { isFirebaseConfigured } from "@/lib/firebase-config"


export function FirebaseLoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const { login, signup, googleSignIn, resetPassword } = useAuth()


  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Signup form state
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("")

  // Password reset state
  const [resetEmail, setResetEmail] = useState("")
  const [showResetForm, setShowResetForm] = useState(false)

  // Check if Firebase is configured
  if (!isFirebaseConfigured()) {
    return (
      <Card className="w-full shadow-xl">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Firebase is not properly configured. Please check your environment variables and restart the server.
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <Settings className="mr-2 h-4 w-4" />
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      await login(loginEmail, loginPassword)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      setError(getAuthErrorMessage(error.code))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validation
    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (signupName.trim().length < 2) {
      setError("Name must be at least 2 characters")
      return
    }

    setIsLoading(true)

    try {
      const result = await signup(signupEmail, signupPassword, signupName.trim())
      setSuccess(`Welcome, ${result.displayName || result.email}!`)

      // Don't redirect immediately - let user verify email first
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(getAuthErrorMessage(error.code))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      await googleSignIn()
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Google sign-in error:", error)
      setError(getAuthErrorMessage(error.code))
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      const message = await resetPassword(resetEmail)
     setSuccess("Password reset link sent! Please check your email.")
      setShowResetForm(false)
      setResetEmail("")
    } catch (error: any) {
      console.error("Password reset error:", error)
      setError(getAuthErrorMessage(error.code))
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to get user-friendly error messages
  const getAuthErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email address"
      case "auth/wrong-password":
        return "Incorrect password"
      case "auth/email-already-in-use":
        return "An account with this email already exists"
      case "auth/invalid-email":
        return "Please enter a valid email address"
      case "auth/weak-password":
        return "Password should be at least 6 characters"
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later"
      case "auth/popup-closed-by-user":
        return "Sign-in popup was closed before completing"
      case "auth/network-request-failed":
        return "Network error. Please check your connection"
      case "auth/api-key-not-valid":
        return "Firebase configuration error. Please check your API key"
      case "auth/invalid-api-key":
        return "Invalid Firebase API key. Please check your configuration"
      default:
        return "An error occurred. Please try again"
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "" }
    if (password.length < 6) return { strength: 1, text: "Too short" }
    if (password.length < 8) return { strength: 2, text: "Weak" }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 3, text: "Medium" }
    return { strength: 4, text: "Strong" }
  }

  const passwordStrength = getPasswordStrength(signupPassword)

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <CardTitle>Welcome to FitAI</CardTitle>
        <CardDescription>Your AI-powered fitness journey starts here</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Success/Error Messages */}
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Password Reset Form */}
        {showResetForm ? (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium">Reset Password</h3>
              <p className="text-sm text-gray-600">Enter your email to receive a reset link</p>
            </div>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowResetForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* Main Login/Signup Form */
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
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
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => setShowResetForm(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Tab */}
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
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="pl-10 pr-10"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Password Strength Indicator */}
                  {signupPassword && (
                    <div className="space-y-1">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded ${
                              level <= passwordStrength.strength
                                ? passwordStrength.strength === 1
                                  ? "bg-red-500"
                                  : passwordStrength.strength === 2
                                    ? "bg-orange-500"
                                    : passwordStrength.strength === 3
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">{passwordStrength.text}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10"
                      required
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signupConfirmPassword && signupPassword !== signupConfirmPassword && (
                    <p className="text-xs text-red-600">Passwords do not match</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}

        {!showResetForm && (
          <>
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
