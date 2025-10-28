"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { AIInsight } from "@/lib/types"
import Link from "next/link"

interface AIInsightsCardProps {
  userId: string
}

export function AIInsightsCard({ userId }: AIInsightsCardProps) {
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
        .limit(3)

      if (data) {
        setInsights(data)
      }
      setLoading(false)
    }

    fetchInsights()
  }, [userId, supabase])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Health Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading insights...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Health Insights
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/insights/generate">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate New
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <p className="mb-2 text-sm font-medium">No insights yet</p>
            <p className="mb-4 text-sm text-muted-foreground">
              Generate personalized health insights based on your data
            </p>
            <Button asChild>
              <Link href="/dashboard/insights/generate">Generate Insights</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="rounded-lg border bg-gradient-to-br from-purple-50 to-blue-50 p-4">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-semibold">{insight.title}</h3>
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{insight.content}</p>
                {insight.recommendations && insight.recommendations.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Recommendations:</p>
                    <ul className="space-y-1">
                      {insight.recommendations.slice(0, 2).map((rec, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground">
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/dashboard/insights">View All Insights</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
