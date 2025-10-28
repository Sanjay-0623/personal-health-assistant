"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Activity, Droplet, Thermometer, TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { HealthMetric } from "@/lib/types"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface HealthMetricsOverviewProps {
  userId: string
}

export function HealthMetricsOverview({ userId }: HealthMetricsOverviewProps) {
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
        .limit(50)

      if (data) {
        setMetrics(data)
      }
      setLoading(false)
    }

    fetchMetrics()
  }, [userId, supabase])

  const getLatestMetric = (type: string) => {
    return metrics.find((m) => m.metric_type === type)
  }

  const getMetricTrend = (type: string) => {
    const typeMetrics = metrics.filter((m) => m.metric_type === type).slice(0, 2)
    if (typeMetrics.length < 2) return null
    return typeMetrics[0].value > typeMetrics[1].value ? "up" : "down"
  }

  const heartRate = getLatestMetric("heart_rate")
  const bloodPressure = getLatestMetric("blood_pressure")
  const oxygenLevel = getLatestMetric("oxygen_level")
  const temperature = getLatestMetric("temperature")

  const chartData = metrics
    .filter((m) => m.metric_type === "heart_rate")
    .slice(0, 7)
    .reverse()
    .map((m) => ({
      date: new Date(m.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: m.value,
    }))

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Health Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading metrics...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Vital Signs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Heart Rate</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{heartRate?.value || "--"}</p>
                  <span className="text-sm text-muted-foreground">bpm</span>
                  {getMetricTrend("heart_rate") === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                  {getMetricTrend("heart_rate") === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Blood Pressure</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">
                    {bloodPressure?.systolic || "--"}/{bloodPressure?.diastolic || "--"}
                  </p>
                  <span className="text-sm text-muted-foreground">mmHg</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Droplet className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Oxygen Level</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{oxygenLevel?.value || "--"}</p>
                  <span className="text-sm text-muted-foreground">%</span>
                  {getMetricTrend("oxygen_level") === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                  {getMetricTrend("oxygen_level") === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Thermometer className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Temperature</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{temperature?.value || "--"}</p>
                  <span className="text-sm text-muted-foreground">°F</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Heart Rate Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
