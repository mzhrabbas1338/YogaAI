import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface VoiceSettings {
  enabled: boolean
  volume: number
  speed: number
  voice: "male" | "female" | "neutral"
  language: "en" | "es" | "fr"
}

interface VoiceCorrectionParams {
  pose: string
  correction: string
  severity: "low" | "medium" | "high"
  voiceSettings: VoiceSettings
}

export async function generateVoiceCorrection({
  pose,
  correction,
  severity,
  voiceSettings,
}: VoiceCorrectionParams): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an expert fitness coach providing voice corrections for yoga and exercise poses. 
      
      Guidelines:
      - Be encouraging and supportive
      - Use clear, concise language
      - Provide specific, actionable instructions
      - Match the tone to the severity level
      - Keep responses under 20 words for voice delivery
      - Use motivational language
      
      Severity levels:
      - Low: Gentle suggestions with encouragement
      - Medium: Clear instructions with positive reinforcement  
      - High: Urgent but supportive corrections for safety`,

      prompt: `Current pose: ${pose}
      Correction needed: ${correction}
      Severity: ${severity}
      Voice preference: ${voiceSettings.voice}
      Language: ${voiceSettings.language}
      
      Generate a natural, encouraging voice correction that a fitness coach would say.`,
    })

    return text
  } catch (error) {
    console.error("Error generating voice correction:", error)

    // Fallback corrections based on severity
    const fallbackCorrections = {
      low: `Nice work! Try to ${correction} for better alignment.`,
      medium: `Good effort! Please ${correction} to improve your form.`,
      high: `Important: ${correction} for safety and better results.`,
    }

    return fallbackCorrections[severity]
  }
}

export async function generateMotivationalMessage(
  pose: string,
  sessionTime: number,
  achievements: string[],
): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an enthusiastic fitness coach providing motivational messages. 
      Be energetic, positive, and personalized. Keep messages under 25 words for voice delivery.`,

      prompt: `User is practicing ${pose} for ${sessionTime} minutes.
      Recent achievements: ${achievements.join(", ")}
      
      Generate an encouraging message to keep them motivated.`,
    })

    return text
  } catch (error) {
    console.error("Error generating motivational message:", error)
    return `You're doing amazing with ${pose}! Keep up the fantastic work!`
  }
}

export async function generateWorkoutSummary(
  exercises: string[],
  duration: number,
  corrections: number,
): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a fitness coach providing workout summaries. 
      Be encouraging and highlight progress. Mention areas for improvement constructively.`,

      prompt: `Workout completed:
      Exercises: ${exercises.join(", ")}
      Duration: ${duration} minutes
      Corrections given: ${corrections}
      
      Generate a supportive workout summary with encouragement and next steps.`,
    })

    return text
  } catch (error) {
    console.error("Error generating workout summary:", error)
    return `Great workout! You practiced ${exercises.length} exercises for ${duration} minutes. Keep up the excellent progress!`
  }
}
