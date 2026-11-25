"""生成 content/levels/cs61a/（CS61A 闯关：起始代码、官方测试、关卡说明）。

用法（在仓库根目录）：python3 scripts/courses/cs61a/levels.py

数据来源：CS61A 2026 春季课程网站的存档镜像 github.com/lr2933/cs61a-spring-2026，
下载 proj/hog/hog.zip（起始代码与官方 ok 测试），缓存在 .staging/course-cache/cs61a/zip/（不进仓库）。
官方测试里的期望输出大多是加密的（hmac-md5，密钥是作业名），站内判题时把学生的输出按同样方式加密后比较，
所以仓库里没有、也不需要官方答案。判题器见 content/levels/ok_runner.py。

关卡说明是官方题目说明的中文翻译（有删节：去掉了 ok 命令行、Gradescope 提交等站内用不到的部分）。
"""
import io, json, os, shutil, urllib.request, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "../../.."))
OUT = os.path.join(ROOT, "content/levels/cs61a")
CACHE = os.path.join(ROOT, ".staging/course-cache/cs61a/zip")
MIRROR = "lr2933/cs61a-spring-2026"

LEARN = "/courses/cs61a/learn/"


def fetch_zip(path):
    os.makedirs(CACHE, exist_ok=True)
    local = os.path.join(CACHE, path.replace("/", "__"))
    if not os.path.exists(local):
        req = urllib.request.Request(f"https://raw.githubusercontent.com/{MIRROR}/HEAD/{path}", headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=120) as r, open(local, "wb") as f:
            f.write(r.read())
    return zipfile.ZipFile(local)


def ref(label, page):
    return {"label": label, "href": LEARN + page}


# ------------------------------------------------------------------ Hog

HOG_RULES = """**Hog 的规则**（第 1、2、4 关都会用到）：两名玩家轮流掷骰子，谁先在自己回合结束时总分达到 `GOAL`（默认 100）谁赢。每回合当前玩家选择一次掷几个骰子（最多 10 个），本回合得分是各骰子点数之和，另有三条特殊规则：

- **Sow Sad**：只要有一个骰子掷出 1，本回合得分就是 1，不管其他骰子是几点。
- **Boar Brawl**：选择掷 0 个骰子的玩家，得分是「对手总分的十位数字」与「自己总分的个位数字」之差的绝对值乘以 3；如果结果小于 1，就得 1 分。总分只有一位数时，十位数字是 0。
- **Sus Fuss**：因数个数恰好是 3 个或 4 个的数（因数包括 1 和它本身）称为 sus 数。掷完骰子后，如果当前玩家的总分是 sus 数，总分立刻变成比它大的最小质数。"""

