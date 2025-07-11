"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const features = [
  {
    id: "yoga",
    title: "Yoga Poses",
    description: "Explore and practice various yoga poses with AI-powered feedback",
    icon: "🧘",
    color: "from-purple-500 to-pink-500",
    route: "/yoga",
  },
  {
    id: "pushups",
    title: "Pushups Counter",
    description: "Count your pushups automatically with pose detection",
    icon: "🤸",
    color: "from-blue-500 to-cyan-500",
    route: "/pushups",
  },
  {
    id: "workout",
    title: "Workout Tracker",
    description: "Track your workouts and monitor progress (Coming Soon)",
    icon: "🏋️",
    color: "from-green-500 to-emerald-500",
    route: "/workout",
    disabled: true,
  },
  {
    id: "steps",
    title: "Steps Tracker",
    description: "Monitor your daily steps and activity (Coming Soon)",
    icon: "🚶",
    color: "from-orange-500 to-red-500",
    route: "/steps",
    disabled: true,
  },
 {
    id: "leaderboard",
    title: "Leaderboard",
    description: "See top performers and compete with others",
    icon: "🏆",
    color: "from-yellow-500 to-orange-500",
    route: "/leaderboard",
  },
]

export function FeatureCards() {
  const router = useRouter()

  const handleCardClick = (route: string, disabled?: boolean) => {
    if (!disabled) {
      router.push(route)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {features.map((feature) => (
        <Card
          key={feature.id}
          className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
            feature.disabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
          onClick={() => handleCardClick(feature.route, feature.disabled)}
        >
          <CardHeader className="text-center">
            <div
              className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4`}
            >
              {feature.icon}
            </div>
            <CardTitle className="text-xl">{feature.title}</CardTitle>
            <CardDescription className="text-center">{feature.description}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              className="w-full"
              disabled={feature.disabled}
              onClick={(e) => {
                e.stopPropagation()
                handleCardClick(feature.route, feature.disabled)
              }}
            >
              {feature.disabled ? "Coming Soon" : "Get Started"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
