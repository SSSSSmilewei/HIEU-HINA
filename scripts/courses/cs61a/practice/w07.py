"""第 6–7 周：可变性、迭代器、生成器。"""
from qhelp import choice, func, text, wwpd
from practice.w05 import TREE, TREE_NOTE

LAB5M = "改编自官方实验 5 的 Q1「WWPD: List-Mutation」。"
LAB5I = "改编自官方实验 5 的 Q5「WWPD: Iterators」。迭代器取完时填 `StopIteration`。"
D = lambda s: s.replace("\n             ", "\n")

PRACTICE = {
    "lec15": [
        wwpd("mut-1", ">>> s = [6, 7, 8]", "print(s.append(6))", "None", "append 直接修改列表，返回 None；print 把 None 显示出来。", LAB5M),
        wwpd("mut-2", ">>> s = [6, 7, 8]\n>>> s.append(6)\n>>> s.insert(0, 9)", "s", "[9, 6, 7, 8, 6]", "insert(0, 9) 把 9 插到下标 0 的位置。", LAB5M),
        wwpd("mut-3", ">>> s = [9, 6, 7, 8, 6]\n>>> x = s.pop(1)\n>>> s.remove(x)", "s", "[9, 7, 8]", "pop(1) 取出并删除下标 1 的元素 6；remove(6) 再删除第一个等于 6 的元素。", LAB5M),
        wwpd("mut-4", ">>> s = [9, 7, 8]\n>>> a, b = s, s[:]", "b is s", "False", "切片 s[:] 创建了一个新列表，值相等但不是同一个对象；a 才和 s 是同一个对象。", LAB5M),
        wwpd("mut-5", ">>> s = [9, 7, 8]\n>>> a, b = s, s[:]\n>>> a.pop()\n8", "a + b", "[9, 7, 9, 7, 8]", "a 和 s 是同一个列表，pop 之后是 [9, 7]；b 是之前的拷贝 [9, 7, 8]。", LAB5M),
        wwpd("mut-6", ">>> s = [3]\n>>> s.extend([4, 5])\n>>> s.extend([s.append(9), s.append(10)])", "s", "[3, 4, 5, 9, 10, None, None]",
             "先求 extend 的参数：两次 append 先把 9、10 加到 s 末尾，并各自返回 None；然后把 [None, None] 接到 s 后面。", LAB5M),
    ],
    "lab05": [
        func("insert-items", "Insert Items", "改编自官方实验 5 的 Q2。\n\n"
             "实现 `insert_items(s, before, after)`：在列表 `s` 中每个等于 `before` 的元素后面插入 `after`，**原地修改** `s` 并返回 `s`。不能创建新的列表。注意 `before` 和 `after` 可能相等。",
             '''
             def insert_items(s, before, after):
                 """Insert after into s following each occurrence of before and then return s.

                 >>> test_s = [1, 5, 8, 5, 2, 3]
                 >>> new_s = insert_items(test_s, 5, 7)
                 >>> new_s
                 [1, 5, 7, 8, 5, 7, 2, 3]
                 >>> new_s is test_s
                 True
                 """
             ''',
             '''
             def insert_items(s, before, after):
                 index = 0
                 while index < len(s):
                     if s[index] == before:
                         s.insert(index + 1, after)
                         index += 1
                     index += 1
                 return s
             ''',
             [("官方示例", ["test_s = [1, 5, 8, 5, 2, 3]", "new_s = insert_items(test_s, 5, 7)", "new_s", "new_s is test_s"]),
              ("末尾", ["insert_items([1, 2, 1, 2, 3, 3], 3, 4)"]),
              ("before 等于 after", ["large_s = [1, 4, 8]", "large_s2 = insert_items(large_s, 4, 4)", "large_s2", "large_s3 = insert_items(large_s2, 4, 6)", "large_s3", "large_s3 is large_s"])],
             hint="插入之后，要跳过刚插入的元素，否则当 before 等于 after 时会无限插下去。"),
        func("group-by", "Group By", "改编自官方实验 5 的 Q3。\n\n"
             "实现 `group_by(s, fn)`：返回一个字典，把 `s` 的元素按 `fn(元素)` 的结果分组——每个不同的结果是一个键，值是结果等于这个键的所有元素组成的列表（保持在 `s` 中的先后顺序）。",
             '''
             def group_by(s, fn):
                 """Return a dictionary of lists that together contain the elements of s.
                 The key for each list is the value that fn returns when called on any of the
                 values of that list.

                 >>> group_by([12, 23, 14, 45], lambda p: p // 10)
                 {1: [12, 14], 2: [23], 4: [45]}
                 """
                 grouped = {}
                 for ____ in ____:
                     key = ____
                     if key in grouped:
                         ____
                     else:
                         grouped[key] = ____
                 return grouped
             ''',
             '''
             def group_by(s, fn):
                 grouped = {}
                 for x in s:
                     key = fn(x)
                     if key in grouped:
                         grouped[key].append(x)
                     else:
                         grouped[key] = [x]
                 return grouped
             ''',
             [("官方示例", ["group_by([12, 23, 14, 45], lambda p: p // 10)", "group_by(range(-3, 4), lambda x: x * x)"])]),
        func("sprout-leaves", "Sprout Leaves", "改编自官方实验 5 的 Q4。\n\n"
             "实现 `sprout_leaves(t, leaves)`：返回一棵新树，和 `t` 一样，只是原来的每个叶子下面都长出新的分支，`leaves` 里的每个标签各一个。\n\n" + TREE_NOTE,
             TREE + D('''
             def sprout_leaves(t, leaves):
                 """Sprout new leaves containing the labels in leaves at each leaf of
                 the original tree t and return the resulting tree.

                 >>> t1 = tree(1, [tree(2), tree(3)])
                 >>> print_tree(sprout_leaves(t1, [4, 5]))
                 1
                   2
                     4
                     5
                   3
                     4
                     5
                 """
             '''),
             TREE + D('''
             def sprout_leaves(t, leaves):
                 if is_leaf(t):
                     return tree(label(t), [tree(leaf) for leaf in leaves])
                 return tree(label(t), [sprout_leaves(s, leaves) for s in branches(t)])
             '''),
             [("官方示例 1", ["print_tree(sprout_leaves(tree(1, [tree(2), tree(3)]), [4, 5]))"]), ("官方示例 2", ["print_tree(sprout_leaves(tree(1, [tree(2, [tree(3)])]), [6, 1, 2]))"])]),
        func("count-occurrences", "Count Occurrences", "改编自官方实验 5 的 Q6。\n\n"
             "实现 `count_occurrences(t, n, x)`：`t` 是迭代器，返回 `t` 的**前 `n` 个**元素中等于 `x` 的个数。只能对 `t` 调用恰好 `n` 次 `next`（可以假定 `t` 至少有 `n` 个元素）。",
             '''
             def count_occurrences(t, n, x):
                 """Return the number of times that x is equal to one of the
                 first n elements of iterator t.

                 >>> s = iter([10, 9, 10, 9, 9, 10, 8, 8, 8, 7])
                 >>> count_occurrences(s, 10, 9)
                 3
                 """
             ''',
             '''
             def count_occurrences(t, n, x):
                 count = 0
                 for _ in range(n):
                     if next(t) == x:
                         count += 1
                 return count
             ''',
             [("官方示例", ["count_occurrences(iter([10, 9, 10, 9, 9, 10, 8, 8, 8, 7]), 10, 9)", "count_occurrences(iter([10, 9, 10, 9, 9, 10, 8, 8, 8, 7]), 3, 10)"]),
              ("迭代器只前进 n 步", ["u = iter([3, 2, 2, 2, 1, 2, 1, 4, 4, 5, 5, 5])", "count_occurrences(u, 1, 3)", "count_occurrences(u, 3, 2)", "list(u)"])]),
        func("pathsum", "Path Sum（选做）", "改编自官方实验 5 的 Q7。\n\n"
             "实现 `pathsum(t, n)`：如果存在一条从根走到**叶子**的路径，路径上的数字之和等于 `n`，返回 `True`，否则返回 `False`。\n\n" + TREE_NOTE,
             TREE + D('''
             def pathsum(t, n):
                 """
                 >>> my_tree = tree(2, [tree(3, [tree(5), tree(7)]), tree(4)])
                 >>> pathsum(my_tree, 12) # 2 -> 3 -> 7
                 True
                 >>> pathsum(my_tree, 5)  # A path that doesn't reach a leaf such as 2 -> 3 doesn't count
                 False
                 """
             '''),
             TREE + D('''
             def pathsum(t, n):
                 if is_leaf(t):
                     return label(t) == n
                 return any([pathsum(b, n - label(t)) for b in branches(t)])
             '''),
             [("官方示例", ["pathsum(tree(2, [tree(3, [tree(5), tree(7)]), tree(4)]), 12)", "pathsum(tree(2, [tree(3, [tree(5), tree(7)]), tree(4)]), 5)",
                         "pathsum(tree(2, [tree(3, [tree(5), tree(7)]), tree(4)]), 6)"])]),
    ],
    "lec16": [
        wwpd("iter-1", ">>> s = [1, 2, 3, 4]\n>>> t = iter(s)", "next(s)", "Error", "列表是可迭代对象，但不是迭代器，不能直接对它调用 next，会报 TypeError。", LAB5I),
        wwpd("iter-2", ">>> s = [1, 2, 3, 4]\n>>> t = iter(s)\n>>> next(t)\n1\n>>> next(t)\n2", "next(iter(s))", "1", "iter(s) 新建了一个迭代器，从头开始，与 t 互不影响。", LAB5I),
        wwpd("iter-3", ">>> s = [1, 2, 3, 4]\n>>> t = iter(s)\n>>> next(t)\n1\n>>> next(t)\n2\n>>> u = t\n>>> next(u)\n3", "next(t)", "4", "u 和 t 是同一个迭代器，u 前进了，t 也就前进了。", LAB5I),
        wwpd("iter-4", ">>> r = range(6)\n>>> r_iter = iter(r)\n>>> next(r_iter)\n0", "[x + 1 for x in r_iter]", "[2, 3, 4, 5, 6]", "r_iter 已经取走了 0，只剩 1 到 5。", LAB5I),
        wwpd("iter-5", ">>> r = range(6)\n>>> r_iter = iter(r)\n>>> next(r_iter)\n0\n>>> [x + 1 for x in r_iter]\n[2, 3, 4, 5, 6]", "next(r_iter)", "StopIteration", "迭代器已经取完，再调用 next 会引发 StopIteration。", LAB5I),
        wwpd("iter-6", ">>> map_iter = map(lambda x : x + 10, range(5))\n>>> next(map_iter)\n10\n>>> next(map_iter)\n11", "list(map_iter)", "[12, 13, 14]", "map 返回惰性的迭代器，list 取出剩下的所有元素。", LAB5I),
    ],
    "lec17": [
        text("big-fib", "改编自官方讨论课 6 的 Q1「Big Fib」。\n\n```py\ndef gen_fib():\n    n, add = 0, 1\n    while True:\n        yield n\n        n, add = n + add, n\n```\n\n`gen_fib()` 依次产出所有斐波那契数 0、1、1、2、3、5……。表达式 `next(filter(lambda n: n > 2026, gen_fib()))` 的值是多少？",
             ["2584"], "filter 也是惰性的，只取到第一个大于 2026 的斐波那契数为止：…1597、2584，所以是 2584。虽然 gen_fib 是无限的，这个表达式仍然会结束。"),
        func("differences", "Something Different", "改编自官方讨论课 6 的 Q3。\n\n"
             "实现生成器函数 `differences(t)`：`t` 是非空的数字迭代器，依次产出每对相邻元素之差（后一个减前一个）。`t` 有 `n` 个元素时，产出 `n - 1` 个差。",
             '''
             def differences(t):
                 """Yield the differences between adjacent values from iterator t.

                 >>> list(differences(iter([5, 2, -100, 103])))
                 [-3, -102, 203]
                 """
             ''',
             '''
             def differences(t):
                 last_x = next(t)
                 for x in t:
                     yield x - last_x
                     last_x = x
             ''',
             [("官方示例", ["list(differences(iter([5, 2, -100, 103])))", "next(differences(iter([39, 100])))"]), ("一个元素", ["list(differences(iter([7])))"])]),
    ],
    "disc06": [
        func("repeated", "Repeated", "改编自官方讨论课 6 的 Q2。\n\n"
             "实现 `repeated(t, k)`：`t` 是迭代器，`k` 大于 1。返回 `t` 中第一个**连续出现 `k` 次**的值，对 `t` 调用 `next` 的次数要尽可能少。",
             '''
             def repeated(t, k):
                 """Return the first value in iterator t that appears k times in a row,
                 calling next on t as few times as possible.

                 >>> s = iter([10, 9, 10, 9, 9, 10, 8, 8, 8, 7])
                 >>> repeated(s, 2)
                 9
                 """
                 assert k > 1
             ''',
             '''
             def repeated(t, k):
                 count, last_item = 0, None
                 while True:
                     item = next(t)
                     if item == last_item:
                         count += 1
                     else:
                         last_item, count = item, 1
                     if count == k:
                         return item
             ''',
             [("官方示例", ["repeated(iter([10, 9, 10, 9, 9, 10, 8, 8, 8, 7]), 2)", "repeated(iter([10, 9, 10, 9, 9, 10, 8, 8, 8, 7]), 3)"]),
              ("同一个迭代器调用两次", ["u = iter([3, 2, 2, 2, 1, 2, 1, 4, 4, 5, 5, 5])", "repeated(u, 3)", "repeated(u, 3)"])]),
        func("partition-gen", "Partitions", "改编自官方讨论课 6 的 Q4。\n\n"
             "实现生成器函数 `partition_gen(n, m)`：产出把 `n` 拆成若干个不超过 `m` 的正整数之和的所有方式，每种方式是一个形如 `'1 + 2 + 3'` 的字符串（从小到大写）。思路和课上的树形递归 `count_partitions` 一样，只是把每个结果 `yield` 出来。",
             '''
             def partition_gen(n, m):
                 """Yield the partitions of n using parts up to size m.

                 >>> for partition in sorted(partition_gen(6, 4)):
                 ...     print(partition)
                 1 + 1 + 1 + 1 + 1 + 1
                 1 + 1 + 1 + 1 + 2
                 1 + 1 + 1 + 3
                 1 + 1 + 2 + 2
                 1 + 1 + 4
                 1 + 2 + 3
                 2 + 2 + 2
                 2 + 4
                 3 + 3
                 """
                 assert n > 0 and m > 0
             ''',
             '''
             def partition_gen(n, m):
                 if n == m:
                     yield str(n)
                 if n - m > 0:
                     for p in partition_gen(n - m, m):
                         yield p + ' + ' + str(m)
                 if m > 1:
                     yield from partition_gen(n, m-1)
             ''',
             [("6 和 4", ["sorted(partition_gen(6, 4))"]), ("4 和 2", ["sorted(partition_gen(4, 2))"])]),
        func("squares", "Squares", "改编自官方讨论课 6 的 Q5。\n\n"
             "实现生成器函数 `squares(total, k)`：产出所有由不小于 `k*k` 的完全平方数组成、和为 `total` 的列表，每个列表从大到小排列。",
             '''
             def squares(total, k):
                 """Yield the ways in which perfect squares greater or equal to k*k sum to total.

                 >>> list(squares(10, 1))  # All lists of perfect squares that sum to 10
                 [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [4, 1, 1, 1, 1, 1, 1], [4, 4, 1, 1], [9, 1]]
                 """
                 assert total > 0 and k > 0
             ''',
             '''
             def squares(total, k):
                 if total == k * k:
                     yield [k * k]
                 elif total > k * k:
                     for s in squares(total - k * k, k):
                         yield s + [k*k]
                     yield from squares(total, k + 1)
             ''',
             [("官方示例", ["list(squares(10, 1))", "list(squares(20, 2))"])]),
        func("church-generator", "Church Generator", "改编自官方讨论课 6 的 Q6。\n\n"
             "实现生成器函数 `church_generator(f)`：依次产出一个个函数，第一个函数原样返回参数，之后每个函数都比前一个多把 `f` 作用一次。",
             '''
             def church_generator(f):
                 """Takes in a function f and yields functions which apply f
                 to their argument one more time than the previously generated
                 function.

                 >>> increment = lambda x: x + 1
                 >>> church = church_generator(increment)
                 >>> [next(church)(0) for _ in range(5)]
                 [0, 1, 2, 3, 4]
                 """
             ''',
             '''
             def church_generator(f):
                 g = lambda x: x
                 while True:
                     yield g
                     g = (lambda g: lambda x: f(g(x)))(g)
             ''',
             [("加一", ["church = church_generator(lambda x: x + 1)", "[next(church)(0) for _ in range(5)]"]), ("乘二", ["church = church_generator(lambda x: x * 2)", "[next(church)(1) for _ in range(6)]"])],
             hint="小心闭包：每个新函数要记住的是「上一个函数」，可以用一个立即调用的 lambda 把当前的 g 固定下来。"),
    ],
    "hw05": [
        func("hailstone-gen", "Infinite Hailstone", "改编自官方作业 5 的 Q1。\n\n"
             "实现生成器函数 `hailstone(n)`：依次产出从 `n` 开始的冰雹序列（偶数除以 2，奇数乘 3 加 1）；到达 1 之后，无限地一直产出 1。",
             '''
             def hailstone(n):
                 """
                 Yields the elements of the hailstone sequence starting at n.
                 At the end of the sequence, yield 1 infinitely.

                 >>> hail_gen = hailstone(10)
                 >>> [next(hail_gen) for _ in range(10)]
                 [10, 5, 16, 8, 4, 2, 1, 1, 1, 1]
                 """
             ''',
             '''
             def hailstone(n):
                 yield n
                 if n == 1:
                     yield from hailstone(n)
                 elif n % 2 == 0:
                     yield from hailstone(n // 2)
                 else:
                     yield from hailstone(n * 3 + 1)
             ''',
             [("官方示例", ["hail_gen = hailstone(10)", "[next(hail_gen) for _ in range(10)]", "next(hail_gen)"]), ("从 1 开始", ["g = hailstone(1)", "[next(g) for _ in range(3)]"])]),
        func("merge", "Merge", "改编自官方作业 5 的 Q2。\n\n"
             "实现 `merge(a, b)`：`a`、`b` 是从小到大排列的无限迭代器。返回一个生成器，按从小到大的顺序产出两者的所有元素，**相同的值只产出一次**。",
             '''
             def sequence(start, step):
                 while True:
                     yield start
                     start += step

             def merge(a, b):
                 """
                 Return a generator that has all of the elements of infinite iterators a and b,
                 in increasing order, without duplicates.

                 >>> a = sequence(2, 3) # 2, 5, 8, 11, 14, ...
                 >>> b = sequence(3, 2) # 3, 5, 7, 9, 11, 13, 15, ...
                 >>> result = merge(a, b) # 2, 3, 5, 7, 8, 9, 11, 13, 14, 15
                 >>> [next(result) for _ in range(10)]
                 [2, 3, 5, 7, 8, 9, 11, 13, 14, 15]
                 """
             ''',
             '''
             def sequence(start, step):
                 while True:
                     yield start
                     start += step

             def merge(a, b):
                 a_val, b_val = next(a), next(b)
                 while True:
                     if a_val == b_val:
                         yield a_val
                         a_val, b_val = next(a), next(b)
                     elif a_val < b_val:
                         yield a_val
                         a_val = next(a)
                     else:
                         yield b_val
                         b_val = next(b)
             ''',
             [("官方示例", ["result = merge(sequence(2, 3), sequence(3, 2))", "[next(result) for _ in range(10)]"]), ("全部重复", ["r = merge(sequence(1, 1), sequence(1, 1))", "[next(r) for _ in range(5)]"])]),
        func("stair-ways", "Stair Ways", "改编自官方作业 5 的 Q3。\n\n"
             "上一段 `n` 级的楼梯，每次可以上 1 级或 2 级。实现生成器函数 `stair_ways(n)`，产出所有不同的上法，每种上法是一个由每步级数组成的列表。",
             '''
             def stair_ways(n):
                 """
                 Yield all the ways to climb a set of n stairs taking
                 1 or 2 steps at a time.

                 >>> list(stair_ways(0))
                 [[]]
                 >>> s_w = stair_ways(4)
                 >>> sorted([next(s_w) for _ in range(5)])
                 [[1, 1, 1, 1], [1, 1, 2], [1, 2, 1], [2, 1, 1], [2, 2]]
                 >>> list(s_w) # Ensure you're not yielding extra
                 []
                 """
             ''',
             '''
             def stair_ways(n):
                 if n == 0:
                     yield []
                 elif n == 1:
                     yield [1]
                 else:
                     for way in stair_ways(n - 1):
                         yield [1] + way
                     for way in stair_ways(n - 2):
                         yield [2] + way
             ''',
             [("官方示例", ["list(stair_ways(0))", "s_w = stair_ways(4)", "sorted([next(s_w) for _ in range(5)])", "list(s_w)"]), ("3 级", ["sorted(stair_ways(3))"])]),
        func("yield-paths", "Yield Paths", "改编自官方作业 5 的 Q4。\n\n"
             "实现生成器函数 `yield_paths(t, target)`：产出从根到每个标签为 `target` 的节点的路径，每条路径是从根开始的标签列表。\n\n" + TREE_NOTE,
             TREE + D('''
             def yield_paths(t, target):
                 """
                 Yields all possible paths from the root of t to a node with the label
                 target as a list.

                 >>> t1 = tree(1, [tree(2, [tree(3), tree(4, [tree(6)]), tree(5)]), tree(5)])
                 >>> next(yield_paths(t1, 6))
                 [1, 2, 4, 6]
                 """
                 if label(t) == target:
                     yield ____
                 for b in branches(t):
                     for ____ in ____:
                         yield ____
             '''),
             TREE + D('''
             def yield_paths(t, target):
                 if label(t) == target:
                     yield [target]
                 for b in branches(t):
                     for path in yield_paths(b, target):
                         yield [label(t)] + path
             '''),
             [("官方示例", ["t1 = tree(1, [tree(2, [tree(3), tree(4, [tree(6)]), tree(5)]), tree(5)])", "next(yield_paths(t1, 6))", "sorted(list(yield_paths(t1, 5)))",
                         "t2 = tree(0, [tree(2, [t1])])", "sorted(list(yield_paths(t2, 2)))"])]),
    ],
}
