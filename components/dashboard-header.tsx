"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function DashboardHeader() {
  const router = useRouter()
  const { currentUser, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!currentUser?.displayName) return "U"
    return currentUser.displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🧘‍♂️</span>
          <h1 className="text-xl font-bold text-gray-900">FitAI</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser?.photoURL || "/placeholder.svg?height=32&width=32"} alt="User" />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {currentUser?.displayName && <p className="font-medium">{currentUser.displayName}</p>}
                {currentUser?.email && (
                  <p className="w-[200px] truncate text-sm text-muted-foreground">{currentUser.email}</p>
                )}
              </div>
            </div>
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
