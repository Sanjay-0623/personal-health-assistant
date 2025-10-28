import { generateObject } from "ai"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { z } from "zod"

const healthAnalysisSchema = z.object({
  overallHealthScore: z.number().min(0).max(100).describe("Overall health score from 0-100"),
  insights: z.array(
    z.object({
      type: z.enum(["lifestyle", "nutrition", "exercise", "sleep", "preventive_care"]),
      title: z.string(),
      content: z.string(),
      recommendations: z.array(z.string()),
      confidenceScore: z.number().min(0).max(1),
    }),
  ),
  alerts: z.array(
    z.object({
      severity: z.enum(["low", "medium", "high", "critical"]),
      title: z.string(),
      message: z.string(),
      alertType: z.enum(["abnormal_reading", "medication_reminder", "emergency", "appointment"]),
    }),
  ),
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user's health data
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    const { data: recentMetrics } = await supabase
      .from("health_metrics")
      .select("*")
      .eq("user_id", user.id)
      .order("recorded_at", { ascending: false })
      .limit(30)

    const { data: medications } = await supabase
      .from("medications")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)

    // Prepare health data summary
    const healthDataSummary = {
      profile: {
        age: profile?.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : null,
        gender: profile?.gender,
        bloodType: profile?.blood_type,
        allergies: profile?.allergies,
        chronicConditions: profile?.chronic_conditions,
      },
      recentMetrics: recentMetrics?.map((m) => ({
        type: m.metric_type,
        value: m.value,
        unit: m.unit,
        systolic: m.systolic,
        diastolic: m.diastolic,
        recordedAt: m.recorded_at,
      })),
      medications: medications?.map((m) => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
      })),
    }

    // Generate AI analysis
    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: healthAnalysisSchema,
      prompt: `You are an AI health assistant analyzing a patient's health data. Provide comprehensive health insights, personalized recommendations, and identify any concerning patterns.

Patient Health Data:
${JSON.stringify(healthDataSummary, null, 2)}

Analyze this data and provide:
1. An overall health score (0-100)
2. 3-5 personalized health insights covering lifestyle, nutrition, exercise, sleep, and preventive care
3. Any health alerts for abnormal readings or concerning patterns

Be specific, actionable, and supportive in your recommendations. Focus on preventive care and wellness optimization.`,
    })

    // Save insights to database
    for (const insight of object.insights) {
      await supabase.from("ai_insights").insert({
        user_id: user.id,
        insight_type: insight.type,
        title: insight.title,
        content: insight.content,
        recommendations: insight.recommendations,
        confidence_score: insight.confidenceScore,
      })
    }

    // Save alerts to database
    for (const alert of object.alerts) {
      await supabase.from("health_alerts").insert({
        user_id: user.id,
        alert_type: alert.alertType,
        severity: alert.severity,
        title: alert.title,
        message: alert.message,
      })
    }

    return NextResponse.json({
      success: true,
      analysis: object,
    })
  } catch (error) {
    console.error("[v0] Error analyzing health data:", error)
    return NextResponse.json({ error: "Failed to analyze health data" }, { status: 500 })
  }
}
