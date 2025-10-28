import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EmergencyPanel } from "@/components/emergency/emergency-panel"

export default async function EmergencyPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} profile={profile} />
      <main className="flex-1 bg-muted/30 p-6">
        <div className="container mx-auto max-w-4xl">
          <EmergencyPanel userId={user.id} profile={profile} />
        </div>
      </main>
    </div>
  )
}
