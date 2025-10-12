-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create feedback_requests table
create table if not exists public.feedback_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  unique_slug text not null unique,
  is_active boolean default true not null,
  created_at timestamptz default now() not null
);

alter table public.feedback_requests enable row level security;

create policy "Users can view their own feedback requests"
  on public.feedback_requests for select
  using (auth.uid() = user_id);

create policy "Users can create their own feedback requests"
  on public.feedback_requests for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own feedback requests"
  on public.feedback_requests for update
  using (auth.uid() = user_id);

create policy "Anyone can view active feedback requests by slug"
  on public.feedback_requests for select
  using (is_active = true);

-- Create anonymous_messages table
create table if not exists public.anonymous_messages (
  id uuid primary key default gen_random_uuid(),
  feedback_request_id uuid not null references public.feedback_requests(id) on delete cascade,
  content text not null,
  is_read boolean default false not null,
  created_at timestamptz default now() not null
);

alter table public.anonymous_messages enable row level security;

create policy "Users can view messages for their feedback requests"
  on public.anonymous_messages for select
  using (
    exists (
      select 1 from public.feedback_requests
      where feedback_requests.id = anonymous_messages.feedback_request_id
      and feedback_requests.user_id = auth.uid()
    )
  );

create policy "Anyone can insert anonymous messages"
  on public.anonymous_messages for insert
  with check (true);

-- Auto-create profiles on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_profile_updated on public.profiles;
create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();