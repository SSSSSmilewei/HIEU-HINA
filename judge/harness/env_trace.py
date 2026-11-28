"""环境图题（故事 3.4）：在判题沙箱里运行一段程序，记下程序结束时的全部帧，输出 JSON。

用法（工作目录里有 program.py）：
    python3 env_trace.py program.py

和 CS61A 讲的环境图一致（以 PythonTutor 的画法为准）：
- 全局帧 Global，之后每次调用函数产生一个帧，按创建的先后编号 f1、f2……；
- 帧名是函数的内在名字（lambda 写作 λ），父帧是定义这个函数时所在的帧；
- 绑定是程序结束时这一帧里的名字和值（闭包里引用外层的名字不算这一帧的绑定）；
- 函数值写作「func 名字」，返回值是这一帧返回的值。
最后一行打印 RESULT_MARK + 环境变量 HIANA_NONCE 的值 + 一行 JSON：
    {"frames": [{"name", "parent", "bindings": {名字: 值}, "ret"}...], "error"}
"""
import json
import os
import sys
import types

RESULT_MARK = "@@HIANA_RESULT@@"
FILENAME = "<程序>"
SKIP = {"<listcomp>", "<dictcomp>", "<setcomp>", "<genexpr>"}
MAX_FRAMES = 200


def fn_name(fn):
    return "λ" if fn.__name__ == "<lambda>" else fn.__name__


def show(v, depth=0):
    """值的写法：函数写 func 名字，列表、元组逐个写，其他用 repr"""
    if isinstance(v, types.FunctionType):
        return f"func {fn_name(v)}"
    if isinstance(v, types.BuiltinFunctionType):
        return f"func {v.__name__}"
    if depth < 3 and isinstance(v, list):
        return "[" + ", ".join(show(x, depth + 1) for x in v) + "]"
    if depth < 3 and isinstance(v, tuple):
        inner = ", ".join(show(x, depth + 1) for x in v)
        return f"({inner},)" if len(v) == 1 else f"({inner})"
    if isinstance(v, (int, float, str, bool, type(None))):
        return repr(v)
    return f"<{type(v).__name__}>"


class Tracer:
    def __init__(self):
        self.frames = []  # 函数帧，按创建顺序
        self.by_frame = {}  # id(帧对象) → 记录
        self.stack = []  # 正在执行的记录（全局帧在最底下）
        self.funcs = {}  # id(函数) → (函数, 父帧名)
        self.global_rec = None

    def parent_of(self, fn):
        """定义函数的帧：栈上最近的、代码里含这个函数代码的帧"""
        for rec in reversed(self.stack):
            if fn.__code__ in rec["code"].co_consts:
                return rec["label"]
        return "Global"

    def observe(self, values):
        for v in values:
            if isinstance(v, types.FunctionType) and v.__code__.co_filename == FILENAME and id(v) not in self.funcs:
                self.funcs[id(v)] = (v, self.parent_of(v))

    def function_for(self, frame):
        """这一帧是哪个函数对象的调用：代码相同，闭包里的值也对得上"""
        import gc  # noqa: PLC0415

        for o in gc.get_referrers(frame.f_code):
            if isinstance(o, types.FunctionType):
                self.observe([o])
        cands = [fn for fn, _ in self.funcs.values() if fn.__code__ is frame.f_code]
        for fn in cands:
            cells = fn.__closure__ or ()
            names = fn.__code__.co_freevars
            try:
                if all(frame.f_locals.get(n) is c.cell_contents for n, c in zip(names, cells)):
                    return fn
            except ValueError:  # 空的 cell
                continue
        return cands[0] if cands else None

    def __call__(self, frame, event, arg):
        if frame.f_code.co_filename != FILENAME or frame.f_code.co_name in SKIP:
            return None
        if event == "call":
            if id(frame) in self.by_frame:  # 生成器恢复执行
                self.stack.append(self.by_frame[id(frame)])
                return self
            if frame.f_code.co_name == "<module>":
                rec = {"label": "Global", "code": frame.f_code, "frame": frame}
                self.global_rec = rec
            else:
                if len(self.frames) >= MAX_FRAMES:
                    raise RuntimeError(f"帧太多了（超过 {MAX_FRAMES} 个），环境图题不会这么长")
                fn = self.function_for(frame)
                rec = {
                    "label": f"f{len(self.frames) + 1}",
                    "code": frame.f_code,
                    "frame": frame,
                    "name": fn_name(fn) if fn else frame.f_code.co_name,
                    "parent": self.funcs[id(fn)][1] if fn else "Global",
                    "locals": {},
                    "ret": None,
                    "returned": False,
                }
                self.frames.append(rec)
            self.by_frame[id(frame)] = rec
            self.stack.append(rec)
            return self
        rec = self.by_frame.get(id(frame))
        if rec is None:
            return self
        if event == "line":
            self.observe(list(frame.f_locals.values()))
        elif event == "return":
            self.observe(list(frame.f_locals.values()) + [arg])
            if rec is not self.global_rec:
                free = set(frame.f_code.co_freevars)
                rec["locals"] = {k: v for k, v in frame.f_locals.items() if k not in free}
                rec["ret"] = arg
                rec["returned"] = True
            if self.stack and self.stack[-1] is rec:
                self.stack.pop()
        return self


def main():
    nonce = os.environ.pop("HIANA_NONCE", "")
    with open(sys.argv[1], encoding="utf-8") as f:
        src = f.read()
    tracer = Tracer()
    env = {"__name__": "__main__"}
    error = None
    try:
        code = compile(src, FILENAME, "exec")
        sys.settrace(tracer)
        try:
            exec(code, env)
        finally:
            sys.settrace(None)
    except BaseException as e:  # noqa: BLE001  程序本身报错也照样画到出错为止
        error = f"{type(e).__name__}: {e}"
    glob = {k: v for k, v in env.items() if not k.startswith("__") and not isinstance(v, types.ModuleType)}
    frames = [{"name": "Global", "parent": None, "bindings": {k: show(v) for k, v in glob.items()}, "ret": None}]
    for rec in tracer.frames:
        frames.append({
            "name": rec["name"],
            "parent": rec["parent"],
            "bindings": {k: show(v) for k, v in rec["locals"].items()},
            "ret": show(rec["ret"]) if rec["returned"] else None,
        })
    sys.stdout.flush()
    print("\n" + RESULT_MARK + nonce + json.dumps({"frames": frames, "error": error}, ensure_ascii=False))


if __name__ == "__main__":
    main()
