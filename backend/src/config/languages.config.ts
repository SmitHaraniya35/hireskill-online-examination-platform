export interface LanguageConfig {
  extension: string;
  image: string;
  compile?: string[] | null;
  syntax?: string[] | null;
  run: string[];
}

export const languages: Record<string, LanguageConfig> = {
  cpp: {
    image: "gcc:latest",
    extension: "cpp",
    compile: ["g++", "Main.cpp", "-O2", "-o", "Main"],
    run: ["./Main"],
  },

  c: {
    image: "gcc:latest",
    extension: "c",
    compile: ["gcc", "Main.c", "-o", "Main"],
    run: ["./Main"]
  },

  javascript: {
    image: "node:20-alpine",
    extension: "js",
    syntax: ["node", "--check", "Main.js"],
    run: ["node", "Main.js"],
  },

  python: {
    image: "python:3.11-slim",
    extension: "py",
    syntax: ["python3", "-m", "py_compile", "Main.py"],
    run: ["python3", "Main.py"],
  }
};
