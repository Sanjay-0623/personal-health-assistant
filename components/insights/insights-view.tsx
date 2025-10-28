"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles, TrendingUp, Apple, Dumbbell, Moon, Shield } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { AIInsight } from "@/lib/types"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface InsightsViewProps {
  userId: string
}

export function InsightsView({ userId }: InsightsViewProps) {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchInsights() {
      const { data } = await supabase
        .from("ai_insights")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (data) {
        setInsights(data)
      }
      setLoading(false)
    }

    fetchInsights()
  }, [userId, supabase])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "lifestyle":
        return <TrendingUp className="h-5 w-5" />
      case "nutrition":
        return <Apple className="h-5 w-5" />
      case "exercise":
        return <Dumbbell className="h-5 w-5" />
      case "sleep":
        return <Moon className="h-5 w-5" />
      case "preventive_care":
        return <Shield className="h-5 w-5" />
      default:
        return <Brain className="h-5 w-5" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "lifestyle":
        return "bg-blue-100 text-blue-600"
      case "nutrition":
        return "bg-green-100 text-green-600"
      case "exercise":
        return "bg-orange-100 text-orange-600"
      case "sleep":
        return "bg-purple-100 text-purple-600"
      case "preventive_care":
        return "bg-teal-100 text-teal-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">AI Health Insights</h1>
        </div>
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Loading insights...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Health Insights</h1>
          <p className="text-muted-foreground">Personalized recommendations based on your health data</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/insights/generate">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate New Insights
          </Link>
        </Button>
      </div>

      {insights.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
              <Brain className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No insights yet</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Generate your first AI-powered health insights to get personalized recommendations
            </p>
            <Button asChild>
              <Link href="/dashboard/insights/generate">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Insights
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {insights.map((insight) => (
            <Card key={insight.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${getInsightColor(insight.insight_type)}`}
                    >
                      {getInsightIcon(insight.insight_type)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{insight.title}</CardTitle>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {insight.insight_type.replace("_", " ")}
                        </Badge>
                        {insight.confidence_score && (
                          <span className="text-xs text-muted-foreground">
                            Confidence: {Math.round(insight.confidence_score * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4 text-muted-foreground">{insight.content}</p>
                {insight.recommendations && insight.recommendations.length > 0 && (
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h4 className="mb-3 flex items-center gap-2 font-semibold">
                      <TrendingUp className="h-4 w-4" />
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {insight.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {idx + 1}
                          </span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-4 text-xs text-muted-foreground">
                  Generated on{" "}
                  {new Date(insight.created_at).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
