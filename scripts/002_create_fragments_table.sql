-- Create fragments table for NFT fragments
create table if not exists public.fragments (
  id uuid primary key default gen_random_uuid(),
  collection_id text not null, -- 'kalpak', 'museums', 'ancienty', 'ring', 'bishkek'
  chain_type text not null check (chain_type in ('A', 'B', 'C')),
  fragment_number integer not null,
  latitude decimal(10, 8) not null,
  longitude decimal(11, 8) not null,
  rarity text not null check (rarity in ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  created_at timestamp with time zone default now(),
  unique(collection_id, chain_type, fragment_number)
);

-- Enable RLS
alter table public.fragments enable row level security;

-- Anyone can view fragments
create policy "Anyone can view fragments"
  on public.fragments for select
  using (true);

-- Only admins can insert/update/delete fragments (we'll handle this later)
create policy "Only admins can modify fragments"
  on public.fragments for all
  using (false);
