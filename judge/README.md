# 判题服务

平台的所有判题都走这里（PRD `docs/prd/hiana-oj.md`，故事 1.2）。部署在学校服务器上，平台的 Worker 用 HTTP 加令牌调用。

## 组成

- `sandbox/`：判题沙箱镜像。开源的 [go-judge](https://github.com/criyle/go-judge)（Hydro 底下用的同一个）加 Python 3.11、gcc、g++、Java 17、SQLite。每次运行都在独立的 Linux 命名空间里，没有网络，限 CPU 时间、内存、进程数。
- `src/server.ts`：判题服务。读 `content/oj/` 的题目（含隐藏用例），收到代码后在沙箱里编译、运行、比对，返回 OJ 式结果（`src/shared/judge.ts`）。
- `harness/ok_judge.py`：在沙箱里跑 CS61A 官方 ok 测试（doctest 和加密的期望输出），不需要 ok 客户端，也不需要参考答案。

## 本地运行

```bash
docker compose -f judge/docker-compose.yml up -d          # 沙箱，只监听 127.0.0.1:5050
JUDGE_TOKEN=至少16个字符的随机串 npx -y bun@1.4.4 judge/src/server.ts   # 判题服务，127.0.0.1:8790
```

平台这边在 `.dev.vars` 里写 `JUDGE_URL=http://127.0.0.1:8790` 和同一个 `JUDGE_TOKEN`。

环境变量：`JUDGE_TOKEN`（必填）、`PORT`（默认 8790）、`HOST`（默认 127.0.0.1）、`SANDBOX_URL`（默认 http://127.0.0.1:5050）、`JUDGE_CONCURRENCY`（同时判几份，默认 4）。

## 接口

| 接口 | 说明 |
| --- | --- |
| `GET /v1/health` | 服务和沙箱是否正常，不要令牌 |
| `POST /v1/run` | 只跑公开用例；输入输出题可以带 `stdin`，只运行不判对错 |
| `POST /v1/submit` | 跑全部用例，包括隐藏用例（隐藏用例只返回序号和结果） |

请求体：`{ problem, language, files: { 路径: 内容 }, stdin? }`。课程作业的题目编号是 `<课程>/<作业>/<题目>`，刷题区的是 `<题目>`。学员只能覆盖题目里标了可改的文件。

## 测试

`tests/judge.test.ts`。判题部分要本机起了沙箱才跑，没起就跳过。

## 已知限制

- ok 题的判题脚本和学员代码在同一个 Python 进程里，学员代码理论上能篡改判题脚本；结果行带了一次性随机串，挡住了直接打印假结果。正式比赛不用这种题型。
- 以后要换成 Hydro 判题，只需要换掉 `src/judge.ts` 这一层，接口不变。
