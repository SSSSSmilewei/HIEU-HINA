# 第 37 讲：设计函数

> 本页讲义由海纳协会依据官方幻灯片「Designing Functions」整理，不是官方讲义的翻译。教材 Composing Programs 没有与这一讲对应的小节，相关内容可以参考 1.4 节「设计函数」。

## 设计程序的步骤

这一讲介绍《程序设计方法》（How to Design Programs）一书提出的解题过程：

1. **从问题分析到数据定义**：弄清楚有哪些信息要表示、在编程语言里用什么来表示，写出数据定义，并举例说明。
2. **签名、目的说明、函数头**：说明函数接收什么数据、产出什么数据；用一句话回答「这个函数计算什么」；先写一个符合签名的空函数（stub）。
3. **函数示例**：举几个例子，说明函数的目的。
4. **函数模板**：根据数据定义，写出函数的大致框架。例如处理树的函数，框架通常是「处理根节点，再对每个分支递归」。
5. **函数定义**：利用目的说明和示例，填上模板里的空白。
6. **测试**：把示例写成测试，确认函数全部通过。测试能发现错误，也能帮助别人读懂函数。

## 应用：把树转换成字典

实现 `as_dict(t)`：`t` 是标签互不相同的 `Tree` 实例。返回一个字典，每个非叶子节点的标签是一个键，对应的值是它的孩子们的标签组成的列表。

```py
def as_dict(t):
    """Return a dictionary containing a key for each non-leaf label in t for which the
    corresponding value is a list of its children's labels.

    >>> as_dict(Tree(3, [Tree(4, [Tree(7), Tree(9, [Tree(1)])]), Tree(2, [Tree(6), Tree(5)])]))
    {3: [4, 2], 4: [7, 9], 9: [1], 2: [6, 5]}
    """
    result = {}
    def f(x):
        if not x.is_leaf():
            s = []
            result[x.label] = s
            for b in x.branches:
                s.append(b.label)
                f(b)
    f(t)
    return result
```

按照设计步骤：

- 签名：`as_dict` 是「Tree → 从整数到整数列表的字典」；辅助函数 `f` 是「Tree → None」，它的作用是向 `result` 里添加键值对。
- 目的说明：`f(x)` 把 `{x.label: x 的孩子的标签列表}` 加进 `result`，再对每个孩子递归。
- 模板：处理当前节点 + 对每个分支递归。

注意 `result[x.label] = s` 先放进字典、之后再往 `s` 里添加元素也是对的，因为字典里保存的是同一个列表对象。

## 更多树的练习（2015 年秋季期末考试第 3 题的改编）

**路径**是从根开始、到某个叶子结束的一串相邻节点的标签。

### 数出和足够大的路径

实现 `count_big(t, n)`：返回 `t` 中标签之和**不小于** `n` 的路径有多少条。

```py
def count_big(t, n):
    """Return the number of paths in t that have a sum larger or equal to n.

    >>> t = Tree(1, [Tree(2), Tree(3, [Tree(4), Tree(5)])])
    >>> count_big(t, 3)
    3
    >>> count_big(t, 6)
    2
    >>> count_big(t, 9)
    1
    """
    if t.is_leaf():
        return one(t.label >= n)
    else:
        return sum([count_big(b, n - t.label) for b in t.branches])

def one(b):
    if b:
        return 1
    else:
        return 0
```

签名是「(Tree, int) → 路径的条数」。关键在于递归时把要求的和减去当前节点的标签。

### 打印和足够大的路径

实现 `print_big(t, n)`：打印出所有标签之和不小于 `n` 的路径。

```py
def print_big(t, n):
    """Print the paths in t that have a sum larger or equal to n.

    >>> t = Tree(1, [Tree(2), Tree(3, [Tree(4), Tree(5)])])
    >>> print_big(t, 6)
    [1, 3, 4]
    [1, 3, 5]
    """
    def helper(t, p):
        p = p + [t.label]
        if t.is_leaf():
            if sum(p) >= n:
                print(p)
        else:
            for b in t.branches:
                helper(b, p)
    helper(t, [])
```

辅助函数的签名是「(Tree, list[int]) → None」，目的说明是「对一个节点和一条部分路径，延长这条路径，必要时打印出来」。注意用 `p = p + [t.label]` 创建新列表，而不是 `p.append(...)` 修改原列表，否则各个分支会共用同一个列表。

## 课堂演示：计算斐波那契数的几种方法

课上用计时比较了几种计算斐波那契数的方法：朴素的树形递归（指数时间）、迭代（线性时间）、记忆化的递归（线性时间），以及基于比内公式（Binet's formula）的闭式解。闭式解需要计算幂，配合第 24 讲的快速幂可以进一步加快。这个演示说明：同一份规格说明可以有效率相差极大的不同实现。
