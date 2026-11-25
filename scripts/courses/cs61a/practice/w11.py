"""第 9–13 周：分解、效率、期中复习、Scheme、Scheme 列表、计算器、解释器、程序即数据、宏。

站内判不了 Scheme 代码，Scheme 的编程题改成两种形式：问求值结果（填空）、选出 / 补全关键表达式。
"""
from qhelp import choice, text

SCM = "（填写 Scheme 解释器显示的结果；列表写成 `(1 2 3)` 的形式，真假写 `#t`、`#f`。）"


def scm(id, source, code, expr, answers, explain):
    """Scheme「解释器会显示什么」题。"""
    ctx = f"\n\n```scheme\n{code.strip()}\n```\n\n" if code.strip() else "\n\n"
    alts = list(answers if isinstance(answers, list) else [answers])
    alts += [a.replace("#t", "#true").replace("#f", "#false") for a in alts if "#t" in a or "#f" in a]
    alts += [a.replace("#t", "true").replace("#f", "false") for a in alts if a in ("#t", "#f")]
    return text(id, f"{source}{ctx}对 `{expr}` 求值，结果是什么？\n\n{SCM}", alts, explain)


LAB8 = "改编自官方实验 8。"
HW7 = "改编自官方作业 7。"
HW8 = "改编自官方作业 8。"
LAB10 = "改编自官方实验 10 的 Q1「WWSD: Quasiquote」。"

