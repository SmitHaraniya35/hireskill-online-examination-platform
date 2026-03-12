export const SUPPORTED_LANGUAGES = [
  "C++",
  "C",
  "Python",
  "JavaScript",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];