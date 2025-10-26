-- Create user_fragments table for ownership
create table if not exists public.user_fragments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  fragment_id uuid not null references public.fragments(id) on delete cascade,
  collected_at timestamp with time zone default now(),
  unique(user_id, fragment_id)
);

-- Enable RLS
alter table public.user_fragments enable row level security;

-- Users can view their own fragments
create policy "Users can view their own fragments"
  on public.user_fragments for select
  using (auth.uid() = user_id);

-- Users can insert their own fragments
create policy "Users can collect fragments"
  on public.user_fragments for insert
  with check (auth.uid() = user_id);

-- Users can delete their own fragments
create policy "Users can delete their own fragments"
  on public.user_fragments for delete
  using (auth.uid() = user_id);
