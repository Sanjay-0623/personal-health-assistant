"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface GenerateInsightsProps {
  userId: string
}

export function GenerateInsights({ userId }: GenerateInsightsProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    console.log("[v0] Starting insight generation for user:", userId)

    try {
      const response = await fetch("/api/analyze-health", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("[v0] API response status:", response.status)
      const data = await response.json()
      console.log("[v0] API response data:", data)

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to generate insights")
      }

      if (data.success) {
        setSuccess(true)
        console.log("[v0] Insights generated successfully, redirecting...")
        setTimeout(() => {
          router.push("/dashboard/insights")
        }, 2000)
      }
    } catch (err) {
      console.error("[v0] Error generating insights:", err)
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Generate AI Health Insights</h1>
        <p className="text-muted-foreground">Get personalized health recommendations based on your data</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            AI Health Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 p-6">
            <h3 className="mb-3 font-semibold">What you&apos;ll get:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                <span>Comprehensive analysis of your health metrics and trends</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                <span>Personalized lifestyle, nutrition, and exercise recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                <span>Early detection of concerning patterns or abnormal readings</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                <span>Preventive care suggestions tailored to your health profile</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                <span>Overall health score and wellness optimization tips</span>
              </li>
            </ul>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Failed to generate insights</p>
                <p className="mt-1 text-xs">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span>Insights generated successfully! Redirecting...</span>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleGenerate} disabled={loading || success} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing your health data...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Insights Generated
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Insights
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Note: AI insights are for informational purposes only and should not replace professional medical advice.
            Always consult with healthcare professionals for medical decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
