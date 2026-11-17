import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync("intro/src/app.js", "utf8");
const draftCode = source.slice(source.indexOf('  const FIELDS = ["f-name"'), source.indexOf("  let sending = false;"));

function restore(saved: unknown) {
  const fields = new Map<string, { value: string; checked: boolean }>();
  const storage = new Map<string, string>();
  const handlers = new Map<string, () => void>();
  if (saved !== undefined) storage.set("hiana.intro.draft", JSON.stringify(saved));
  const context = {
    draft: false, formStep: 1, phase: "form",
    $: (id: string) => {
      if (!fields.has(id)) fields.set(id, { value: "", checked: false });
      return fields.get(id)!;
    },
    localStorage: {
      getItem: (key: string) => storage.get(key),
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    },
    window: { addEventListener: (event: string, handler: () => void) => handlers.set(event, handler) },
  };
  runInNewContext(draftCode, context);
  return { context, storage, fields, save: () => handlers.get("pagehide")!() };
}

test("报名草稿不保存手机号和 QQ，恢复时重新填写联系方式", () => {
  const saved = restore(undefined);
  for (const [id, value] of [["f-name", "小海"], ["f-phone", "13812345678"], ["f-qq", "123456789"], ["q1", "学习算法"]]) {
    saved.context.$(id).value = value;
  }
  saved.context.formStep = 2;
  saved.save();
  const draft = JSON.parse(saved.storage.get("hiana.intro.draft")!);
  expect(draft["f-phone"]).toBeUndefined();
  expect(draft["f-qq"]).toBeUndefined();
  expect(draft.savedAt).toBeGreaterThan(0);
  const restored = restore(draft);
  expect(restored.context.$("f-name").value).toBe("小海");
  expect(restored.context.$("q1").value).toBe("学习算法");
  expect(restored.context.formStep).toBe(1);
  expect(restored.context.draft).toBe(true);
});

test("报名草稿清理旧格式、过期和未来时间戳", () => {
  for (const saved of [
    { "f-phone": "13812345678" },
    { savedAt: Date.now() - 8 * 86_400_000, "f-phone": "13812345678" },
    { savedAt: Date.now() + 86_400_000 },
    null,
  ]) {
    const restored = restore(saved);
    expect(restored.storage.has("hiana.intro.draft")).toBe(false);
    expect(restored.context.draft).toBe(false);
  }
});
