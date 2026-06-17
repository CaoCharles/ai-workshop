import { Link } from "react-router-dom";

export default function ThanksPage() {
  return (
    <main className="min-h-full flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="w-full max-w-md">
        <div className="text-6xl">🎉</div>
        <h1 className="mt-6 text-3xl sm:text-4xl font-bold text-brand">
          謝謝你的回答！
        </h1>
        <p className="mt-3 text-lg text-brand-dark/70">
          你選的痛點已經加入現場的氣泡圖了。
        </p>

        <div className="mt-10 space-y-3">
          <Link
            to="/"
            className="block w-full rounded-2xl bg-brand py-4 text-xl font-semibold text-white
                       transition hover:bg-brand-dark active:scale-[0.99]"
          >
            再填一次
          </Link>
          <Link
            to="/results"
            className="block w-full rounded-2xl border-2 border-brand py-4 text-xl font-semibold text-brand
                       transition hover:bg-brand/5 active:scale-[0.99]"
          >
            查看大家的答案
          </Link>
        </div>
      </div>
    </main>
  );
}
