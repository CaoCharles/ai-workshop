-- 在 Supabase 的 SQL Editor 貼上並執行這份檔案。

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  word_1 text not null,
  word_2 text not null,
  word_3 text not null,
  created_at timestamptz default now(),
  user_agent text,
  source text default 'github_pages'
);

-- 開啟 Row Level Security
alter table public.responses enable row level security;

-- 允許匿名(anon) 新增資料
create policy "anon can insert" on public.responses
  for insert to anon
  with check (true);

-- 允許匿名讀取（因為結果頁要公開給大家看）
-- 若你想關閉公開結果，刪掉這條 policy 即可。
create policy "anon can select" on public.responses
  for select to anon
  using (true);

-- 注意：沒有建立 update / delete policy，
-- 在 RLS 開啟下，匿名使用者就無法修改或刪除資料。

-- 讓 Realtime 推播這張表的變更（結果頁的即時氣泡圖依賴它）
alter publication supabase_realtime add table public.responses;
