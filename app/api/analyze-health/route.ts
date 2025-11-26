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

    const hasMetrics = recentMetrics && recentMetrics.length > 0
    const hasMedications = medications && medications.length > 0

    // Calculate health score based on available data
    let healthScore = 75 // baseline

    if (hasMetrics) {
      // Adjust score based on recent metrics
      const avgHeartRate =
        recentMetrics
          .filter((m) => m.metric_type === "heart_rate")
          .slice(0, 5)
          .reduce((sum, m) => sum + Number(m.value), 0) / 5

      if (avgHeartRate && avgHeartRate >= 60 && avgHeartRate <= 100) {
        healthScore += 5
      }

      // Check for consistent tracking
      if (recentMetrics.length >= 10) {
        healthScore += 10
      }
    }

    // Generate insights based on data
    const insights = []

    if (hasMetrics) {
      const heartRateMetrics = recentMetrics.filter((m) => m.metric_type === "heart_rate")
      if (heartRateMetrics.length > 0) {
        const avgHR =
          heartRateMetrics.slice(0, 5).reduce((sum, m) => sum + Number(m.value), 0) /
          heartRateMetrics.slice(0, 5).length
        insights.push({
          type: "lifestyle",
          title: "Heart Rate Monitoring",
          content: `Your average heart rate is ${Math.round(avgHR)} bpm. ${avgHR >= 60 && avgHR <= 100 ? "This is within the normal range." : "Consider consulting with a healthcare provider about this reading."}`,
          recommendations: [
            "Continue regular heart rate monitoring",
            "Maintain consistent exercise routine",
            "Monitor any unusual changes in resting heart rate",
          ],
          confidenceScore: 0.85,
        })
      }

      const bpMetrics = recentMetrics.filter((m) => m.metric_type === "blood_pressure")
      if (bpMetrics.length > 0) {
        insights.push({
          type: "preventive_care",
          title: "Blood Pressure Tracking",
          content: "You're actively monitoring your blood pressure, which is excellent for cardiovascular health.",
          recommendations: [
            "Continue regular blood pressure checks",
            "Maintain a low-sodium diet",
            "Stay hydrated throughout the day",
          ],
          confidenceScore: 0.8,
        })
      }
    } else {
      insights.push({
        type: "lifestyle",
        title: "Start Your Health Journey",
        content:
          "Welcome to your health assistant! Begin by tracking your vital signs regularly to establish your health baseline.",
        recommendations: [
          "Log your heart rate and blood pressure daily",
          "Track your activity levels and sleep patterns",
          "Set up medication reminders if needed",
        ],
        confidenceScore: 0.9,
      })
    }

    // Add nutrition insight
    insights.push({
      type: "nutrition",
      title: "Balanced Nutrition",
      content: "Maintaining a balanced diet is crucial for overall health and wellness.",
      recommendations: [
        "Eat a variety of colorful fruits and vegetables",
        "Stay hydrated with at least 8 glasses of water daily",
        "Limit processed foods and added sugars",
      ],
      confidenceScore: 0.85,
    })

    // Add exercise insight
    insights.push({
      type: "exercise",
      title: "Regular Physical Activity",
      content: "Regular exercise is essential for maintaining cardiovascular health and overall wellness.",
      recommendations: [
        "Aim for 150 minutes of moderate exercise per week",
        "Include both cardio and strength training",
        "Take breaks to stretch if you sit for long periods",
      ],
      confidenceScore: 0.9,
    })

    // Generate alerts
    const alerts = []

    if (!hasMetrics) {
      alerts.push({
        severity: "low",
        title: "Start Tracking Your Health",
        message:
          "Begin your health journey by logging your first vital signs. Regular tracking helps identify trends and potential health concerns early.",
        alertType: "appointment",
      })
    }

    if (hasMetrics) {
      // Check for abnormal readings
      const highBP = recentMetrics.some(
        (m) => m.metric_type === "blood_pressure" && (Number(m.systolic) > 140 || Number(m.diastolic) > 90),
      )

      if (highBP) {
        alerts.push({
          severity: "medium",
          title: "Elevated Blood Pressure Detected",
          message:
            "Some of your blood pressure readings are above the normal range. Consider scheduling a check-up with your healthcare provider.",
          alertType: "abnormal_reading",
        })
      }

      const highHR = recentMetrics.some((m) => m.metric_type === "heart_rate" && Number(m.value) > 100)

      if (highHR) {
        alerts.push({
          severity: "low",
          title: "Elevated Heart Rate",
          message:
            "Your heart rate has been elevated recently. This could be due to activity, stress, or caffeine. Monitor and consult a doctor if it persists.",
          alertType: "abnormal_reading",
        })
      }
    }

    if (hasMedications) {
      alerts.push({
        severity: "low",
        title: "Medication Reminders Active",
        message: `You have ${medications.length} active medication${medications.length > 1 ? "s" : ""}. Check the Medications tab to ensure you're taking them as prescribed.`,
        alertType: "medication_reminder",
      })
    }

    const analysisResult = {
      overallHealthScore: Math.min(100, healthScore),
      insights,
      alerts,
    }

    console.log("[v0] Rule-based analysis complete:", analysisResult)

    // Save insights to database
    for (const insight of analysisResult.insights) {
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
    for (const alert of analysisResult.alerts) {
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
      analysis: analysisResult,
    })
  } catch (error) {
    console.error("[v0] Error analyzing health data:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze health data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
