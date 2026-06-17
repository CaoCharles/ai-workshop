import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

if (!supabaseConfigured) {
  // 在 console 提醒缺少環境變數，避免部署後一片空白卻不知原因。
  console.error(
    "缺少 Supabase 環境變數。請建立 .env 並設定 VITE_SUPABASE_URL 與 VITE_SUPABASE_ANON_KEY。"
  );
}

// 即使環境變數沒設定，也用合法格式的 placeholder 避免 createClient 直接拋錯把整頁打掉。
// 真正送出/讀取時若沒設定會失敗，並由畫面提示，而不是整站白屏。
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-anon-key"
);

export type ResponseRow = {
  id: string;
  word_1: string;
  word_2: string;
  word_3: string;
  created_at: string;
  user_agent: string | null;
  source: string | null;
};
