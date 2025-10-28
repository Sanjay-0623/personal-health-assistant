"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Heart, Droplet, Thermometer, Weight, Footprints, Moon } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface AddMetricFormProps {
  userId: string
}

export function AddMetricForm({ userId }: AddMetricFormProps) {
  const [metricType, setMetricType] = useState("heart_rate")
  const [value, setValue] = useState("")
  const [systolic, setSystolic] = useState("")
  const [diastolic, setDiastolic] = useState("")
  const [notes, setNotes] = useState("")
  const [recordedAt, setRecordedAt] = useState(new Date().toISOString().slice(0, 16))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const metricConfig: Record<string, { label: string; unit: string; icon: any; placeholder: string; color: string }> = {
    heart_rate: {
      label: "Heart Rate",
      unit: "bpm",
      icon: Heart,
      placeholder: "72",
      color: "text-red-600",
    },
    blood_pressure: {
      label: "Blood Pressure",
      unit: "mmHg",
      icon: Activity,
      placeholder: "120/80",
      color: "text-blue-600",
    },
    oxygen_level: {
      label: "Oxygen Level",
      unit: "%",
      icon: Droplet,
      placeholder: "98",
      color: "text-green-600",
    },
    temperature: {
      label: "Temperature",
      unit: "°F",
      icon: Thermometer,
      placeholder: "98.6",
      color: "text-orange-600",
    },
    weight: {
      label: "Weight",
      unit: "lbs",
      icon: Weight,
      placeholder: "150",
      color: "text-purple-600",
    },
    steps: {
      label: "Steps",
      unit: "steps",
      icon: Footprints,
      placeholder: "10000",
      color: "text-teal-600",
    },
    sleep_hours: {
      label: "Sleep Hours",
      unit: "hours",
      icon: Moon,
      placeholder: "8",
      color: "text-indigo-600",
    },
  }

  const config = metricConfig[metricType]
  const Icon = config.icon

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const metricData: any = {
        user_id: userId,
        metric_type: metricType,
        value: Number.parseFloat(value),
        unit: config.unit,
        notes: notes || null,
        recorded_at: recordedAt,
      }

      if (metricType === "blood_pressure") {
        metricData.systolic = Number.parseFloat(systolic)
        metricData.diastolic = Number.parseFloat(diastolic)
        metricData.value = Number.parseFloat(systolic) // Use systolic as main value
      }

      const { error: insertError } = await supabase.from("health_metrics").insert(metricData)

      if (insertError) throw insertError

      // Check for abnormal readings
      await fetch("/api/check-abnormal-readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metricType,
          value: Number.parseFloat(value),
          systolic: systolic ? Number.parseFloat(systolic) : null,
          diastolic: diastolic ? Number.parseFloat(diastolic) : null,
          unit: config.unit,
        }),
      })

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Log Health Data</h1>
        <p className="text-muted-foreground">Record your health metrics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            {config.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="metricType">Metric Type *</Label>
              <Select value={metricType} onValueChange={setMetricType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(metricConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {metricType === "blood_pressure" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="systolic">Systolic *</Label>
                  <Input
                    id="systolic"
                    type="number"
                    placeholder="120"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diastolic">Diastolic *</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    placeholder="80"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="value">Value ({config.unit}) *</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.1"
                  placeholder={config.placeholder}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="recordedAt">Date & Time *</Label>
              <Input
                id="recordedAt"
                type="datetime-local"
                value={recordedAt}
                onChange={(e) => setRecordedAt(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this reading..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Saving..." : "Save Metric"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
