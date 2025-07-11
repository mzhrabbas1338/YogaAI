"use client"

import React, { useRef, useEffect, useState } from "react"
import Webcam from "react-webcam"
import * as tf from "@tensorflow/tfjs-core"
import "@tensorflow/tfjs-backend-webgl"
import * as posedetection from "@tensorflow-models/pose-detection"
import { db, auth } from "@/lib/firebase"
import { addDoc, collection } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { VoiceCoach } from "@/components/voice-coach"
import Swal from "sweetalert2"
import html2canvas from "html2canvas"


const PushupCounter = () => {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [count, setCount] = useState(0)
  const [goodReps, setGoodReps] = useState(0)
  const [excellentReps, setExcellentReps] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [elbowAngle, setElbowAngle] = useState(0)
  const [backAngle, setBackAngle] = useState(0)
  const [barLevel, setBarLevel] = useState(0)
  const [position, setPosition] = useState("⬆️ Up")
  const [phase, setPhase] = useState<"up" | "down">("up")
  const [detector, setDetector] = useState<posedetection.PoseDetector | null>(null)

  const [sessionActive, setSessionActive] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [recentVoiceFeedback, setRecentVoiceFeedback] = useState<string[]>([])
  const [lastSpokenFeedback, setLastSpokenFeedback] = useState<string>("")

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend("webgl")
      const detector = await posedetection.createDetector(posedetection.SupportedModels.MoveNet)
      setDetector(detector)
    }
    loadModel()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (sessionActive) {
      interval = setInterval(() => {
        detectPose()
        if (startTime) setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000))
      }, 100)
    }
    return () => clearInterval(interval)
  }, [detector, phase, sessionActive, startTime])

  const detectPose = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video?.readyState === 4 &&
      detector
    ) {
      const video = webcamRef.current.video as HTMLVideoElement
      const poses = await detector.estimatePoses(video)
      if (poses.length > 0) {
        drawCanvas(poses[0], video)
        handlePushupLogic(poses[0])
      }
    }
  }

  const calculateAngle = (A: any, B: any, C: any) => {
    const AB = [A.x - B.x, A.y - B.y]
    const CB = [C.x - B.x, C.y - B.y]
    const dot = AB[0] * CB[0] + AB[1] * CB[1]
    const magAB = Math.sqrt(AB[0] ** 2 + AB[1] ** 2)
    const magCB = Math.sqrt(CB[0] ** 2 + CB[1] ** 2)
    const angle = Math.acos(dot / (magAB * magCB))
    return Math.round((angle * 180) / Math.PI)
  }

  const motivationalCues = ["Great!", "Go lower!", "Nice form!", "Keep it up!", "You're doing great!"]

  const handlePushupLogic = (pose: any) => {
    const keypoints = pose.keypoints
    const shoulder = keypoints[6]
    const elbow = keypoints[8]
    const wrist = keypoints[10]
    const hip = keypoints[12]
    const knee = keypoints[14]

    if ([shoulder, elbow, wrist, hip, knee].some((kp) => kp.score < 0.5)) return

    const elbowA = calculateAngle(shoulder, elbow, wrist)
    const backA = calculateAngle(shoulder, hip, knee)

    setElbowAngle(elbowA)
    setBackAngle(backA)

    const isBackStraight = backA > 145
    const isExcellent = backA > 165 && elbowA < 100
    const isDownPose = elbowA < 110 && isBackStraight
    const isUpPose = elbowA > 140 && isBackStraight

    setBarLevel((180 - elbowA) / 90)
    setPosition(isDownPose ? "⬇️ Down" : isUpPose ? "⬆️ Up" : position)

    if (phase === "up" && isDownPose) {
      setPhase("down")
    } else if (phase === "down" && isUpPose) {
      const newCount = count + 1
      setCount(newCount)
      if (isBackStraight) setGoodReps(prev => prev + 1)
      if (isExcellent) setExcellentReps(prev => prev + 1)
      setPhase("up")

      const motivational = motivationalCues[Math.floor(Math.random() * motivationalCues.length)]
      const feedbackText = isExcellent ? "🌟 Excellent form" : isBackStraight ? "✅ Good posture" : "⚠️ Keep your back straight"
      setFeedback(feedbackText)

      const feedbackSpoken = feedbackText.replace(/[^\w\s]/gi, "").replace("✅", "Good posture").replace("🌟", "Excellent form")
      const pushupText = `${newCount} pushups`
      let extraCue = ""

      if (newCount % 5 === 0 && newCount > 0) {
        extraCue = newCount === 10 ? "Halfway there!" : "Keep going!"
      }

      const spokenFeedback = `${feedbackSpoken}. ${motivational}. ${pushupText}. ${extraCue}`.trim()

      if (spokenFeedback !== lastSpokenFeedback) {
        setRecentVoiceFeedback([spokenFeedback])
        setLastSpokenFeedback(spokenFeedback)
      }
    }
  }

  const drawCanvas = (pose: any, video: HTMLVideoElement) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    pose.keypoints.forEach((kp: any) => {
      if (kp.score > 0.5) {
        ctx.beginPath()
        ctx.arc(kp.x, kp.y, 6, 0, 2 * Math.PI)
        ctx.fillStyle = "lime"
        ctx.fill()
        ctx.strokeStyle = "black"
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })

    const drawLine = (i: number, j: number) => {
      const kp1 = pose.keypoints[i]
      const kp2 = pose.keypoints[j]
      if (kp1.score > 0.5 && kp2.score > 0.5) {
        ctx.beginPath()
        ctx.moveTo(kp1.x, kp1.y)
        ctx.lineTo(kp2.x, kp2.y)
        ctx.strokeStyle = "cyan"
        ctx.lineWidth = 4
        ctx.stroke()
      }
    }

    const drawAngle = (a: any, b: any, c: any) => {
      if ([a, b, c].every((kp) => kp.score > 0.5)) {
        const angle = calculateAngle(a, b, c)
        ctx.fillStyle = "yellow"
        ctx.font = "bold 16px Arial"
        ctx.fillText(`${angle}°`, b.x + 10, b.y - 10)
      }
    }

    drawLine(6, 8)
    drawLine(8, 10)
    drawLine(6, 12)
    drawLine(12, 14)
    drawLine(14, 16)

    drawAngle(pose.keypoints[6], pose.keypoints[8], pose.keypoints[10])
    drawAngle(pose.keypoints[6], pose.keypoints[12], pose.keypoints[14])
  }

  const handleStart = () => {
    setSessionActive(true)
    setStartTime(new Date())
    setCount(0)
    setGoodReps(0)
    setExcellentReps(0)
    setElapsedTime(0)
    setRecentVoiceFeedback([])
    setLastSpokenFeedback("")
  }

  const handleStop = async () => {
    setSessionActive(false)
    if (!user || !startTime) return

    let proType = "Beginner"
    if (count > 25) proType = "Pro"
    else if (count > 10) proType = "Intermediate"
const sessionData = {
  uid: user.uid,
  displayName: user.displayName || "Anonymous",
  photoURL: user.photoURL || "/avatar-placeholder.png",
  reps: count,
  goodReps: goodReps,
  excellentReps: excellentReps,
  proType: proType,
  startTime: startTime.toISOString(),
  durationSeconds: elapsedTime,
  recordedAt: new Date().toISOString()
}


    await addDoc(collection(db, "sessions"), sessionData)

    Swal.fire({
      icon: "success",
      title: "Session Saved!",
      html: `<b>Total:</b> ${count} reps<br/><b>Good:</b> ${goodReps}<br/><b>Excellent:</b> ${excellentReps}<br/><b>Level:</b> ${proType}`,
      confirmButtonColor: "#6366f1"
    })
  }
 const handleShare = async () => {
  const summary = document.getElementById("session-summary")
  if (!summary) return

  // Generate image
  const canvas = await html2canvas(summary, {
    backgroundColor: null, // ensures transparent parts don't turn white
    useCORS: true // allow external avatar image to render
  })

  const dataUrl = canvas.toDataURL("image/png")

  // Download image automatically
  const link = document.createElement("a")
  link.href = dataUrl
  link.download = "pushup-summary.png"
  link.click()

  // WhatsApp message text
  const text = `🔥 Push-up Workout Summary 🔥

👤 ${user?.displayName || "I"} did ${count} push-ups!
🌟 Excellent Form: ${excellentReps}
✅ Good Reps: ${goodReps}

📸 Summary image downloaded. Share it now!

Try it yourself 👉 https://your-app-url.com`

  // Open WhatsApp share link with text
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(url, "_blank")
}


  return (
    <div className="w-full px-4 py-8 flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Bar from bottom to top */}
      <div className="fixed bottom-0 right-0 w-4 h-full bg-gray-700">
        <div
          className="absolute bottom-0 w-full transition-all duration-300"
          style={{
            height: `${barLevel * 100}%`,
            background: `hsl(${120 - barLevel * 120}, 100%, 50%)`
          }}
        ></div>
      </div>

      {/* Video Container */}
      <div className="relative w-full max-w-[800px] aspect-video shadow-xl rounded-xl overflow-hidden">
        <Webcam
          ref={webcamRef}
          mirrored={false}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          videoConstraints={{ facingMode: "user" }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full z-10"
        />
      </div>

      {/* UI Overlays */}
      <div className="mt-4 w-full max-w-[800px] flex flex-wrap justify-between gap-2 text-sm sm:text-base">
        <div className="bg-purple-600 px-4 py-2 rounded-xl font-bold shadow">{count} Push-ups</div>
        <div className="bg-black bg-opacity-70 px-4 py-2 rounded-xl text-yellow-400">Elbow: {elbowAngle}° | Back: {backAngle}°</div>
        <div className="bg-black bg-opacity-80 px-4 py-2 rounded-xl">{feedback}</div>
        <div className="bg-black bg-opacity-70 px-4 py-2 rounded-xl">{position}</div>
        <div className="flex gap-2">
          {!sessionActive ? (
            <button onClick={handleStart} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl">Start</button>
          ) : (
            <button onClick={handleStop} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl">Stop</button>
          )}
        </div>
        {sessionActive && (
          <div className="bg-white text-black px-4 py-2 rounded-xl">
            ⏱️ Time: {Math.floor(elapsedTime / 60)}:{elapsedTime % 60 < 10 ? "0" : ""}{elapsedTime % 60}
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-col items-center">
  {/* Hidden Summary Card */}
  <div
  id="session-summary"
  className="w-80 p-6 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white shadow-2xl text-center relative"
>
  <h2 className="text-xl font-bold mb-3">🏋️ PushTrack AI Summary</h2>

  <div className="mb-3">
    <img
      src={user?.photoURL || "/avatar-placeholder.png"}
      alt="User Avatar"
      crossOrigin="anonymous"
      className="w-16 h-16 mx-auto rounded-full border-2 border-white"
    />
    <p className="mt-2 font-medium">{user?.displayName || "You"}</p>
  </div>

  <p>🔢 Push-ups: <strong>{count}</strong></p>
  <p>✅ Good Reps: <strong>{goodReps}</strong></p>
  <p>🌟 Excellent: <strong>{excellentReps}</strong></p>

  <p className="mt-3 text-lg font-semibold">
    {count > 25 ? "🥇 Pro" : count > 10 ? "🥈 Intermediate" : "🏅 Beginner"}
  </p>

  <p className="mt-4 text-sm opacity-80">Powered by PushTrack AI</p>
</div>


  {/* Share Button */}
  {!sessionActive && count > 0 && (
    <button
      onClick={handleShare}
      className="bg-green-500 hover:bg-green-600 text-white mt-4 px-4 py-2 rounded-xl shadow"
    >
      📤 Share Result
    </button>
  )}
</div>


      {/* Voice Coach Below */}
      {sessionActive && (
        <div className="w-full max-w-[800px] mt-6">
          <VoiceCoach feedbackList={recentVoiceFeedback} poseName="Pushup" />
        </div>
      )}
    </div>
  )
}

export default PushupCounter
