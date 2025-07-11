import PushupCounter from "@/components/pushups-counter"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PushupsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🤸 Pushups Counter</h1>
          <p className="text-gray-600">AI-powered pushup counting with form feedback</p>
        </div>
        
        <PushupCounter />
        
      </main>
    </div>
  )
}
