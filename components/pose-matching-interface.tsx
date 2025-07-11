"use client"

import { useState, useRef, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, Play, Square, RotateCcw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { VoiceCoach } from "@/components/voice-coach"

interface Props {
  pose: {
    name: string
    Fname: string
    description: string
    instructions: string[]
  }
}

export function PoseMatchingInterface({ pose }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [feedback, setFeedback] = useState<string[] | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [poseImage, setPoseImage] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const IMAGE_URL = "http://127.0.0.1:8000/analyze-pose/"
  const VIDEO_URL = "http://127.0.0.1:8000/analyze-live-frame/"

  const getPoseKey = (name: string) => name.trim().toLowerCase()

  const analyzePose = async (imageBlob: Blob) => {
    setIsAnalyzing(true)
    setFeedback(null)
    setScore(null)
    setPoseImage(null)

    try {
      const formData = new FormData()
      formData.append("file", imageBlob)
      formData.append("pose_name", getPoseKey(pose.name))

      const res = await fetch(IMAGE_URL, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error(`Error: ${res.status}`)

      const data = await res.json()
      setScore(data.score)
      setFeedback(data.feedback)
      setPoseImage(`data:image/jpeg;base64,${data.pose_image}`)
    } catch (err) {
      console.error("❌ Analysis error:", err)
      setFeedback(["❌ Failed to analyze pose. Please try again."])
    } finally {
      setIsAnalyzing(false)
    }
  }

  const analyzeLiveFrame = async (frameData: string) => {
    setIsAnalyzing(true)
    setFeedback(null)
    setScore(null)
    setPoseImage(null)

    try {
      const res = await fetch(VIDEO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frame: frameData, pose_name: getPoseKey(pose.name) })
      })
      if (!res.ok) throw new Error(`Error: ${res.status}`)

      const data = await res.json()
      setScore(data.score)
      setFeedback(data.feedback)
      setPoseImage(`data:image/jpeg;base64,${data.pose_image}`)
    } catch (err) {
      console.error("❌ Live frame error:", err)
      setFeedback(["❌ Failed to analyze webcam pose. Try again."])
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) analyzePose(file)
  }

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
        setIsRecording(true)

        setTimeout(() => {
          captureFrame()
          setIsRecording(false)
          stream.getTracks().forEach((track) => track.stop())
        }, 3000)
      } catch {
        alert("Camera access denied")
      }
    } else {
      const stream = videoRef.current?.srcObject as MediaStream
      stream?.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
    }
  }

  const captureFrame = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const base64Data = canvas.toDataURL("image/jpeg")
      analyzeLiveFrame(base64Data)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-600"
    if (score >= 75) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Perform: {pose.name}</CardTitle>
            <CardDescription>{pose.description}</CardDescription>
          </CardHeader>

          <div className="relative mb-4 px-4">
            <img
              src={`/pose-images/${pose.name}.jpg`}
              alt={`${pose.name} reference`}
              className="w-full rounded-lg shadow-sm"
            />
            <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs px-3 py-1 rounded shadow-md">
              Reference Image: {pose.name}
            </div>
          </div>

          <CardContent>
            <ol className="space-y-3">
              {pose.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Upload/Camera + Result */}
        <Card>
          <CardHeader>
            <CardTitle>AI Pose Analysis</CardTitle>
            <CardDescription>Upload or capture image for real-time feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <video ref={videoRef} className="hidden" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
              {isRecording ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-red-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-gray-600">Recording... Hold your pose!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">Position yourself in the camera view</p>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button onClick={toggleRecording} className="flex-1" variant={isRecording ? "destructive" : "default"}>
                {isRecording ? (
                  <>
                    <Square className="mr-2 h-4 w-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Camera
                  </>
                )}
              </Button>

              <Button onClick={handleImageUpload} variant="outline" className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

            {isAnalyzing && (
              <Alert>
                <AlertDescription className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600" />
                  <span>Analyzing pose...</span>
                </AlertDescription>
              </Alert>
            )}

            {feedback && score !== null && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pose Accuracy</span>
                  <Badge className={`${getScoreColor(score)} text-white`}>{score}%</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${getScoreColor(score)}`} style={{ width: `${score}%` }} />
                </div>

                {poseImage && (
                  <img
                    src={poseImage}
                    alt="Analyzed Pose"
                    className="w-full max-h-64 object-contain rounded-md border"
                  />
                )}

                <Alert>
                  <AlertDescription>
                    <ul className="list-disc pl-5 space-y-1">
                      {feedback.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={() => {
                    setFeedback(null)
                    setScore(null)
                    setPoseImage(null)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* VoiceCoach Component */}
      {feedback && feedback.length > 0 && (
        <VoiceCoach feedbackList={feedback} poseName={pose.name} />
      )}
    </div>
  )
}
