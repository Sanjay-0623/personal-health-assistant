"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pill, Brain, AlertCircle } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Button variant="outline" className="justify-start bg-transparent" asChild>
          <Link href="/dashboard/metrics/add">
            <Plus className="mr-2 h-4 w-4" />
            Log Health Data
          </Link>
        </Button>
        <Button variant="outline" className="justify-start bg-transparent" asChild>
          <Link href="/dashboard/medications/add">
            <Pill className="mr-2 h-4 w-4" />
            Add Medication
          </Link>
        </Button>
        <Button variant="outline" className="justify-start bg-transparent" asChild>
          <Link href="/dashboard/insights/generate">
            <Brain className="mr-2 h-4 w-4" />
            Get AI Insights
          </Link>
        </Button>
        <Button variant="outline" className="justify-start bg-transparent" asChild>
          <Link href="/dashboard/emergency">
            <AlertCircle className="mr-2 h-4 w-4" />
            Emergency
          </Link>
        </Button>
      </div>
    </Card>
  )
}
