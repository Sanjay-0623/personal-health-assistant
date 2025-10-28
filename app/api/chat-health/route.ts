import { streamText } from "ai"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user's health context
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    const { data: recentMetrics } = await supabase
      .from("health_metrics")
      .select("*")
      .eq("user_id", user.id)
      .order("recorded_at", { ascending: false })
      .limit(10)

    const { data: medications } = await supabase
      .from("medications")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)

    const { data: recentAlerts } = await supabase
      .from("health_alerts")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_resolved", false)
      .order("created_at", { ascending: false })
      .limit(5)

    const healthContext = `
User Health Profile:
- Name: ${profile?.full_name || "User"}
- Blood Type: ${profile?.blood_type || "Not specified"}
- Allergies: ${profile?.allergies?.join(", ") || "None"}
- Chronic Conditions: ${profile?.chronic_conditions?.join(", ") || "None"}

Recent Health Metrics:
${recentMetrics?.map((m) => `- ${m.metric_type}: ${m.value} ${m.unit} (${new Date(m.recorded_at).toLocaleDateString()})`).join("\n") || "No recent metrics"}

Current Medications:
${medications?.map((m) => `- ${m.name} (${m.dosage}) - ${m.frequency}`).join("\n") || "No active medications"}

Active Health Alerts:
${recentAlerts?.map((a) => `- [${a.severity}] ${a.title}: ${a.message}`).join("\n") || "No active alerts"}
`

    const result = streamText({
      model: "openai/gpt-4o-mini",
      system: `You are a compassionate and knowledgeable AI health assistant. You help users understand their health data, provide wellness advice, and answer health-related questions.

Important guidelines:
- Always be supportive and encouraging
- Provide evidence-based health information
- Remind users that you're not a replacement for professional medical advice
- Encourage users to consult healthcare professionals for serious concerns
- Focus on preventive care and wellness optimization
- Be specific and actionable in your recommendations

User's Health Context:
${healthContext}`,
      messages,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Error in health chat:", error)
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 })
  }
}