HOG_LEVELS = [
    {
        "id": "q00", "test": "00", "title": "认识骰子", "points": 0, "unlockOnly": True,
        "functions": [],
        "task": """`dice.py` 用**没有参数的函数**表示骰子。这些函数不是纯函数：每调用一次，返回值可能不同，因为调用本身会改变「下一次返回什么」。

```python
def make_fair_dice(sides):
    \"\"\"返回一个骰子，等概率地给出 1 到 SIDES 之间的点数。\"\"\"

four_sided = make_fair_dice(4)
six_sided = make_fair_dice(6)

def make_test_dice(*outcomes):
    \"\"\"返回一个按 OUTCOMES 的顺序循环给出点数的骰子。

    >>> dice = make_test_dice(1, 2, 3)
    >>> dice()
    1
    >>> dice()
    2
    >>> dice()
    3
    >>> dice()
    1
    \"\"\"
```

公平骰子（`four_sided`、`six_sided`）每个点数出现的概率相同；测试骰子（`make_test_dice` 返回的）是确定的，总是按给定的顺序循环，后面各关的测试都用它。

这一关不用写代码：在下方「先检验理解」里写出每一行的输出，全部答对就算通过。""",
        "hints": ["`make_test_dice(4, 1, 2)` 返回的骰子依次给出 4、1、2，然后回到 4 重新开始。", "「掷」一次骰子就是调用一次这个函数：`six_sided()`。"],
        "refs": [ref("1.3 定义新函数", "cp-1-3")],
    },
    {
        "id": "q01", "test": "01", "title": "掷骰子：roll_dice", "points": 2,
        "functions": ["roll_dice"],
        "task": """实现 `hog.py` 里的 `roll_dice`。它有两个参数：正整数 `num_rolls`（掷几次）和骰子函数 `dice`；返回这一回合掷 `num_rolls` 次得到的分数：要么是各次点数之和，要么是 1（Sow Sad）。

- **Sow Sad**：只要有一次掷出 1，本回合得分就是 1。
  - 例 1：掷 7 个骰子，其中 5 个是 1，得 1 分。
  - 例 2：掷 4 个骰子，全是 3，没有触发 Sow Sad，得 12 分。

调用一次 `dice()` 得到一个点数。在 `roll_dice` 里，`dice()` **必须恰好调用 `num_rolls` 次**，即使中途已经掷出了 1 也要掷完，这样才是在模拟「所有骰子一起掷」。

函数头 `def roll_dice(num_rolls, dice=six_sided)` 用了默认参数：调用时不给 `dice`，就用 `six_sided`。例如 `roll_dice(3, four_sided)` 掷 3 个四面骰，`roll_dice(3)` 掷 3 个六面骰。""",
        "hints": ["用一个 `while` 循环计数，每轮调用一次 `dice()`，把点数加进总和。", "用一个变量记住「有没有掷出过 1」，循环结束后再决定返回总和还是 1。", "测试里的 `counted_dice` 检查你调用 `dice()` 的次数：提前 `return` 会少掷几次，导致下一次调用的结果对不上。"],
        "refs": [ref("1.5 控制", "cp-1-5"), ref("1.3 定义新函数", "cp-1-3")],
    },
    {
        "id": "q02", "test": "02", "title": "零骰规则：boar_brawl", "points": 2,
        "functions": ["boar_brawl"],
        "task": """实现 `boar_brawl(player_score, opponent_score)`：当前玩家掷 0 个骰子、触发 Boar Brawl 时，返回本回合得到的分数。

- **Boar Brawl**：得分 = 3 × |对手总分的十位数字 − 自己总分的个位数字|；结果小于 1 时得 1 分。个位是最右边一位，十位是右数第二位；一位数的十位是 0。
  - 例 1：自己 21 分，对手 46 分。对手十位是 4，自己个位是 1，得 `3 * abs(4 - 1) = 9` 分。
  - 例 2：自己 45 分，对手 52 分。`3 * abs(5 - 5) = 0`，所以得 1 分。
  - 例 3：自己 2 分，对手 5 分。对手十位是 0，自己个位是 2，得 `3 * abs(0 - 2) = 6` 分。

不要假设分数小于 100，函数要对任何非负分数都正确。

**限制**：不能使用 `str`、列表，也不能出现方括号 `[` `]`。测试会检查这一点。""",
        "hints": ["个位数字是 `n % 10`，去掉个位是 `n // 10`。", "十位数字是 `(n // 10) % 10`。不取 `% 10` 的话，分数达到 100 以上时会出错。", "「或 1，取较大者」可以用 `max(…, 1)`。"],
        "refs": [ref("1.2 编程要素", "cp-1-2")],
    },
    {
        "id": "q03", "test": "03", "title": "一个回合：take_turn", "points": 2,
        "functions": ["take_turn"],
        "task": """实现 `take_turn(num_rolls, player_score, opponent_score, dice)`：返回掷 `num_rolls` 次骰子这一回合的得分。

`num_rolls` 是 0 时触发 Boar Brawl，否则正常掷骰子。你的实现应当**调用** `roll_dice` 和 `boar_brawl`，不要把它们的代码重写一遍。""",
        "hints": ["只需要一个 `if`：`num_rolls == 0` 时返回 `boar_brawl(...)`，否则返回 `roll_dice(...)`。", "注意 `boar_brawl` 的参数顺序：先是自己的分数，再是对手的分数。"],
        "refs": [ref("1.4 设计函数", "cp-1-4")],
    },
    {
        "id": "q04", "test": "04", "title": "因数与质数：Sus Fuss", "points": 2,
        "functions": ["num_factors", "sus_points", "sus_update"],
        "task": """先实现 `num_factors(n)`：输入正整数 `n`，返回它有几个因数。1 和 `n` 本身都算。

再实现 `sus_points` 和 `sus_update`：

- `sus_points(score)`：输入一个总分，返回应用 Sus Fuss 规则之后的总分（不变也要返回）。例如 `sus_points(5)` 返回 `5`，`sus_points(21)` 返回 `23`。要用到 `num_factors` 和已经写好的 `is_prime`。
- `sus_update(num_rolls, player_score, opponent_score, dice)`：返回玩家掷 `num_rolls` 次骰子后的**总分**，同时考虑 Boar Brawl 和 Sus Fuss。要用到 `sus_points`。

- **Sus Fuss**：因数个数恰好是 3 或 4 的数称为 sus 数。掷完骰子后，总分如果是 sus 数，立刻变成比它大的最小质数。
  - 例 1：14 分的玩家掷 2 个骰子得 7 分，总分 21。21 有 4 个因数（1、3、7、21），是 sus 数，所以总分变成下一个质数 23。
  - 例 2：63 分的玩家掷 5 个骰子，触发 Sow Sad 得 1 分，总分 64。64 有 7 个因数，不是 sus 数，总分不变。
  - 例 3：49 分的玩家掷 5 个骰子得 18 分，总分 67。67 是质数，只有 2 个因数，总分不变。

提示：可以参考 `hog.py` 里已经写好的 `simple_update`；`take_turn` 已经处理了 Boar Brawl。""",
        "hints": ["`num_factors`：从 1 数到 `n`，能整除的就计数。", "`sus_points`：先判断因数个数是不是 3 或 4；是的话，从 `score + 1` 开始往上找，直到 `is_prime` 为真。", "`sus_update` 只需要一行：对 `simple_update(...)` 的结果调用 `sus_points`。"],
        "refs": [ref("1.5 控制", "cp-1-5")],
    },
    {
        "id": "q05", "test": "05", "title": "整局游戏：play", "points": 4,
        "functions": ["play"],
        "task": """实现 `play`：模拟一整局 Hog。两名玩家轮流掷骰子，直到有一方达到 `goal` 分，然后返回双方的最终总分。

- **掷几个骰子**：调用当前玩家的策略函数（玩家 0 用 `strategy0`，玩家 1 用 `strategy1`）。策略函数接收「自己的总分」和「对手的总分」，返回这一回合掷几个骰子。`play` 上方的 `always_roll_5` 就是一个简单的策略。
- **更新总分**：调用 `update` 函数。它接收掷几个骰子、自己的总分、对手的总分和骰子函数，返回当前玩家这一回合结束后的**总分**（不是增加的分数）。`simple_update` 和 `sus_update` 都是 update 函数。
- **结束条件**：某位玩家在自己回合结束时（所有规则都已生效）达到或超过 `goal`，游戏结束。返回值是两人的总分，玩家 0 在前。

例如 `play(always_roll_5, always_roll_5, simple_update)` 模拟两个总是掷 5 个骰子的玩家，只用 Sow Sad 和 Boar Brawl 规则；把 `simple_update` 换成 `sus_update` 就是全部规则。

**重要**：每个回合只能调用一次策略函数，而且只调用当前玩家的那一个。测试会检查这一点。""",
        "hints": ["`who` 表示当前玩家；下一位玩家是 `1 - who`。", "循环条件是「两人都还没到 `goal`」。", "轮到玩家 1 时，传给策略和 update 的「自己」是 `score1`，「对手」是 `score0`，顺序别弄反。"],
        "refs": [ref("1.5 控制", "cp-1-5"), ref("1.6 高阶函数", "cp-1-6-1")],
    },
    {
        "id": "q06", "test": "06", "title": "返回函数：always_roll", "points": 2,
        "functions": ["always_roll"],
        "task": """从这一关起进入第二阶段：策略。策略是一个函数，接收自己和对手的总分，返回掷几个骰子（0 到 10）。

实现高阶函数 `always_roll(n)`：返回一个**总是掷 `n` 个骰子**的策略函数。`always_roll(5)` 应当和 `always_roll_5` 等价。""",
        "hints": ["在 `always_roll` 里面定义一个接收两个参数的函数，让它返回 `n`，再把这个函数返回出去。", "也可以用 lambda：`lambda score, opponent_score: n`。"],
        "refs": [ref("1.6 高阶函数", "cp-1-6-1")],
    },
    {
        "id": "q07", "test": "07", "title": "检查策略：is_always_roll", "points": 2,
        "functions": ["is_always_roll"],
        "task": """策略的参数只有有限种取值。`goal` 为 100 时，自己的分数可以是 0 到 99，对手的分数也是 0 到 99，一共 10000 种组合。

实现 `is_always_roll(strategy, goal)`：判断 `strategy` 是否对**每一种**分数组合（两个分数都小于 `goal`）都返回同一个骰子数。

注意 `goal` 不一定是 100，要按传进来的 `goal` 检查所有组合。""",
        "hints": ["先算出 `strategy(0, 0)`，再用两层循环检查所有组合是否都等于它。", "发现一个不相等的就可以立刻返回 `False`。"],
        "refs": [ref("1.5 控制", "cp-1-5")],
    },
    {
        "id": "q08", "test": "08", "title": "求平均：make_averaged", "points": 2,
        "functions": ["make_averaged"],
        "task": """实现高阶函数 `make_averaged(original_function, times_called)`。

它的返回值是一个函数，接收的参数和 `original_function` 相同。用某组参数调用这个函数时，它用**同样的参数**调用 `original_function` 共 `times_called` 次，返回这些结果的平均值。

仔细看 `make_averaged` 的 doctest：`original_function` 是 `roll_dice`，`averaged_dice(1, dice)` 说明参数 `(1, dice)` 是传给 `averaged_dice` 的，再由它转交给 `roll_dice`。

要写出「接收任意多个参数、再原样转交」的函数，需要 `*args` 语法：

```python
>>> def printed(f):
...     def print_and_return(*args):
...         result = f(*args)
...         print('Result:', result)
...         return result
...     return print_and_return
>>> printed_pow = printed(pow)
>>> printed_pow(2, 8)  # *args 代表参数 (2, 8)
Result: 256
256
```""",
        "hints": ["内层函数写成 `def averaged(*args):`，在里面调用 `original_function(*args)`。", "循环 `times_called` 次累加结果，最后除以 `times_called`。"],
        "refs": [ref("1.6 高阶函数", "cp-1-6-1")],
    },
    {
        "id": "q09", "test": "09", "title": "做实验：max_scoring_num_rolls", "points": 2,
        "functions": ["max_scoring_num_rolls"],
        "task": """实现 `max_scoring_num_rolls(dice, times_called)`：用给定的骰子做实验，找出掷几个骰子（1 到 10）时一回合的**平均得分最高**。要用到 `make_averaged` 和 `roll_dice`。

如果有几个骰子数的平均得分并列最高，返回其中较小的那个。例如 3 和 6 并列最高时返回 3。

**重要**：要从 1 往上试到 10，不要从 10 往下试，否则通不过测试（测试骰子的结果和调用顺序有关）。

用六面骰做实验，你多半会发现掷 6 个骰子平均得分最高。""",
        "hints": ["先用 `make_averaged(roll_dice, times_called)` 得到一个求平均的函数。", "循环 `n` 从 1 到 10，只有平均分**严格大于**当前最高分时才更新，这样并列时保留较小的 `n`。"],
        "refs": [ref("1.6 高阶函数", "cp-1-6-1")],
    },
    {
        "id": "q10", "test": "10", "title": "零骰策略：boar_strategy", "points": 2,
        "functions": ["boar_strategy"],
        "task": """策略可以利用 Boar Brawl 规则：在掷 0 个骰子最划算的时候掷 0 个。

实现 `boar_strategy(score, opponent_score, threshold, num_rolls)`：如果掷 0 个骰子至少能得 `threshold` 分，就返回 0，否则返回 `num_rolls`。这个策略**不考虑** Sus Fuss 规则。

实现以后，用 `always_roll(6)` 做对照，`boar_strategy` 的胜率大约是 66% 到 67%。""",
        "hints": ["用第 2 关的 `boar_brawl(score, opponent_score)` 算出掷 0 个骰子的得分，再和 `threshold` 比较。"],
        "refs": [ref("1.4 设计函数", "cp-1-4")],
    },
    {
        "id": "q11", "test": "11", "title": "组合策略：sus_strategy", "points": 2,
        "functions": ["sus_strategy"],
        "task": """更好的策略同时利用 Boar Brawl 和 Sus Fuss。例如自己 53 分、对手 60 分时，掷 0 个骰子会到 62 分；62 是 sus 数，于是本回合结束时是 67 分，一共涨了 67 − 53 = 14 分。

实现 `sus_strategy(score, opponent_score, threshold, num_rolls)`：如果掷 0 个骰子后的总分比回合开始时**至少多 `threshold` 分**，就返回 0，否则返回 `num_rolls`。

实现以后，`sus_strategy` 对 `always_roll(6)` 的胜率大约是 67% 到 69%。""",
        "hints": ["用第 4 关的 `sus_update(0, score, opponent_score)` 算出掷 0 个骰子后的总分。", "比较的是「增加了多少」，要减去 `score`。"],
        "refs": [ref("1.4 设计函数", "cp-1-4")],
    },
    {
        "id": "q12", "test": "12", "title": "自由发挥：final_strategy", "points": 0, "optional": True,
        "functions": ["final_strategy"],
        "task": """**选做**。实现 `final_strategy`，综合前面的想法（以及你自己的想法），尽量提高对基准策略的胜率。几条思路：

- 知道目标分数（默认 100）时，超过目标没有好处。看看掷 0、1、2 个骰子能不能直接赢；领先时可以少冒险。
- 不用固定阈值：当掷 0 个骰子的得分比掷 6 个骰子的平均得分高时就掷 0 个。

这一关的测试只检查策略是否合法：对每种分数组合都返回整数，而且不调用 `max_scoring_num_rolls`。""",
        "hints": ["先让它返回一个固定的数（例如 6）通过测试，再慢慢改进。"],
        "refs": [],
    },
]

