/* 插件用到的几个 Node.js 接口的类型（只声明用到的部分，省得为类型检查多装 @types/node） */
declare module "node:child_process" {
  export function execFile(
    file: string,
    args: string[],
    options: { cwd?: string; env?: Record<string, string | undefined>; maxBuffer?: number },
    callback: (error: Error | null, stdout: string, stderr: string) => void,
  ): unknown;
}
declare module "node:fs/promises" {
  export function mkdir(path: string, options?: { recursive?: boolean }): Promise<unknown>;
  export function readdir(path: string): Promise<string[]>;
  export function stat(path: string): Promise<unknown>;
  export function writeFile(path: string, data: string, options?: { mode?: number }): Promise<void>;
  export function chmod(path: string, mode: number): Promise<void>;
}
declare module "node:os" {
  export function homedir(): string;
  export function hostname(): string;
}
declare module "node:path" {
  export function join(...parts: string[]): string;
}
declare const process: { env: Record<string, string | undefined> };
