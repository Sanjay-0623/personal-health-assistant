"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pill, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Medication } from "@/lib/types"
import Link from "next/link"

interface MedicationRemindersProps {
  userId: string
}

export function MedicationReminders({ userId }: MedicationRemindersProps) {
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMedications() {
      const { data } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(5)

      if (data) {
        setMedications(data)
      }
      setLoading(false)
    }

    fetchMedications()
  }, [userId, supabase])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medication Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading medications...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today&apos;s Medications</CardTitle>
      </CardHeader>
      <CardContent>
        {medications.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-4">No medications scheduled</p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/medications/add">Add Medication</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {medications.map((med) => (
              <div key={med.id} className="flex items-start gap-3 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <Pill className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{med.name}</p>
                  <p className="text-xs text-muted-foreground">{med.dosage}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {med.time_of_day?.join(", ")}
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/dashboard/medications">View All Medications</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
