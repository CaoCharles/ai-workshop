# AI 專案模擬工作坊 — 想法蒐集 + 即時氣泡圖

學員掃 QR Code → 在手機填三個關鍵詞 → 你的螢幕上即時長出氣泡圖。

- 技術：React + Vite + TypeScript + Tailwind CSS + Supabase
- 部署：GitHub Pages（純靜態）
- 結果頁 `#/results` 使用 Supabase Realtime，學員一送出就自動更新

## 頁面

| 路徑 | 說明 |
| --- | --- |
| `#/` | 填寫頁：三個關鍵詞輸入框 + 驗證 + 送出 |
| `#/thanks` | 送出成功頁 |
| `#/results` | 公開的即時氣泡圖（詞頻 Top 20） |

> 使用 hash 路由（網址有 `#`），這是 GitHub Pages 這類純靜態主機最穩的做法，重新整理不會 404。

## 1. 安裝

```bash
npm install
```

## 2. 設定 Supabase

1. 到 [supabase.com](https://supabase.com) 建一個專案。
2. 開 **SQL Editor**，貼上 `supabase_schema.sql` 全部內容並執行。這會建立 `responses` 表、RLS 政策，並把表加入 Realtime。
3. 到 **Project Settings → API**，複製：
   - `Project URL`
   - `anon` `public` key
4. 複製 `.env.example` 成 `.env`，填入：

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=你的_project_url
VITE_SUPABASE_ANON_KEY=你的_anon_key
```

> `.env` 已被 `.gitignore` 排除，不會 commit 上 GitHub。anon key 本來就是設計給前端公開使用的，安全性由 RLS 政策保障。

## 3. 本機開發

```bash
npm run dev
```

開 http://localhost:5173

## 4. 部署到 GitHub Pages

1. 在 GitHub 建一個 repo，例如 `ai-pm-class`。
2. **修改 `vite.config.ts` 的 base** 成你的 repo 名稱：

   ```ts
   base: command === "build" ? "/你的repo名稱/" : "/",
   ```

3. 推上去後執行：

   ```bash
   npm run build
   npm run deploy
   ```

   `deploy` 會用 `gh-pages` 把 `dist` 推到 `gh-pages` 分支。

4. 到 repo 的 **Settings → Pages**，Source 選 `gh-pages` 分支。
5. 等一兩分鐘，網站會在 `https://<你的帳號>.github.io/<repo名稱>/` 上線。

## 5. 產生 QR Code

QR Code 只是把上線網址編碼成圖。把下面網址丟進任何 QR 產生器即可（例如 qr-code-generator.com）：

```
https://<你的帳號>.github.io/<repo名稱>/
```

學員掃描就會直接進到填寫頁。
你自己在投影螢幕開 `https://<你的帳號>.github.io/<repo名稱>/#/results` 展示即時氣泡圖。

## 表單驗證規則

- 三個欄位都必填
- 每個詞最多 10 個中文字（或 20 個英文字母）
- 詞語中間不可有空白
- 三個詞不可重複
- 過濾不雅字詞（清單在 `src/lib/blockedWords.ts`，可自行增補）

## 客製化

- **問題文字**：改 `src/pages/HomePage.tsx` 最上面的 `QUESTION` / `SUBTITLE`
- **主色**：改 `tailwind.config.js` 的 `brand` 色票
- **顯示前幾名**：改 `src/pages/ResultsPage.tsx` 的 `TOP_N`
- **要不要公開結果**：若不想公開，刪掉 `supabase_schema.sql` 裡的 `anon can select` policy（結果頁就只有你用 service key 才看得到）
