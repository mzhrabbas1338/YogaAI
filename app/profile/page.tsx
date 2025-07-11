"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { collection, getDocs, query, where } from "firebase/firestore"
import { ArrowLeft } from "lucide-react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend)

export default function ProfilePage() {
  const { currentUser, updateUserProfile } = useAuth()
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessions, setSessions] = useState<any[]>([])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)
    setError(null)

    try {
      await updateUserProfile(displayName)
      setSuccess(true)
    } catch (error) {
      console.error("Profile update error:", error)
      setError("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getUserInitials = () => {
    if (!currentUser?.displayName) return "U"
    return currentUser.displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  useEffect(() => {
    const fetchSessions = async () => {
      if (!currentUser) return
      const q = query(collection(db, "sessions"), where("uid", "==", currentUser.uid))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setSessions(data.sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()))
    }
    fetchSessions()
  }, [currentUser])

  const chartData = {
    labels: sessions.map((s) => new Date(s.startTime).toLocaleDateString()),
    datasets: [
      {
        label: "Push-ups",
        data: sessions.map((s) => s.reps),
        fill: false,
        borderColor: "#4f46e5",
        backgroundColor: "#4f46e5",
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "bottom" as const },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600">Manage your account information and review your session history</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {success && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <AlertDescription>Profile updated successfully!</AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={currentUser?.email || ""} disabled />
                  <p className="text-sm text-gray-500">Email cannot be changed</p>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Account</CardTitle>
              <CardDescription>Account information and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={currentUser?.photoURL || "/placeholder.svg?height=96&width=96"} />
                  <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-medium text-lg">{currentUser?.displayName || "User"}</h3>
                  <p className="text-sm text-gray-500">{currentUser?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {sessions.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Past Sessions</h2>
            <div className="bg-white rounded-xl shadow p-6 mb-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Reps</th>
                    <th className="px-4 py-2">Duration (s)</th>
                    <th className="px-4 py-2">Start Time</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.id} className="border-b">
                      <td className="px-4 py-2">{new Date(s.recordedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2 font-semibold">{s.reps}</td>
                      <td className="px-4 py-2">{s.durationSeconds}</td>
                      <td className="px-4 py-2">{new Date(s.startTime).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Progress Chart</h3>
              <Line data={chartData} options={chartOptions} height={100} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
