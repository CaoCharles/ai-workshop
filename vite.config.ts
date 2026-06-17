import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 部署到 GitHub Pages 時，base 必須是 "/<你的 repo 名稱>/"。
// 例如 repo 叫 ai-pm-class，就改成 "/ai-pm-class/"。
// 本機 dev 時 base 用 "/" 即可，下面用環境判斷自動切換。
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/ai-workshop/" : "/",
  plugins: [react()],
}));
