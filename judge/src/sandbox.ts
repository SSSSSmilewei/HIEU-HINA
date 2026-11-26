/**
 * 沙箱：在隔离环境里运行一条命令。正式环境用 go-judge（judge/docker-compose.yml），
 * 每次运行在独立的命名空间里，没有网络，限时、限内存、限进程数。
 */

export interface RunSpec {
  args: string[];
  /** 放进工作目录的文件：路径 → 内容；或者上一步编译缓存下来的文件 */
  files: Record<string, string | { cached: string }>;
  stdin?: string;
  cpuMs: number;
  memoryMb: number;
  /** 运行完要缓存下来给下一步用的文件（如编译产物） */
  keep?: string[];
  env?: string[];
}

export type RunStatus = "ok" | "exit" | "signal" | "tle" | "mle" | "ole" | "error";

export interface RunOutput {
  status: RunStatus;
  exitCode: number;
  timeMs: number;
  memoryKb: number;
  stdout: string;
  stderr: string;
  /** keep 里的文件 → 缓存编号 */
  cached: Record<string, string>;
  /** 沙箱自身的错误说明 */
  error?: string;
}

export interface Sandbox {
  run(spec: RunSpec): Promise<RunOutput>;
  /** 删掉缓存的文件 */
  release(ids: string[]): Promise<void>;
}

/** 标准输出、标准错误最多收这么多字节 */
export const MAX_OUTPUT_BYTES = 64 * 1024;
/** 墙钟时间是 CPU 时间的几倍（防止 sleep 卡住） */
const CLOCK_FACTOR = 3;
const MAX_PROCS = 64;
const NS_PER_MS = 1_000_000;
const BASE_ENV = ["PATH=/usr/bin:/bin", "HOME=/w", "LANG=C.UTF-8", "PYTHONDONTWRITEBYTECODE=1", "PYTHONIOENCODING=utf-8"];

const STATUS: Record<string, RunStatus> = {
  Accepted: "ok",
  "Nonzero Exit Status": "exit",
  Signalled: "signal",
  "Time Limit Exceeded": "tle",
  "Memory Limit Exceeded": "mle",
  "Output Limit Exceeded": "ole",
};

interface GoJudgeResult {
  status: string;
  exitStatus: number;
  time: number;
  memory: number;
  files?: Record<string, string>;
  fileIds?: Record<string, string>;
  error?: string;
}

export class GoJudge implements Sandbox {
  constructor(private readonly url: string) {}

  async run(spec: RunSpec): Promise<RunOutput> {
    const copyIn: Record<string, { content: string } | { fileId: string }> = {};
    for (const [path, v] of Object.entries(spec.files)) copyIn[path] = typeof v === "string" ? { content: v } : { fileId: v.cached };
    const body = {
      cmd: [
        {
          args: spec.args,
          env: [...BASE_ENV, ...(spec.env ?? [])],
          files: [{ content: spec.stdin ?? "" }, { name: "stdout", max: MAX_OUTPUT_BYTES }, { name: "stderr", max: MAX_OUTPUT_BYTES }],
          cpuLimit: spec.cpuMs * NS_PER_MS,
          clockLimit: spec.cpuMs * CLOCK_FACTOR * NS_PER_MS,
          memoryLimit: spec.memoryMb * 1024 * 1024,
          stackLimit: spec.memoryMb * 1024 * 1024,
          procLimit: MAX_PROCS,
          copyIn,
          copyOutCached: spec.keep ?? [],
        },
      ],
    };
    let res: Response;
    try {
      res = await fetch(`${this.url}/run`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    } catch (e) {
      return failed(`连不上沙箱：${(e as Error).message}`);
    }
    if (!res.ok) return failed(`沙箱返回 ${res.status}：${(await res.text()).slice(0, 200)}`);
    const [r] = (await res.json()) as GoJudgeResult[];
    if (!r) return failed("沙箱没有返回结果");
    const status = STATUS[r.status] ?? "error";
    return {
      status,
      exitCode: r.exitStatus,
      timeMs: Math.round(r.time / NS_PER_MS),
      memoryKb: Math.round(r.memory / 1024),
      stdout: r.files?.stdout ?? "",
      stderr: r.files?.stderr ?? "",
      cached: r.fileIds ?? {},
      error: status === "error" ? `${r.status}${r.error ? `：${r.error}` : ""}` : undefined,
    };
  }

  async release(ids: string[]): Promise<void> {
    await Promise.all(ids.map((id) => fetch(`${this.url}/file/${id}`, { method: "DELETE" }).catch(() => undefined)));
  }
}

function failed(error: string): RunOutput {
  return { status: "error", exitCode: -1, timeMs: 0, memoryKb: 0, stdout: "", stderr: "", cached: {}, error };
}
