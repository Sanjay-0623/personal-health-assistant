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
    console.log("[v0] Starting health analysis...")
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("[v0] User authenticated:", user?.id)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user's health data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    console.log("[v0] Profile fetched:", profile, profileError)

    const { data: recentMetrics, error: metricsError } = await supabase
      .from("health_metrics")
      .select("*")
      .eq("user_id", user.id)
      .order("recorded_at", { ascending: false })
      .limit(30)

    console.log("[v0] Recent metrics fetched:", recentMetrics?.length, metricsError)

    const { data: medications, error: medicationsError } = await supabase
      .from("medications")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)

    console.log("[v0] Medications fetched:", medications?.length, medicationsError)

    // Prepare health data summary
    const healthDataSummary = {
      profile: {
        age: profile?.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : null,
        gender: profile?.gender || "not specified",
        bloodType: profile?.blood_type || "not specified",
        allergies: profile?.allergies || [],
        chronicConditions: profile?.chronic_conditions || [],
      },
      recentMetrics:
        recentMetrics?.map((m) => ({
          type: m.metric_type,
          value: m.value,
          unit: m.unit,
          systolic: m.systolic,
          diastolic: m.diastolic,
          recordedAt: m.recorded_at,
        })) || [],
      medications:
        medications?.map((m) => ({
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
        })) || [],
    }

    console.log("[v0] Health data summary prepared:", JSON.stringify(healthDataSummary, null, 2))

    // Generate AI analysis
    console.log("[v0] Calling AI model...")
    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: healthAnalysisSchema,
      prompt: `You are an AI health assistant analyzing a patient's health data. Provide comprehensive health insights, personalized recommendations, and identify any concerning patterns.

Patient Health Data:
${JSON.stringify(healthDataSummary, null, 2)}

${
  recentMetrics && recentMetrics.length > 0
    ? "Analyze this data and provide:"
    : "Note: This is a new user with limited health data. Provide general health recommendations and encourage them to start tracking their health metrics. Provide:"
}

1. An overall health score (0-100)${recentMetrics && recentMetrics.length > 0 ? " based on the available data" : " (use 75 as a baseline for new users)"}
2. 3-5 personalized health insights covering lifestyle, nutrition, exercise, sleep, and preventive care
3. ${recentMetrics && recentMetrics.length > 0 ? "Any health alerts for abnormal readings or concerning patterns" : "Helpful tips for starting a health tracking journey (create at least one low-severity alert encouraging them to log their first health metrics)"}

Be specific, actionable, and supportive in your recommendations. Focus on preventive care and wellness optimization.`,
    })

    console.log("[v0] AI analysis complete:", object)

    // Save insights to database
    for (const insight of object.insights) {
      const { error: insightError } = await supabase.from("ai_insights").insert({
        user_id: user.id,
        insight_type: insight.type,
        title: insight.title,
        content: insight.content,
        recommendations: insight.recommendations,
        confidence_score: insight.confidenceScore,
      })
      if (insightError) {
        console.error("[v0] Error saving insight:", insightError)
      }
    }

    // Save alerts to database
    for (const alert of object.alerts) {
      const { error: alertError } = await supabase.from("health_alerts").insert({
        user_id: user.id,
        alert_type: alert.alertType,
        severity: alert.severity,
        title: alert.title,
        message: alert.message,
      })
      if (alertError) {
        console.error("[v0] Error saving alert:", alertError)
      }
    }

    console.log("[v0] Insights and alerts saved successfully")

    return NextResponse.json({
      success: true,
      analysis: object,
    })
  } catch (error) {
    console.error("[v0] Error analyzing health data:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze health data",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
