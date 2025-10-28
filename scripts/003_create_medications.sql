-- Create medications table for medication tracking
create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  dosage text not null,
  frequency text not null, -- 'daily', 'twice_daily', 'weekly', etc.
  time_of_day text[], -- ['08:00', '20:00']
  start_date date not null,
  end_date date,
  instructions text,
  prescribing_doctor text,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.medications enable row level security;

-- RLS Policies for medications
create policy "medications_select_own"
  on public.medications for select
  using (auth.uid() = user_id);

create policy "medications_insert_own"
  on public.medications for insert
  with check (auth.uid() = user_id);

create policy "medications_update_own"
  on public.medications for update
  using (auth.uid() = user_id);

create policy "medications_delete_own"
  on public.medications for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index medications_user_id_idx on public.medications(user_id);
create index medications_is_active_idx on public.medications(is_active);
