import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/HomePage";
import ThanksPage from "./pages/ThanksPage";
import ResultsPage from "./pages/ResultsPage";

// 使用 HashRouter：GitHub Pages 是純靜態主機，沒有後端 rewrite，
// 用 hash 路由(#/results)可避免重新整理時出現 404。
const router = createHashRouter([
  { path: "/", element: <HomePage /> },
  { path: "/thanks", element: <ThanksPage /> },
  { path: "/results", element: <ResultsPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