HOG_FILES = ["hog.py", "dice.py", "ucb.py", "hog_ui.py"]


def build_hog():
    z = fetch_zip("proj/hog/hog.zip")
    out = os.path.join(OUT, "hog")
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(os.path.join(out, "tests"))
    support = []
    for name in z.namelist():
        rel = name.split("/", 1)[1] if "/" in name else name
        if rel in HOG_FILES or (rel.startswith("tests/") and rel.endswith(".py")):
            with open(os.path.join(out, rel), "wb") as f:
                f.write(z.read(name))
            if rel.startswith("tests/"):
                support.append("hog/" + rel)
    for lv in HOG_LEVELS:
        assert os.path.exists(os.path.join(out, "tests", lv["test"] + ".py")), lv["test"]
    return {
        "id": "hog",
        "title": "项目 1：Hog（掷骰子游戏）",
        "item": "proj-hog",
        "key": "Hog Project",
        "dir": "hog",
        "intro": "照着官方项目，一关一关写出完整的 Hog 游戏。第 0 到 5 关实现游戏规则（第一阶段），第 6 到 11 关设计和比较策略（第二阶段），第 12 关选做。全部通过后，你的仓库里就是一个能玩的 Hog。\n\n" + HOG_RULES,
        "files": [
            {"path": "hog/hog.py", "editable": True},
            {"path": "hog/dice.py", "editable": False},
            {"path": "hog/ucb.py", "editable": False},
            {"path": "hog/hog_ui.py", "editable": False},
        ],
        "support": sorted(support),
        "levels": HOG_LEVELS,
    }


def main():
    chapters = [
        build_hog(),
        {"id": "cats", "title": "项目 2：Cats（打字速度测试）", "item": "proj-cats", "soon": True, "levels": []},
        {"id": "ants", "title": "项目 3：Ants（植物大战僵尸式塔防）", "item": "proj-ants", "soon": True, "levels": []},
        {"id": "scheme", "title": "项目 4：Scheme 解释器", "item": "proj-scheme", "soon": True, "levels": []},
    ]
    index = {
        "format": "hiana-levels@1",
        "course": "cs61a",
        "title": "CS 61A 闯关：用 Python 写出四个项目",
        "license": "起始代码与测试 © UC Berkeley CS 61A（课程网站 cs61a.org 存档）；关卡说明为官方题目说明的中文翻译，海纳协会。",
        "source": "https://github.com/lr2933/cs61a-spring-2026",
        "chapters": chapters,
    }
    with open(os.path.join(OUT, "index.json"), "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
        f.write("\n")
    n = sum(len(c["levels"]) for c in chapters)
    print(f"写出 {OUT}：{len(chapters)} 章，{n} 关")


if __name__ == "__main__":
    main()
