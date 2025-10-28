-- Create health metrics table for storing vital signs
create table if not exists public.health_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  metric_type text not null, -- 'heart_rate', 'blood_pressure', 'oxygen_level', 'temperature', 'weight', 'steps', 'sleep_hours'
  value numeric not null,
  unit text not null,
  systolic numeric, -- for blood pressure
  diastolic numeric, -- for blood pressure
  notes text,
  recorded_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.health_metrics enable row level security;

-- RLS Policies for health_metrics
create policy "health_metrics_select_own"
  on public.health_metrics for select
  using (auth.uid() = user_id);

create policy "health_metrics_insert_own"
  on public.health_metrics for insert
  with check (auth.uid() = user_id);

create policy "health_metrics_update_own"
  on public.health_metrics for update
  using (auth.uid() = user_id);

create policy "health_metrics_delete_own"
  on public.health_metrics for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index health_metrics_user_id_idx on public.health_metrics(user_id);
create index health_metrics_recorded_at_idx on public.health_metrics(recorded_at desc);
