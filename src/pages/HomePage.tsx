import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { validateWords, validateSingleWord } from "../lib/validation";

const QUESTION = "你的單位最想用 AI 解決哪三個痛點?";
const SUBTITLE =
  "選 3 個最有感的痛點；清單裡沒有的，可以用下方「其他」自己補。送出後會即時變成現場的氣泡圖。";

// 預設痛點詞庫（你可以自由增減）。
const PRESET_OPTIONS = [
  "重複性人工作業多",
  "客服回應慢",
  "報表製作耗時",
  "資料分散難整合",
  "文件審閱費時",
  "人力不足",
  "知識傳承困難",
  "需求預測不準",
  "簽核流程冗長",
  "行銷素材產出慢",
  "數據分析門檻高",
  "風險異常難察覺",
  "教育訓練成本高",
  "跨部門溝通成本高",
  "客戶洞察不足",
];

const MAX = 3;

export default function HomePage() {
  const navigate = useNavigate();
  const [options, setOptions] = useState<string[]>(PRESET_OPTIONS);
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const full = selected.length >= MAX;

  function toggle(word: string) {
    setError(null);
    setSelected((prev) => {
      if (prev.includes(word)) return prev.filter((w) => w !== word);
      if (prev.length >= MAX) return prev;
      return [...prev, word];
    });
  }

  function addCustom() {
    setError(null);
    const w = custom.trim();
    const err = validateSingleWord(custom);
    if (err) {
      setError(err);
      return;
    }
    const dup = selected.some((s) => s.toLowerCase() === w.toLowerCase());
    if (dup) {
      setError("這個項目已經選了。");
      return;
    }
    if (selected.length >= MAX) {
      setError(`最多只能選 ${MAX} 個。`);
      return;
    }
    const exists = options.some((o) => o.toLowerCase() === w.toLowerCase());
    if (!exists) setOptions((prev) => [...prev, w]);
    setSelected((prev) => [...prev, w]);
    setCustom("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (selected.length !== MAX) {
      setError(`請選滿 ${MAX} 個再送出。`);
      return;
    }
    const msg = validateWords(selected);
    if (msg) {
      setError(msg);
      return;
    }

    setSubmitting(true);
    const [word_1, word_2, word_3] = selected;
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

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="mb-3 flex items-center justify-between text-sm font-medium text-brand-dark/70">
            <span>點選痛點(可複選)</span>
            <span className={full ? "text-brand font-bold" : ""}>
              已選 {selected.length} / {MAX}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {options.map((word) => {
              const isSel = selected.includes(word);
              const disabled = !isSel && full;
              return (
                <button
                  key={word}
                  type="button"
                  onClick={() => toggle(word)}
                  disabled={disabled}
                  className={[
                    "rounded-full px-4 py-2.5 text-base font-medium transition active:scale-95",
                    isSel
                      ? "bg-brand text-white shadow"
                      : "bg-white text-brand-dark border-2 border-brand/20",
                    disabled ? "opacity-40 cursor-not-allowed" : "",
                  ].join(" ")}
                >
                  {isSel && <span className="mr-1">✓</span>}
                  {word}
                </button>
              );
            })}
          </div>

          {/* 其他：自己補 */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-brand-dark/70 mb-2">
              其他(清單沒有的痛點)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustom();
                  }
                }}
                placeholder="自己輸入一個痛點"
                className="flex-1 rounded-2xl border-2 border-brand/20 bg-white px-4 py-3 text-lg
                           focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15
                           placeholder:text-brand-dark/30"
              />
              <button
                type="button"
                onClick={addCustom}
                disabled={full}
                className="rounded-2xl bg-brand-light px-5 text-lg font-semibold text-white
                           transition hover:bg-brand disabled:opacity-40 disabled:cursor-not-allowed"
              >
                加入
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-red-700 text-base"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || selected.length !== MAX}
            className="mt-6 w-full rounded-2xl bg-brand py-4 text-xl font-semibold text-white
                       transition hover:bg-brand-dark active:scale-[0.99]
                       disabled:opacity-50 disabled:cursor-not-allowed"
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
