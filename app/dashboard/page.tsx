import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { HealthMetricsOverview } from "@/components/dashboard/health-metrics-overview"
import { RecentAlerts } from "@/components/dashboard/recent-alerts"
import { AIInsightsCard } from "@/components/dashboard/ai-insights-card"
import { MedicationReminders } from "@/components/dashboard/medication-reminders"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} profile={profile} />
      <main className="flex-1 bg-muted/30 p-6">
        <div className="container mx-auto space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || "User"}!</h1>
            <p className="text-muted-foreground">Here&apos;s your health overview for today</p>
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Main Content */}
            <div className="space-y-6 lg:col-span-2">
              <HealthMetricsOverview userId={user.id} />
              <AIInsightsCard userId={user.id} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <RecentAlerts userId={user.id} />
              <MedicationReminders userId={user.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
