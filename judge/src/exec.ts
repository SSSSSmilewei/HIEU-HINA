import { EXEC_MEMORY_MB, EXEC_TIME_MS, type ExecRequest, type ExecResult } from "../../src/shared/judge";
import type { Sandbox } from "./sandbox";

/** 编译最多用的 CPU 时间 */
const COMPILE_MS = 10_000;
const COMPILE_MEMORY_MB = 512;
const JAVA_EXTRA_MB = 256;

/** 「运行」任意代码（不判对错）：有编译的先编译，再带上输入运行一次 */
export async function exec(sb: Sandbox, req: ExecRequest): Promise<ExecResult> {
  const files: Record<string, string> = req.files;
  const main = req.main;
  let run: string[];
  let cached: Record<string, { cached: string }> = {};
  let memoryMb = EXEC_MEMORY_MB;
  const toRelease: string[] = [];

  const compile = async (args: string[], output: string): Promise<ExecResult | null> => {
    const out = await sb.run({ args, files, cpuMs: COMPILE_MS, memoryMb: COMPILE_MEMORY_MB, keep: [output] });
    const id = out.cached[output];
    if (out.status !== "ok" || !id) {
      if (id) toRelease.push(id);
      const status = out.status === "error" ? "error" : "ce";
      return { status, exitCode: out.exitCode, timeMs: out.timeMs, memoryKb: out.memoryKb, stdout: "", stderr: "", compileOutput: (out.stderr || out.stdout || out.error || "编译失败").slice(0, 16_000) };
    }
    toRelease.push(id);
    cached = { [output]: { cached: id } };
    return null;
  };

  try {
    if (req.language === "python") run = ["/usr/bin/python3", main];
    else if (req.language === "c" || req.language === "cpp") {
      const cc = req.language === "c" ? ["/usr/bin/gcc", "-O2", "-std=c17"] : ["/usr/bin/g++", "-O2", "-std=c++17"];
      const failed = await compile([...cc, "-o", "hiana_main", main, ...(req.language === "c" ? ["-lm"] : [])], "hiana_main");
      if (failed) return failed;
      run = ["/w/hiana_main"];
    } else {
      // Java：类名就是文件名；编译产物放在 out/ 里
      const dir = main.includes("/") ? main.slice(0, main.lastIndexOf("/")) : "";
      const cls = main.slice(main.lastIndexOf("/") + 1).replace(/\.java$/, "");
      const output = `${dir ? `${dir}/` : ""}${cls}.class`;
      const failed = await compile(["/usr/bin/javac", "-encoding", "UTF-8", "-J-Xmx512m", main], output);
      if (failed) return failed;
      run = ["/usr/bin/java", `-Xmx${EXEC_MEMORY_MB}m`, "-Xss64m", "-cp", dir ? `/w/${dir}` : "/w", cls];
      memoryMb += JAVA_EXTRA_MB;
    }
    const out = await sb.run({ args: run, files: { ...files, ...cached }, stdin: req.stdin, cpuMs: EXEC_TIME_MS, memoryMb });
    return { status: out.status, exitCode: out.exitCode, timeMs: out.timeMs, memoryKb: out.memoryKb, stdout: out.stdout, stderr: out.error ? `${out.stderr}\n${out.error}`.trim() : out.stderr };
  } finally {
    if (toRelease.length) await sb.release(toRelease).catch(() => undefined);
  }
}
