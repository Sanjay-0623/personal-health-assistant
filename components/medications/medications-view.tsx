"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pill, Plus, Clock, Calendar, User, Trash2, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Medication } from "@/lib/types"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface MedicationsViewProps {
  userId: string
}

export function MedicationsView({ userId }: MedicationsViewProps) {
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchMedications()
  }, [])

  async function fetchMedications() {
    const { data } = await supabase
      .from("medications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (data) {
      setMedications(data)
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    await supabase.from("medications").delete().eq("id", id)
    fetchMedications()
  }

  async function handleToggleActive(id: string, currentStatus: boolean) {
    await supabase.from("medications").update({ is_active: !currentStatus }).eq("id", id)
    fetchMedications()
  }

  const activeMedications = medications.filter((m) => m.is_active)
  const inactiveMedications = medications.filter((m) => !m.is_active)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Medications</h1>
        </div>
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Loading medications...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medications</h1>
          <p className="text-muted-foreground">Manage your medications and track your intake</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/medications/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Medication
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active ({activeMedications.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({inactiveMedications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeMedications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                  <Pill className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">No active medications</h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  Add your first medication to start tracking your intake
                </p>
                <Button asChild>
                  <Link href="/dashboard/medications/add">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Medication
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeMedications.map((medication) => (
                <Card key={medication.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                          <Pill className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{medication.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            Active
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Pill className="h-4 w-4" />
                        <span className="font-medium">Dosage:</span>
                        <span>{medication.dosage}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Frequency:</span>
                        <span>{medication.frequency.replace("_", " ")}</span>
                      </div>
                      {medication.time_of_day && medication.time_of_day.length > 0 && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">Times:</span>
                          <span>{medication.time_of_day.join(", ")}</span>
                        </div>
                      )}
                      {medication.prescribing_doctor && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span className="font-medium">Doctor:</span>
                          <span>{medication.prescribing_doctor}</span>
                        </div>
                      )}
                    </div>

                    {medication.instructions && (
                      <div className="rounded-lg bg-muted/50 p-3 text-sm">
                        <p className="font-medium">Instructions:</p>
                        <p className="text-muted-foreground">{medication.instructions}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleToggleActive(medication.id, medication.is_active)}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Mark Inactive
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Medication</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {medication.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(medication.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive" className="mt-6">
          {inactiveMedications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No inactive medications</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {inactiveMedications.map((medication) => (
                <Card key={medication.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <Pill className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{medication.name}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            Inactive
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Pill className="h-4 w-4" />
                        <span className="font-medium">Dosage:</span>
                        <span>{medication.dosage}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Frequency:</span>
                        <span>{medication.frequency.replace("_", " ")}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleToggleActive(medication.id, medication.is_active)}
                      >
                        Reactivate
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Medication</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {medication.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(medication.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
