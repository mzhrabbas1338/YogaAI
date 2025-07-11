"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Volume2, VolumeX, Play } from "lucide-react"

interface VoiceCoachProps {
  feedbackList: string[] // From server
  poseName: string
}

export function VoiceCoach({ feedbackList, poseName }: VoiceCoachProps) {
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [volume, setVolume] = useState(0.8)

  useEffect(() => {
    // Automatically speak all feedback on arrival
    if (voiceEnabled && feedbackList.length > 0) {
      speakFeedbackList(feedbackList)
    }
  }, [feedbackList, voiceEnabled])

  const speakText = (text: string) => {
    if (!("speechSynthesis" in window) || !voiceEnabled) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.volume = volume
    utterance.rate = 1
    speechSynthesis.speak(utterance)
  }

  const speakFeedbackList = (list: string[]) => {
    for (const line of list) {
      speakText(line)
    }
  }

  const handleToggleVoice = () => {
    setVoiceEnabled((prev) => {
      if (prev) speechSynthesis.cancel()
      return !prev
    })
  }

  const getCategory = (text: string) => {
    if (text.startsWith("✅")) return "correct"
    if (text.startsWith("⚠")) return "improve"
    return "neutral"
  }

  const getCategoryBadge = (type: string) => {
    switch (type) {
      case "correct":
        return <Badge className="bg-green-100 text-green-800 border border-green-300">✅ Correct</Badge>
      case "improve":
        return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">⚠ Improvement</Badge>
      default:
        return <Badge variant="secondary">Note</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {/* Voice Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">🗣️ AI Feedback for {poseName}</CardTitle>
              <CardDescription>Get real-time corrections with voice coaching</CardDescription>
            </div>
            <Button onClick={handleToggleVoice} size="sm" variant={voiceEnabled ? "default" : "outline"}>
              {voiceEnabled ? (
                <>
                  <Volume2 className="mr-2 h-4 w-4" />
                  Voice On
                </>
              ) : (
                <>
                  <VolumeX className="mr-2 h-4 w-4" />
                  Voice Off
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        {voiceEnabled && (
          <CardContent>
            <div className="space-y-2">
              <label className="text-sm font-medium">Volume</label>
              <Slider
                value={[volume * 100]}
                onValueChange={(val) => setVolume(val[0] / 100)}
                max={100}
                step={5}
              />
              <span className="text-xs text-gray-500">{Math.round(volume * 100)}%</span>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Feedback</CardTitle>
          <CardDescription>Sorted by correction priority</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {feedbackList.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No feedback available yet. Perform your pose!</p>
          ) : (
            feedbackList.map((line, i) => {
              const type = getCategory(line)
              return (
                <div
                  key={i}
                  className="p-3 border rounded-lg bg-muted flex justify-between items-center"
                >
                  <div>
                    {getCategoryBadge(type)}
                    <p className="text-sm mt-1">{line}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="ml-2"
                    onClick={() => speakText(line)}
                    disabled={!voiceEnabled}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
