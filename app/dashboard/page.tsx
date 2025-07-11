import { DashboardHeader } from "@/components/dashboard-header"
import { FeatureCards } from "@/components/feature-cards"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h1>
          <p className="text-gray-600">Ready to continue your fitness journey?</p>
        </div>
        <FeatureCards />
      </main>
    </div>
  )
}
