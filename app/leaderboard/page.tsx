"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Leader {
  uid: string
  name: string
  photoURL?: string
  totalReps: number
  goodReps: number
  excellentReps: number
  lastDate?: string
displayName?: string
 
  

}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [filtered, setFiltered] = useState<Leader[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all") // today | week | all
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usr) => {
      if (usr) setUser(usr)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const snapshot = await getDocs(collection(db, "sessions"))
      const userMap: { [uid: string]: Leader } = {}

      snapshot.forEach((doc) => {
        const data = doc.data()
        const date = new Date(data.recordedAt)
        const today = new Date()
        const weekStart = new Date()
        weekStart.setDate(today.getDate() - 7)

        if (dateFilter === "today" && date.toDateString() !== today.toDateString()) return
        if (dateFilter === "week" && date < weekStart) return

        const { uid, reps = 0, goodReps = 0, excellentReps = 0 } = data

        if (!userMap[uid]) {
          userMap[uid] = {
            uid,
            name: data.displayName || "Anonymous",
            photoURL: data.photoURL,
            totalReps: 0,
            goodReps: 0,
            excellentReps: 0,
            lastDate: data.recordedAt,
          }
        }

        userMap[uid].totalReps += reps
        userMap[uid].goodReps += goodReps
        userMap[uid].excellentReps += excellentReps
      })

      const sorted = Object.values(userMap).sort((a, b) => b.totalReps - a.totalReps)
      setLeaders(sorted)
      setFiltered(sorted)
      setLoading(false)
    }

    fetchLeaderboard()
  }, [dateFilter])

  useEffect(() => {
    const q = searchQuery.toLowerCase()
    const filteredData = leaders.filter((u) =>
      u.name.toLowerCase().includes(q)
    )
    setFiltered(filteredData)
  }, [searchQuery, leaders])

  const getRank = (uid: string) =>
    leaders.findIndex((u) => u.uid === uid) + 1

  const getLevel = (reps: number) =>
    reps > 25 ? "🥇 Pro" : reps > 10 ? "🥈 Intermediate" : "🏅 Beginner"

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Please log in to view the leaderboard.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center text-orange-700">🏆 Leaderboard</h1>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center mb-6">
        <div className="flex gap-2">
          {["all", "week", "today"].map((f) => (
            <Button
              key={f}
              variant={f === dateFilter ? "default" : "outline"}
              onClick={() => setDateFilter(f)}
            >
              {f === "all" ? "All Time" : f === "week" ? "This Week" : "Today"}
            </Button>
          ))}
        </div>
        <Input
          placeholder="Search by name"
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Your Rank */}
      {leaders.length > 0 && (
        <div className="mb-8">
          <Card className="bg-white border shadow-md">
            <CardHeader className="flex items-center gap-4">
              <Image
                src={user.photoURL || "/avatar-placeholder.png"}
                alt="avatar"
                width={48}
                height={48}
                className="rounded-full border"
              />
              <div>
                <CardTitle className="text-lg">{user.displayName}</CardTitle>
                <p className="text-sm text-gray-500">Your Rank: #{getRank(user.uid)}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p>💪 Total Push-ups: {leaders.find((l) => l.uid === user.uid)?.totalReps || 0}</p>
              <p>✅ Good Reps: {leaders.find((l) => l.uid === user.uid)?.goodReps || 0}</p>
              <p>🌟 Excellent: {leaders.find((l) => l.uid === user.uid)?.excellentReps || 0}</p>
              <p className="mt-2 text-sm text-gray-600">
                Level: {getLevel(leaders.find((l) => l.uid === user.uid)?.totalReps || 0)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leaderboard Cards */}
      {loading ? (
        <div className="flex justify-center mt-20">
          <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filtered.map((user, index) => (
            <Card key={user.uid} className="bg-white shadow-md border">
  <CardHeader className="flex items-center gap-4">
    <Image
      src={user.photoURL || "/avatar-placeholder.png"}
      alt="Avatar"
      width={48}
      height={48}
      className="rounded-full border"
    />
    <div>
      <CardTitle className="text-lg">
  {user.name || "Anonymous"}
</CardTitle>

      <p className="text-sm text-gray-500">#{index + 1}</p>
    </div>
  </CardHeader>
  <CardContent>
    <p>💪 Push-ups: {user.totalReps}</p>
    <p>✅ Good: {user.goodReps}</p>
    <p>🌟 Excellent: {user.excellentReps}</p>
    <p className="mt-2 text-sm text-gray-600">Level: {getLevel(user.totalReps)}</p>
  </CardContent>
</Card>
          ))}
        </div>
      )}
    </div>
  )
}
