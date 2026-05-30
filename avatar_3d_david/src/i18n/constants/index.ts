export const LOCALES = {
  ko: {
    iso: "ko-KR",
    name: "한국어",
  },
  en: {
    iso: "en-US",
    name: "English",
  },
} as const satisfies Record<
  string,
  {
    name: string;
    iso: string;
  }
>;

export const LOCALE_DEFAULT: keyof typeof LOCALES = "en";
