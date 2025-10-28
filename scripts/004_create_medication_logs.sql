-- Create medication logs table for tracking medication intake
create table if not exists public.medication_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  medication_id uuid not null references public.medications(id) on delete cascade,
  scheduled_time timestamp with time zone not null,
  taken_at timestamp with time zone,
  status text not null default 'pending', -- 'pending', 'taken', 'missed', 'skipped'
  notes text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.medication_logs enable row level security;

-- RLS Policies for medication_logs
create policy "medication_logs_select_own"
  on public.medication_logs for select
  using (auth.uid() = user_id);

create policy "medication_logs_insert_own"
  on public.medication_logs for insert
  with check (auth.uid() = user_id);

create policy "medication_logs_update_own"
  on public.medication_logs for update
  using (auth.uid() = user_id);

create policy "medication_logs_delete_own"
  on public.medication_logs for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index medication_logs_user_id_idx on public.medication_logs(user_id);
create index medication_logs_scheduled_time_idx on public.medication_logs(scheduled_time desc);
create index medication_logs_status_idx on public.medication_logs(status);
