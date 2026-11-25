"""第 4–7 周：树形递归、容器（字典）、数据抽象、树。"""
from qhelp import choice, func, wwpd

TREE = '''
def tree(label, branches=[]):
    """Construct a tree with the given label value and a list of branches."""
    return [label] + list(branches)

def label(tree):
    """Return the label value of a tree."""
    return tree[0]

def branches(tree):
    """Return the list of branches of the given tree."""
    return tree[1:]

def is_leaf(tree):
    """Returns True if the given tree's list of branches is empty, and False otherwise."""
    return not branches(tree)

def print_tree(t, indent=0):
    """Print a representation of this tree in which each label is indented by two spaces times its depth from the root."""
    print('  ' * indent + str(label(t)))
    for b in branches(t):
        print_tree(b, indent + 1)
'''
TREE_NOTE = "起始代码里已经有课上的树抽象：`tree(label, branches)`、`label(t)`、`branches(t)`、`is_leaf(t)`、`print_tree(t)`。请只通过这些函数操作树。"

CITY = '''
def make_city(name, lat, lon):
    """Construct a city object."""
    return [name, lat, lon]

def get_name(city):
    return city[0]

def get_lat(city):
    return city[1]

def get_lon(city):
    return city[2]
'''

MOBILE = '''
def mobile(left, right):
    """Construct a mobile from a left arm and a right arm."""
    assert is_arm(left), "left must be an arm"
    assert is_arm(right), "right must be an arm"
    return ['mobile', left, right]

def is_mobile(m):
    return type(m) == list and len(m) == 3 and m[0] == 'mobile'

def left(m):
    assert is_mobile(m), "must call left on a mobile"
    return m[1]

def right(m):
    assert is_mobile(m), "must call right on a mobile"
    return m[2]

def arm(length, mobile_or_planet):
    """Construct an arm: a length of rod with a mobile or planet at the end."""
    assert is_mobile(mobile_or_planet) or is_planet(mobile_or_planet)
    return ['arm', length, mobile_or_planet]

def is_arm(s):
    return type(s) == list and len(s) == 3 and s[0] == 'arm'

def length(s):
    assert is_arm(s), "must call length on an arm"
    return s[1]

def end(s):
    assert is_arm(s), "must call end on an arm"
    return s[2]
'''
PLANET = '''
def planet(mass):
    """Construct a planet of some mass."""
    assert mass > 0
    return ['planet', mass]

def mass(p):
    """Select the mass of a planet."""
    assert is_planet(p), 'must call mass on a planet'
    return p[1]

def is_planet(p):
    """Whether p is a planet."""
    return type(p) == list and len(p) == 2 and p[0] == 'planet'

def examples():
    t = mobile(arm(1, planet(2)),
               arm(2, planet(1)))
    u = mobile(arm(5, planet(1)),
               arm(1, mobile(arm(2, planet(3)),
                             arm(3, planet(2)))))
    v = mobile(arm(4, t), arm(2, u))
    return t, u, v
'''
MOBILE_NOTE = ("「活动雕塑」（mobile）由左右两条臂（arm）组成；每条臂是一根有长度的杆，末端挂着一个行星（planet）或者另一个活动雕塑。"
               "起始代码里已经实现了 `mobile`、`left`、`right`、`arm`、`length`、`end`、`planet`、`mass` 等构造器和选择器，以及示例函数 `examples()`，它返回三个活动雕塑 `t`、`u`、`v`。")

LAB4D = "改编自官方实验 4 的 Q1「Dictionaries」。"

