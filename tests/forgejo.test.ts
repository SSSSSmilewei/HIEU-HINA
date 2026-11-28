import { afterEach, describe, expect, test } from "bun:test";
import { memoryD1 } from "../scripts/local-d1";
import { ensureSchema } from "../src/worker/db";
import type { Env } from "../src/worker/env";
import { drainQueue, forgejoName, syncOrQueue, type SubmissionSync } from "../src/worker/forgejo";

/** 学员仓库（故事 2.1）。Forgejo 用内存里的假服务代替，只实现用到的几个接口。 */
const URL_BASE = "http://forgejo.test";
const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

interface Commit {
  repo: string;
  message: string;
  files: { operation: string; path: string; sha?: string }[];
}

function fakeForgejo(opts: { down?: () => boolean } = {}) {
  const users = new Set<string>();
  const repos = new Set<string>();
  const files = new Map<string, { content: string; sha: string }>();
  const commits: Commit[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    if (url.origin !== URL_BASE) return realFetch(input, init);
    if (opts.down?.()) throw new TypeError("connection refused");
    const method = init?.method ?? "GET";
    const path = decodeURIComponent(url.pathname.replace("/api/v1", ""));
    const body = init?.body ? JSON.parse(String(init.body)) : null;
    const res = (status: number, data?: unknown) => new Response(data === undefined ? "" : JSON.stringify(data), { status });
    let m: RegExpMatchArray | null;
    if (method === "POST" && path === "/admin/users") {
      if (users.has(body.username)) return res(422, { message: "exists" });
      users.add(body.username);
      return res(201, { login: body.username });
    }
    if ((m = path.match(/^\/admin\/users\/([^/]+)\/repos$/)) && method === "POST") {
      repos.add(`${m[1]}/${body.name}`);
      return res(201, {});
    }
    if ((m = path.match(/^\/repos\/([^/]+)\/([^/]+)$/)) && method === "GET") return repos.has(`${m[1]}/${m[2]}`) ? res(200, {}) : res(404, {});
    if ((m = path.match(/^\/repos\/([^/]+)\/([^/]+)\/contents\/(.+)$/)) && method === "GET") {
      const f = files.get(`${m[1]}/${m[2]}/${m[3]}`);
      return f ? res(200, { sha: f.sha, content: f.content, encoding: "base64" }) : res(404, {});
    }
    if ((m = path.match(/^\/repos\/([^/]+)\/([^/]+)\/contents$/)) && method === "POST") {
      const repo = `${m[1]}/${m[2]}`;
      for (const f of body.files) {
        const key = `${repo}/${f.path}`;
        if (f.operation === "update" && files.get(key)?.sha !== f.sha) return res(422, { message: "sha mismatch" });
        files.set(key, { content: f.content, sha: crypto.randomUUID() });
      }
      commits.push({ repo, message: body.message, files: body.files });
      return res(201, {});
    }
    return res(404, { message: `fake: no ${method} ${path}` });
  }) as typeof fetch;
  const text = (key: string) => {
    const f = files.get(key);
    return f ? new TextDecoder().decode(Uint8Array.from(atob(f.content), (c) => c.charCodeAt(0))) : undefined;
  };
  return { users, repos, commits, text };
}

const assignment = {
  id: "lab01",
  title: "实验 1：函数",
  repoDir: "lab/lab01",
  files: [
    { path: "lab01.py", content: "def digit(n, k):\n    return ______\n" },
    { path: "tests/q.py", content: "test = {}\n" },
  ],
  problems: [{ id: "digit", title: "取出某一位数字", editable: ["lab01.py"] }],
};

async function env(): Promise<Env> {
  const e = {
    DB: memoryD1(),
    ASSETS: {
      fetch: async (req: Request) => {
        const p = new URL(req.url).pathname;
        if (p === "/oj/assignments/cs61a/lab01.json") return Response.json(assignment);
        if (p === "/oj/problems/a-plus-b.json") return Response.json({ title: "A + B" });
        return new Response("index", { headers: { "content-type": "text/html" } });
      },
    },
    FORGEJO_URL: URL_BASE,
    FORGEJO_TOKEN: "t",
  } as unknown as Env;
  await ensureSchema(e.DB);
  return e;
}

