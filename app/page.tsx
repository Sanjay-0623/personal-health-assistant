import { Button } from "@/components/ui/button"
import { Activity, Heart, Shield, Brain, Bell, Calendar } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">HealthCare AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-5xl font-bold text-balance leading-tight">
              Your AI-Powered Personal Health Assistant
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground text-balance">
              Monitor your health in real-time, get personalized insights, and take control of your well-being with
              intelligent digital support.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">Start Your Health Journey</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Comprehensive Health Management</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Real-time Monitoring</h3>
                <p className="text-muted-foreground">
                  Track heart rate, blood pressure, oxygen levels, and more with seamless device integration.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Brain className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">AI Health Insights</h3>
                <p className="text-muted-foreground">
                  Get personalized recommendations and lifestyle insights powered by advanced AI algorithms.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Medication Management</h3>
                <p className="text-muted-foreground">
                  Never miss a dose with smart reminders and comprehensive medication tracking.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <Bell className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Emergency Alerts</h3>
                <p className="text-muted-foreground">
                  Instant notifications for abnormal readings with quick access to emergency contacts.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Preventive Care</h3>
                <p className="text-muted-foreground">
                  Stay ahead with proactive health monitoring and early warning systems.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                  <Activity className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your health data is encrypted and protected with enterprise-grade security.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-600 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-balance">Ready to Take Control of Your Health?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100 text-balance">
              Join thousands of users who are already managing their health smarter with AI-powered insights.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/sign-up">Get Started Free</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 HealthCare AI. Your Personal Health Assistant.</p>
        </div>
      </footer>
    </div>
  )
}
