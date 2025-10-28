"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, Info, CheckCircle2, X } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { HealthAlert } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AlertsViewProps {
  userId: string
}

export function AlertsView({ userId }: AlertsViewProps) {
  const [alerts, setAlerts] = useState<HealthAlert[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchAlerts()
  }, [])

  async function fetchAlerts() {
    const { data } = await supabase
      .from("health_alerts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (data) {
      setAlerts(data)
    }
    setLoading(false)
  }

  async function handleMarkAsRead(id: string) {
    await supabase.from("health_alerts").update({ is_read: true }).eq("id", id)
    fetchAlerts()
  }

  async function handleResolve(id: string) {
    await supabase
      .from("health_alerts")
      .update({ is_resolved: true, resolved_at: new Date().toISOString() })
      .eq("id", id)
    fetchAlerts()
  }

  async function handleDelete(id: string) {
    await supabase.from("health_alerts").delete().eq("id", id)
    fetchAlerts()
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertCircle className="h-5 w-5" />
      case "medium":
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const activeAlerts = alerts.filter((a) => !a.is_resolved)
  const resolvedAlerts = alerts.filter((a) => a.is_resolved)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Health Alerts</h1>
        </div>
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Loading alerts...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health Alerts</h1>
          <p className="text-muted-foreground">Monitor and manage your health notifications</p>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active ({activeAlerts.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedAlerts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeAlerts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">All clear!</h3>
                <p className="text-sm text-muted-foreground">You have no active health alerts</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={alert.severity === "critical" || alert.severity === "high" ? "border-red-200" : ""}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 ${alert.severity === "critical" || alert.severity === "high" ? "text-red-600" : alert.severity === "medium" ? "text-orange-600" : "text-blue-600"}`}
                        >
                          {getSeverityIcon(alert.severity)}
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <CardTitle className="text-lg">{alert.title}</CardTitle>
                            <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                            {!alert.is_read && <Badge variant="outline">New</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {new Date(alert.created_at).toLocaleString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(alert.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {!alert.is_read && (
                        <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(alert.id)}>
                          Mark as Read
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleResolve(alert.id)}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Resolve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="mt-6">
          {resolvedAlerts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No resolved alerts</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {resolvedAlerts.map((alert) => (
                <Card key={alert.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-gray-600">{getSeverityIcon(alert.severity)}</div>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <CardTitle className="text-lg">{alert.title}</CardTitle>
                            <Badge variant="outline">Resolved</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            Resolved on{" "}
                            {alert.resolved_at &&
                              new Date(alert.resolved_at).toLocaleString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(alert.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
