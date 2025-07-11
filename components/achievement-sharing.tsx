"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, Trophy, Star, Target, Zap } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: "yoga" | "strength" | "endurance" | "consistency"
  points: number
  unlockedAt: Date
  shared: boolean
}

const mockAchievements: Achievement[] = [
  {
    id: "first-yoga",
    title: "First Steps",
    description: "Complete your first yoga session",
    icon: "🧘‍♀️",
    category: "yoga",
    points: 50,
    unlockedAt: new Date(),
    shared: false,
  },
  {
    id: "pushup-master",
    title: "Pushup Master",
    description: "Complete 100 pushups in one session",
    icon: "💪",
    category: "strength",
    points: 200,
    unlockedAt: new Date(),
    shared: false,
  },
  {
    id: "week-streak",
    title: "Week Warrior",
    description: "Maintain a 7-day workout streak",
    icon: "🔥",
    category: "consistency",
    points: 150,
    unlockedAt: new Date(),
    shared: true,
  },
]

export function AchievementSharing() {
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements)

  const shareAchievement = (achievementId: string) => {
    setAchievements((prev) =>
      prev.map((achievement) => (achievement.id === achievementId ? { ...achievement, shared: true } : achievement)),
    )

    // In a real app, this would post to social media or the community feed
    console.log(`Shared achievement: ${achievementId}`)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "yoga":
        return <Star className="h-4 w-4" />
      case "strength":
        return <Zap className="h-4 w-4" />
      case "endurance":
        return <Target className="h-4 w-4" />
      case "consistency":
        return <Trophy className="h-4 w-4" />
      default:
        return <Trophy className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "yoga":
        return "bg-purple-100 text-purple-800"
      case "strength":
        return "bg-red-100 text-red-800"
      case "endurance":
        return "bg-blue-100 text-blue-800"
      case "consistency":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5" />
          <span>Your Achievements</span>
        </CardTitle>
        <CardDescription>Share your fitness milestones with friends</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50"
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{achievement.icon}</div>
              <div>
                <h3 className="font-medium">{achievement.title}</h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={getCategoryColor(achievement.category)}>
                    {getCategoryIcon(achievement.category)}
                    <span className="ml-1 capitalize">{achievement.category}</span>
                  </Badge>
                  <Badge variant="secondary">{achievement.points} pts</Badge>
                </div>
              </div>
            </div>
            <Button
              variant={achievement.shared ? "secondary" : "default"}
              size="sm"
              onClick={() => shareAchievement(achievement.id)}
              disabled={achievement.shared}
            >
              <Share2 className="mr-2 h-4 w-4" />
              {achievement.shared ? "Shared" : "Share"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
