-- ============================================
-- Run this entire file in Supabase SQL Editor
-- (Step 4 of SETUP_GUIDE.md)
-- ============================================

-- table for opinions / complaints / cute messages
create table messages (
  id bigint generated always as identity primary key,
  type text not null,
  sender_name text not null,
  message_text text not null,
  extra_field text,
  created_at timestamp with time zone default now()
);

-- table for photo locker access requests
create table access_requests (
  id bigint generated always as identity primary key,
  requester_name text not null,
  note text,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

-- table for the photo album itself
create table photos (
  id bigint generated always as identity primary key,
  image_url text not null,
  caption text,
  created_at timestamp with time zone default now()
);

-- ============================================
-- Row Level Security: allow anyone to insert
-- (so friends can submit without logging in)
-- and allow anyone to read (since the page itself
-- is password-gated by your ADMIN_PASSWORD in config.js)
-- ============================================

alter table messages enable row level security;
alter table access_requests enable row level security;
alter table photos enable row level security;

create policy "anyone can insert messages" on messages
  for insert with check (true);
create policy "anyone can read messages" on messages
  for select using (true);
create policy "anyone can delete messages" on messages
  for delete using (true);

create policy "anyone can insert requests" on access_requests
  for insert with check (true);
create policy "anyone can read requests" on access_requests
  for select using (true);
create policy "anyone can update requests" on access_requests
  for update using (true);

create policy "anyone can insert photos" on photos
  for insert with check (true);
create policy "anyone can read photos" on photos
  for select using (true);
create policy "anyone can delete photos" on photos
  for delete using (true);
