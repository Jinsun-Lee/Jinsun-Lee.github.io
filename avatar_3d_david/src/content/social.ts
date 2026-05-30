export const social = [
  { url: "mailto:withire32@kakao.com", name: "mail" },
  { url: "https://github.com/Jinsun-Lee", name: "github" },
] as const satisfies { url: string; name: "mail" | "github" | "instagram" | "linkedin" | "x" }[];
