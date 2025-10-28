"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { HealthMetric } from "@/lib/types"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MetricsViewProps {
  userId: string
}

export function MetricsView({ userId }: MetricsViewProps) {
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMetrics() {
      const { data } = await supabase
        .from("health_metrics")
        .select("*")
        .eq("user_id", userId)
        .order("recorded_at", { ascending: false })
        .limit(100)

      if (data) {
        setMetrics(data)
      }
      setLoading(false)
    }

    fetchMetrics()
  }, [userId, supabase])

  const getMetricsByType = (type: string) => {
    return metrics.filter((m) => m.metric_type === type)
  }

  const getChartData = (type: string) => {
    return getMetricsByType(type)
      .slice(0, 30)
      .reverse()
      .map((m) => ({
        date: new Date(m.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: m.value,
      }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Health Metrics</h1>
        </div>
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Loading metrics...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health Metrics</h1>
          <p className="text-muted-foreground">View and analyze your health data over time</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/metrics/add">
            <Plus className="mr-2 h-4 w-4" />
            Log Data
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="heart_rate" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-7">
          <TabsTrigger value="heart_rate">Heart Rate</TabsTrigger>
          <TabsTrigger value="blood_pressure">Blood Pressure</TabsTrigger>
          <TabsTrigger value="oxygen_level">Oxygen</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="sleep_hours">Sleep</TabsTrigger>
        </TabsList>

        {["heart_rate", "blood_pressure", "oxygen_level", "temperature", "weight", "steps", "sleep_hours"].map(
          (type) => (
            <TabsContent key={type} value={type} className="mt-6 space-y-6">
              {getChartData(type).length > 0 ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Trend (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={getChartData(type)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Readings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {getMetricsByType(type)
                          .slice(0, 10)
                          .map((metric) => (
                            <div key={metric.id} className="flex items-center justify-between rounded-lg border p-3">
                              <div>
                                <p className="font-medium">
                                  {metric.value} {metric.unit}
                                  {metric.systolic && metric.diastolic && ` (${metric.systolic}/${metric.diastolic})`}
                                </p>
                                {metric.notes && <p className="text-sm text-muted-foreground">{metric.notes}</p>}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(metric.recorded_at).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="mb-4 text-muted-foreground">No {type.replace("_", " ")} data recorded yet</p>
                    <Button asChild>
                      <Link href="/dashboard/metrics/add">
                        <Plus className="mr-2 h-4 w-4" />
                        Log First Reading
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ),
        )}
      </Tabs>
    </div>
  )
}