PRACTICE = {
    "lec23": [
        text("set-and", "据讲义 2.9.3 节「集合」。\n\n在 Python 里，`{1, 2, 3} & {2, 3, 4}` 的值是什么？（照解释器的显示填写，例如 `{1, 2}`。）", ["{2, 3}", "{3, 2}"],
             "& 是交集，只保留两个集合都有的元素。", origin="review"),
        choice("dispatch", "据讲义 2.4.8 节「分派字典」。\n\n用一个字典把消息名映射到处理函数（例如 `{'withdraw': withdraw, 'deposit': deposit}`），然后按收到的消息查表调用。这种写法主要的好处是？",
               ["加一种新消息时，只要往字典里加一项，不必改动分派的代码", "程序运行得更快", "不再需要函数", "可以省掉所有局部变量"], 0,
               "分派字典把「收到什么消息」和「怎样处理」分开，系统的各部分可以独立扩展，这正是分解的思想。", origin="review"),
    ],
    "lec24": [
        choice("memo", "据讲义 2.8.2 节「记忆化」。\n\n用记忆化（把算过的 `fib(k)` 存进字典）改写树形递归的 `fib(n)` 之后，计算 `fib(n)` 需要的时间大约按什么速度增长？",
               ["线性：Θ(n)", "指数：Θ(φⁿ)", "对数：Θ(log n)", "常数：Θ(1)"], 0, "每个 fib(k) 只计算一次，之后直接查表，一共 n 个子问题。", origin="review"),
        choice("fast-exp", "据讲义 2.8.4 节「示例：幂运算」。\n\n`fast_exp(b, n)` 在 n 为偶数时计算 `square(fast_exp(b, n // 2))`，在 n 为奇数时计算 `b * fast_exp(b, n - 1)`。它的增长阶是？",
               ["Θ(log n)", "Θ(n)", "Θ(n²)", "Θ(1)"], 0, "每两步至少把 n 减半，所以递归的层数与 log n 成正比。", origin="review"),
        choice("nested-loop", "据讲义 2.8.5 节「增长类别」。\n\n```py\ndef overlap(a, b):\n    count = 0\n    for item in a:\n        if item in b:\n            count += 1\n    return count\n```\n\n`a`、`b` 都是长度为 n 的列表时，`overlap` 的增长阶是？",
               ["Θ(n²)", "Θ(n)", "Θ(log n)", "Θ(n log n)"], 0, "外层循环 n 次，每次 `item in b` 都要扫描整个列表 b，所以一共大约 n × n 步。", origin="review"),
    ],
    "lec25": [
        choice("review-env", "期中复习：环境图。\n\n```py\ndef f(x):\n    def g(y):\n        return x + y\n    x = 10\n    return g\n\nh = f(1)\nh(5)\n```\n\n最后一行的值是？",
               ["15", "6", "11", "报错"], 0, "g 的父帧是 f 的帧；调用 h(5) 时查找 x，找到的是 f 帧里已经被改成 10 的 x。", origin="review"),
        choice("review-mut", "期中复习：可变性。\n\n```py\ns = [1, 2]\nt = [s, s]\ns.append(3)\n```\n\n执行完之后，`t` 的值是？",
               ["[[1, 2, 3], [1, 2, 3]]", "[[1, 2], [1, 2]]", "[[1, 2, 3], [1, 2]]", "[1, 2, 3, 1, 2, 3]"], 0, "t 的两个元素都指向同一个列表 s，修改 s 后从 t 里看到的也变了。", origin="review"),
    ],
    "lec26": [
        scm("over-or-under", LAB8 + "Q1「Over or Under」的参考答案：", "(define (over-or-under num1 num2)\n  (cond\n    ((< num1 num2) -1)\n    ((= num1 num2) 0)\n    (else 1)))",
            "(over-or-under 5 3)", "1", "5 不小于 3，也不等于 3，落到 else 分支。"),
        choice("paren", LAB8 + "\n\n在 Scheme 解释器里分别输入 `0` 和 `(0)`，结果是？",
               ["`0` 得到 0；`(0)` 报错，因为括号表示调用，而 0 不是过程", "两个都得到 0", "两个都报错", "`(0)` 得到空表"], 0, "Scheme 里每一对括号都是一次调用（或特殊形式），不能随便加括号。"),
        scm("repeat", LAB8 + "Q3「Repeat」的示例：", "(define (square x) (* x x))", "((repeat square 3) 3)", "6561",
            "把 square 作用 3 次：3 → 9 → 81 → 6561。"),
    ],
    "lab08": [
        text("composed", LAB8 + "Q2「Compose」。\n\n补全过程 `composed`：它返回一个新过程，对参数 `x` 返回 `(f (g x))`。\n\n```scheme\n(define (composed f g)\n  ______)\n```\n\n空白处应填写什么？",
             ["(lambda (x) (f (g x)))"], "用 lambda 创建一个接收 x 的新过程。注意 Scheme 的调用写法是 (f arg)，不是 f(arg)。"),
        choice("gcd", LAB8 + "Q4「Greatest Common Divisor」。用欧几里得算法求最大公约数：较小的数能整除较大的数时，结果就是较小的数；否则结果等于「较小的数」与「较大的数除以较小的数的余数」的最大公约数。\n\n"
               "```scheme\n(define (gcd a b)\n  (cond ((zero? a) b)\n        ((zero? b) a)\n        ((= (modulo (max a b) (min a b)) 0) (min a b))\n        (else ______)))\n```\n\n空白处应填写？",
               ["(gcd (min a b) (modulo (max a b) (min a b)))", "(gcd a (- b 1))", "(modulo a b)", "(gcd (max a b) (min a b))"], 0, "这正是 gcd(a, b) = gcd(b, a % b) 的 Scheme 写法。"),
        scm("gcd-value", LAB8 + "Q4 的过程：", "", "(gcd 24 60)", "12", "60 除以 24 余 12，24 除以 12 余 0，所以是 12。"),
        scm("swap", LAB8 + "Q6「Swap」：写一个尾递归过程 `swap`，返回把列表中每两个元素交换位置后的新列表。", "", "(swap '(1 2 3 4 5))", "(2 1 4 3 5)", "1 和 2 交换、3 和 4 交换，最后剩下的 5 不动。"),
        choice("tail", LAB8 + "「Tail Calls」部分。\n\n下面哪个版本的阶乘是**尾递归**的？",
               ["```scheme\n(define (factorial n)\n  (define (fact-tail n result)\n    (if (= n 0)\n        result\n        (fact-tail (- n 1) (* n result))))\n  (fact-tail n 1))\n```",
                "```scheme\n(define (factorial n)\n  (if (= n 0)\n      1\n      (* n (factorial (- n 1)))))\n```"], 0,
               "第二个版本在递归调用返回后还要乘以 n，递归调用不是最后一步。第一个版本把乘积作为参数传下去，递归调用就是最后一步，解释器可以复用同一个帧。"),
        scm("make-adder", LAB8 + "Q7「Make Adder」：`make-adder` 接收 `num`，返回一个接收 `inc` 并返回 `num + inc` 的过程。", "", "((make-adder 2) 3)", "5", "(make-adder 2) 返回一个过程，再用 3 调用它。"),
    ],
    "hw07": [
        choice("pow", HW7 + "Q1「Pow」：要求递归调用的次数随 `exp` 按对数增长。利用 x²ʸ = (xʸ)² 和 x²ʸ⁺¹ = x·(xʸ)²。\n\n"
               "```scheme\n(define (square n) (* n n))\n\n(define (pow base exp)\n  (cond ((= exp 0) 1)\n        ((even? exp) ______)\n        (else (* base (pow base (- exp 1))))))\n```\n\n空白处应填写？",
               ["(square (pow base (/ exp 2)))", "(* base (pow base (- exp 1)))", "(pow (square base) exp)", "(* exp (pow base 2))"], 0, "指数为偶数时折半，递归层数因此与 log exp 成正比。"),
        scm("pow-value", HW7 + "Q1 的过程：", "", "(pow 2 10)", "1024", "2 的 10 次方。"),
        scm("cube", HW7 + "Q2「Repeatedly Cube」：`(repeatedly-cube n x)` 把 `x` 连续立方 `n` 次。", "", "(repeatedly-cube 2 2)", "512", "(2³)³ = 8³ = 512。"),
        text("cadr", HW7 + "Q3「Cadr and Caddr」。\n\n`cadr` 返回列表的第二个元素。只用 `car` 和 `cdr`，`(cadr s)` 应该写成什么？", ["(car (cdr s))"], "先用 cdr 去掉第一个元素，再用 car 取剩下部分的第一个。"),
    ],
    "lec27": [
        scm("car-cdr", "据讲义 3.2.3 节「复合值」。", "", "(car (cdr '(1 (2 3) 4)))", "(2 3)", "cdr 得到 ((2 3) 4)，它的第一个元素是列表 (2 3)。"),
        scm("cons", "据讲义 3.2.3 节「复合值」。", "", "(cons 1 (list 2 3))", "(1 2 3)", "cons 把 1 接在列表 (2 3) 的前面。"),
        scm("quote", "改编自官方讨论课 9「Scheme Lists & Quotation」的复习。", "", "(list 'a (+ 1 2))", "(a 3)", "引号让 a 保持为符号；(+ 1 2) 没有引号，会被求值成 3。"),
    ],
    "hw08": [
        scm("ascending", HW8 + "Q1「Ascending」：`ascending?` 判断数字列表是否不递减。", "", "(ascending? '(1 2 3 3 2))", "#f", "最后的 3 → 2 是下降。"),
        text("my-filter", HW8 + "Q2「My Filter」。补全 `my-filter` 的第二个分支：当第一个元素满足 `pred` 时，结果应该是什么？\n\n"
             "```scheme\n(define (my-filter pred s)\n  (cond ((null? s) '())\n        ((pred (car s)) ______)\n        (else (my-filter pred (cdr s)))))\n```", ["(cons (car s) (my-filter pred (cdr s)))"],
             "保留第一个元素，再接上对余下部分过滤的结果。"),
        scm("interleave", HW8 + "Q3「Interleave」：从第一个列表开始交替取元素，较短的列表取完后，把较长列表剩下的元素接在后面。", "", "(interleave '(7 8 9 10) '(11 12))", "(7 11 8 12 9 10)", "交替取到 12 之后，第二个列表取完了，再接上 9、10。"),
        scm("no-repeats", HW8 + "Q4「No Repeats」：`no-repeats` 返回去掉重复元素后的列表，每个元素只保留第一次出现的位置。", "", "(no-repeats '(5 4 5 4 2 2))", "(5 4 2)", "按第一次出现的顺序：5、4、2。"),
    ],
    "disc09": [
        scm("fit", "改编自官方讨论课 9 的 Q1「Perfect Fit」：`(fit total n)` 判断能否用 `n` 个**互不相同**的正完全平方数凑出 `total`。", "", "(fit 25 2)", "#t", "25 = 9 + 16，即 3² + 4²。"),
        scm("fit-2", "改编自官方讨论课 9 的 Q1「Perfect Fit」。", "", "(fit 9 3)", "#f", "1 + 4 + 4 用了两次 2²，不算；找不到三个互不相同的完全平方数之和为 9。"),
        choice("fit-or", "改编自官方讨论课 9 的 Q1「Perfect Fit」。辅助过程 `(f total n k)` 表示：能否用 `n` 个都不小于 `k*k` 的互不相同的完全平方数凑出 `total`。\n\n"
               "```scheme\n(define (f total n k)\n  (if (and (= n 0) (= total 0))\n      #t\n      (if (< total (* k k))\n          #f\n          ______)))\n```\n\n空白处应填写？",
               ["(or (f total n (+ k 1)) (f (- total (* k k)) (- n 1) (+ k 1)))", "(and (f total n (+ k 1)) (f (- total (* k k)) (- n 1) k))", "(f (- total k) (- n 1) k)", "(or (f total n k) (f total (- n 1) k))"], 0,
               "两种情况取「或」：不用 k²，或者用上 k²（于是总数减 k²、个数减 1）；两种情况下下一个候选都从 k + 1 开始，保证不重复。"),
    ],
    "lec28": [
        choice("calc-tokens", "据讲义 3.4.3 节「解析表达式」。\n\n计算器解析器把文本 `(+ 1 (* 2 3))` 切分成记号（token）的结果是？",
               ["`(`、`+`、`1`、`(`、`*`、`2`、`3`、`)`、`)`", "`+ 1`、`* 2 3`", "一个整数 7", "`(+ 1`、`(* 2 3))`"], 0, "词法分析只负责切分，括号、运算符、数字各是一个记号；之后的语法分析才把它们组织成树。", origin="review"),
        choice("calc-apply", "据讲义 3.4.4 节「计算器求值」。\n\n`calc_eval` 遇到调用表达式时，先做什么？",
               ["对每个运算数求值，再用 calc_apply 把运算符应用到这些值上", "直接返回表达式本身", "先对运算符求值两次", "调用 Python 的 eval"], 0, "这与 Python 调用表达式的求值规则一致。", origin="review"),
    ],
    "lab09": [
        choice("using-link", "改编自官方实验 9 的 Q1「Using Link」。\n\n计算器表达式 `(+ (- 2 4) 6 8)` 被表示成 `Link` 实例 `exp`。下面哪个表达式的值是 `'-'`？",
               ["`exp.rest.first.first`", "`exp.first`", "`exp.rest.first`", "`exp.rest.rest.first`"], 0,
               "exp.first 是 '+'；exp.rest.first 是子表达式 (- 2 4) 对应的 Link；它的 first 才是 '-'。"),
        choice("calc-define", "改编自官方实验 9 的 Q4「Saving Values」。\n\n给计算器加上 `define` 之后，`calc_eval(\"a\")` 要查到 `a` 的值。官方的写法是把名字和值存在一个全局字典 `bindings` 里。`(define a 1)` 应该做什么？",
               ["把 bindings['a'] 设为 1，并返回名字 'a'", "返回 1，不保存任何东西", "把 1 改名为 a", "报错，因为计算器不支持名字"], 0, "官方示例：calc_eval(Link(\"define\", Link(\"a\", Link(1, nil)))) 返回 'a'，之后 calc_eval(\"a\") 返回 1。"),
    ],
    "lec29": [
        choice("lookup", "据讲义 3.5.2 节「环境」。\n\nScheme 解释器求值一个符号时，在哪里找它的值？",
               ["从当前帧开始，沿父帧一层层往上找", "只在全局帧里找", "只在当前帧里找", "在调用者的帧里找"], 0, "和 Python 一样是词法作用域。", origin="review"),
        choice("lambda-frame", "据讲义 3.5.2 节「环境」。\n\n调用一个由 `lambda` 创建的过程时，新帧的父帧是？",
               ["这个过程被创建时所在的帧", "调用它的帧", "全局帧", "没有父帧"], 0, "过程记住了定义它时的环境。", origin="review"),
    ],
    "disc10": [
        choice("repr-expr", "改编自官方讨论课 10 的 Q1「Representing Expressions」。\n\nScheme 表达式 `(+ 1 (* 2 3))` 在 Python 实现的解释器里用 `Pair` 表示。它一共由几个 `Pair` 实例串成（最外层和嵌套的都算）？",
               ["6", "3", "2", "9"], 0, "最外层 (+ 1 (...)) 有三个元素，需要 3 个 Pair；内层 (* 2 3) 也有三个元素，需要 3 个 Pair。"),
    ],
    "lec30": [
        scm("eval-list", "改编自官方实验 10 的「Programs as Data」说明。", "(define expr (list '+ 2 2))", "(eval expr)", "4", "expr 是列表 (+ 2 2)，eval 把它当作程序求值。"),
        scm("add-program", "改编自官方实验 10 的「Programs as Data」说明。", "(define (add-program x y)\n  `(+ ,x ,y))", "(add-program 3 6)", "(+ 3 6)", "返回的是一个表达式（列表），并没有被求值。"),
    ],
    "lab10": [
        scm("qq-1", LAB10, "(define x 2)", "`(1 x 3)", "(1 x 3)", "准引用里没有逗号的部分不求值，x 仍然是符号。"),
        scm("qq-2", LAB10, "(define x 2)", "`(1 ,x 3)", "(1 2 3)", "逗号后面的 x 被求值成 2。"),
        scm("qq-3", LAB10, "(define x 2)", "`(1 (,x) 3)", "(1 (2) 3)", "嵌套的列表里也可以用逗号。"),
        scm("qq-4", LAB10, "(define x 2)\n(define y 3)", "`(x ,(* y x) y)", "(x 6 y)", "只有 (* y x) 被求值。"),
        scm("qq-5", LAB10, "(define x 2)\n(define y 3)", "`(1 ,(cons x (list y 4)) 5)", "(1 (2 3 4) 5)", "(cons 2 (list 3 4)) 得到 (2 3 4)。"),
    ],
    "lec31": [
        scm("mystery-1", "改编自官方讨论课 11 的 Q1「Mystery Macro」。", "(define-macro (mystery-macro expr old new)\n    (mystery-helper expr old new))\n(define (mystery-helper e o n)\n  (if (and (list? e) (not (null? e)))\n      (cons (mystery-helper (car e) o n) (mystery-helper (cdr e) o n))\n      (if (eq? e o) n e)))\n(define five 5)",
            "(mystery-macro (* x x) x (+ five 1))", "36", "宏先把表达式里所有的 x 换成 (+ five 1)，得到 (* (+ five 1) (+ five 1))，再求值得 36。"),
        choice("mystery-2", "改编自官方讨论课 11 的 Q1「Mystery Macro」。上一题的 `mystery-macro` 做的事情是？",
               ["把表达式 expr 中所有的符号 old 替换成 new，然后对替换后的表达式求值", "对 old 和 new 求值后比较大小", "删除表达式里的 old", "把 expr 原样返回，不求值"], 0, "宏操作的是没有求值的代码本身，这正是普通过程做不到的。"),
    ],
    "hw09": [
        scm("curry-cook", "改编自官方作业 9 的 Q1「Cooking Curry」：`curry-cook` 接收形参列表 `formals` 和带引号的函数体 `body`，生成一个柯里化的 lambda 表达式（一个列表）。", "",
            "(curry-cook '(x y) '(+ x y))", "(lambda (x) (lambda (y) (+ x y)))", "每个形参各包一层只接收一个参数的 lambda；返回的是程序（列表），并没有求值。"),
        text("curry-cook-fill", "改编自官方作业 9 的 Q1「Cooking Curry」。补全 `curry-cook` 的递归情况：\n\n```scheme\n(define (curry-cook formals body)\n    (if (null? formals)\n        body\n        ______))\n```",
             ["`(lambda (,(car formals)) ,(curry-cook (cdr formals) body))"], "用准引用拼出 lambda 表达式：第一个形参放进参数表，函数体是对余下形参递归生成的表达式。"),
        scm("curry-consume", "改编自官方作业 9 的 Q2「Consuming Curry」：`curry-consume` 把柯里化的过程依次应用到参数列表 `args` 上，参数可以比形参少。",
            "(define three-curry (lambda (x) (lambda (y) (lambda (z) (+ x (* y z))))))\n(define eat-two (curry-consume three-curry '(1 2)))", "(eat-two 3)", "7", "x = 1、y = 2 已经给定，再给 z = 3：1 + 2 × 3 = 7。"),
        scm("switch", "改编自官方作业 9 的 Q3「Switch to Cond」：`switch-to-cond` 把带引号的 switch 表达式转换成等价的 cond 表达式。", "",
            "(switch-to-cond `(switch (+ 1 1) ((1 2) (2 4))))", "(cond ((equal? (+ 1 1) 1) 2) ((equal? (+ 1 1) 2) 4))", "每个选项变成一个 cond 子句：判断 expr 是否等于这个值，等于就求对应的表达式。"),
    ],
    "disc11": [
        choice("assign", "改编自官方讨论课 11 的 Q2「Multiple Assignment」。宏返回的表达式在**调用宏的环境**里求值，所以宏可以返回 define 表达式。实现 `(assign sym1 sym2 expr1 expr2)`，要求在改变 `sym1` 之前先求出 `expr2` 的值（这样 `(assign x y y x)` 才能交换两个值）。\n\n下面哪个实现是正确的？",
               ["```scheme\n(define-macro (assign sym1 sym2 expr1 expr2)\n  `(begin\n     (define ,sym1 ,expr1)\n     (define ,sym2 ',(eval expr2))))\n```",
                "```scheme\n(define-macro (assign sym1 sym2 expr1 expr2)\n  `(begin\n     (define ,sym1 ,expr1)\n     (define ,sym2 ,expr2)))\n```",
                "```scheme\n(define (assign sym1 sym2 expr1 expr2)\n  (define sym1 expr1)\n  (define sym2 expr2))\n```"], 0,
               "第一种在宏展开时（sym1 还没改变）就用 eval 求出 expr2 的值，并加上引号放进 define。第二种在 sym1 改变之后才求 expr2，交换会失败。第三种是普通过程，define 只影响过程自己的局部帧。"),
    ],
}
