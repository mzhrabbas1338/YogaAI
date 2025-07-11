import { PoseMatchingInterface } from "@/components/pose-matching-interface"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Props {
  params: {
    poseId: string
  }
}

const poseData: Record<string, { name:string ;Fname: string; description: string; instructions: string[] }> = {
  "chair": {
    name:"chair",
    Fname: "Utkatasana (Chair Pose)",
    description: "Strengthens thighs and ankles while stimulating the heart and diaphragm.",
    instructions: [
      "Stand with feet together and arms at your sides.",
      "Inhale and raise your arms overhead, palms facing inward.",
      "Exhale and bend your knees, lowering your hips as if sitting in a chair.",
      "Keep your back straight and chest lifted.",
      "Hold for 30-60 seconds.",
    ],
  },
  "cobra": {
    name: "cobra",
    Fname: "Bhujangasana (Cobra Pose)",
    description: "A gentle backbend that strengthens the spine and opens the chest.",
    instructions: [
      "Lie on your stomach with legs extended and tops of feet on the floor.",
      "Place palms under shoulders, elbows close to body.",
      "Inhale and lift your chest, using back muscles not your arms.",
      "Keep elbows slightly bent and shoulders relaxed.",
      "Hold for 15-30 seconds.",
    ],
  },
  "dog": {
    name: "dog",
    Fname: "Adho Mukha Svanasana (Downward Dog)",
    description: "Stretches the body and strengthens arms and legs; relieves stress.",
    instructions: [
      "Start on hands and knees, hands shoulder-width apart.",
      "Tuck toes and lift hips toward the ceiling.",
      "Straighten legs and form an inverted V-shape.",
      "Press heels toward the floor and relax your neck.",
      "Hold for 1-3 minutes.",
    ],
  },
  "shoulderstand": {
    name: "shoulderstand",
    Fname: "Sarvangasana (Shoulder Stand)",
    description: "An advanced inversion pose that improves circulation and boosts energy.",
    instructions: [
      "Lie on your back and lift legs to 90 degrees.",
      "Use hands to support lower back while lifting hips.",
      "Straighten legs and stack them over your shoulders.",
      "Keep neck relaxed and chin slightly tucked.",
      "Hold for 1-3 minutes.",
    ],
  },
  "tree": {
    name: "tree",
    Fname: "Vrikshasana (Tree Pose)",
    description: "Enhances balance, stability, and concentration while strengthening the legs.",
    instructions: [
      "Stand tall with feet together.",
      "Shift weight to one foot.",
      "Place the opposite foot on the inner thigh or calf (not knee).",
      "Bring palms together in prayer position at chest.",
      "Hold for 30-60 seconds, then switch sides.",
    ],
  },
  "triangle": {
    name: "triangle",
    Fname: "Trikonasana (Triangle Pose)",
    description: "Stretches the spine and legs; improves flexibility and digestion.",
    instructions: [
      "Stand with feet wide apart, arms stretched out to sides.",
      "Turn one foot out 90°, other foot slightly in.",
      "Extend arm over the front leg and lower it to shin, ankle, or floor.",
      "Reach the opposite arm straight up, look at the raised hand.",
      "Hold for 30-60 seconds, then switch sides.",
    ],
  },
  warrior: {
    name: "warrior",
    Fname: "Virabhadrasana (Warrior Pose)",
    description: "A powerful standing pose that builds strength and endurance.",
    instructions: [
      "Stand with feet wide apart.",
      "Turn front foot out 90° and back foot slightly in.",
      "Bend front knee over ankle, keeping back leg straight.",
      "Extend arms parallel to the floor, gaze forward.",
      "Hold for 30-60 seconds, then switch sides.",
    ],
  }
  
  // Add more poses as needed
}

export default function PoseMatchingPage({ params }: Props) {
  const pose = poseData[params.poseId] || {
    name: "Yoga Pose",
    Fname: "Yoga Pose",
    description: "Practice this yoga pose with AI feedback",
    instructions: ["Follow the instructions on screen"],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/yoga">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Yoga Poses
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{pose.Fname}</h1>
          <p className="text-gray-600">{pose.description}</p>
        </div>
        <PoseMatchingInterface pose={pose} />
      </main>
    </div>
  )
}
