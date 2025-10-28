-- Create health alerts table for abnormal readings and notifications
create table if not exists public.health_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  alert_type text not null, -- 'abnormal_reading', 'medication_reminder', 'emergency', 'appointment'
  severity text not null, -- 'low', 'medium', 'high', 'critical'
  title text not null,
  message text not null,
  related_metric_id uuid references public.health_metrics(id) on delete set null,
  related_medication_id uuid references public.medications(id) on delete set null,
  is_read boolean default false,
  is_resolved boolean default false,
  created_at timestamp with time zone default now(),
  resolved_at timestamp with time zone
);

-- Enable RLS
alter table public.health_alerts enable row level security;

-- RLS Policies for health_alerts
create policy "health_alerts_select_own"
  on public.health_alerts for select
  using (auth.uid() = user_id);

create policy "health_alerts_insert_own"
  on public.health_alerts for insert
  with check (auth.uid() = user_id);

create policy "health_alerts_update_own"
  on public.health_alerts for update
  using (auth.uid() = user_id);

create policy "health_alerts_delete_own"
  on public.health_alerts for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index health_alerts_user_id_idx on public.health_alerts(user_id);
create index health_alerts_is_read_idx on public.health_alerts(is_read);
create index health_alerts_severity_idx on public.health_alerts(severity);
create index health_alerts_created_at_idx on public.health_alerts(created_at desc);
