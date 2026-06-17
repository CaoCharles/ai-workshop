import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { validateWords } from "../lib/validation";

const QUESTION = "用三個關鍵詞，說說你想做的 AI 專案點子";
const SUBTITLE = "想到什麼就寫什麼，這些詞會即時變成現場的氣泡圖。";

export default function HomePage() {
  const navigate = useNavigate();
  const [words, setWords] = useState(["", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update(i: number, value: string) {
    setWords((prev) => prev.map((w, idx) => (idx === i ? value : w)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const msg = validateWords(words);
    if (msg) {
      setError(msg);
      return;
    }

    setSubmitting(true);
    const [word_1, word_2, word_3] = words.map((w) => w.trim());
    const { error: insertError } = await supabase.from("responses").insert({
      word_1,
      word_2,
      word_3,
      user_agent: navigator.userAgent,
      source: "github_pages",
    });
    setSubmitting(false);

    if (insertError) {
      setError("送出失敗，請稍後再試一次。");
      return;
    }
    navigate("/thanks");
  }

  return (
    <main className="min-h-full flex flex-col items-center px-5 py-10 sm:py-16">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl sm:text-4xl font-bold leading-snug text-brand">
          {QUESTION}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-brand-dark/70">{SUBTITLE}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {words.map((w, i) => (
            <input
              key={i}
              type="text"
              value={w}
              onChange={(e) => update(i, e.target.value)}
              placeholder={`關鍵詞 ${i + 1}`}
              inputMode="text"
              className="w-full rounded-2xl border-2 border-brand/20 bg-white px-5 py-4 text-xl
                         focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15
                         placeholder:text-brand-dark/30"
            />
          ))}

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-red-700 text-base"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-brand py-4 text-xl font-semibold text-white
                       transition hover:bg-brand-dark active:scale-[0.99]
                       disabled:opacity-60"
          >
            {submitting ? "送出中…" : "送出"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/results" className="text-brand-light underline underline-offset-4">
            查看大家的答案 →
          </Link>
        </div>

        <p className="mt-10 text-center text-sm text-brand-dark/50">
          資料僅用於活動統計，不會蒐集個人身份資訊。
        </p>
      </div>
    </main>
  );
}
