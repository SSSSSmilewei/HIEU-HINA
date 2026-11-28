import { describe, expect, test } from "bun:test";
import { fileForLanguage, monacoLanguage, type PublicProblem } from "../src/client/ide/types";

describe("做题界面的小工具", () => {
  test("按扩展名选编辑器语言", () => {
    expect(monacoLanguage("lab01.py")).toBe("python");
    expect(monacoLanguage("src/main.cpp")).toBe("cpp");
    expect(monacoLanguage("Main.java")).toBe("java");
    expect(monacoLanguage("q.scm")).toBe("scheme");
    expect(monacoLanguage("README")).toBe("plaintext");
  });

  test("输入输出题按语言找到对应的文件", () => {
    const p = { editable: ["main.cpp", "main.c", "Main.java", "main.py"] } as PublicProblem;
    expect(fileForLanguage(p, "python")).toBe("main.py");
    expect(fileForLanguage(p, "java")).toBe("Main.java");
    expect(fileForLanguage(p, "c")).toBe("main.c");
    expect(fileForLanguage(p, "sql")).toBe("main.cpp");
  });
});
