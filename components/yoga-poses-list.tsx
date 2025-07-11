"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"

const yogaPoses = [
  {
    id: "chair",
    name: "chair",
    Fname:"Utkatasana (Chair Pose)",
    description: "Strengthens thighs and ankles while stimulating the heart and diaphragm.",
    difficulty: "Intermediate",
    duration: "30-60 seconds",
    image:"/pose-Images/chair.jpg",
  },
  {
    id: "cobra",
    name: "cobra",
    Fname: "Bhujangasana (Cobra Pose)",
    description: "A gentle backbend that strengthens the spine and opens the chest.",
    difficulty: "Intermediate",
    duration: "15-30 seconds",
    image:
      "/pose-Images/cobra.jpg",
  },
  {
    id: "dog",
    name: "dog",
    Fname: "Adho Mukha Svanasana (Downward Dog)",
    description: "Stretches the body and strengthens arms and legs; relieves stress.",
    difficulty: "Beginner",
    duration: "1-3 minutes",
    image:
      "/pose-Images/dog.jpg",
  },
  {
    id: "shoulderstand",
    name: "shoulderstand",
    Fname: "Sarvangasana (Shoulder Stand)",
    description: "An advanced inversion pose that improves circulation and boosts energy.",
    difficulty: "Advanced",
    duration: "1-3 minutes",
    image:
      "/pose-Images/shoulderstand.jpg",
  },
  {
    id: "tree",
    name: "tree",
    Fname: "Vrikshasana (Tree Pose)",
    description: "Enhances balance, stability, and concentration while strengthening the legs.",
    difficulty: "Beginner",
    duration: "30-60 seconds",
    image:
       "/pose-Images/tree.jpg",
  },
  {
    id: "triangle",
    name: "triangle",
    Fname: "Trikonasana (Triangle Pose)",
    description: "Stretches the spine and legs; improves flexibility and digestion.",
    difficulty: "Intermediate",
    duration: "30-60 seconds",
    image:
      "/pose-Images/triangle.jpg",
  },
  {
    id: "warrior",
    name: "warrior",
    Fname: "Virabhadrasana (Warrior Pose)",
    description: "A powerful standing pose that builds strength and endurance.",
    difficulty: "Intermediate",
    duration: "30-60 seconds",
    image:
       "/pose-Images/warrior.jpg",
  },
]


export function YogaPosesList() {
  const router = useRouter()

  const handleTryNow = (poseId: string) => {
    router.push(`/yoga/${poseId}`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {yogaPoses.map((pose) => (
        <Card key={pose.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative h-48 w-full">
            <Image
              src={pose.image || "/placeholder.svg"}
              alt={pose.name}
              fill
              className="object-cover rounded-t-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{pose.name}</CardTitle>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pose.difficulty)}`}>
                {pose.difficulty}
              </span>
            </div>
            <CardDescription>{pose.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Duration: {pose.duration}</span>
            </div>
            <Button className="w-full" onClick={() => handleTryNow(pose.id)}>
              Try Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
