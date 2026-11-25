# 第 3 章　引用、递归与列表（下）：IntList

> 本页是 UC Berkeley CS61B 2026 春季官方教材（Berkeley-CS61B/sp26-gitbook）第 3 章后半部分的中文翻译，原文见页面下方的「教材原文」。代码保持原样，代码中的注释不翻译。第 3 章前半部分（引用与数组）在第 3 讲。

## IntList

现在我们真正弄懂了海象之谜，可以开始构建自己的列表类了。

原来，一个非常基础的列表实现起来易如反掌，如下所示：

```java
public class IntList {
    public int first;
    public IntList rest;        

    public IntList(int f, IntList r) {
        first = f;
        rest = r;
    }
}
```

你可能记得 61A 里有类似的东西，叫「链表」（Linked List）。

这样的列表用起来很难看。例如，如果想构造一个包含 5、10、15 这几个数的列表，可以这样做：

```java
IntList L = new IntList(5, null);
L.rest = new IntList(10, null);
L.rest.rest = new IntList(15, null);
```

也可以倒着构造列表，代码稍微好看一点，但更难理解：

```java
IntList L = new IntList(15, null);
L = new IntList(10, L);
L = new IntList(5, L);
```

虽然原则上可以用 IntList 存放任何整数列表，但写出来的代码会相当难看，而且容易出错。我们采用面向对象编程的惯用策略：给类添加一些辅助方法来完成基本的任务。

**size 和 iterativeSize**

我们想给 `IntList` 类添加一个方法 `size`，这样调用 `L.size()` 就能得到 `L` 中的元素个数。

在读本章剩下的部分之前，先试着自己写一写 `size` 和 `iterativeSize` 方法。`size` 应该用递归，`iterativeSize` 不应该用递归。先自己试试再看我是怎么做的，大概能学到更多。两段视频现场演示了怎样实现这些方法。

我的 `size` 方法如下：

```java
/** Return the size of the list using... recursion! */
public int size() {
    if (rest == null) {
        return 1;
    }
    return 1 + this.rest.size();
}
```

关于递归代码，要记住的关键一点是需要一个基本情形（base case）。在这里，最合理的基本情形是 rest 为 `null`，这时列表的大小是 1。

练习：你可能会想，为什么不写成 `if (this == null) return 0;` 这样？为什么这样不行？

答案：想想调用 size 时发生了什么。你是在一个对象上调用它，例如 L.size()。如果 L 是 null，就会得到空指针（NullPointer）错误！

我的 `iterativeSize` 方法如下。我建议你写迭代式的数据结构代码时，用 `p` 作为变量名，提醒自己这个变量存的是一个指针。你需要这个指针，因为在 Java 里不能给「this」重新赋值。[这篇 Stack Overflow 帖子](https://stackoverflow.com/questions/23021377/reassign-this-in-java-class) 下面的回复简单解释了原因。

```java
/** Return the size of the list using no recursion! */
public int iterativeSize() {
    IntList p = this;
    int totalSize = 0;
    while (p != null) {
        totalSize += 1;
        p = p.rest;
    }
    return totalSize;
}
```

**get**

虽然 `size` 方法让我们能得到列表的大小，但我们还没有简单的办法取得列表的第 i 个元素。

练习：写一个方法 `get(int i)`，返回列表的第 i 项。例如，如果 `L` 是 5 -> 10 -> 15，那么 `L.get(0)` 应该返回 5，`L.get(1)` 应该返回 10，`L.get(2)` 应该返回 15。对于无效的 `i`（太大或太小），你的代码怎样表现都无所谓。

解答见上面的讲座视频或 lectureCode 仓库。

注意我们写的这个方法需要线性时间！也就是说，如果列表有 1,000,000 项，取最后一项要花的时间会比短列表长得多。在以后的讲座里，我们会看到另一种实现列表的方法，可以避免这个问题。
