"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Info, ExternalLink } from "lucide-react"

export function DemoBanner() {
  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <div className="flex items-center justify-between">
          <span>
            <strong>Demo Mode:</strong> You're using a demo version. No real authentication is happening.
          </span>
          <Button variant="outline" size="sm" asChild className="ml-4 bg-transparent">
            <a href="#setup-firebase" className="text-blue-600 hover:text-blue-800">
              <ExternalLink className="mr-1 h-3 w-3" />
              Setup Firebase
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