const student = { id: "u1", name: "林同学", studentNo: "250101001", username: null, kind: "campus" as const };
const sub = (over: Partial<SubmissionSync> = {}): SubmissionSync => ({
  user: student,
  problem: "cs61a/lab01/digit",
  files: { "lab01.py": "def digit(n, k):\n    return n // 10 ** k % 10\n" },
  verdict: "AC",
  passed: 3,
  total: 3,
  ...over,
});

describe("学员仓库", () => {
  test("用户名：校内 s+学号，校外 x-+用户名", () => {
    expect(forgejoName(student)).toBe("s250101001");
    expect(forgejoName({ ...student, kind: "external", username: "Alice.W" })).toBe("x-alice.w");
  });

  test("第一次提交：建账号和仓库，先提交官方起始代码，再提交学员的代码", async () => {
    const f = fakeForgejo();
    const e = await env();
    expect(await syncOrQueue(e, sub({ verdict: "WA", passed: 1 }))).toBe("done");
    expect([...f.users]).toEqual(["s250101001"]);
    expect([...f.repos]).toEqual(["s250101001/cs61a"]);
    expect(f.commits.map((c) => c.message)).toEqual(["开始实验 1：函数：官方起始代码", "实验 1：函数 · 取出某一位数字：提交，答案错误（1/3）", "更新 README：学习进度"]);
    expect(f.text("s250101001/cs61a/README.md")).toContain("| ⬜ | [实验 1：函数](lab/lab01/) | 0 / 1 |");
    expect(f.commits[0]!.files.map((x) => x.path)).toEqual(["lab/lab01/lab01.py", "lab/lab01/tests/q.py"]);
    expect(f.text("s250101001/cs61a/lab/lab01/lab01.py")).toContain("10 ** k");

    // 第二次：不再提交起始代码；内容没变就不产生提交（README 也没变）
    await syncOrQueue(e, sub());
    expect(f.commits).toHaveLength(3);
    // 通过之后 README 跟着更新
    await e.DB.prepare("INSERT INTO oj_solved (user_id, problem, solved_at) VALUES ('u1', 'cs61a/lab01/digit', 1)").run();
    await syncOrQueue(e, sub({ files: { "lab01.py": "def digit(n, k):\n    return pow(10, k)\n" } }));
    expect(f.commits).toHaveLength(5);
    expect(f.commits[3]!.files[0]!.operation).toBe("update");
    expect(f.text("s250101001/cs61a/README.md")).toContain("| ✅ | [实验 1：函数](lab/lab01/) | 1 / 1 |");
    expect(f.text("s250101001/cs61a/README.md")).toContain("- 实验 1：函数 · 取出某一位数字");
  });

  test("刷题：只有通过的才进 oj-practice 仓库", async () => {
    const f = fakeForgejo();
    const e = await env();
    await syncOrQueue(e, sub({ problem: "a-plus-b", verdict: "WA", files: { "main.cpp": "x" } }));
    expect(f.commits).toHaveLength(0);
    await syncOrQueue(e, sub({ problem: "a-plus-b", files: { "main.cpp": "int main(){}" } }));
    expect(f.commits.map((c) => [c.repo, c.message, c.files[0]!.path])).toEqual([["s250101001/oj-practice", "A + B：通过", "a-plus-b/main.cpp"]]);
  });

  test("Forgejo 连不上：进队列，恢复后定时任务补上", async () => {
    let down = true;
    const f = fakeForgejo({ down: () => down });
    const e = await env();
    expect(await syncOrQueue(e, sub())).toBe("queued");
    expect(await drainQueue(e, Date.now())).toBe(0); // 还没到重试时间
    down = false;
    expect(await drainQueue(e, Date.now() + 10 * 60_000)).toBe(1);
    expect(f.commits).toHaveLength(3);
    const left = await e.DB.prepare("SELECT COUNT(*) AS n FROM forgejo_queue").first<{ n: number }>();
    expect(left?.n).toBe(0);
  });

  test("没配 Forgejo 时什么都不做", async () => {
    const e = { ...(await env()), FORGEJO_URL: undefined } as Env;
    expect(await syncOrQueue(e, sub())).toBe("off");
  });
});
