import { generateObject } from "ai"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { z } from "zod"

const abnormalCheckSchema = z.object({
  isAbnormal: z.boolean(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  reason: z.string(),
  recommendations: z.array(z.string()),
  requiresImmediateAttention: z.boolean(),
})

export async function POST(request: Request) {
  try {
    const { metricType, value, systolic, diastolic, unit } = await request.json()

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user profile for context
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    // Get historical data for comparison
    const { data: historicalMetrics } = await supabase
      .from("health_metrics")
      .select("*")
      .eq("user_id", user.id)
      .eq("metric_type", metricType)
      .order("recorded_at", { ascending: false })
      .limit(10)

    const metricData = {
      type: metricType,
      value,
      systolic,
      diastolic,
      unit,
    }

    const userContext = {
      age: profile?.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : null,
      gender: profile?.gender,
      chronicConditions: profile?.chronic_conditions,
      historicalAverage:
        historicalMetrics && historicalMetrics.length > 0
          ? historicalMetrics.reduce((sum, m) => sum + Number(m.value), 0) / historicalMetrics.length
          : null,
    }

    // Check if reading is abnormal using AI
    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: abnormalCheckSchema,
      prompt: `You are a medical AI assistant analyzing a health metric reading. Determine if this reading is abnormal and requires attention.

Metric Data:
${JSON.stringify(metricData, null, 2)}

User Context:
${JSON.stringify(userContext, null, 2)}

Standard healthy ranges:
- Heart Rate: 60-100 bpm (resting)
- Blood Pressure: Systolic 90-120 mmHg, Diastolic 60-80 mmHg
- Oxygen Level: 95-100%
- Temperature: 97-99°F (36.1-37.2°C)
- Weight: Varies by individual

Analyze this reading and determine:
1. Is it abnormal?
2. What is the severity level?
3. Why is it concerning (if abnormal)?
4. What recommendations should be given?
5. Does it require immediate medical attention?

Consider the user's age, gender, chronic conditions, and historical patterns.`,
    })

    // If abnormal, create an alert
    if (object.isAbnormal) {
      await supabase.from("health_alerts").insert({
        user_id: user.id,
        alert_type: "abnormal_reading",
        severity: object.severity,
        title: `Abnormal ${metricType} Reading`,
        message: object.reason,
      })
    }

    return NextResponse.json({
      success: true,
      analysis: object,
    })
  } catch (error) {
    console.error("[v0] Error checking abnormal reading:", error)
    return NextResponse.json({ error: "Failed to check reading" }, { status: 500 })
  }
}
