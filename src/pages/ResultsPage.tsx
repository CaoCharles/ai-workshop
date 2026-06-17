import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, type ResponseRow } from "../lib/supabase";
import BubbleChart, { type Bubble } from "../components/BubbleChart";

const TOP_N = 20;

export default function ResultsPage() {
  const [rows, setRows] = useState<ResponseRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function load() {
    const { data, error } = await supabase
      .from("responses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(2000);
    if (error) {
      setLoadError("讀取資料失敗，請確認 Supabase 的 select 權限已開放。");
      return;
    }
    setLoadError(null);
    setRows(data ?? []);
    setTotal((data ?? []).length);
  }

  useEffect(() => {
    load();
    // Supabase Realtime：有新資料 insert 時自動重抓，氣泡圖即時長出。
    const channel = supabase
      .channel("responses-stream")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "responses" },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 把三欄的詞攤平後做詞頻統計，取 Top N。
  const bubbles = useMemo<Bubble[]>(() => {
    const counts = new Map<string, number>();
    for (const r of rows) {
      for (const w of [r.word_1, r.word_2, r.word_3]) {
        const key = (w ?? "").trim();
        if (!key) continue;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .map(([text, count]) => ({ text, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_N);
  }, [rows]);

  return (
    <main className="min-h-full px-5 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand">
              大家的 AI 專案關鍵詞
            </h1>
            <p className="mt-2 text-brand-dark/60">
              共 {total} 份回答 · 顯示前 {TOP_N} 名 · 即時更新
            </p>
          </div>
          <Link
            to="/"
            className="rounded-xl border-2 border-brand px-5 py-2 font-semibold text-brand hover:bg-brand/5"
          >
            ← 回填寫頁
          </Link>
        </div>

        {loadError && (
          <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-red-700">
            {loadError}
          </p>
        )}

        <div className="mt-6 rounded-3xl bg-white p-3 sm:p-6 shadow-sm">
          <BubbleChart data={bubbles} />
        </div>
      </div>
    </main>
  );
}
