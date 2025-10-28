export interface Profile {
  id: string
  full_name: string | null
  date_of_birth: string | null
  gender: string | null
  phone_number: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  blood_type: string | null
  allergies: string[] | null
  chronic_conditions: string[] | null
  created_at: string
  updated_at: string
}

export interface HealthMetric {
  id: string
  user_id: string
  metric_type: string
  value: number
  unit: string
  systolic?: number
  diastolic?: number
  notes?: string
  recorded_at: string
  created_at: string
}

export interface Medication {
  id: string
  user_id: string
  name: string
  dosage: string
  frequency: string
  time_of_day: string[]
  start_date: string
  end_date?: string
  instructions?: string
  prescribing_doctor?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MedicationLog {
  id: string
  user_id: string
  medication_id: string
  scheduled_time: string
  taken_at?: string
  status: "pending" | "taken" | "missed" | "skipped"
  notes?: string
  created_at: string
}

export interface HealthAlert {
  id: string
  user_id: string
  alert_type: string
  severity: "low" | "medium" | "high" | "critical"
  title: string
  message: string
  related_metric_id?: string
  related_medication_id?: string
  is_read: boolean
  is_resolved: boolean
  created_at: string
  resolved_at?: string
}

export interface AIInsight {
  id: string
  user_id: string
  insight_type: string
  title: string
  content: string
  recommendations: string[]
  confidence_score?: number
  is_read: boolean
  created_at: string
}
