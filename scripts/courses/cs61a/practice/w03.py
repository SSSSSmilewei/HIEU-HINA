"""第 3–5 周：函数抽象、函数举例、Quest 复习、递归、树形递归、序列、容器。"""
from qhelp import choice, func, text, wwpd

LAB3L = "改编自官方实验 3 的 Q1「WWPD: Lists & Ranges」。"
LAB3C = "改编自官方实验 3 的 Q3「WWPD: List Comprehensions」。"

PRACTICE = {
    "lec06": [
        text("warm-up", "改编自官方讨论课 2 的 Q1「Warm Up」。\n\n执行 `result = (lambda x: 2 * (lambda x: 3)(4) * x)(5)` 之后，`result` 的值是多少？", ["30"],
             "内层的 (lambda x: 3)(4) 不管参数是什么都返回 3；外层用 x = 5 调用，得到 2 * 3 * 5 = 30。注意内层 lambda 的形参 x 只在它自己的帧里，不影响外层的 x。"),
        choice("hof-diagram", "改编自官方实验 2 的 Q6「HOF Diagram Practice」。建议先在纸上画出环境图，再选答案。\n\n```py\nn = 7\n\ndef f(x):\n    n = 8\n    return x + 1\n\ndef g(x):\n    n = 9\n    def h():\n        return x + 1\n    return h\n\ndef f(f, x):\n    return f(x + n)\n\nf = f(g, n)\ng = (lambda y: y())(f)\n```\n\n全部执行完之后，全局帧里 `g` 绑定的值是什么？",
               ["15", "16", "10", "一个函数"], 0,
               "第二个 def f 覆盖了第一个。f(g, n) 在调用时 n 取全局的 7，于是求 g(7 + 7) = g(14)，返回记住 x = 14 的 h，全局的 f 被重新绑定到这个 h。最后 (lambda y: y())(f) 调用 h()，得到 14 + 1 = 15。g 函数体里的 n = 9 只是局部名字，不影响全局的 n。"),
    ],
    "lab02": [
        func("composite-identity", "Composite Identity Function", "改编自官方实验 2 的 Q4。\n\n"
             "写函数 `composite_identity(f, g)`：`f`、`g` 都是单参数函数。返回一个单参数函数，它对参数 `x` 判断 `f(g(x))` 是否等于 `g(f(x))`，相等返回 `True`，否则返回 `False`。",
             '''
             def composite_identity(f, g):
                 """
                 Return a function with one parameter x that returns True if f(g(x)) is
                 equal to g(f(x)). You can assume the result of g(x) is a valid input for f
                 and vice versa.

                 >>> add_one = lambda x: x + 1        # adds one to x
                 >>> square = lambda x: x**2          # squares x [returns x^2]
                 >>> b1 = composite_identity(square, add_one)
                 >>> b1(0)                            # (0 + 1) ** 2 == 0 ** 2 + 1
                 True
                 >>> b1(4)                            # (4 + 1) ** 2 != 4 ** 2 + 1
                 False
                 """
             ''',
             '''
             def composite_identity(f, g):
                 return lambda x: f(g(x)) == g(f(x))
             ''',
             [("官方示例", ["composite_identity(lambda x: x ** 2, lambda x: x + 1)(0)", "composite_identity(lambda x: x ** 2, lambda x: x + 1)(4)"]),
              ("加法总能交换", ["composite_identity(lambda x: x + 3, lambda x: x + 5)(10)"])]),
        func("count-cond", "Count Cond", "改编自官方实验 2 的 Q5。\n\n"
             "`count_fives(n)` 数 1 到 `n` 中有多少个 `i` 使 `sum_digits(n * i)` 等于 5；`count_primes(n)` 数 1 到 `n` 中有多少个质数。两者的结构几乎一样。\n\n"
             "写一个更一般的高阶函数 `count_cond(condition)`：`condition(n, i)` 是返回真假的双参数函数。`count_cond` 返回一个单参数函数，它接收 `n`，数出 1 到 `n` 中满足 `condition(n, i)` 的 `i` 有多少个。起始代码里已经有 `sum_digits` 和 `is_prime`。",
             '''
             def sum_digits(y):
                 """Return the sum of the digits of non-negative integer y."""
                 total = 0
                 while y > 0:
                     total, y = total + y % 10, y // 10
                 return total

             def is_prime(n):
                 """Return whether positive integer n is prime."""
                 if n == 1:
                     return False
                 k = 2
                 while k < n:
                     if n % k == 0:
                         return False
                     k += 1
                 return True

             def count_cond(condition):
                 """Returns a function with one parameter N that counts all the numbers from
                 1 to n that satisfy the two-argument predicate function Condition.

                 >>> count_fives = count_cond(lambda n, i: sum_digits(n * i) == 5)
                 >>> count_fives(10)   # 50 (10 * 5)
                 1
                 """
             ''',
             '''
             def sum_digits(y):
                 total = 0
                 while y > 0:
                     total, y = total + y % 10, y // 10
                 return total

             def is_prime(n):
                 if n == 1:
                     return False
                 k = 2
                 while k < n:
                     if n % k == 0:
                         return False
                     k += 1
                 return True

             def count_cond(condition):
                 def counter(n):
                     i, count = 1, 0
                     while i <= n:
                         if condition(n, i):
                             count += 1
                         i += 1
                     return count
                 return counter
             ''',
             [("count_fives", ["count_cond(lambda n, i: sum_digits(n * i) == 5)(10)", "count_cond(lambda n, i: sum_digits(n * i) == 5)(50)"]),
              ("count_primes", ["count_cond(lambda n, i: is_prime(i))(2)", "count_cond(lambda n, i: is_prime(i))(5)", "count_cond(lambda n, i: is_prime(i))(20)"])]),
        func("multiple", "Multiple", "改编自官方实验 2 的 Q7（选做）。\n\n写函数 `multiple(a, b)`：`a`、`b` 都是正整数，返回同时是 `a` 和 `b` 的倍数的最小正整数。",
             '''
             def multiple(a, b):
                 """Return the smallest number n that is a multiple of both a and b.

                 >>> multiple(3, 4)
                 12
                 """
             ''',
             '''
             def multiple(a, b):
                 n = 1
                 while True:
                     if n % a == 0 and n % b == 0:
                         return n
                     n += 1
             ''',
             [("官方示例", ["multiple(3, 4)", "multiple(14, 21)"]), ("一个是另一个的倍数", ["multiple(5, 25)"]), ("互质", ["multiple(7, 9)"])]),
    ],
    "lec07": [
        func("cycle", "I Heard You Liked Functions...", "改编自官方实验 2 的 Q8（选做）。\n\n"
             "写函数 `cycle(f1, f2, f3)`：返回函数 `g`；`g(n)` 再返回函数 `h`；`h(x)` 依次循环地把 `f1`、`f2`、`f3`、`f1`、`f2`……作用在 `x` 上，一共作用 `n` 次。"
             "`n` 为 0 时返回 `x`；`n` 为 1 时返回 `f1(x)`；`n` 为 2 时返回 `f2(f1(x))`；`n` 为 4 时返回 `f1(f3(f2(f1(x))))`。",
             '''
             def cycle(f1, f2, f3):
                 """Returns a function that is itself a higher-order function.

                 >>> def add1(x):
                 ...     return x + 1
                 >>> def times2(x):
                 ...     return x * 2
                 >>> def add3(x):
                 ...     return x + 3
                 >>> my_cycle = cycle(add1, times2, add3)
                 >>> my_cycle(2)(1)
                 4
                 """
             ''',
             '''
             def cycle(f1, f2, f3):
                 def g(n):
                     def h(x):
                         i = 0
                         while i < n:
                             if i % 3 == 0:
                                 x = f1(x)
                             elif i % 3 == 1:
                                 x = f2(x)
                             else:
                                 x = f3(x)
                             i += 1
                         return x
                     return h
                 return g
             ''',
             [("官方示例", ["cycle(lambda x: x + 1, lambda x: x * 2, lambda x: x + 3)(0)(5)", "cycle(lambda x: x + 1, lambda x: x * 2, lambda x: x + 3)(2)(1)",
                         "cycle(lambda x: x + 1, lambda x: x * 2, lambda x: x + 3)(3)(2)", "cycle(lambda x: x + 1, lambda x: x * 2, lambda x: x + 3)(4)(2)",
                         "cycle(lambda x: x + 1, lambda x: x * 2, lambda x: x + 3)(6)(1)"])],
             hint="大部分工作在最内层的函数里完成。想想 `n % 3` 在 n 从 0 到 12 时的规律。"),
        choice("decorator", "下面的程序用到了讲义 1.6.9 节的装饰器。\n\n```py\ndef trace(fn):\n    def wrapped(x):\n        print('->', fn, '(', x, ')')\n        return fn(x)\n    return wrapped\n\n@trace\ndef triple(x):\n    return 3 * x\n```\n\n执行完这几行之后，名字 `triple` 绑定的是什么？",
               ["`trace(原来的 triple)` 返回的函数 `wrapped`", "原来的 `triple` 函数", "`trace` 函数本身", "数字 3"], 0,
               "装饰器语法等价于先定义 triple，再执行 triple = trace(triple)，所以名字 triple 绑定到 wrapped。", origin="review"),
    ],
    "disc02": [
        func("make-keeper", "Make Keeper", "改编自官方讨论课 2 的 Q2。\n\n"
             "实现 `make_keeper(n)`：返回一个函数 `f`，它接收一个单参数函数 `cond`；调用 `f(cond)` 时，从小到大打印 1 到 `n` 中所有使 `cond(i)` 为真的整数，每个一行。",
             '''
             def make_keeper(n):
                 """Returns a function that takes one parameter cond and prints
                 out all integers 1..i..n where calling cond(i) returns True.

                 >>> def is_even(x): # Even numbers have remainder 0 when divided by 2.
                 ...     return x % 2 == 0
                 >>> make_keeper(5)(is_even)
                 2
                 4
                 """
             ''',
             '''
             def make_keeper(n):
                 def f(cond):
                     i = 1
                     while i <= n:
                         if cond(i):
                             print(i)
                         i += 1
                 return f
             ''',
             [("偶数", ["make_keeper(5)(lambda x: x % 2 == 0)"]), ("全部", ["make_keeper(5)(lambda x: True)"]), ("一个都没有", ["make_keeper(5)(lambda x: False)"])]),
        func("match-k", "Match Maker", "改编自官方讨论课 2 的 Q4。\n\n"
             "实现 `match_k(k)`：返回一个函数，它接收整数 `x`，如果 `x` 中**所有相隔 `k` 位**的两个数字都相同，返回 `True`，否则返回 `False`。"
             "例如 1010 中相隔 2 位的数字是 1 与 1、0 与 0，所以 `match_k(2)(1010)` 为 `True`；2010 中 2 与 1 不同，所以 `match_k(2)(2010)` 为 `False`。不能使用字符串和下标。",
             '''
             def match_k(k):
                 """Returns a function that checks if digits k apart match.

                 >>> match_k(2)(1010)
                 True
                 >>> match_k(2)(2010)
                 False
                 """
             ''',
             '''
             def match_k(k):
                 def check(x):
                     while x // (10 ** k) > 0:
                         if (x % 10) != (x // (10 ** k)) % 10:
                             return False
                         x //= 10
                     return True
                 return check
             ''',
             [("官方示例", ["match_k(2)(1010)", "match_k(2)(2010)", "match_k(1)(1010)", "match_k(1)(1)", "match_k(1)(2111111111111111)", "match_k(3)(123123)", "match_k(2)(123123)"])],
             hint="每一轮比较最后一位和它前面第 `k` 位，然后去掉最后一位。整除 10 的若干次方可以去掉右边的几位。"),
        func("ramp", "Ups and Downs A", "改编自官方讨论课 2 的 Q5。\n\n"
             "在非负整数里，相邻两位数字如果左边小于右边，叫一次「上升」；左边大于右边，叫一次「下降」。例如 61127 有 2 次上升（1→2、2→7）和 1 次下降（6→1）。\n\n"
             "实现 `ramp(n)`：从左往右读 `n` 的各位，上升次数多于下降次数时返回 `True`，否则返回 `False`。可以使用起始代码里的 `sign` 函数。",
             '''
             def sign(x):
                 if x > 0:
                     return 1
                 elif x < 0:
                     return -1
                 else:
                     return 0

             def ramp(n):
                 """Return whether non-negative integer N has more increases than decreases.

                 >>> ramp(123)   # 2 increases (1-> 2, 2-> 3) and 0 decreases
                 True
                 """
             ''',
             '''
             def sign(x):
                 if x > 0:
                     return 1
                 elif x < 0:
                     return -1
                 else:
                     return 0

             def ramp(n):
                 n, last, tally = n // 10, n % 10, 0
                 while n:
                     n, last, tally = n // 10, n % 10, tally + sign(last - n % 10)
                 return tally > 0
             ''',
             [("官方示例", ["ramp(123)", "ramp(1315)", "ramp(176)", "ramp(5)"]), ("只有下降", ["ramp(9531)"])]),
        func("only", "Choose Wisely A", "改编自官方讨论课 2 的 Q7。\n\n"
             "「数字测试」是一个函数，接收 0 到 9 的整数，返回 `True` 或 `False`。实现 `only(n, t)`：返回一个非负整数，它按原来的顺序只保留 `n` 中使 `t` 返回 `True` 的那些数字；一个都不保留时返回 0。",
             '''
             def only(n, t):
                 """Return only the digits of n for which t returns True when called on each digit

                 >>> only(23344567, lambda d: d % 2 == 0)
                 2446
                 >>> only(2023, lambda d: False)
                 0
                 """
             ''',
             '''
             def only(n, t):
                 keep = 0
                 while n:
                     n, d = n // 10, n % 10
                     if t(d):
                         keep = keep * 10 + d
                 while keep:
                     n, keep = 10 * n + keep % 10, keep // 10
                 return n
             ''',
             [("官方示例", ["only(23344567, lambda d: d % 2 == 0)", "only(987654349675, lambda d: d < 7)", "only(2023, lambda d: False)"])]),
        func("every", "Choose Wisely B", "改编自官方讨论课 2 的 Q8。\n\n实现 `every(t)`：`t` 是数字测试。返回一个函数，它接收非负整数 `n`，当 `n` 的**每一位**都使 `t` 返回 `True` 时返回 `True`，否则返回 `False`。",
             '''
             def every(t):
                 """Return a function that returns whether t is True
                 for every digit of non-negative n.

                 >>> f = every(lambda d: d % 2 == 1)
                 >>> f(37511)  # every digit is odd
                 True
                 """
             ''',
             '''
             def every(t):
                 def digit(n):
                     while n:
                         if not t(n % 10):
                             return False
                         n = n // 10
                     return True
                 return digit
             ''',
             [("官方示例", ["every(lambda d: d % 2 == 1)(37511)", "every(lambda d: d % 2 == 1)(2023)"]), ("大于 3", ["every(lambda d: d > 3)(4567)", "every(lambda d: d > 3)(4537)"])]),
    ],
    "lec08": [
        func("repeating", "Repeating", "改编自官方讨论课 1 的 Q7（考试练习）。\n\n"
             "如果正整数 `n` 是把正整数 `m` 的各位重复写一次或多次得到的，就说 `n` 是 `m` 的重复序列。例如 616161 是 61 的重复序列，61616 不是。\n\n实现 `repeating(t, n)`：判断 `n` 是不是某个 `t` 位整数的重复序列。",
             '''
             def repeating(t, n):
                 """Return whether t digits repeat to form positive integer n.

                 >>> repeating(2, 6161)  # repeats 61 (2 digits)
                 True
                 >>> repeating(3, 6161)
                 False
                 """
             ''',
             '''
             def repeating(t, n):
                 if pow(10, t-1) > n:
                     return False
                 end = n % pow(10, t)
                 rest = n
                 while rest:
                     if rest % pow(10, t) != end:
                         return False
                     rest = rest // pow(10, t)
                 return True
             ''',
             [("官方示例", ["repeating(1, 6161)", "repeating(2, 6161)", "repeating(3, 6161)", "repeating(4, 6161)", "repeating(5, 6161)"]), ("一位重复", ["repeating(1, 7777)"])],
             hint="反复检查剩下部分的最后 `t` 位是否与 `n` 的最后 `t` 位相同，然后去掉这 `t` 位。"),
        func("ups", "Ups and Downs C", "改编自官方讨论课 2 的 Q6（考试风格）。\n\n"
             "下面的 `process` 用 `tally` 和 `result` 两个函数分析非负整数 `n` 中每一对相邻数字：每处理一对（从右往左），就用 `tally(左边数字, 右边数字)` 得到新的 `tally` 和 `result`；处理完后返回 `result()`。\n\n"
             "实现 `ups(k)`：返回两个函数，作为 `tally` 和 `result` 传给 `process` 后，`process` 能判断 `n` 是否**恰好**有 `k` 次上升（左边数字小于右边数字）。可以用 `sign`、`max`、`min`。",
             '''
             def sign(x):
                 if x > 0:
                     return 1
                 elif x < 0:
                     return -1
                 else:
                     return 0

             def process(n, tally, result):
                 """Process all pairs of adjacent digits in N using functions TALLY and RESULT."""
                 while n >= 10:
                     tally, result = tally(n % 100 // 10, n % 10)
                     n = n // 10
                 return result()

             def ups(k):
                 """Return tally and result functions that compute whether N has exactly K increases.

                 >>> f, g = ups(3)
                 >>> process(1200849, f, g)    # Exactly 3 increases: 1 -> 2, 0 -> 8, 4 -> 9
                 True
                 """
             ''',
             '''
             def sign(x):
                 if x > 0:
                     return 1
                 elif x < 0:
                     return -1
                 else:
                     return 0

             def process(n, tally, result):
                 while n >= 10:
                     tally, result = tally(n % 100 // 10, n % 10)
                     n = n // 10
                 return result()

             def ups(k):
                 def f(left, right):
                     return ups(min(k, k + sign(left - right)))
                 return f, lambda: k == 0
             ''',
             [("官方示例", ["process(1200849, *ups(3))", "process(94004, *ups(3))", "process(122333445, *ups(3))", "process(0, *ups(3))"]), ("一次上升", ["process(94004, *ups(1))"])],
             hint="每遇到一次上升，就把还需要的次数减一；用 `min` 保证次数不会再变大。"),
    ],
    "lec09": [
        func("skip-factorial", "Skip Factorial", "改编自官方讨论课 3 的 Q1。\n\n用递归实现 `skip_factorial(n)`：返回 n × (n − 2) × (n − 4) × … 直到最后一个正整数。",
             '''
             def skip_factorial(n):
                 """Return the product of positive integers n * (n - 2) * (n - 4) * ...

                 >>> skip_factorial(5) # 5 * 3 * 1
                 15
                 >>> skip_factorial(8) # 8 * 6 * 4 * 2
                 384
                 """
                 if ______:
                     return ______
                 else:
                     return n * skip_factorial(n - 2)
             ''',
             '''
             def skip_factorial(n):
                 if n <= 2:
                     return n
                 else:
                     return n * skip_factorial(n - 2)
             ''',
             [("官方示例", ["skip_factorial(5)", "skip_factorial(8)"]), ("1 和 2", ["skip_factorial(1)", "skip_factorial(2)"])],
             hint="想清楚递归在什么时候停下来：n 是 1 或 2 时，结果是什么？"),
        func("swipe", "Swipe", "改编自官方讨论课 3 的 Q2。\n\n实现 `swipe(n)`：每行打印 `n` 的一位数字，先从右往左打印，再从左往右打印，最左边的一位只打印一次。不能使用 `while`、`for` 和 `str`，请用递归。",
             '''
             def swipe(n):
                 """Print the digits of n, one per line, first backward then forward.

                 >>> swipe(2837)
                 7
                 3
                 8
                 2
                 8
                 3
                 7
                 """
             ''',
             '''
             def swipe(n):
                 if n < 10:
                     print(n)
                 else:
                     print(n % 10)
                     swipe(n // 10)
                     print(n % 10)
             ''',
             [("2837", ["swipe(2837)"]), ("一位", ["swipe(5)"]), ("两位", ["swipe(41)"])],
             hint="先打印最后一位，再对其余部分递归，最后再打印一次最后一位。"),
    ],
    "disc03": [
        func("is-prime-rec", "Is Prime（递归版）", "改编自官方讨论课 3 的 Q3。\n\n不用 `while` 和 `for`，用递归实现 `is_prime(n)`（`n` 大于 1）。需要在里面定义一个辅助函数，检查从 `i` 到 `n - 1` 的数是否都不能整除 `n`。",
             '''
             def is_prime(n):
                 """Returns True if n is a prime number and False otherwise.

                 >>> is_prime(2)
                 True
                 >>> is_prime(16)
                 False
                 """
                 def f(i):
                     if i == n:
                         return ____
                     elif ____:
                         return ____
                     else:
                         return f(____)
                 return f(2)
             ''',
             '''
             def is_prime(n):
                 def check_all(i):
                     if i == n:
                         return True
                     elif n % i == 0:
                         return False
                     return check_all(i + 1)
                 return check_all(2)
             ''',
             [("官方示例", ["is_prime(2)", "is_prime(16)", "is_prime(521)"]), ("平方数", ["is_prime(49)"])]),
        func("hailstone-rec", "Recursive Hailstone", "改编自官方讨论课 3 的 Q4。\n\n用递归重写冰雹序列：`hailstone(n)` 打印从 `n` 开始的冰雹序列（偶数除以 2，奇数乘 3 加 1，到 1 为止），并返回序列的长度。官方的写法是让 `hailstone`、`even`、`odd` 三个函数互相调用。",
             '''
             def hailstone(n):
                 """Print out the hailstone sequence starting at n,
                 and return the number of elements in the sequence.

                 >>> a = hailstone(10)
                 10
                 5
                 16
                 8
                 4
                 2
                 1
                 >>> a
                 7
                 """
                 print(n)
                 if n % 2 == 0:
                     return even(n)
                 else:
                     return odd(n)

             def even(n):
                 return ____

             def odd(n):
                 "*** YOUR CODE HERE ***"
             ''',
             '''
             def hailstone(n):
                 print(n)
                 if n % 2 == 0:
                     return even(n)
                 else:
                     return odd(n)

             def even(n):
                 return 1 + hailstone(n // 2)

             def odd(n):
                 if n == 1:
                     return 1
                 else:
                     return 1 + hailstone(3 * n + 1)
             ''',
             [("10", ["hailstone(10)"]), ("1", ["hailstone(1)"])]),
        func("sevens", "Sevens", "改编自官方讨论课 3 的 Q5。\n\n"
             "「七的游戏」：`k` 个人围成一圈，从 1 号开始按顺时针依次报数 1、2、3……；如果某个数能被 7 整除或者含有数字 7，报完这个数后方向反转。"
             "实现 `sevens(n, k)`：返回报出数字 `n` 的人的编号（顺时针从 1 编到 `k`）。用递归实现。",
             '''
             def sevens(n, k):
                 """Return the (clockwise) position of who says n among k players.

                 >>> sevens(2, 5)
                 2
                 >>> sevens(9, 5)
                 5
                 """
             ''',
             '''
             def has_seven(n):
                 if n == 0:
                     return False
                 elif n % 10 == 7:
                     return True
                 else:
                     return has_seven(n // 10)

             def sevens(n, k):
                 def f(i, who, direction):
                     if i == n:
                         return who
                     if i % 7 == 0 or has_seven(i):
                         direction = -direction
                     who = who + direction
                     if who > k:
                         who = 1
                     if who < 1:
                         who = k
                     return f(i + 1, who, direction)
                 return f(1, 1, 1)
             ''',
             [("官方示例", ["sevens(2, 5)", "sevens(6, 5)", "sevens(7, 5)", "sevens(8, 5)", "sevens(9, 5)", "sevens(18, 5)"]), ("更多", ["sevens(30, 4)"])],
             hint="递归函数需要记住三件事：当前报到的数、轮到谁、现在的方向。"),
    ],
    "hw03": [
        func("num-eights", "Num Eights", "改编自官方作业 3 的 Q1。\n\n用递归实现 `num_eights(num)`：返回正整数 `num` 中数字 8 出现的次数。**不能使用赋值语句和循环**。",
             '''
             def num_eights(num):
                 """Returns the number of times 8 appears as a digit of num.

                 >>> num_eights(8782089)
                 3
                 """
             ''',
             '''
             def num_eights(num):
                 if num % 10 == 8:
                     return 1 + num_eights(num // 10)
                 elif num < 10:
                     return 0
                 else:
                     return num_eights(num // 10)
             ''',
             [("官方示例", ["num_eights(3)", "num_eights(8)", "num_eights(88888888)", "num_eights(2638)", "num_eights(86380)", "num_eights(12345)", "num_eights(8782089)"])]),
        func("digit-distance", "Digit Distance", "改编自官方作业 3 的 Q2。\n\n"
             "一个整数的「数字距离」是相邻两位数字之差的绝对值之和。例如 71253 的数字距离是 |7−1| + |1−2| + |2−5| + |5−3| = 12；一位数的数字距离是 0。用递归实现 `digit_distance(num)`，不能使用循环。",
             '''
             def digit_distance(num):
                 """Determines the digit distance of num.

                 >>> digit_distance(314) # 2 + 3
                 5
                 """
             ''',
             '''
             def digit_distance(num):
                 if num < 10:
                     return 0
                 return abs(num % 10 - (num // 10) % 10) + digit_distance(num // 10)
             ''',
             [("官方示例", ["digit_distance(3)", "digit_distance(777)", "digit_distance(314)", "digit_distance(31415926535)", "digit_distance(3464660003)"])]),
        func("interleaved-sum", "Interleaved Sum", "改编自官方作业 3 的 Q3。\n\n"
             "实现 `interleaved_sum(num, f_odd, f_even)`：返回从 1 到 `num` 中，对奇数作用 `f_odd`、对偶数作用 `f_even` 后的总和。例如 `interleaved_sum(5, lambda x: x, lambda x: x * x)` 是 1 + 2×2 + 3 + 4×4 + 5 = 29。"
             "**不能使用循环，也不能用 `%` 判断奇偶**——从 1 开始，相邻的数奇偶交替。",
             '''
             def interleaved_sum(num, f_odd, f_even):
                 """Compute the sum f_odd(1) + f_even(2) + f_odd(3) + ..., up
                 to num.

                 >>> interleaved_sum(5, lambda x: x, lambda x: x * x)
                 29
                 """
             ''',
             '''
             def interleaved_sum(num, f_odd, f_even):
                 def sum_from(k):
                     if k > num:
                         return 0
                     elif k == num:
                         return f_odd(k)
                     else:
                         return f_odd(k) + f_even(k+1) + sum_from(k + 2)
                 return sum_from(1)
             ''',
             [("官方示例", ["interleaved_sum(5, lambda x: x, lambda x: x * x)", "interleaved_sum(5, lambda x: x * x, lambda x: x)", "interleaved_sum(4, lambda x: x * 3, lambda x: x * x)", "interleaved_sum(4, lambda x: x * x, lambda x: x * 3)"]),
              ("1", ["interleaved_sum(1, lambda x: 100, lambda x: 0)"])]),
        func("count-dollars", "Count Dollars", "改编自官方作业 3 的 Q4。\n\n"
             "美元纸币有 1、5、10、20、50、100 六种面值。实现 `count_dollars(sum_needed)`：返回用这些纸币凑出 `sum_needed` 美元一共有多少种方法（只看每种面值用几张）。例如 15 有 6 种凑法。"
             "起始代码里的 `next_smaller_dollar(bill)` 返回比 `bill` 小一档的面值，1 美元再往下返回 `None`。不能使用循环。",
             '''
             def next_smaller_dollar(bill):
                 """Returns the next smaller bill in order."""
                 if bill == 100:
                     return 50
                 if bill == 50:
                     return 20
                 if bill == 20:
                     return 10
                 elif bill == 10:
                     return 5
                 elif bill == 5:
                     return 1

             def count_dollars(sum_needed):
                 """Return the number of ways to make change.

                 >>> count_dollars(15)  # 15 $1 bills, 10 $1 & 1 $5 bills, ... 1 $5 & 1 $10 bills
                 6
                 """
             ''',
             '''
             def next_smaller_dollar(bill):
                 if bill == 100:
                     return 50
                 if bill == 50:
                     return 20
                 if bill == 20:
                     return 10
                 elif bill == 10:
                     return 5
                 elif bill == 5:
                     return 1

             def count_dollars(sum_needed):
                 def constrained_count(sum_needed, largest_bill):
                     if sum_needed == 0:
                         return 1
                     if sum_needed < 0:
                         return 0
                     if largest_bill == None:
                         return 0
                     without_dollar_bill = constrained_count(sum_needed, next_smaller_dollar(largest_bill))
                     with_dollar_bill = constrained_count(sum_needed - largest_bill, largest_bill)
                     return without_dollar_bill + with_dollar_bill
                 return constrained_count(sum_needed, 100)
             ''',
             [("官方示例", ["count_dollars(15)", "count_dollars(10)", "count_dollars(20)", "count_dollars(45)", "count_dollars(100)"])],
             hint="和讲义里的整数划分一样：要么至少用一张当前最大的面值，要么完全不用它。"),
        func("knapsack", "Knapsack", "改编自官方作业 3 的 Q6。\n\n"
             "你有一个最多能装 `c` 磅的背包，面前有若干件物品，第 `i` 件重 `weights[i]` 磅、价值 `values[i]`。实现 `knapsack(weights, values, c)`：返回能装走的物品的最大总价值。",
             '''
             def knapsack(weights, values, c):
                 """
                 >>> w = [2, 6, 3, 3]
                 >>> v = [1, 5, 3, 3]
                 >>> knapsack(w, v, 6)
                 6
                 """
             ''',
             '''
             def knapsack(weights, values, c):
                 if weights == []:
                     return 0
                 first_weight, rest_weights = weights[0], weights[1:]
                 first_value, rest_values = values[0], values[1:]
                 without_first = knapsack(rest_weights, rest_values, c)
                 if first_weight <= c:
                     with_first = first_value + knapsack(rest_weights, rest_values, c - first_weight)
                     return max(with_first, without_first)
                 return without_first
             ''',
             [("官方示例", ["knapsack([2, 6, 3, 3], [1, 5, 3, 3], 6)"]), ("装不下", ["knapsack([5, 7], [10, 20], 4)"]), ("更多", ["knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7)"])],
             hint="对第一件物品分两种情况：放进去，或者不放。"),
        func("move-stack", "Towers of Hanoi", "改编自官方作业 3 的 Q7。\n\n"
             "汉诺塔：三根柱子编号 1、2、3，`start` 柱上有 `num` 个从小到大叠好的圆盘，要全部移到 `end` 柱上；每次只能移动一个最上面的圆盘，大盘不能压在小盘上。"
             "实现 `move_stack(num, start, end)`，用起始代码里的 `print_move` 打印每一步移动。",
             '''
             def print_move(origin, destination):
                 """Print instructions to move a disk."""
                 print("Move the top disk from rod", origin, "to rod", destination)

             def move_stack(num, start, end):
                 """Print the moves required to move num disks on the start pole to the end
                 pole without violating the rules of Towers of Hanoi.

                 >>> move_stack(2, 1, 3)
                 Move the top disk from rod 1 to rod 2
                 Move the top disk from rod 1 to rod 3
                 Move the top disk from rod 2 to rod 3
                 """
                 assert 1 <= start <= 3 and 1 <= end <= 3 and start != end, "Bad start/end"
             ''',
             '''
             def print_move(origin, destination):
                 print("Move the top disk from rod", origin, "to rod", destination)

             def move_stack(num, start, end):
                 if num == 1:
                     print_move(start, end)
                 else:
                     other = 6 - start - end
                     move_stack(num-1, start, other)
                     print_move(start, end)
                     move_stack(num-1, other, end)
             ''',
             [("1 个", ["move_stack(1, 1, 3)"]), ("2 个", ["move_stack(2, 1, 3)"]), ("3 个", ["move_stack(3, 1, 3)"]), ("换柱子", ["move_stack(2, 3, 1)"])],
             hint="三根柱子编号之和是 6，所以第三根柱子是 `6 - start - end`。"),
        func("anonymous-factorial", "Anonymous Factorial（选做）", "改编自官方作业 3 的 Q8。\n\n"
             "阶乘可以写成 `fact = lambda n: 1 if n == 1 else mul(n, fact(sub(n, 1)))`，但这依赖名字 `fact`。实现 `make_anonymous_factorial()`：只用一个表达式返回一个计算阶乘的函数，**不能有赋值语句、`def` 语句，也不能通过名字递归**。",
             '''
             from operator import sub, mul

             def make_anonymous_factorial():
                 """Return the value of an expression that computes factorial.

                 >>> make_anonymous_factorial()(5)
                 120
                 """
                 return 'YOUR_EXPRESSION_HERE'
             ''',
             '''
             from operator import sub, mul

             def make_anonymous_factorial():
                 return (lambda f: lambda k: f(f, k))(lambda f, k: k if k == 1 else mul(k, f(f, sub(k, 1))))
             ''',
             [("5 的阶乘", ["make_anonymous_factorial()(5)"]), ("1 和 7", ["make_anonymous_factorial()(1)", "make_anonymous_factorial()(7)"])],
             hint="把「自己」当作参数传给自己。"),
    ],
    "lec11": [
        wwpd("list-1", ">>> s = [7//3, 5, [4, 0, 1], 2]", "s[0]", "2", "7 // 3 的值是 2。", LAB3L),
        wwpd("list-2", ">>> s = [7//3, 5, [4, 0, 1], 2]", "s[-1]", "2", "负下标从末尾数，-1 是最后一个元素。", LAB3L),
        wwpd("list-3", ">>> s = [7//3, 5, [4, 0, 1], 2]", "4 in s", "False", "s 的元素是 2、5、[4, 0, 1]、2；4 在嵌套的列表里，不是 s 本身的元素。", LAB3L),
        wwpd("list-4", ">>> s = [7//3, 5, [4, 0, 1], 2]", "s[2] + [3 + 2]", "[4, 0, 1, 5]", "两个列表相加得到一个新列表。", LAB3L),
        wwpd("list-5", ">>> s = [7//3, 5, [4, 0, 1], 2]", "s[2] * 2", "[4, 0, 1, 4, 0, 1]", "列表乘以整数表示重复。", LAB3L),
        wwpd("range-1", "", "list(range(3, 6))", "[3, 4, 5]", "range(3, 6) 包含 3，不包含 6。", LAB3L),
        wwpd("range-2", "", "range(4)[-1]", "3", "range(4) 是 0、1、2、3，最后一个是 3。", LAB3L),
    ],
    "lec12": [
        wwpd("comp-1", "", "[2 * x for x in range(4)]", "[0, 2, 4, 6]", "对 0、1、2、3 分别乘 2。", LAB3C),
        wwpd("comp-2", "", "[y for y in [6, 1, 6, 1] if y > 2]", "[6, 6]", "if 子句只保留大于 2 的元素。", LAB3C),
        wwpd("comp-3", "", "[[1] + s for s in [[4], [5, 6]]]", "[[1, 4], [1, 5, 6]]", "对每个列表 s，在它前面接上 [1]。", LAB3C),
        wwpd("comp-4", "", "[z + 1 for z in range(10) if z % 3 == 0]", "[1, 4, 7, 10]", "0 到 9 中能被 3 整除的是 0、3、6、9，各加 1。", LAB3C),
    ],
    "lab03": [
        func("close", "Close", "改编自官方实验 3 的 Q2。\n\n"
             "实现 `close(s, k)`：`s` 是整数列表，`k` 是非负整数。返回 `s` 中有多少个元素与它自己的下标相差不超过 `k`（即元素与下标之差的绝对值小于等于 `k`）。下标从 0 开始。",
             '''
             def close(s, k):
                 """Return how many elements of s are within k of their index.

                 >>> t = [6, 2, 4, 3, 5]
                 >>> close(t, 0)  # Only 3 is equal to its index
                 1
                 >>> close(t, 1)  # 2, 3, and 5 are within 1 of their index
                 3
                 """
                 count = 0
                 for i in ___________:  # Use a range to loop over indices
                     "*** YOUR CODE HERE ***"
                 return count
             ''',
             '''
             def close(s, k):
                 count = 0
                 for i in range(len(s)):
                     if abs(i - s[i]) <= k:
                         count += 1
                 return count
             ''',
             [("官方示例", ["close([6, 2, 4, 3, 5], 0)", "close([6, 2, 4, 3, 5], 1)", "close([6, 2, 4, 3, 5], 2)", "close(list(range(10)), 0)"]), ("空列表", ["close([], 3)"])]),
        func("close-list", "Close List", "改编自官方实验 3 的 Q4。\n\n实现 `close_list(s, k)`：返回一个列表，按原顺序列出 `s` 中与自己下标相差不超过 `k` 的元素。请用一个列表推导式写成一行。",
             '''
             def close_list(s, k):
                 """Return a list of the elements of s that are within k of their index.

                 >>> t = [6, 2, 4, 3, 5]
                 >>> close_list(t, 0)  # Only 3 is equal to its index
                 [3]
                 """
                 return [___ for i in ___ if ___]
             ''',
             '''
             def close_list(s, k):
                 return [s[i] for i in range(len(s)) if abs(i - s[i]) <= k]
             ''',
             [("官方示例", ["close_list([6, 2, 4, 3, 5], 0)", "close_list([6, 2, 4, 3, 5], 1)", "close_list([6, 2, 4, 3, 5], 2)"])]),
        func("double-eights-rec", "Double Eights（递归版）", "改编自官方实验 3 的 Q5。\n\n用递归实现 `double_eights(n)`：判断正整数 `n` 中是否有两个相邻的 8。**不能使用循环、`in` 运算符和 `str` 函数**。",
             '''
             def double_eights(n):
                 """Returns whether or not n has two digits in row that
                 are the number 8.

                 >>> double_eights(1288)
                 True
                 >>> double_eights(78)
                 False
                 """
             ''',
             '''
             def double_eights(n):
                 last, second_last = n % 10, n // 10 % 10
                 if last == 8 and second_last == 8:
                     return True
                 elif n < 100:
                     return False
                 return double_eights(n // 10)
             ''',
             [("官方示例", ["double_eights(1288)", "double_eights(880)", "double_eights(538835)", "double_eights(284682)", "double_eights(588138)", "double_eights(78)"])],
             hint="n 有相邻的 8，要么是最后两位都是 8，要么去掉最后一位之后仍然有相邻的 8。"),
        func("make-onion", "Making Onions", "改编自官方实验 3 的 Q6。\n\n"
             "实现 `make_onion(f, g)`：`f`、`g` 是单参数函数。返回函数 `can_reach(x, y, limit)`：如果最多调用 `limit` 次 `f` 和 `g`（任意组合）能从 `x` 得到 `y`，返回 `True`，否则返回 `False`。"
             "例如 `f` 加一、`g` 乘二时，从 5 调用四次 `f(g(g(f(5))))` 可以得到 25。",
             '''
             def make_onion(f, g):
                 """Return a function can_reach(x, y, limit) that returns
                 whether some call expression containing only f, g, and x with
                 up to limit calls will give the result y.

                 >>> up = lambda x: x + 1
                 >>> double = lambda y: y * 2
                 >>> can_reach = make_onion(up, double)
                 >>> can_reach(5, 25, 4)      # 25 = up(double(double(up(5))))
                 True
                 """
                 def can_reach(x, y, limit):
                     if limit < 0:
                         return ____
                     elif x == y:
                         return ____
                     else:
                         return can_reach(____, ____, limit - 1) or can_reach(____, ____, limit - 1)
                 return can_reach
             ''',
             '''
             def make_onion(f, g):
                 def can_reach(x, y, limit):
                     if limit < 0:
                         return False
                     elif x == y:
                         return True
                     else:
                         return can_reach(f(x), y, limit - 1) or can_reach(g(x), y, limit - 1)
                 return can_reach
             ''',
             [("数字", ["make_onion(lambda x: x + 1, lambda y: y * 2)(5, 25, 4)", "make_onion(lambda x: x + 1, lambda y: y * 2)(5, 25, 3)", "make_onion(lambda x: x + 1, lambda y: y * 2)(1, 1, 0)"]),
              ("字符串", ["make_onion(lambda x: x + 'ing', lambda y: y + 'end')('cry', 'crying', 1)", "make_onion(lambda x: x + 'ing', lambda y: y + 'end')('un', 'unending', 3)", "make_onion(lambda x: x + 'ing', lambda y: y + 'end')('peach', 'folding', 4)"])]),
        func("ten-pairs", "Ten-Pairs（选做）", "改编自官方实验 3 的 Q8。\n\n"
             "如果正整数 `n` 中有两位数字之和为 10，就叫一个「十对」。例如 7823952 有 3 个十对：7+3、8+2、8+2。一个数字可以属于多个十对，但单独一个 5 不能和自己组成十对。"
             "用递归实现 `ten_pairs(n)`，不能使用循环。建议先实现辅助函数 `count_digit(n, digit)`，返回 `digit` 在 `n` 中出现的次数。",
             '''
             def ten_pairs(n):
                 """Return the number of ten-pairs within positive integer n.

                 >>> ten_pairs(7823952) # 7+3, 8+2, and 8+2
                 3
                 """

             def count_digit(n, digit):
                 """Return how many times digit appears in n.

                 >>> count_digit(55055, 5) # digit 5 appears 4 times in 55055
                 4
                 """
             ''',
             '''
             def ten_pairs(n):
                 if n < 10:
                     return 0
                 return ten_pairs(n // 10) + count_digit(n // 10, 10 - n % 10)

             def count_digit(n, digit):
                 if n == 0:
                     return 0
                 if n % 10 == digit:
                     return count_digit(n // 10, digit) + 1
                 return count_digit(n // 10, digit)
             ''',
             [("官方示例", ["ten_pairs(7823952)", "ten_pairs(55055)", "ten_pairs(9641469)"]), ("count_digit", ["count_digit(55055, 5)"])]),
    ],
}