PRACTICE = {
    "lec10": [
        func("paths", "Insect Combinatorics", "改编自官方讨论课 4 的 Q1。\n\n"
             "一只虫子在 `m` 行 `n` 列的网格里，从左下角 (1, 1) 出发，要走到右上角 (m, n)，每一步只能向上或向右。用递归实现 `paths(m, n)`，返回一共有多少条不同的路线。",
             '''
             def paths(m, n):
                 """Return the number of paths from one corner of an
                 M by N grid to the opposite corner.

                 >>> paths(2, 2)
                 2
                 >>> paths(5, 7)
                 210
                 """
             ''',
             '''
             def paths(m, n):
                 if m == 1 or n == 1:
                     return 1
                 return paths(m - 1, n) + paths(m, n - 1)
             ''',
             [("官方示例", ["paths(2, 2)", "paths(5, 7)", "paths(117, 1)", "paths(1, 157)"]), ("3 × 3", ["paths(3, 3)"])],
             hint="走到最上面一行或最右边一列之后，就只剩一条路了。"),
        func("max-product", "Max Product", "改编自官方讨论课 4 的 Q2。\n\n"
             "实现 `max_product(s)`：`s` 是数字列表（每个数都不小于 1），返回从中选出若干个**互不相邻**的元素相乘能得到的最大乘积。一个都不选时乘积是 1。",
             '''
             def max_product(s):
                 """Return the maximum product of non-consecutive elements of s.

                 >>> max_product([10, 3, 1, 9, 2])   # 10 * 9
                 90
                 >>> max_product([])                 # The product of no numbers is 1
                 1
                 """
             ''',
             '''
             def max_product(s):
                 if s == []:
                     return 1
                 if len(s) == 1:
                     return s[0]
                 return max(s[0] * max_product(s[2:]), max_product(s[1:]))
             ''',
             [("官方示例", ["max_product([10, 3, 1, 9, 2])", "max_product([5, 10, 5, 10, 5])", "max_product([])"]), ("一个元素", ["max_product([7])"])],
             hint="对第一个元素分两种情况：选它（那么第二个不能选），或者不选它。"),
    ],
    "disc04": [
        func("sums", "Sum Fun", "改编自官方讨论课 4 的 Q3。\n\n"
             "实现 `sums(n, m)`：返回所有满足下面条件的列表组成的列表——元素之和为 `n`；只包含 1 到 `m` 的正整数；相邻两个元素不相同。顺序不同的列表算不同的列表。结果按「以 1 开头的、以 2 开头的……」的顺序排列，和下面的示例一致。",
             '''
             def sums(n, m):
                 """Return lists that sum to n containing positive numbers up to m that
                 have no adjacent repeats.

                 >>> sums(5, 1)
                 []
                 >>> sums(5, 3)
                 [[1, 3, 1], [2, 1, 2], [2, 3], [3, 2]]
                 """
                 if n < 0:
                     return []
                 if n == 0:
                     sums_to_zero = []     # The only way to sum to zero using positives
                     return [sums_to_zero] # Return a list of all the ways to sum to zero
                 result = []
                 for k in range(1, m + 1):
                     result = result + [___ for rest in ___ if rest == [] or ___]
                 return result
             ''',
             '''
             def sums(n, m):
                 if n < 0:
                     return []
                 if n == 0:
                     return [[]]
                 result = []
                 for k in range(1, m + 1):
                     result = result + [[k] + rest for rest in sums(n-k, m) if rest == [] or rest[0] != k]
                 return result
             ''',
             [("官方示例", ["sums(5, 1)", "sums(5, 2)", "sums(5, 3)", "sums(5, 5)", "sums(6, 3)"])],
             hint="用 `[k] + s` 在列表 `s` 前面接上 `k`。"),
        func("fit", "A Perfect Question", "改编自官方讨论课 4 的 Q4（原题是 2023 年秋季期中考试 2 的第 4(a) 题）。\n\n"
             "完全平方数是某个整数 `k` 的平方 `k*k`。实现 `fit(total, n)`：判断能否找到 `n` 个正的完全平方数（可以重复）使它们的和等于 `total`。",
             '''
             def fit(total, n):
                 """Return whether there are n positive perfect squares that sums to total.

                 >>> [fit(4, 1), fit(4, 2), fit(4, 3), fit(4, 4)]  # 1*(2*2) for n=1; 4*(1*1) for n=4
                 [True, False, False, True]
                 """
                 def f(total, n, k):
                     if _____:
                         return True
                     elif total < k * k:
                         return False
                     else:
                         return _____
                 return f(total, n, 1)
             ''',
             '''
             def fit(total, n):
                 def f(total, n, k):
                     if total == 0 and n == 0:
                         return True
                     elif total < k * k:
                         return False
                     else:
                         return f(total - k * k, n - 1, k) or f(total, n, k + 1)
                 return f(total, n, 1)
             ''',
             [("官方示例", ["[fit(4, 1), fit(4, 2), fit(4, 3), fit(4, 4)]", "[fit(12, n) for n in range(3, 8)]", "[fit(32, 2), fit(32, 3), fit(32, 4), fit(32, 5)]"])]),
    ],
    "lec13": [
        wwpd("city-1", CITY.strip() + "\n>>> berkeley = make_city('Berkeley', 122, 37)", "get_name(berkeley)", "'Berkeley'",
             "get_name 是选择器，返回城市的名字。", "改编自官方实验 4 的「City Data Abstraction」。"),
        wwpd("city-2", CITY.strip() + "\n>>> new_york = make_city('New York City', 74, 40)", "get_lon(new_york)", "40", "构造时第三个参数是经度 lon。", "改编自官方实验 4 的「City Data Abstraction」。"),
        choice("barrier", "改编自官方实验 4 的 Q6「Don't violate the abstraction barrier!」。\n\n城市用 `make_city(name, lat, lon)` 构造。下面哪一种写 `distance` 的方式**违反了抽象屏障**？",
               ["`lat_1, lon_1 = city_a[1], city_a[2]`", "`lat_1, lon_1 = get_lat(city_a), get_lon(city_a)`", "`sqrt((get_lat(a) - get_lat(b))**2 + (get_lon(a) - get_lon(b))**2)`", "`new_city = make_city('arb', lat, lon)`"], 0,
               "直接用下标访问城市的内部表示，等于假定城市一定是列表；一旦把表示方式换成字典或函数，这段代码就会出错。应当只用选择器 get_lat、get_lon。"),
    ],
    "lab04": [
        func("divide", "Divide", "改编自官方实验 4 的 Q2。\n\n"
             "实现 `divide(quotients, divisors)`：两个参数都是正整数列表。返回一个字典，键是 `quotients` 里的每个元素 `q`，值是 `divisors` 中所有能被 `q` 整除的元素组成的列表。请用一行字典推导式完成。",
             '''
             def divide(quotients, divisors):
                 """Return a dictonary in which each quotient q is a key for the list of
                 divisors that it divides evenly.

                 >>> divide([3, 4, 5], [8, 9, 10, 11, 12])
                 {3: [9, 12], 4: [8, 12], 5: [10]}
                 """
                 return {___: ___ for ___ in ___}
             ''',
             '''
             def divide(quotients, divisors):
                 return {q: [d for d in divisors if d % q == 0] for q in quotients}
             ''',
             [("官方示例", ["divide([3, 4, 5], [8, 9, 10, 11, 12])", "divide(list(range(1, 5)), list(range(20, 25)))"])]),
        func("buy", "Buying Fruit", "改编自官方实验 4 的 Q3。\n\n"
             "实现 `buy(fruits_to_buy, prices, total_amount)`：`fruits_to_buy` 是必须买的水果列表（每种至少买一个），`prices` 是水果到单价的字典，`total_amount` 是要正好花完的钱数。"
             "按顺序打印所有花完这笔钱的买法，每种买法一行，格式由起始代码里的 `display` 函数决定，例如 `[2 apples][1 orange][1 banana]`。",
             '''
             def buy(fruits_to_buy, prices, total_amount):
                 """Print ways to buy some of each fruit so that the sum of prices is amount.

                 >>> prices = {'oranges': 4, 'apples': 3, 'bananas': 2, 'kiwis': 9}
                 >>> buy(['apples', 'oranges', 'bananas'], prices, 12)
                 [2 apples][1 orange][1 banana]
                 """
                 def add(fruits, amount, cart):
                     if fruits == [] and amount == 0:
                         print(cart)
                     elif fruits and amount > 0:
                         fruit = fruits[0]
                         price = ____
                         for k in ____:
                             # Hint: The display function will help you add fruit to the cart.
                             add(____, ____, ____)
                 add(fruits_to_buy, total_amount, '')

             def display(fruit, count):
                 """Display a count of a fruit in square brackets.

                 >>> display('apples', 3)
                 '[3 apples]'
                 >>> display('apples', 1)
                 '[1 apple]'
                 """
                 assert count >= 1 and fruit[-1] == 's'
                 if count == 1:
                     fruit = fruit[:-1]  # get rid of the plural s
                 return '[' + str(count) + ' ' + fruit + ']'
             ''',
             '''
             def buy(fruits_to_buy, prices, total_amount):
                 def add(fruits, amount, cart):
                     if fruits == [] and amount == 0:
                         print(cart)
                     elif fruits and amount > 0:
                         fruit = fruits[0]
                         price = prices[fruit]
                         for k in range(1, amount // price + 1):
                             add(fruits[1:], amount - price * k, cart + display(fruit, k))
                 add(fruits_to_buy, total_amount, '')

             def display(fruit, count):
                 assert count >= 1 and fruit[-1] == 's'
                 if count == 1:
                     fruit = fruit[:-1]
                 return '[' + str(count) + ' ' + fruit + ']'
             ''',
             [("12 元", ["buy(['apples', 'oranges', 'bananas'], {'oranges': 4, 'apples': 3, 'bananas': 2, 'kiwis': 9}, 12)"]),
              ("16 元", ["buy(['apples', 'oranges', 'bananas'], {'oranges': 4, 'apples': 3, 'bananas': 2, 'kiwis': 9}, 16)"]),
              ("苹果和猕猴桃", ["buy(['apples', 'kiwis'], {'oranges': 4, 'apples': 3, 'bananas': 2, 'kiwis': 9}, 36)"])]),
        func("distance", "Distance", "改编自官方实验 4 的 Q4。\n\n"
             "城市由 `make_city(name, lat, lon)` 构造，用 `get_name`、`get_lat`、`get_lon` 取出名字、纬度、经度（已经写在起始代码里）。实现 `distance(city_a, city_b)`：把纬度、经度当作平面坐标，返回两座城市之间的直线距离。只能通过选择器访问城市。",
             CITY + '''
             from math import sqrt

             def distance(city_a, city_b):
                 """
                 Returns the distance between city_a and city_b according to their
                 coordinates.

                 >>> city_a = make_city('city_a', 0, 1)
                 >>> city_b = make_city('city_b', 0, 2)
                 >>> distance(city_a, city_b)
                 1.0
                 """
             '''.replace("\n             ", "\n"),
             CITY + '''
             from math import sqrt

             def distance(city_a, city_b):
                 lat_1, lon_1 = get_lat(city_a), get_lon(city_a)
                 lat_2, lon_2 = get_lat(city_b), get_lon(city_b)
                 return sqrt((lat_1 - lat_2)**2 + (lon_1 - lon_2)**2)
             '''.replace("\n             ", "\n"),
             [("官方示例", ["distance(make_city('city_a', 0, 1), make_city('city_b', 0, 2))", "distance(make_city('city_c', 6.5, 12), make_city('city_d', 2.5, 15))"])]),
        func("closer-city", "Closer City", "改编自官方实验 4 的 Q5。\n\n"
             "实现 `closer_city(lat, lon, city_a, city_b)`：返回离坐标 (lat, lon) 更近的那座城市的名字；距离相等时算 `city_b` 更近。只能使用 `make_city`、选择器和 `distance`（起始代码里已经写好了）。",
             CITY + '''
             from math import sqrt

             def distance(city_a, city_b):
                 lat_1, lon_1 = get_lat(city_a), get_lon(city_a)
                 lat_2, lon_2 = get_lat(city_b), get_lon(city_b)
                 return sqrt((lat_1 - lat_2)**2 + (lon_1 - lon_2)**2)

             def closer_city(lat, lon, city_a, city_b):
                 """
                 Returns the name of either city_a or city_b, whichever is closest to
                 coordinate (lat, lon). If the two cities are the same distance away
                 from the coordinate, consider city_b to be the closer city.
                 """
             '''.replace("\n             ", "\n"),
             CITY + '''
             from math import sqrt

             def distance(city_a, city_b):
                 lat_1, lon_1 = get_lat(city_a), get_lon(city_a)
                 lat_2, lon_2 = get_lat(city_b), get_lon(city_b)
                 return sqrt((lat_1 - lat_2)**2 + (lon_1 - lon_2)**2)

             def closer_city(lat, lon, city_a, city_b):
                 new_city = make_city('arb', lat, lon)
                 if distance(city_a, new_city) < distance(city_b, new_city):
                     return get_name(city_a)
                 return get_name(city_b)
             '''.replace("\n             ", "\n"),
             [("官方示例", ["closer_city(38.33, 121.44, make_city('Berkeley', 37.87, 112.26), make_city('Stanford', 34.05, 118.25))",
                         "closer_city(41.29, 174.78, make_city('Bucharest', 44.43, 26.10), make_city('Vienna', 48.20, 16.37))"]),
              ("距离相等", ["closer_city(0, 0, make_city('A', 1, 0), make_city('B', 0, 1))"])]),
    ],
    "lec14": [
        func("has-path", "Has Path", "改编自官方讨论课 5 的 Q2。\n\n"
             "实现 `has_path(t, p)`：`t` 是树，`p` 是标签列表。如果从 `t` 的**根**出发，存在一条路径依次经过的标签正好是 `p`，返回 `True`，否则返回 `False`（路径不必走到叶子）。\n\n" + TREE_NOTE,
             TREE + '''
             def has_path(t, p):
                 """Return whether tree t has a path from the root with labels p.

                 >>> t2 = tree(5, [tree(6), tree(7)])
                 >>> t1 = tree(3, [tree(4), t2])
                 >>> has_path(t1, [5, 6])        # This path is not from the root of t1
                 False
                 >>> has_path(t1, [3, 5, 6])     # This path goes to a leaf
                 True
                 """
             '''.replace("\n             ", "\n"),
             TREE + '''
             def has_path(t, p):
                 if p == [label(t)]:
                     return True
                 elif label(t) != p[0]:
                     return False
                 return any([has_path(b, p[1:]) for b in branches(t)])
             '''.replace("\n             ", "\n"),
             [("官方示例", ["has_path(tree(3, [tree(4), tree(5, [tree(6), tree(7)])]), [5, 6])", "has_path(tree(5, [tree(6), tree(7)]), [5, 6])",
                         "has_path(tree(3, [tree(4), tree(5, [tree(6), tree(7)])]), [3, 5])", "has_path(tree(3, [tree(4), tree(5, [tree(6), tree(7)])]), [3, 5, 6])",
                         "has_path(tree(3, [tree(4), tree(5, [tree(6), tree(7)])]), [3, 4, 5, 6])"])]),
        choice("leaves", "改编自讲义 2.3.6 节的 `count_leaves`。\n\n```py\nt = tree(1, [tree(2, [tree(3), tree(4)]), tree(5)])\n```\n\n这棵树有几个叶子？",
               ["2", "3", "4", "5"], 1, "叶子是没有分支的节点：3、4、5，一共 3 个。", origin="review"),
    ],
    "lec12": [
        wwpd("dict-1", ">>> pokemon = {'pikachu': 25, 'dragonair': 148, 'mew': 151}", "pokemon['pikachu']", "25", "用键取出对应的值。", LAB4D),
        wwpd("dict-2", ">>> pokemon = {'pikachu': 25, 'dragonair': 148, 'mew': 151}", "25 in pokemon", "False", "对字典用 in 判断的是键，25 是值不是键。", LAB4D),
        wwpd("dict-3", ">>> pokemon = {'pikachu': 25, 'dragonair': 148, 'mew': 151}", "148 in pokemon.values()", "True", "values() 是所有值。", LAB4D),
        wwpd("max-key", ">>> s = [-3, -5, -4, -1, -2]", "max(s, key=abs)", "-5", "按绝对值比较，绝对值最大的是 -5；返回的是原来的元素。", "改编自官方讨论课 5 的 Q1「Warm Up」。"),
    ],
    "disc05": [
        func("find-path", "Find Path", "改编自官方讨论课 5 的 Q3。\n\n"
             "实现 `find_path(t, x)`：`t` 是标签互不相同的树。返回从根走到标签为 `x` 的节点所经过的标签列表；如果树里没有 `x`，返回 `None`。\n\n" + TREE_NOTE,
             TREE + '''
             def find_path(t, x):
                 """
                 >>> t2 = tree(5, [tree(6), tree(7)])
                 >>> t1 = tree(3, [tree(4), t2])
                 >>> find_path(t1, 6)
                 [3, 5, 6]
                 """
             '''.replace("\n             ", "\n"),
             TREE + '''
             def find_path(t, x):
                 if label(t) == x:
                     return [label(t)]
                 for b in branches(t):
                     path = find_path(b, x)
                     if path:
                         return [label(t)] + path
                 return None
             '''.replace("\n             ", "\n"),
             [("官方示例", ["find_path(tree(3, [tree(4), tree(5, [tree(6), tree(7)])]), 5)", "find_path(tree(3, [tree(4), tree(5, [tree(6), tree(7)])]), 4)",
                         "find_path(tree(3, [tree(4), tree(5, [tree(6), tree(7)])]), 6)", "find_path(tree(5, [tree(6), tree(7)]), 6)",
                         "print(find_path(tree(3, [tree(4), tree(5, [tree(6), tree(7)])]), 2))"])]),
        func("only-paths", "Only Paths", "改编自官方讨论课 5 的 Q4。\n\n"
             "实现 `only_paths(t, n)`：返回一棵新树，只保留 `t` 中那些位于「从根到叶子、标签之和等于 `n`」的路径上的节点；如果没有这样的路径，返回 `None`。\n\n" + TREE_NOTE,
             TREE + '''
             def only_paths(t, n):
                 """Return a tree with only the nodes of t along paths from the root to a leaf of t
                 for which the node labels of the path sum to n. If no paths sum to n, return None.

                 >>> t = tree(3, [tree(4), tree(1, [tree(3, [tree(2)]), tree(2, [tree(1)]), tree(5), tree(3)])])
                 >>> print_tree(only_paths(t, 7))
                 3
                   4
                   1
                     2
                       1
                     3
                 """
             '''.replace("\n             ", "\n"),
             TREE + '''
             def only_paths(t, n):
                 if n == label(t) and is_leaf(t):
                     return t
                 new_branches = [only_paths(b, n - label(t)) for b in branches(t)]
                 if any(new_branches):
                     return tree(label(t), [b for b in new_branches if b is not None])
             '''.replace("\n             ", "\n"),
             [("和为 7", ["print_tree(only_paths(tree(3, [tree(4), tree(1, [tree(3, [tree(2)]), tree(2, [tree(1)]), tree(5), tree(3)])]), 7))"]),
              ("和为 9", ["print_tree(only_paths(tree(3, [tree(4), tree(1, [tree(3, [tree(2)]), tree(2, [tree(1)]), tree(5), tree(3)])]), 9))"]),
              ("没有", ["print(only_paths(tree(3, [tree(4), tree(1, [tree(3, [tree(2)]), tree(2, [tree(1)]), tree(5), tree(3)])]), 3))"])]),
    ],
    "hw04": [
        func("shuffle", "Shuffle", "改编自官方作业 4 的 Q1。\n\n"
             "实现 `shuffle(s)`：`s` 是元素个数为偶数的序列（列表或 range）。返回一个新列表，把前一半和后一半的元素交错排列：前半的第 1 个、后半的第 1 个、前半的第 2 个、后半的第 2 个……不能修改 `s`。",
             '''
             def shuffle(s):
                 """Return a shuffled list that interleaves the two halves of s.

                 >>> shuffle(range(6))
                 [0, 3, 1, 4, 2, 5]
                 """
                 assert len(s) % 2 == 0, 'len(seq) must be even'
             ''',
             '''
             def shuffle(s):
                 half = len(s) // 2
                 shuffled = []
                 for i in range(half):
                     shuffled.append(s[i])
                     shuffled.append(s[half + i])
                 return shuffled
             ''',
             [("官方示例", ["shuffle(range(6))", "shuffle(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])", "shuffle(shuffle(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']))"]),
              ("不修改原列表", ["s = [1, 2, 3, 4]", "shuffle(s)", "s"])]),
        func("deep-map", "Deep Map", "改编自官方作业 4 的 Q2。\n\n"
             "「嵌套的数字列表」是元素为数字或嵌套数字列表的列表，例如 `[1, [2, [3]], 4]`。实现 `deep_map(f, s)`：把 `s` 中（包括各层嵌套里的）每个数字 `x` 原地替换成 `f(x)`。"
             "**不能创建新的列表**，要直接修改原来的列表；函数返回 `None`。可以用 `type(x) == list` 判断 `x` 是不是列表。",
             '''
             def deep_map(f, s):
                 """Replace all non-list elements x with f(x) in the nested list s.

                 >>> six = [1, 2, [3, [4], 5], 6]
                 >>> deep_map(lambda x: x * x, six)
                 >>> six
                 [1, 4, [9, [16], 25], 36]
                 """
             ''',
             '''
             def deep_map(f, s):
                 for i in range(len(s)):
                     if type(s[i]) == list:
                         deep_map(f, s[i])
                     else:
                         s[i] = f(s[i])
             ''',
             [("平方", ["six = [1, 2, [3, [4], 5], 6]", "deep_map(lambda x: x * x, six)", "six"]),
              ("不创建新列表", ["s = [3, [1, [4, [1]]]]", "s1 = s[1]", "s2 = s1[1]", "deep_map(lambda x: x + 1, s)", "s", "s1 is s[1]", "s2 is s1[1]"])]),
        func("total-mass", "Mass", "改编自官方作业 4 的 Q3。\n\n" + MOBILE_NOTE + "\n\n实现 `total_mass(m)`：`m` 是行星或活动雕塑，返回它的总质量（所有行星质量之和）。",
             MOBILE + PLANET + '''
def total_mass(m):
    """Return the total mass of m, a planet or mobile.

    >>> t, u, v = examples()
    >>> total_mass(t)
    3
    """
''',
             MOBILE + PLANET + '''
def total_mass(m):
    if is_planet(m):
        return mass(m)
    return total_mass(end(left(m))) + total_mass(end(right(m)))
''',
             [("官方示例", ["total_mass(examples()[0])", "total_mass(examples()[1])", "total_mass(examples()[2])"]), ("一个行星", ["total_mass(planet(7))"])]),
        func("balanced", "Balanced", "改编自官方作业 4 的 Q4。\n\n" + MOBILE_NOTE +
             "\n\n实现 `balanced(m)`：判断活动雕塑 `m` 是否平衡。平衡要同时满足两个条件：左臂的力矩等于右臂的力矩（力矩 = 杆长 × 末端挂着的物体的总质量）；末端挂着的每个活动雕塑本身也平衡。单独一个行星总是平衡的。起始代码里已经有 `total_mass`。",
             MOBILE + PLANET + '''
def total_mass(m):
    if is_planet(m):
        return mass(m)
    return total_mass(end(left(m))) + total_mass(end(right(m)))

def balanced(m):
    """Return whether m is balanced.

    >>> t, u, v = examples()
    >>> balanced(t)
    True
    """
''',
             MOBILE + PLANET + '''
def total_mass(m):
    if is_planet(m):
        return mass(m)
    return total_mass(end(left(m))) + total_mass(end(right(m)))

def balanced(m):
    if is_planet(m):
        return True
    left_end, right_end = end(left(m)), end(right(m))
    torque_left = length(left(m)) * total_mass(left_end)
    torque_right = length(right(m)) * total_mass(right_end)
    return torque_left == torque_right and balanced(left_end) and balanced(right_end)
''',
             [("官方示例", ["balanced(examples()[0])", "balanced(examples()[2])", "balanced(mobile(arm(3, examples()[0]), arm(2, examples()[1])))"]),
              ("子雕塑不平衡", ["balanced(mobile(arm(1, examples()[2]), arm(1, mobile(arm(3, examples()[0]), arm(2, examples()[1])))))"])]),
        func("prune-leaves", "Pruning Leaves", "改编自官方作业 4 的 Q5。\n\n"
             "实现 `prune_leaves(t, vals)`：`vals` 是一个元组。返回一棵新树，去掉 `t` 中所有标签在 `vals` 里的**叶子**；不要删除非叶子节点，也不要删除标签不在 `vals` 里的叶子。如果整棵树都被删掉，返回 `None`。\n\n" + TREE_NOTE,
             TREE + '''
             def prune_leaves(t, vals):
                 """Return a version of t with all leaves that have a label
                 that appears in vals removed.  Return None if the entire tree is
                 pruned away.

                 >>> t = tree(2)
                 >>> print(prune_leaves(t, (1, 2)))
                 None
                 """
             '''.replace("\n             ", "\n"),
             TREE + '''
             def prune_leaves(t, vals):
                 if is_leaf(t) and label(t) in vals:
                     return None
                 new_branches = []
                 for b in branches(t):
                     pruned = prune_leaves(b, vals)
                     if pruned:
                         new_branches.append(pruned)
                 return tree(label(t), new_branches)
             '''.replace("\n             ", "\n"),
             [("整棵删掉", ["print(prune_leaves(tree(2), (1, 2)))"]),
              ("官方示例", ["print_tree(prune_leaves(tree(1, [tree(2), tree(3, [tree(4), tree(5)]), tree(6, [tree(7)])]), (3, 4, 6, 7)))"])],
             hint="先对每个分支递归，再把不是 None 的结果组成新的分支列表。"),
        func("max-path-sum", "Maximum Path Sum", "改编自官方作业 4 的 Q6。\n\n"
             "实现 `max_path_sum(t)`：`t` 是标签为正数的树。返回从根走到某个叶子的所有路径中，标签之和的最大值。\n\n" + TREE_NOTE,
             TREE + '''
             def max_path_sum(t):
                 """Return the maximum root-to-leaf path sum of a tree.

                 >>> t = tree(1, [tree(5, [tree(1), tree(3)]), tree(10)])
                 >>> max_path_sum(t) # 1, 10
                 11
                 """
             '''.replace("\n             ", "\n"),
             TREE + '''
             def max_path_sum(t):
                 if is_leaf(t):
                     return label(t)
                 return label(t) + max([max_path_sum(b) for b in branches(t)])
             '''.replace("\n             ", "\n"),
             [("官方示例", ["max_path_sum(tree(1, [tree(5, [tree(1), tree(3)]), tree(10)]))"]), ("更深", ["max_path_sum(tree(5, [tree(4, [tree(1), tree(3)]), tree(2, [tree(10), tree(3)])]))"]), ("只有根", ["max_path_sum(tree(7))"])]),
    ],
}
