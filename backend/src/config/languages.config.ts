export interface LanguageConfig {
  extension: string;
  image: string;
  compile?: string[] | null;
  run: string[];
}

// export const languages: Record<string, LanguageConfig> = {
//   cpp: {
//     image: "gcc:latest",
//     extension: "cpp",
//     compile: ["g++", "/app/Main.cpp", "-o", "/app/Main"],
//     run: ["/app/Main"],
//   },

//   c: {
//     image: "gcc:latest",
//     extension: "c",
//     compile: ["gcc", "/app/Main.c", "-o", "/app/Main"],
//     run: ["/app/Main"],
//   },

//   js: {
//     image: "node:20-alpine",
//     extension: "js",
//     run: ["node", "/app/Main.js"],
//   },
// };

// export const languages: Record<string, LanguageConfig> = {
//   cpp: {
//     image: "gcc:latest",
//     extension: "cpp",
//     compile: ["g++", "Main.cpp", "-O2", "-o", "Main"],
//     run: ["./Main"],
//   },

//   c: {
//     image: "gcc:latest",
//     extension: "c",
//     compile: ["gcc", "Main.c", "-o", "Main"],
//     run: ["./Main"]
//   },

//   js: {
//     image: "node:20-alpine",
//     extension: "js",
//     run: ["node", "Main.js"],
//   },
// };
