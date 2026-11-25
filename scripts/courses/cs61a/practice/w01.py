"""第 1–2 周：欢迎、函数、控制、高阶函数、环境。"""
from qhelp import choice, func, text, wwpd

LAB0 = "改编自官方实验 0「What Would Python Do?」。"
LAB1 = "改编自官方实验 1 的 Q1「Return and Print」。"
LAB1IF = "改编自官方实验 1 的 Q6「WWPD: What If?」。"
LAB2SC = "改编自官方实验 2 的 Q1「WWPD: The Truth Will Prevail」。"
LAB2HOF = "改编自官方实验 2 的 Q2「WWPD: Higher-Order Functions」。"
LAB2L = "改编自官方实验 2 的 Q3「WWPD: Lambda」。"

PRACTICE = {
    "lec01": [
        wwpd("basics-1", ">>> x = 20", "x + 2", "22", "名字 x 绑定到 20，表达式 x + 2 的值是 22。", LAB0),
        wwpd("basics-2", ">>> x = 20\n>>> x + 2\n22", "x", "20", "求表达式 x + 2 的值不会改变 x 的绑定，x 仍然是 20。", LAB0),
        wwpd("basics-3", ">>> y = 5\n>>> y = y + 3", "y * 2", "16", "y = y + 3 先算右边的 5 + 3，再把 y 重新绑定到 8，所以 y * 2 是 16。", LAB0),
        wwpd("basics-4", ">>> x = 20\n>>> y = 5\n>>> y = y + 3", "y + x", "28", "此时 y 是 8，x 是 20。", LAB0),
    ],
    "lab00": [
        func("twenty-twenty-six", "2026", "改编自官方实验 0 的「Implementing Functions」。\n\n"
             "函数 `twenty_twenty_six` 的函数体只有一条 `return` 语句。把它补完整，让函数返回 2026。试试看你能写出多有创意的表达式（例如只用一些运算符和小数字拼出 2026）。",
             '''
             def twenty_twenty_six():
                 """Come up with the most creative expression that evaluates to 2026
                 using only numbers and the +, *, and - operations.
                 """
                 return ______
             ''',
             '''
             def twenty_twenty_six():
                 return 2000 + 26
             ''',
             [("返回 2026", ["twenty_twenty_six()"])]),
        choice("ok-unlock", "官方的测试程序叫 `ok`。在终端里输入 `python3 ok -q python-basics -u` 时，`-q python-basics` 和 `-u` 分别表示什么？\n\n（改编自官方实验 0 的说明。）",
               ["`-q` 指定要测试的题目，`-u` 表示「解锁」：回答「Python 会显示什么」的问题",
                "`-q` 表示安静模式，`-u` 表示上传作业",
                "`-q` 表示退出，`-u` 表示更新 ok 程序",
                "两个都是 Python 解释器自己的选项"], 0,
               "`-q` 后面跟题目名称；`-u`（unlock）让你逐个回答解释器会显示什么，答对才能继续。自学者在本地运行时还要加上 `--local`。"),
    ],
    "lec02": [
        wwpd("div-1", "", "25 / 4", "6.25", "/ 是真除法，结果总是浮点数。", "改编自官方实验 1 的「Division, Floor Div, and Modulo」。"),
        wwpd("div-2", "", "25 // 4", "6", "// 是向下取整的整除。", "改编自官方实验 1 的「Division, Floor Div, and Modulo」。"),
        wwpd("div-3", "", "4 / 2", "2.0", "真除法的结果是浮点数，所以是 2.0 而不是 2。", "改编自官方实验 1 的「Division, Floor Div, and Modulo」。"),
        wwpd("div-4", "", "5 % 0", "Error", "对 0 取余会引发 ZeroDivisionError。", "改编自官方实验 1 的「Division, Floor Div, and Modulo」。"),
        wwpd("return-print-1", ">>> def welcome():\n...     print('Go')\n...     return 'hello'\n...\n>>> def cal():\n...     print('Bears')\n...     return 'world'\n...\n>>> welcome()\nGo\n'hello'",
             "cal()", ["Bears 'world'"], "调用 cal() 先执行 print，显示 Bears（不带引号）；返回值是字符串 'world'，交互式解释器显示它时带引号。两行输出请用一个空格隔开填写。", LAB1),
        choice("return-print-2", f"{LAB1}\n\n```py\n>>> def welcome():\n...     print('Go')\n...     return 'hello'\n...\n>>> def cal():\n...     print('Bears')\n...     return 'world'\n...\n>>> print(welcome(), cal())\n```\n\n最后一行会显示什么？",
               ["Go\nBears\nhello world", "hello world", "Go\nBears\n'hello' 'world'", "Go hello\nBears world"], 0,
               "调用表达式先求运算数：welcome() 打印 Go 并返回 'hello'，cal() 打印 Bears 并返回 'world'；最后 print 把两个字符串用空格隔开显示，print 显示字符串时不带引号。"),
    ],
    "hw01": [
        func("a-plus-abs-b", "A Plus Abs B", "改编自官方作业 1 的 Q1。\n\n"
             "`operator` 模块里有 `add`、`sub` 等双参数函数，例如 `add(2, 3)` 的值是 5。补全下面函数里的两个空，让它返回 `a` 加上 `b` 的绝对值，**不能调用 `abs`**，也不要改动其他代码。",
             '''
             from operator import add, sub

             def a_plus_abs_b(a, b):
                 """Return a+abs(b), but without calling abs.

                 >>> a_plus_abs_b(2, 3)
                 5
                 >>> a_plus_abs_b(2, -3)
                 5
                 """
                 if b < 0:
                     f = _____
                 else:
                     f = _____
                 return f(a, b)
             ''',
             '''
             from operator import add, sub

             def a_plus_abs_b(a, b):
                 if b < 0:
                     f = sub
                 else:
                     f = add
                 return f(a, b)
             ''',
             [("官方示例", ["a_plus_abs_b(2, 3)", "a_plus_abs_b(2, -3)"]), ("a 为负数", ["a_plus_abs_b(-1, 4)", "a_plus_abs_b(-1, -4)"]), ("b 为 0", ["a_plus_abs_b(7, 0)"])],
             explain="b 是正数就把两个数相加，是负数就相减：a - b 正好等于 a + |b|。"),
        func("two-of-three", "Two of Three", "改编自官方作业 1 的 Q2。\n\n"
             "写函数 `two_of_three(i, j, k)`：三个参数都是正数，返回其中**最小的两个数的平方和**。官方要求函数体只写一行。",
             '''
             def two_of_three(i, j, k):
                 """Return m*m + n*n, where m and n are the two smallest members of the
                 positive numbers i, j, and k.

                 >>> two_of_three(1, 2, 3)
                 5
                 >>> two_of_three(5, 3, 1)
                 10
                 """
                 return _____
             ''',
             '''
             def two_of_three(i, j, k):
                 return min(i*i+j*j, i*i+k*k, j*j+k*k)
             ''',
             [("官方示例", ["two_of_three(1, 2, 3)", "two_of_three(5, 3, 1)"]), ("顺序打乱", ["two_of_three(10, 2, 8)"]), ("三个相等", ["two_of_three(5, 5, 5)"])],
             hint="想想 `min` 和 `max`：如果 x > y > 0，那么 x 的平方也大于 y 的平方。"),
        func("largest-factor", "Largest Factor", "改编自官方作业 1 的 Q3。\n\n"
             "写函数 `largest_factor(n)`：`n` 是大于 1 的整数，返回小于 `n` 且能整除 `n` 的最大整数。",
             '''
             def largest_factor(n):
                 """Return the largest factor of n that is smaller than n.

                 >>> largest_factor(15) # factors are 1, 3, 5
                 5
                 """
             ''',
             '''
             def largest_factor(n):
                 factor = n - 1
                 while factor > 0:
                     if n % factor == 0:
                         return factor
                     factor -= 1
             ''',
             [("15", ["largest_factor(15)"]), ("80", ["largest_factor(80)"]), ("质数", ["largest_factor(13)"]), ("2", ["largest_factor(2)"])],
             hint="判断 b 能否整除 a，用 `a % b == 0`。"),
        func("hailstone", "Hailstone（冰雹序列）", "改编自官方作业 1 的 Q4。\n\n"
             "从正整数 `n` 开始：`n` 是偶数就除以 2，是奇数就乘 3 再加 1，直到 `n` 变成 1。写函数 `hailstone(n)`，**依次打印**这个序列中的每个数（包括开头的 `n` 和最后的 1），并**返回**序列一共有多少个数。",
             '''
             def hailstone(n):
                 """Print the hailstone sequence starting at n and return its
                 length.

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
             ''',
             '''
             def hailstone(n):
                 length = 1
                 while n != 1:
                     print(n)
                     if n % 2 == 0:
                         n = n // 2
                     else:
                         n = 3 * n + 1
                     length += 1
                 print(n)
                 return length
             ''',
             [("10", ["hailstone(10)"]), ("1", ["hailstone(1)"]), ("7", ["hailstone(7)"])],
             hint="除以 2 要用 `//`，否则会得到 5.0 这样的浮点数。"),
    ],
    "lec03": [
        wwpd("if-1", ">>> def ab(c, d):\n...     if c > 5:\n...         print(c)\n...     elif c > 7:\n...         print(d)\n...     print('foo')", "ab(10, 20)", ["10 foo"],
             "c > 5 成立，打印 10；elif 分支不再检查；最后打印 foo。函数没有 return，返回 None，不显示。两行输出请用一个空格隔开填写。", LAB1IF),
        wwpd("if-2", ">>> def bake(cake, make):\n...     if cake == 0:\n...         cake = cake + 1\n...         print(cake)\n...     if cake == 1:\n...         print(make)\n...     else:\n...         return cake\n...     return make",
             "bake(1, \"mashed potatoes\")", ["mashed potatoes 'mashed potatoes'"],
             "cake 是 1，第一个 if 不执行；第二个 if 成立，打印 mashed potatoes（不带引号）；最后返回 make，交互式解释器显示带引号的字符串。两行输出请用一个空格隔开填写。", LAB1IF),
        wwpd("sc-1", "", "True and 13", "13", "and 的两边都是真值时，返回最后一个值。", LAB2SC),
        wwpd("sc-2", "", "False or 0", "0", "or 从左往右找第一个真值；都是假值时返回最后一个值 0。", LAB2SC),
        wwpd("sc-3", "", "True and 1 / 0", "Error", "左边是真值，and 必须继续求右边，于是发生 ZeroDivisionError。", LAB2SC),
        wwpd("sc-4", "", "True or 1 / 0", "True", "or 遇到第一个真值就停止（短路），右边不会被求值。", LAB2SC),
        wwpd("sc-5", "", "-1 or 5", "-1", "-1 不是 0，是真值，or 直接返回它。", LAB2SC),
        wwpd("sc-6", ">>> def f(x):\n...     if x == 0:\n...         return \"zero\"\n...     elif x > 0:\n...         return \"positive\"\n...     else:\n...         return \"\"", "f(0) and f(-1)", ["''"],
             "f(0) 返回 'zero'，是真值，and 继续求 f(-1)，得到空字符串 ''（假值），这就是结果。", LAB2SC),
    ],
    "lab01": [
        func("digit", "Pick a Digit", "改编自官方实验 1 的 Q3。\n\n"
             "实现 `digit(n, k)`：`n`、`k` 都是正整数（`k` 可以是 0），返回 `n` 从右往左数第 `k` 位上的数字（最右边一位是第 0 位）；如果没有这一位，返回 0。函数体只能有一条 `return` 语句。",
             '''
             def digit(n, k):
                 """Return the k-th digit from the right of n for positive integers n and k.

                 >>> digit(3579, 2)
                 5
                 >>> digit(3579, 0)
                 9
                 >>> digit(3579, 10)
                 0
                 """
                 return _____
             ''',
             '''
             def digit(n, k):
                 return n // pow(10, k) % 10
             ''',
             [("官方示例", ["digit(3579, 2)", "digit(3579, 0)", "digit(3579, 10)"]), ("最高位", ["digit(3579, 3)"]), ("中间是 0", ["digit(1002, 1)"])],
             hint="用 `//`、`%` 和内置函数 `pow` 把某一位单独取出来。"),
        func("middle", "Middle Number", "改编自官方实验 1 的 Q4。\n\n"
             "实现 `middle(a, b, c)`：三个参数是互不相同的整数，用**一个** return 表达式返回既不是最大、也不是最小的那个数。",
             '''
             def middle(a, b, c):
                 """Return the number among a, b, and c that is not the smallest or largest.
                 Assume a, b, and c are all different numbers.

                 >>> middle(3, 5, 4)
                 4
                 """
                 return _____
             ''',
             '''
             def middle(a, b, c):
                 return a + b + c - min(a, b, c) - max(a, b, c)
             ''',
             [("官方示例", ["middle(3, 5, 4)", "middle(30, 5, 4)", "middle(3, 5, 40)", "middle(30, 5, 40)"]), ("负数", ["middle(-3, -10, 7)"])],
             hint="先把三个数加起来，再减掉不要的两个。"),
        func("falling", "Falling Factorial", "改编自官方实验 1 的 Q7。\n\n"
             "实现「下降阶乘」`falling(n, k)`：返回从 `n` 开始往下数的 `k` 个连续整数的乘积；`k` 为 0 时返回 1。例如 `falling(6, 3)` 是 6 × 5 × 4 = 120。",
             '''
             def falling(n, k):
                 """Compute the falling factorial of n to depth k.

                 >>> falling(6, 3)  # 6 * 5 * 4
                 120
                 >>> falling(4, 0)
                 1
                 """
             ''',
             '''
             def falling(n, k):
                 total, stop = 1, n-k
                 while n > stop:
                     total, n = total*n, n-1
                 return total
             ''',
             [("官方示例", ["falling(6, 3)", "falling(4, 3)", "falling(4, 1)", "falling(4, 0)"]), ("k 等于 n", ["falling(5, 5)"])]),
        func("divisible-by-k", "Divisible By k", "改编自官方实验 1 的 Q8。\n\n"
             "实现 `divisible_by_k(n, k)`：从小到大**打印**所有不超过 `n` 且能被 `k` 整除的正整数，然后**返回**一共打印了多少个数。",
             '''
             def divisible_by_k(n, k):
                 """
                 >>> a = divisible_by_k(10, 2)  # 2, 4, 6, 8, and 10 are divisible by 2
                 2
                 4
                 6
                 8
                 10
                 >>> a
                 5
                 """
             ''',
             '''
             def divisible_by_k(n, k):
                 count = 0
                 i = 1
                 while i <= n:
                     if i % k == 0:
                         print(i)
                         count += 1
                     i += 1
                 return count
             ''',
             [("10 和 2", ["divisible_by_k(10, 2)"]), ("3 和 1", ["divisible_by_k(3, 1)"]), ("一个都没有", ["divisible_by_k(6, 7)"])]),
        func("sum-digits", "Sum Digits", "改编自官方实验 1 的 Q9。\n\n"
             "实现 `sum_digits(y)`：`y` 是非负整数，返回它各位数字之和。注意要用 `return` 返回结果，而不是打印。",
             '''
             def sum_digits(y):
                 """Sum all the digits of y.

                 >>> sum_digits(10) # 1 + 0 = 1
                 1
                 >>> sum_digits(4224) # 4 + 2 + 2 + 4 = 12
                 12
                 """
             ''',
             '''
             def sum_digits(y):
                 total = 0
                 while y > 0:
                     total, y = total + y % 10, y // 10
                 return total
             ''',
             [("官方示例", ["sum_digits(10)", "sum_digits(4224)", "sum_digits(1234567890)"]), ("0", ["sum_digits(0)"])],
             hint="`y % 10` 是最后一位，`y // 10` 去掉最后一位。"),
        func("double-eights", "Double Eights", "改编自官方实验 1 的 Q10。\n\n"
             "实现 `double_eights(n)`：如果 `n` 的十进制写法里有两个**相邻**的 8，返回 `True`，否则返回 `False`。",
             '''
             def double_eights(n):
                 """Return true if n has two eights in a row.

                 >>> double_eights(8)
                 False
                 >>> double_eights(88)
                 True
                 """
             ''',
             '''
             def double_eights(n):
                 while n:
                     if n % 10 == 8 and n // 10 % 10 == 8:
                         return True
                     n //= 10
                 return False
             ''',
             [("官方示例", ["double_eights(8)", "double_eights(88)", "double_eights(2882)", "double_eights(880088)"]), ("不相邻", ["double_eights(12345)", "double_eights(80808080)"])]),
    ],
    "lec04": [
        wwpd("hof-1", ">>> def cake():\n...    print('beets')\n...    def pie():\n...        print('sweets')\n...        return 'cake'\n...    return pie", "chocolate = cake()", "beets",
             "调用 cake() 会执行它的函数体：打印 beets，然后返回内层函数 pie。赋值语句本身不显示值。", LAB2HOF),
        wwpd("hof-2", ">>> def cake():\n...    print('beets')\n...    def pie():\n...        print('sweets')\n...        return 'cake'\n...    return pie\n>>> chocolate = cake()\nbeets", "chocolate", "Function",
             "chocolate 绑定的是函数 pie，解释器会显示 <function cake.<locals>.pie at ...>。", LAB2HOF),
        wwpd("hof-3", ">>> def cake():\n...    print('beets')\n...    def pie():\n...        print('sweets')\n...        return 'cake'\n...    return pie\n>>> chocolate = cake()\nbeets", "chocolate()", ["sweets 'cake'"],
             "调用 pie：先打印 sweets，再返回字符串 'cake'。两行输出请用一个空格隔开填写。", LAB2HOF),
        choice("hof-4", f"{LAB2HOF}\n\n```py\n>>> def cake():\n...    print('beets')\n...    def pie():\n...        print('sweets')\n...        return 'cake'\n...    return pie\n>>> chocolate = cake()\nbeets\n>>> more_chocolate, more_cake = chocolate(), cake\nsweets\n>>> def snake(x, y):\n...    if cake == more_cake:\n...        return chocolate\n...    else:\n...        return x + y\n>>> cake = 'cake'\n>>> snake(10, 20)\n```\n\n最后一行会显示什么？",
               ["30", "Function", "'cake'", "Error"], 0,
               "执行 cake = 'cake' 之后，名字 cake 绑定到字符串，而 more_cake 仍然绑定到原来的函数，两者不相等，于是返回 x + y，也就是 30。"),
    ],
    "disc01": [
        func("is-prime", "Is Prime?", "改编自官方讨论课 1 的 Q1。\n\n"
             "写函数 `is_prime(n)`：`n` 是正整数，是质数就返回 `True`，否则返回 `False`。质数是只能被 1 和它本身整除的大于 1 的整数，**1 不是质数**。",
             '''
             def is_prime(n):
                 """
                 >>> is_prime(10)
                 False
                 >>> is_prime(7)
                 True
                 >>> is_prime(1) # one is not a prime number!!
                 False
                 """
             ''',
             '''
             def is_prime(n):
                 if n == 1:
                     return False
                 k = 2
                 while k < n:
                     if n % k == 0:
                         return False
                     k += 1
                 return True
             ''',
             [("官方示例", ["is_prime(10)", "is_prime(7)", "is_prime(1)"]), ("2", ["is_prime(2)"]), ("平方数", ["is_prime(49)"])]),
        func("fizzbuzz", "Fizzbuzz", "改编自官方讨论课 1 的 Q2。\n\n"
             "实现 `fizzbuzz(n)`：对 1 到 `n` 的每个整数 `i` 打印一行——同时能被 3 和 5 整除打印 `fizzbuzz`，只能被 3 整除打印 `fizz`，只能被 5 整除打印 `buzz`，否则打印 `i` 本身。函数不需要返回值。",
             '''
             def fizzbuzz(n):
                 """
                 >>> result = fizzbuzz(5)
                 1
                 2
                 fizz
                 4
                 buzz
                 """
             ''',
             '''
             def fizzbuzz(n):
                 i = 1
                 while i <= n:
                     if i % 3 == 0 and i % 5 == 0:
                         print('fizzbuzz')
                     elif i % 3 == 0:
                         print('fizz')
                     elif i % 5 == 0:
                         print('buzz')
                     else:
                         print(i)
                     i += 1
             ''',
             [("16", ["fizzbuzz(16)"]), ("1", ["fizzbuzz(1)"])]),
        func("ordered-digits", "Ordered Digits", "改编自官方讨论课 1 的 Q3。\n\n"
             "实现 `ordered_digits(x)`：`x` 是正整数，如果它的各位数字从左到右是**不递减**的，返回 `True`，否则返回 `False`。例如 5、11、127、1357 是，21、1375 不是。",
             '''
             def ordered_digits(x):
                 """Return True if the (base 10) digits of X>0 are in non-decreasing
                 order, and False otherwise.

                 >>> ordered_digits(127)
                 True
                 >>> ordered_digits(21)
                 False
                 """
             ''',
             '''
             def ordered_digits(x):
                 last = x % 10
                 x = x // 10
                 while x > 0:
                     if last < x % 10:
                         return False
                     last = x % 10
                     x = x // 10
                 return True
             ''',
             [("有序", ["ordered_digits(5)", "ordered_digits(11)", "ordered_digits(127)", "ordered_digits(1357)"]), ("无序", ["ordered_digits(21)", "ordered_digits(1375)"])]),
        func("unique-digits", "Unique Digits", "改编自官方讨论课 1 的 Q4。\n\n"
             "实现 `unique_digits(n)`：返回正整数 `n` 中**不同的数字**有几个。可以先写一个辅助函数 `has_digit(n, k)`，判断 `n` 里有没有数字 `k`。",
             '''
             def unique_digits(n):
                 """Return the number of unique digits in positive integer n.

                 >>> unique_digits(8675309) # All are unique
                 7
                 >>> unique_digits(13173131) # 1, 3, and 7
                 3
                 """
             ''',
             '''
             def has_digit(n, k):
                 while n > 0:
                     if n % 10 == k:
                         return True
                     n = n // 10
                 return False

             def unique_digits(n):
                 unique = 0
                 i = 0
                 while i < 10:
                     if has_digit(n, i):
                         unique += 1
                     i += 1
                 return unique
             ''',
             [("官方示例", ["unique_digits(8675309)", "unique_digits(13173131)", "unique_digits(101)"]), ("一位", ["unique_digits(7)"])]),
    ],
    "lec05": [
        wwpd("lambda-1", ">>> a = lambda x: x", "a(5)", "5", "a 绑定到一个返回参数本身的函数。", LAB2L),
        wwpd("lambda-2", "", "(lambda: 3)()", "3", "lambda 表达式求值得到一个没有参数的函数，紧接着调用它，返回 3。", LAB2L),
        wwpd("lambda-3", ">>> b = lambda x, y: lambda: x + y\n>>> c = b(8, 4)", "c()", "12", "b(8, 4) 返回内层的 lambda，它记住了 x = 8、y = 4；调用它得到 12。", LAB2L),
        wwpd("lambda-4", ">>> higher_order_lambda = lambda f: lambda x: f(x)\n>>> g = lambda x: x * x", "higher_order_lambda(2)(g)", "Error",
             "higher_order_lambda(2) 把 2 当成了 f；再调用时执行 f(x) 也就是 2(g)，整数不能被调用，会报 TypeError。", LAB2L),
        wwpd("lambda-5", ">>> call_thrice = lambda f: lambda x: f(f(f(x)))", "call_thrice(lambda y: y + 1)(0)", "3", "把加一的函数作用三次在 0 上，得到 3。", LAB2L),
        wwpd("lambda-6", ">>> print_lambda = lambda z: print(z)\n>>> one_thousand = print_lambda(1000)\n1000", "one_thousand", "Nothing",
             "print 返回 None，所以 one_thousand 绑定到 None；交互式解释器对 None 什么都不显示。", LAB2L),
    ],
    "hw02": [
        func("product", "Product", "改编自官方作业 2 的 Q1。\n\n"
             "写高阶函数 `product(n, term)`：`term` 是一个单参数函数，`term(i)` 给出序列的第 `i` 项。返回前 `n` 项的乘积 `term(1) * term(2) * ... * term(n)`。\n\n"
             "测试里会用到这几个函数：`identity(x)` 返回 `x`，`square(x)` 返回 `x * x`，`increment(x)` 返回 `x + 1`，`triple(x)` 返回 `3 * x`。它们已经写在起始代码里了。",
             '''
             def square(x):
                 return x * x

             def identity(x):
                 return x

             def triple(x):
                 return 3 * x

             def increment(x):
                 return x + 1

             def product(n, term):
                 """Return the product of the first n terms in a sequence.

                 >>> product(3, identity)  # 1 * 2 * 3
                 6
                 >>> product(3, square)    # 1^2 * 2^2 * 3^2
                 36
                 """
             ''',
             '''
             def square(x):
                 return x * x

             def identity(x):
                 return x

             def triple(x):
                 return 3 * x

             def increment(x):
                 return x + 1

             def product(n, term):
                 prod, k = 1, 1
                 while k <= n:
                     prod, k = term(k) * prod, k + 1
                 return prod
             ''',
             [("identity", ["product(3, identity)", "product(5, identity)"]), ("square", ["product(3, square)", "product(5, square)"]),
              ("increment 和 triple", ["product(3, increment)", "product(3, triple)"])]),
        func("accumulate", "Accumulate", "改编自官方作业 2 的 Q2。\n\n"
             "`product` 是更一般的函数 `accumulate(fuse, start, n, term)` 的一个特例。`fuse` 是满足交换律和结合律的双参数函数，`start` 是起始值，`n` 是非负整数。"
             "`accumulate` 用 `fuse` 把 `start` 和前 `n` 项 `term(1)`、…、`term(n)` 融合在一起。例如 `accumulate(add, 11, 3, square)` 等于 11 + 1 + 4 + 9 = 25。\n\n"
             "然后用一行 `return` 语句，借助 `accumulate` 写出 `summation_using_accumulate(n, term)`（求和）和 `product_using_accumulate(n, term)`（求积）。",
             '''
             from operator import add, mul

             def square(x):
                 return x * x

             def identity(x):
                 return x

             def triple(x):
                 return 3 * x

             def accumulate(fuse, start, n, term):
                 """Return the result of fusing together the first n terms in a sequence
                 and start.  The terms to be fused are term(1), term(2), ..., term(n).

                 >>> accumulate(add, 0, 5, identity)  # 0 + 1 + 2 + 3 + 4 + 5
                 15
                 >>> accumulate(mul, 2, 3, square)    # 2 * 1^2 * 2^2 * 3^2
                 72
                 """

             def summation_using_accumulate(n, term):
                 """Returns the sum: term(1) + ... + term(n), using accumulate."""
                 return _____

             def product_using_accumulate(n, term):
                 """Returns the product: term(1) * ... * term(n), using accumulate."""
                 return _____
             ''',
             '''
             from operator import add, mul

             def square(x):
                 return x * x

             def identity(x):
                 return x

             def triple(x):
                 return 3 * x

             def accumulate(fuse, start, n, term):
                 total, k = start, 1
                 while k <= n:
                     total, k = fuse(total, term(k)), k + 1
                 return total

             def summation_using_accumulate(n, term):
                 return accumulate(add, 0, n, term)

             def product_using_accumulate(n, term):
                 return accumulate(mul, 1, n, term)
             ''',
             [("accumulate", ["accumulate(add, 0, 5, identity)", "accumulate(add, 11, 5, identity)", "accumulate(add, 11, 0, identity)", "accumulate(add, 11, 3, square)", "accumulate(mul, 2, 3, square)", "accumulate(lambda x, y: x + y + 1, 2, 3, square)"]),
              ("summation_using_accumulate", ["summation_using_accumulate(5, square)", "summation_using_accumulate(5, triple)"]),
              ("product_using_accumulate", ["product_using_accumulate(4, square)", "product_using_accumulate(6, triple)"])]),
        func("make-repeater", "Make Repeater", "改编自官方作业 2 的 Q3。\n\n"
             "实现 `make_repeater(f, n)`：`f` 是单参数函数，`n` 是正整数。返回一个单参数函数，使 `make_repeater(f, n)(x)` 等于把 `f` 连续作用 `n` 次的结果 `f(f(...f(x)...))`。",
             '''
             def square(x):
                 return x * x

             def triple(x):
                 return 3 * x

             def increment(x):
                 return x + 1

             def make_repeater(f, n):
                 """Returns the function that computes the nth application of f.

                 >>> add_three = make_repeater(increment, 3)
                 >>> add_three(5)
                 8
                 """
             ''',
             '''
             def square(x):
                 return x * x

             def triple(x):
                 return 3 * x

             def increment(x):
                 return x + 1

             def make_repeater(f, n):
                 def repeater(x):
                     k = 0
                     while k < n:
                         x, k = f(x), k + 1
                     return x
                 return repeater
             ''',
             [("官方示例", ["make_repeater(increment, 3)(5)", "make_repeater(triple, 5)(1)", "make_repeater(square, 2)(5)", "make_repeater(square, 3)(5)"])]),
    ],
}
