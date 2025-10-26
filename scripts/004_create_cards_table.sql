-- Create cards table for assembled NFTs
create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  collection_id text not null,
  rarity text not null,
  assembled_at timestamp with time zone default now(),
  is_listed boolean default false,
  price decimal(10, 2)
);

-- Enable RLS
alter table public.cards enable row level security;

-- Users can view their own cards
create policy "Users can view their own cards"
  on public.cards for select
  using (auth.uid() = user_id);

-- Anyone can view listed cards
create policy "Anyone can view listed cards"
  on public.cards for select
  using (is_listed = true);

-- Users can insert their own cards
create policy "Users can create cards"
  on public.cards for insert
  with check (auth.uid() = user_id);

-- Users can update their own cards
create policy "Users can update their own cards"
  on public.cards for update
  using (auth.uid() = user_id);

-- Users can delete their own cards
create policy "Users can delete their own cards"
  on public.cards for delete
  using (auth.uid() = user_id);
