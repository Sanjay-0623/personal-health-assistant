-- Create AI insights table for storing personalized health recommendations
create table if not exists public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  insight_type text not null, -- 'lifestyle', 'nutrition', 'exercise', 'sleep', 'preventive_care'
  title text not null,
  content text not null,
  recommendations text[],
  confidence_score numeric,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.ai_insights enable row level security;

-- RLS Policies for ai_insights
create policy "ai_insights_select_own"
  on public.ai_insights for select
  using (auth.uid() = user_id);

create policy "ai_insights_insert_own"
  on public.ai_insights for insert
  with check (auth.uid() = user_id);

create policy "ai_insights_update_own"
  on public.ai_insights for update
  using (auth.uid() = user_id);

create policy "ai_insights_delete_own"
  on public.ai_insights for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index ai_insights_user_id_idx on public.ai_insights(user_id);
create index ai_insights_created_at_idx on public.ai_insights(created_at desc);
