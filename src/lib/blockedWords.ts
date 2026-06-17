// 不雅 / 不適合的字詞前端過濾清單。
// 這裡只放少量範例，實際活動前可自行增補。
// 比對方式為「不分大小寫、去除空白後做包含判斷」。
export const blockedWords: string[] = [
  "幹",
  "靠北",
  "白痴",
  "智障",
  "去死",
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "幹你",
  "婊",
  "雞掰",
];

export function containsBlockedWord(input: string): boolean {
  const normalized = input.toLowerCase().replace(/\s+/g, "");
  return blockedWords.some((w) => normalized.includes(w.toLowerCase()));
}
