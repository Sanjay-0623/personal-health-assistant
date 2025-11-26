"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Phone, MapPin, User, Heart, FileText, Shield } from "lucide-react"
import type { Profile } from "@/lib/types"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface EmergencyPanelProps {
  userId: string
  profile: Profile | null
}

export function EmergencyPanel({ userId, profile }: EmergencyPanelProps) {
  const handleEmergencyCall = (number: string) => {
    window.location.href = `tel:${number}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-red-600">Emergency</h1>
        <p className="text-muted-foreground">Quick access to emergency services and contacts</p>
      </div>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Medical Emergency</AlertTitle>
        <AlertDescription>
          If you are experiencing a life-threatening emergency, call 108 (Ambulance) or 102 (Medical Emergency)
          immediately or go to the nearest emergency room.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Phone className="h-5 w-5" />
              Emergency Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="destructive"
              size="lg"
              className="w-full text-lg"
              onClick={() => handleEmergencyCall("108")}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call 108 (Ambulance)
            </Button>
            <Button
              variant="destructive"
              size="lg"
              className="w-full text-lg"
              onClick={() => handleEmergencyCall("102")}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call 102 (Medical Emergency)
            </Button>
            <p className="text-center text-xs text-muted-foreground">For immediate life-threatening emergencies</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <User className="h-5 w-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile?.emergency_contact_name && profile?.emergency_contact_phone ? (
              <>
                <div className="rounded-lg bg-white p-3">
                  <p className="font-medium">{profile.emergency_contact_name}</p>
                  <p className="text-sm text-muted-foreground">{profile.emergency_contact_phone}</p>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full bg-transparent"
                  onClick={() => handleEmergencyCall(profile.emergency_contact_phone!)}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Emergency Contact
                </Button>
              </>
            ) : (
              <div className="text-center">
                <p className="mb-3 text-sm text-muted-foreground">No emergency contact set</p>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/profile">Add Emergency Contact</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-600" />
            Medical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {profile?.blood_type && (
              <div className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">Blood Type</p>
                <p className="font-medium">{profile.blood_type}</p>
              </div>
            )}
            {profile?.allergies && profile.allergies.length > 0 && (
              <div className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">Allergies</p>
                <p className="font-medium">{profile.allergies.join(", ")}</p>
              </div>
            )}
            {profile?.chronic_conditions && profile.chronic_conditions.length > 0 && (
              <div className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">Chronic Conditions</p>
                <p className="font-medium">{profile.chronic_conditions.join(", ")}</p>
              </div>
            )}
          </div>
          {(!profile?.blood_type || !profile?.allergies || !profile?.chronic_conditions) && (
            <Button variant="outline" asChild>
              <Link href="/dashboard/profile">Complete Medical Profile</Link>
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Find Nearby Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              variant="outline"
              className="justify-start bg-transparent"
              onClick={() => window.open("https://www.google.com/maps/search/hospital+near+me", "_blank")}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Nearest Hospital
            </Button>
            <Button
              variant="outline"
              className="justify-start bg-transparent"
              onClick={() => window.open("https://www.google.com/maps/search/pharmacy+near+me", "_blank")}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Nearest Pharmacy
            </Button>
            <Button
              variant="outline"
              className="justify-start bg-transparent"
              onClick={() => window.open("https://www.google.com/maps/search/urgent+care+near+me", "_blank")}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Urgent Care
            </Button>
            <Button
              variant="outline"
              className="justify-start bg-transparent"
              onClick={() => window.open("https://www.google.com/maps/search/clinic+near+me", "_blank")}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Walk-in Clinic
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Health Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              variant="outline"
              className="justify-start bg-transparent"
              onClick={() => handleEmergencyCall("104")}
            >
              <Phone className="mr-2 h-4 w-4" />
              National Health Helpline (104)
            </Button>
            <Button
              variant="outline"
              className="justify-start bg-transparent"
              onClick={() => handleEmergencyCall("9152987821")}
            >
              <Phone className="mr-2 h-4 w-4" />
              Mental Health Helpline (COOJ)
            </Button>
            <Button
              variant="outline"
              className="justify-start bg-transparent"
              onClick={() => handleEmergencyCall("100")}
            >
              <Phone className="mr-2 h-4 w-4" />
              Police Emergency (100)
            </Button>
            <Button
              variant="outline"
              className="justify-start bg-transparent"
              onClick={() => handleEmergencyCall("1098")}
            >
              <Phone className="mr-2 h-4 w-4" />
              Child Helpline (1098)
            </Button>
            <Button
              variant="outline"
              className="justify-start bg-transparent"
              onClick={() => handleEmergencyCall("1091")}
            >
              <Phone className="mr-2 h-4 w-4" />
              Women Helpline (1091)
            </Button>
            <Button
              variant="outline"
              className="justify-start bg-transparent"
              onClick={() => handleEmergencyCall("14567")}
            >
              <Phone className="mr-2 h-4 w-4" />
              Senior Citizen Helpline (14567)
            </Button>
            <Button variant="outline" className="justify-start bg-transparent" asChild>
              <Link href="/dashboard/chat">
                <FileText className="mr-2 h-4 w-4" />
                AI Health Assistant
              </Link>
            </Button>
            <Button variant="outline" className="justify-start bg-transparent" asChild>
              <Link href="/dashboard/alerts">
                <AlertCircle className="mr-2 h-4 w-4" />
                View Health Alerts
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
