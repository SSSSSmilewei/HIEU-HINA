import type { Language } from "../../src/shared/problem";

/** 输入输出题每种语言怎么编译、怎么运行。工作目录是沙箱里的 /w。 */
export interface LanguageSpec {
  /** 学员主文件的默认文件名 */
  main: string;
  /** 编译命令；没有就是解释执行 */
  compile?: (main: string) => { args: string[]; output: string };
  run: (main: string, memoryMb: number) => string[];
  /** 运行时额外给的内存（JVM 自己要用） */
  extraMemoryMb?: number;
  /** 编译最多用的 CPU 时间 */
  compileMs?: number;
}

const COMPILE_MS = 10_000;
const JAVA_EXTRA_MB = 256;

export const LANGUAGE_SPECS: Partial<Record<Language, LanguageSpec>> = {
  python: { main: "main.py", run: (m) => ["/usr/bin/python3", m] },
  c: {
    main: "main.c",
    compile: (m) => ({ args: ["/usr/bin/gcc", "-O2", "-std=c17", "-o", "main", m, "-lm"], output: "main" }),
    run: () => ["/w/main"],
    compileMs: COMPILE_MS,
  },
  cpp: {
    main: "main.cpp",
    compile: (m) => ({ args: ["/usr/bin/g++", "-O2", "-std=c++17", "-o", "main", m], output: "main" }),
    run: () => ["/w/main"],
    compileMs: COMPILE_MS,
  },
  java: {
    main: "Main.java",
    compile: (m) => ({ args: ["/usr/bin/javac", "-encoding", "UTF-8", "-J-Xmx512m", m], output: "Main.class" }),
    run: (_m, mb) => ["/usr/bin/java", `-Xmx${mb}m`, "-Xss64m", "-cp", "/w", "Main"],
    extraMemoryMb: JAVA_EXTRA_MB,
    compileMs: COMPILE_MS,
  },
};
