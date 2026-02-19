export interface LanguageConfig {
  extension: string;
  image: string;
  buildCommand?: (filename: string) => string | null;
  runCommand: (filename: string) => string;
}
export const languages: Record<string, LanguageConfig> = {
  javascript: {
    extension: "js",
    image: "node:20-alpine",
    runCommand: (filename: string) => `timeout 3s node ${filename}`,
  },
  c: {
    extension: "c",
    image: "gcc:13-alpine",
    buildCommand: (filename: string) =>
      `gcc ${filename} -o ${filename.split(".")[0]}`,
    runCommand: (filename: string) => `timeout 3s ./${filename.split(".")[0]}`,
  },
};
