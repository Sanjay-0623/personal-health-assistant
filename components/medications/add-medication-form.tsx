"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pill, Plus, X } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface AddMedicationFormProps {
  userId: string
}

export function AddMedicationForm({ userId }: AddMedicationFormProps) {
  const [name, setName] = useState("")
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState("daily")
  const [timeOfDay, setTimeOfDay] = useState<string[]>(["08:00"])
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState("")
  const [instructions, setInstructions] = useState("")
  const [prescribingDoctor, setPrescribingDoctor] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const handleAddTime = () => {
    setTimeOfDay([...timeOfDay, "12:00"])
  }

  const handleRemoveTime = (index: number) => {
    setTimeOfDay(timeOfDay.filter((_, i) => i !== index))
  }

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...timeOfDay]
    newTimes[index] = value
    setTimeOfDay(newTimes)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: insertError } = await supabase.from("medications").insert({
        user_id: userId,
        name,
        dosage,
        frequency,
        time_of_day: timeOfDay,
        start_date: startDate,
        end_date: endDate || null,
        instructions: instructions || null,
        prescribing_doctor: prescribingDoctor || null,
        is_active: true,
      })

      if (insertError) throw insertError

      router.push("/dashboard/medications")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Medication</h1>
        <p className="text-muted-foreground">Add a new medication to your tracking list</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-purple-600" />
            Medication Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Medication Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Aspirin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  placeholder="e.g., 100mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency *</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="twice_daily">Twice Daily</SelectItem>
                  <SelectItem value="three_times_daily">Three Times Daily</SelectItem>
                  <SelectItem value="four_times_daily">Four Times Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="as_needed">As Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time of Day</Label>
              <div className="space-y-2">
                {timeOfDay.map((time, index) => (
                  <div key={index} className="flex gap-2">
                    <Input type="time" value={time} onChange={(e) => handleTimeChange(index, e.target.value)} />
                    {timeOfDay.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveTime(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddTime}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Time
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor">Prescribing Doctor (Optional)</Label>
              <Input
                id="doctor"
                placeholder="Dr. Smith"
                value={prescribingDoctor}
                onChange={(e) => setPrescribingDoctor(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                placeholder="Take with food, avoid alcohol, etc."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
              />
            </div>

            {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Adding..." : "Add Medication"}
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
