import { YogaPosesList } from "@/components/yoga-poses-list"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function YogaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🧘 Yoga Poses</h1>
          <p className="text-gray-600">Choose a pose to practice with AI-powered feedback</p>
        </div>
        <YogaPosesList />
      </main>
    </div>
  )
}
