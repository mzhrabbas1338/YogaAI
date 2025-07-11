"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy, CheckCircle, AlertTriangle } from "lucide-react"
import { useState } from "react"

export function FirebaseSetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const envTemplate = `# Firebase Configuration
# Replace these with your actual Firebase project values from Firebase Console
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🔧 Firebase Setup Required</h1>
          <p className="text-gray-600">Set up Firebase Authentication to use all features</p>
        </div>

        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Firebase Not Configured:</strong> You need to set up Firebase to use authentication features. Follow
            the steps below to get started.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          {/* Step 1: Create Firebase Project */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <span>Create Firebase Project</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">First, you need to create a Firebase project in the Firebase Console.</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Go to Firebase Console</li>
                  <li>Click "Create a project"</li>
                  <li>Enter your project name (e.g., "fitai-app")</li>
                  <li>Follow the setup wizard</li>
                  <li>Wait for project creation to complete</li>
                </ol>
              </div>
              <Button variant="outline" asChild>
                <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Firebase Console
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Enable Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <span>Enable Authentication</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Enable the authentication methods you want to use.</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>In your Firebase project, click "Authentication" in the left sidebar</li>
                  <li>Click "Get started" button</li>
                  <li>Go to "Sign-in method" tab</li>
                  <li>
                    <strong>Enable Email/Password:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>Click on "Email/Password"</li>
                      <li>Toggle "Enable" to ON</li>
                      <li>Click "Save"</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Enable Google (Optional):</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>Click on "Google"</li>
                      <li>Toggle "Enable" to ON</li>
                      <li>Enter your project support email</li>
                      <li>Click "Save"</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Create Web App */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <span>Register Web App</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Register your web app to get the configuration keys.</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Go to Project Settings (click the gear ⚙️ icon next to "Project Overview")</li>
                  <li>Scroll down to "Your apps" section</li>
                  <li>Click the Web app icon {"</>"}</li>
                  <li>Enter app nickname (e.g., "FitAI Web App")</li>
                  <li>
                    <strong>Optional:</strong> Check "Also set up Firebase Hosting"
                  </li>
                  <li>Click "Register app"</li>
                  <li>
                    <strong>Important:</strong> Copy the config object that appears (you'll need this in step 4)
                  </li>
                </ol>
              </div>
              <Alert>
                <AlertDescription>
                  <strong>Important:</strong> Don't close the page until you've copied the configuration object!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Step 4: Set Up Firestore */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <span>Set Up Firestore Database</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Create a database to store user profiles and app data.</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>In your Firebase project, click "Firestore Database" in the left sidebar</li>
                  <li>Click "Create database"</li>
                  <li>
                    <strong>Choose security rules:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>Select "Start in test mode" (for development)</li>
                      <li>Click "Next"</li>
                    </ul>
                  </li>
                  <li>Choose a location (select the one closest to your users)</li>
                  <li>Click "Done"</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Step 5: Configure Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  5
                </span>
                <span>Configure Environment Variables</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Create a <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file in your project root
                with your Firebase configuration:
              </p>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{envTemplate}</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700"
                  onClick={() => copyToClipboard(envTemplate, 5)}
                >
                  {copiedStep === 5 ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Important:</strong> Replace ALL the placeholder values with your actual Firebase configuration
                  values from step 3. Don't use the example values shown above!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Step 6: Restart Server */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  6
                </span>
                <span>Restart Development Server</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">After creating the .env.local file, restart your development server:</p>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm">
                  <code>npm run dev</code>
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700"
                  onClick={() => copyToClipboard("npm run dev", 6)}
                >
                  {copiedStep === 6 ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800">
                  After restarting, refresh this page. If configured correctly, you'll see the login form instead of
                  this setup guide.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card>
            <CardHeader>
              <CardTitle>🔍 Troubleshooting Common Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-medium text-red-800">Error: "API key not valid"</h4>
                  <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                    <li>Make sure you copied the EXACT API key from Firebase Console</li>
                    <li>Check that there are no extra spaces or characters</li>
                    <li>Ensure the API key starts with "AIzaSy"</li>
                    <li>Verify you're using the Web API key, not other types</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium text-orange-800">Error: "Project not found"</h4>
                  <ul className="list-disc list-inside text-sm text-orange-700 mt-2 space-y-1">
                    <li>Double-check your PROJECT_ID matches exactly</li>
                    <li>Make sure the project exists in Firebase Console</li>
                    <li>Verify you're logged into the correct Google account</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-blue-800">Environment Variables Not Loading</h4>
                  <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">
                    <li>Make sure the file is named exactly ".env.local"</li>
                    <li>Place it in the root directory (same level as package.json)</li>
                    <li>All variables must start with "NEXT_PUBLIC_"</li>
                    <li>Restart the development server after making changes</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-green-800">Still Having Issues?</h4>
                  <ul className="list-disc list-inside text-sm text-green-700 mt-2 space-y-1">
                    <li>Check the browser console for detailed error messages</li>
                    <li>Verify all Firebase services are enabled</li>
                    <li>Make sure your domain is added to authorized domains (for production)</li>
                    <li>Try creating a new Firebase project if problems persist</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Test */}
        <Card className="mt-8 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">✅ Quick Configuration Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 mb-4">
              Once you've completed all steps, you should see these values in your browser console:
            </p>
            <div className="bg-white p-4 rounded border">
              <p className="text-sm text-gray-600 mb-2">Open browser console and check:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Set" : "❌ Missing"}</li>
                <li>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅ Set" : "❌ Missing"}</li>
                <li>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✅ Set" : "❌ Missing"}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
