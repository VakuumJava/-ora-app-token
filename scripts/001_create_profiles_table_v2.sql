-- Drop existing trigger and function if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create profiles table that references auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text unique not null,
  email text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can delete their own profile" on public.profiles;
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;

-- RLS policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can delete their own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- Create trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_nickname text;
  nickname_suffix int := 0;
  final_nickname text;
begin
  -- Get nickname from metadata or generate from email
  user_nickname := coalesce(
    new.raw_user_meta_data ->> 'nickname',
    split_part(new.email, '@', 1)
  );
  
  final_nickname := user_nickname;
  
  -- Handle nickname conflicts by adding a number suffix
  while exists (select 1 from public.profiles where nickname = final_nickname) loop
    nickname_suffix := nickname_suffix + 1;
    final_nickname := user_nickname || nickname_suffix::text;
  end loop;
  
  -- Insert the profile
  insert into public.profiles (id, nickname, email)
  values (new.id, final_nickname, new.email);
  
  return new;
exception
  when others then
    -- Log error but don't fail the auth signup
    raise warning 'Error creating profile for user %: %', new.id, sqlerrm;
    return new;
end;
$$;

-- Create trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
