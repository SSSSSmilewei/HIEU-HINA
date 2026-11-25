"""CS61A 练手题：条目 id → 题目列表。按周分文件（w01.py …），每个文件定义 PRACTICE 字典。"""
import importlib, os, sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

PRACTICE = {}
for _f in sorted(os.listdir(os.path.dirname(__file__))):
    if _f.startswith("w") and _f.endswith(".py"):
        _m = importlib.import_module(f"practice.{_f[:-3]}")
        for _k, _v in _m.PRACTICE.items():
            PRACTICE.setdefault(_k, []).extend(_v)
for _k, _v in PRACTICE.items():
    _ids = [q["id"] for q in _v]
    assert len(_ids) == len(set(_ids)), (_k, _ids)
