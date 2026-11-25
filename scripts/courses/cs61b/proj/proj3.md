# 小项目 3：渗流（Percolation）

> 本页是 UC Berkeley CS61B 2026 春季官方项目说明「Mini-Project 3: Percolation」的中文翻译，原文见页面下方的「项目原文」。命令、代码和程序输出保持原样。

> **本站补充（校外学习者请先看）**：本项目的自动评分和提交次数限制（每 24 小时 4 次）都在 Gradescope 上，只对伯克利在读学生开放。不过这个项目在本地就能验证得很好：骨架自带两个基础测试和两个可视化程序，`PercolationTest.java` 里还要自己补测试；代码风格（style）检查用的是 IntelliJ 的 CS 61B 插件（作业 1 里装过，校外也能安装），在本地就能跑。校外学习者请把本地测试全部跑通、两个可视化程序运行正常，就当作完成。照旧：代码保持私有、自己写。

*完成本项目需要以下讲座：*

- [第 14 讲（不相交集）](https://docs.google.com/presentation/d/1-_-YgqNu4uW4ZsUNL-LD7Jdvie3uYTbLz-SD9h7aETY/edit?slide=id.g20e53a1f10d_0_135#slide=id.g20e53a1f10d_0_135)，或[教材第 14 章](https://cs61b-2.gitbook.io/cs61b-textbook-fall-2025/14.-disjoint-sets)。

*组队政策：*本项目不组队。可以和其他同学讨论想法，但不允许共享代码，提交的解答必须是你自己的工作！详见[课程政策页](https://sp26.datastructur.es/policies/#collaboration-policy)。

在这份作业里，我们将用学到的不相交集（disjoint sets）知识来给渗流（percolation）建模。

完成这份作业后，你将……

- 理解如何把不相交集数据结构应用到现实场景中。

## 准备工作

按[作业工作流程指南](https://sp26.datastructur.es/resources/assignment-workflow/)开始这份作业。起始代码在 `proj3` 文件夹里。

> 在这个项目上，你每 24 小时最多只能向 Gradescope 提交 4 次。换句话说，你有 4 个提交令牌（token），每个令牌 24 小时刷新一次。
>
> 与之前的作业不同，**本地不会提供全部测试**，所以你要自己写测试来验证代码的正确性。

对 `Percolation.java`，你必须遵守[代码风格指南](https://sp26.datastructur.es/resources/style-guide/)，你可以在 IntelliJ 里随意次数自查风格。（对你自己写的测试，风格检查器是关闭的。）

## 任务 1：渗流

在这个程序里，我们将编写一个程序，用[蒙特卡洛模拟](https://en.wikipedia.org/wiki/Monte_Carlo_method)（Monte Carlo simulation）来估计渗流阈值的值。

### 介绍视频

本项目有一段介绍视频，见[这个链接](https://www.youtube.com/watch?v=kIYKCsvG6UI&list=PLNSdoiHk6ujjZs46s6XVXEbZUuF1MIO7g)（英文）。视频分三部分：介绍、实现剧透、优化剧透。想要更有挑战性的话，可以无视后面的剧透。如果你更想看 Hug 教授八年前还在普林斯顿时录的一段视频，见[这个链接](https://www.youtube.com/watch?v=o60oHXesOuA)（英文）。注意：这些视频里提到要实现 `PercolationStats.java`；这个类现在我们已经把完整解答给你了，所以不用担心这一步。

### 幻灯片

本项目的幻灯片在[这里](https://docs.google.com/presentation/d/1S0yv4X5qu-aIHA-hHeBItDmpIpRPRC7-Z95XJOhKmVY/edit?usp=sharing)（英文）。因为这是个迷你项目，我们给出了做法上的剧透。想要更大的挑战，可以无视它们。

### 谁关心这个问题？

给定一个由绝缘材料和金属材料随机分布构成的复合系统：需要多大比例的材料是金属，整个复合系统才能导电？给定一个表面有水（或地下有油）的多孔介质：在什么条件下，水能一路渗到最底下（或者油能喷到表面上）？科学家定义了一个叫渗流的抽象过程，来给这类情况建模。

### 模型

我们用一个 N×N 的格点（site）网格来给渗流系统建模。每个格点要么是开放的（open），要么是阻塞的（blocked）。一个*饱满格点*（full site）是一个开放的格点，它可以通过一条由相邻（左、右、上、下）开放格点组成的链，连接到顶行的某个开放格点。如果底行存在一个饱满的开放格点，我们就说系统渗流。换句话说，如果我们把所有与顶行连通的开放格点都灌满，而这个过程也把底行的某个开放格点灌满了，系统就渗流。（在绝缘/金属材料的例子里，开放格点对应金属材料，所以渗流的系统有一条从顶到底的金属通路，电流沿饱满格点导通。在多孔介质的例子里，开放格点对应水可以流过的空隙，所以渗流的系统能让水从顶到底灌满开放格点。）

在下面的图里可以看到，左边的系统里，水能从顶行的一个开放格点出发，顺着相连的开放空隙一路下渗，最终抵达底行的一个开放空隙格点。

而在右边的系统里，顶行格点里的水没有任何路径下渗到底行的开放空隙格点。

![percolates](https://sp26.datastructur.es/assets/projects/proj3/1-percolates.webp)

### `Percolation.java`

要给渗流系统建模，请补全具有以下 API 的 `Percolation` 类：

```
public class Percolation {
  public Percolation(int N)                // create N-by-N grid, with all sites initially blocked
  public void open(int row, int col)       // open the site (row, col) if it is not open already
  public boolean isOpen(int row, int col)  // is the site (row, col) open?
  public boolean isFull(int row, int col)  // is the site (row, col) full?
  public int numberOfOpenSites()           // number of open sites
  public boolean percolates()              // does the system percolate?
}
```

（各行注释的意思依次是：创建 N×N 网格，初始所有格点阻塞；如果格点 (row, col) 尚未开放则开放它；格点 (row, col) 是否开放；格点 (row, col) 是否饱满；开放格点的数量；系统是否渗流。）

通过实现上面 API 里给出的所有方法来填写 `Percolation.java`。

### 渗流问题

在一个著名的科学问题里，研究者关心下面的问题：如果每个格点都独立地以概率 $p$ 被设为开放（从而以概率 $1 − p$ 被阻塞），系统渗流的概率是多少？当 $p$ 等于 0（没有格点开放）时，系统不渗流；当 $p$ 等于 1（所有格点开放）时，系统渗流。下图展示了 20×20 随机网格（左）和 100×100 随机网格（右）中，格点空置概率 $p$ 与渗流概率的关系。

![threshold20](https://sp26.datastructur.es/assets/projects/proj3/2-percolation-threshold20.webp) ![threshold100](https://sp26.datastructur.es/assets/projects/proj3/3-percolation-threshold100.webp)

当 $N$ 足够大时，存在一个阈值 $p^*$：当 $p < p^*$ 时，随机 N×N 网格几乎从不渗流；当 $p > p^*$ 时，随机 N×N 网格几乎总是渗流。目前还没有推导出确定渗流阈值 $p^*$ 的数学解。你的任务是写一个计算机程序来估计 $p^*$。

### `WeightedQuickUnionUF` 类

`WeightedQuickUnionUF` 类由普林斯顿的 `algs4` 库提供，API 如下：

```
public class WeightedQuickUnionUF {
  public WeightedQuickUnionUF(int n)      // creates a UF with n elements
  public int count()                      // number of disjoint sets
  public int find(int p)                  // the root of p's set
  public boolean connected(int p, int q)  // whether p and q are in the same set
  public void union(int p, int q)         // join p and q's sets together
}
```

（各行注释的意思依次是：创建一个含 n 个元素的并查集；不相交集的数量；p 所在集合的根；p 和 q 是否在同一个集合里；把 p 和 q 所在的集合合并。）

> **你的代码必须使用 [`WeightedQuickUnionUF`](https://algs4.cs.princeton.edu/15uf/WeightedQuickUnionUF.java.html) 类！** 它已经替你实现好了，所以不要重新实现并查集（Union Find）ADT。

### 提示

**重要**：我们发布了一组视频，包含这个项目做法上的一些提示！请务必观看；它们能帮你在这份作业上省下大量时间。

- [视频 1：一个小提示](https://youtu.be/-pr7psbTSOU)（英文）
- [视频 2：一个更大的提示](https://youtu.be/gTqM4WvM9D8)（英文）

### 边界情况

按约定，行和列的下标是 0 到 `N` − 1 之间的整数，其中 (0, 0) 是左上角的格点：如果 `open()`、`isOpen()` 或 `isFull()` 的任何参数超出规定范围，抛出 `java.lang.IndexOutOfBoundsException`。构造函数在 `N` ≤ 0 时应抛出 `java.lang.IllegalArgumentException`。

### 性能要求

构造函数的耗时应该与 $N^2$ 成正比；所有方法的耗时都应该是常数时间，加上常数次并查集方法 `union()`、`find()`、`connected()`、`count()` 的调用。满足这些要求有点棘手！你可以先做一个能跑的版本，再想办法让它变快。如何满足速度要求，提示见本说明开头的[视频](https://www.youtube.com/watch?v=kIYKCsvG6UI&list=PLNSdoiHk6ujjZs46s6XVXEbZUuF1MIO7g)。你的 `numberOfOpenSites()` 方法必须花费常数时间。本作业的目标之一，就是学会把一个问题（渗流）转化成一个已经解决的问题（不相交集，又称并查集）。

如果你读到了说明的这个位置还不知道怎么开始，把[这些幻灯片](https://docs.google.com/presentation/d/1S0yv4X5qu-aIHA-hHeBItDmpIpRPRC7-Z95XJOhKmVY/edit?usp=sharing)过一遍，再看看这个[视频](https://www.youtube.com/watch?v=kIYKCsvG6UI&list=PLNSdoiHk6ujjZs46s6XVXEbZUuF1MIO7g)。

## 测试

你会发现 `InteractivePercolationVisualizer` 对检查 `Percolation` 类实现得是否正确非常有帮助。如果你的实现正确，点击单元格应该会打开（并在需要时灌满）那些格点，还会显示开放格点数和系统是否渗流的信息。

在 `tests` 文件夹里，我们提供了两个基础测试。**你应该往 `PercolationTest.java` 里添加更多测试来测你的代码。**

我们还提供两个客户端程序，作为大规模的可视化跟踪。**我们强烈推荐用它们来测试和调试你的 `Percolation` 实现。**

### 示例数据文件

`inputFiles` 目录里有一些配合可视化客户端使用的示例文件，包括下面会用到的 `input20.txt`。

每个输入文件对应的预期输出图像，见[输出](https://sp26.datastructur.es/projects/proj3/#outputs)一节。

### 基于文件的可视化客户端

`PercolationPicture.java` 通过以下步骤做可视化：

- 从文件读入网格大小 N。
- 创建 N×N 的格点网格（初始全部阻塞）。
- 从文件读入一系列要打开的格点（行 i、列 j）。每打开一个格点后，用标准绘图库作图：饱满格点画成浅蓝色，开放（但不饱满）的格点画成白色，阻塞格点画成黑色，格点 (0, 0) 在左上角。

对输入文件 `input20.txt`，程序应该产生下面这些图像所示的输出。这些图像分别对应 50、100、150、204、250 个格点开放的状态。

![percolation50](https://sp26.datastructur.es/assets/projects/proj3/4-percolation-50.webp) ![percolation100](https://sp26.datastructur.es/assets/projects/proj3/5-percolation-100.webp) ![percolation150](https://sp26.datastructur.es/assets/projects/proj3/6-percolation-150.webp)

![percolation204](https://sp26.datastructur.es/assets/projects/proj3/7-percolation-204.webp) ![percolation250](https://sp26.datastructur.es/assets/projects/proj3/8-percolation-250.webp)

你可以这样对这个输入运行可视化程序：在 IntelliJ 的 `Run -> Edit Configurations -> + -> Application` 标签页里传入正确的参数。把 "Main class" 设为 `PercolationPicture`，"Program arguments" 设为一个输入文件（例如 `inputFiles/input20.txt`）。最后点 "Run" 开始运行。

> 打开 `PercolationPicture.java`，按上面的步骤运行可视化程序。用这个工具帮你调试 `Percolation.java` 的方法！

### 交互式可视化客户端

`InteractivePercolationVisualizer.java` 把渗流系统中打开格点的结果做成动画，用鼠标作为输入。它接收一个命令行整数 `N` 指定网格大小。作为附加功能，它会按 `PercolationPicture`（上面描述过）使用的同样格式打印出打开的格点序列，所以可以用它来给测试准备有意思的文件。如果你设计出了有意思的数据文件，欢迎发到 Ed 上。

> 打开 `InteractivePercolationVisualizer.java`，按和 `PercolationPicture` 相同的步骤运行交互式可视化程序。注意，交互版**不需要**提供程序参数。
>
> 用这个工具帮你调试 `Percolation.java` 的方法！

*注：如果使用 IntelliJ，你可以在 Run -> Edit Configurations 里选择运行哪个类（也就是选择运行谁的 main 方法）。更多信息请查 FAQ。*

## 任务 2：回灌

开始测试 `Percolation` 时你会发现：系统渗流之后，可视化程序会把所有与底行开放格点连通的格点也涂成浅蓝色（在那些与顶行连通的格点之外）。（**译注**：原文此处写作 `PercolationVisualizer`，骨架代码里提供的类是 `InteractivePercolationVisualizer`，译文已更正。）

![percolation](https://sp26.datastructur.es/assets/projects/proj3/9-percolation-backwash.webp)

> 修改你的实现，避免回灌（backwash）。
>
> 虽然 Percolation API 正式来说不应该出现回灌，但要修好它需要相当的巧思；不修也只扣很少的分。需要提示的话，见[提示](https://sp26.datastructur.es/projects/proj3/#tips)。

## 任务 3：渗流阈值（不计分）

项目的这一部分不计分，但我们强烈建议你至少读一遍下面的内容，并想一想。

**蒙特卡洛模拟。**要估计渗流阈值，考虑下面的计算实验：

- 把所有格点初始化为阻塞。
- 重复以下步骤，直到系统渗流：

  - 在所有阻塞格点中均匀随机地选一个。
  - 打开这个格点。

- 系统渗流时，已打开格点所占的比例就是渗流阈值的一个估计。

例如，如果按下面的快照在 20×20 网格里打开格点，那么我们对渗流阈值的估计就是 204/400 = 0.51，因为系统在第 204 个格点打开时渗流。这些图像分别对应 50、100、150、204 个格点开放的状态。

![percolation50](https://sp26.datastructur.es/assets/projects/proj3/4-percolation-50.webp) ![percolation100](https://sp26.datastructur.es/assets/projects/proj3/5-percolation-100.webp) ![percolation150](https://sp26.datastructur.es/assets/projects/proj3/6-percolation-150.webp) ![percolation204](https://sp26.datastructur.es/assets/projects/proj3/7-percolation-204.webp)

<details>

<summary>如果你对下面这些计算背后的数学感兴趣，点这里。</summary>

把这个计算实验重复 $T$ 次并取平均，我们就能得到渗流阈值更精确的估计。设 $x_t$ 是第 $t$ 次计算实验中开放格点的比例。样本均值 $\mu$ 给出渗流阈值的估计；样本标准差 $\sigma$ 衡量阈值有多「陡」。

$\mu = \frac{x_1 + x_2 + … + x_T}{T}$，$\sigma^2 = \frac{(x_1 - \mu)^2 + (x_2 - \mu)^2 + … + (x_T - \mu)^2}{T-1}$

假定 $T$ 足够大（比如至少 30），下面的区间给出渗流阈值的 95% 置信区间：

$[\mu - \frac{1.96\sigma}{\sqrt{T}}, \mu + \frac{1.96\sigma}{\sqrt{T}}]$

</details>

要完成一系列计算实验，我们给了你一个 `PercolationStats` 数据类型。

它的构造函数接收两个参数 `N` 和 `T`，在 N×N 网格上执行 `T` 次独立的计算实验（就是上面讨论的那种）。利用这些实验数据，它算出渗流阈值的均值、标准差和 95% 置信区间。

> 打开 `PercolationStats.java`，看一看提供的构造函数和方法。然后运行 `main` 方法，解读结果。关于渗流问题的解答，这些数字告诉你了什么？
>
> 如果你正确实现了 `Percolation.java`，这时你应该已经得到了渗流阈值 `p` 的 95% 置信区间。

## 任务 4：运行时间分析（不计分）

项目的这一部分同样不计分，但我们强烈建议你至少读一遍下面的内容，并想一想。

> 用 QuickFindUF 里的 quick-find 算法实现 `Percolation` 数据类型。用 [Stopwatch](https://introcs.cs.princeton.edu/java/stdlib/Stopwatch.java.html) 测量 `PercolationStats` 在不同 `N` 和 `T` 取值下的总运行时间。`N` 翻倍对总运行时间有什么影响？`T` 翻倍呢？
>
> 再用 `WeightedQuickUnionUF` 里的加权 quick-union 算法实现 `Percolation` 数据类型。同样的问题，你的答案又是什么？

## 提交

**重要**：这份作业要检查代码风格！！你必须遵守[风格指南](https://sp26.datastructur.es/resources/style-guide/)，你可以在 IntelliJ 里随意次数自查。（对你自己写的测试，风格检查器是关闭的。）

我们**不会**因为没检查风格而补发提交令牌。请提前规划，用正确的风格！已警告过你了。

写完本地测试并通过之后，试着提交到自动评分器。你可能会全过，也可能不会。

- 如果挂了正确性测试，说明有一种情况你的本地测试没有覆盖。
- 如果挂了任何计时（timing）测试，说明你的实现不满足上面描述的时间限制。
- 修好所有风格错误之前，自动评分器不会运行。提醒：你在 IntelliJ 里想检查多少次风格都可以：![Run style checker in IntelliJ](https://sp26.datastructur.es/assets/resources/style-guide-img/intellij_style_checker.webp)
- 你的令牌限额是每 24 小时 4 个。我们不会因为忘记 add/commit/push 代码、没跑风格检查等原因补发令牌。

评分：

1. **渗流功能（40%）**
2. **随机测试（40%）**
3. **计时（20%）**

你在 Gradescope 上得到的分数就是本次作业的最终分数（前提是你遵守了[合作政策](https://sp26.datastructur.es/policies/#collaboration-policy)）。

> 本作业最初由普林斯顿大学的 Kevin Wayne 和 Bob Sedgewick 开发，自动评分器由 Josh Hug 为普林斯顿的算法课构建。

## 输出

### greeting57

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/greeting57.webp)

### heart25

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/heart25.webp)

### input10-no

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/input10-no.webp)

### input10

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/input10.webp)

### input1-no

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/input1-no.webp)

### input1

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/input1.webp)

### input20

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/input20.webp)

### input2-no

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/input2-no.webp)

### input2

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/input2.webp)

### input3

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/input3.webp)

### input4

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/input4.webp)

### input50

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/input50.webp)

### input5

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/input5.webp)

### input6

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/input6.webp)

### input7

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/input7.webp)

### input8-dups

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/input8-dups.webp)

### input8-no

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/input8-no.webp)

### input8

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/input8.webp)

### jerry47

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/jerry47.webp)

### sedgewick60

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/sedgewick60.webp)

### snake101

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/snake101.webp)

### snake13

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/snake13.webp)

### wayne98

![](https://sp26.datastructur.es/assets/projects/proj3/outputs/wayne98.webp)
