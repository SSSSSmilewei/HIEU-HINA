# 级数的比较

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：与调和级数比较

我们要用黎曼和比较

$$
\sum_{n=1}^\infty \frac1n
$$

和 $\displaystyle\int_1^\infty \frac{dx}{x}$，以证明这个级数发散。同样的推理也适用于前面两个例子。

我们用 $\Delta x = 1$ 的黎曼和计算 $y = \dfrac1x$ 的图像下方的面积。还可以选择计算上黎曼和还是下黎曼和；两个我们都做。

> 图 1：$y = \dfrac1x$ 的上黎曼和（未按比例画）：从 $x = 1$ 起，宽为 1、高分别为 $1, \frac12, \frac13, \ldots$ 的矩形，都伸到曲线上方。

上黎曼和是图 1 中所示矩形面积之和。如果停在 $N$ 之前的那个矩形，可以看到从 1 到 $N$ 曲线下方的面积是 $\displaystyle\int_1^N \frac{dx}{x}$，它小于这些矩形的面积之和：

$$
\int_1^N \frac{dx}{x} < 1 + \frac12 + \frac13 + \cdots + \frac{1}{N - 1}.
$$

（这里只有 $N - 1$ 个矩形，因为 1 和 $N$ 之间的距离是 $N - 1$。）如果 $S_N = 1 + \frac12 + \frac13 + \cdots + \frac1N$，那么因为和里多了一项，有

$$
\int_1^N \frac{dx}{x} < 1 + \frac12 + \frac13 + \cdots + \frac{1}{N - 1} < S_N.
$$

于是我们知道积分的值小于 $S_N$ 的值。这让我们能确凿地证明这个级数发散：

$$
\int_1^N \frac{dx}{x} < S_N \;\Longrightarrow\; \ln x\Big|_1^N < S_N \;\Longrightarrow\; \ln N - \ln 1 < S_N \;\Longrightarrow\; \ln N < S_N.
$$

随着 $N$ 趋于无穷大，$\ln N$ 趋于无穷大，所以 $S_N$ 也必定趋于无穷大。按定义，

$$
\sum_{n=1}^\infty \frac1n = \lim_{N \to \infty} S_N,
$$

所以级数 $\displaystyle\sum_{n=1}^\infty \frac1n$ 发散。

> 图 2：$y = \dfrac1x$ 的下黎曼和（未按比例画）：从 $x = 1$ 起，宽为 1、高分别为 $\frac12, \frac13, \frac14, \ldots$ 的矩形，都在曲线下方。

现在用下黎曼和来看 $S_N$ 趋于无穷大的速度和 $\displaystyle\int_1^N \frac{dx}{x}$ 一样。因为图 2 中所示矩形的面积之和小于曲线下方的面积，我们知道

$$
\int_1^N \frac{dx}{x} > \frac12 + \frac13 + \cdots + \frac1N = S_N - 1.
$$

回忆 $\displaystyle\int_1^N \frac{dx}{x} = \ln N$，于是

$$
S_N - 1 < \int_1^N \frac{dx}{x} \;\Longrightarrow\; S_N < (\ln N) + 1.
$$

把它和上黎曼和的结果结合起来，得出

$$
\ln N < S_N < (\ln N) + 1.
$$

$S_N$ 的值很难精确算出，但现在我们知道它在 $\ln N$ 和 $(\ln N) + 1$ 之间，而这两个我们会算。

## 片段 2：比较判别法

**积分比较**

我们借助 $\displaystyle\int_1^\infty \frac{dx}{x}$、用黎曼和来理解 $\displaystyle\sum_1^\infty \frac1n$ 时，用的就是积分比较；在这一讲里，我们还在积分和级数之间做了其他几个比较。现在学习这个技巧背后的一般理论。

**定理**：如果 $f(x)$ 在从 1 到无穷大的区间上递减且 $f(x) > 0$，那么和 $\displaystyle\sum_1^\infty f(n)$ 与积分 $\displaystyle\int_1^\infty f(x)\,dx$ 要么都发散，要么都收敛，并且

$$
\left|\sum_{n=1}^\infty f(n) - \int_1^\infty f(x)\,dx\right| < f(1).
$$

例如，对 $S_N = \displaystyle\sum_1^N \frac1n$，我们证明了 $|S_N - \ln N| < 1$。

因为无穷级数的和很难算，而反常积分容易算，这是一个极其有用的定理。

**极限比较**

**定理**：如果 $f(n) \sim g(n)$（即 $\displaystyle\lim_{n \to \infty} \frac{f(n)}{g(n)} = 1$），并且对所有 $n$ 有 $g(n) > 0$，那么 $\displaystyle\sum_{n=1}^\infty f(n)$ 和 $\displaystyle\sum_{n=1}^\infty g(n)$ 要么都收敛，要么都发散。

这是说，如果 $f$ 和 $g$ 在尾巴上的表现相同，它们的收敛性质也相似。

## 片段 3：比较的例子

**例**：$\displaystyle\sum_{n=0}^\infty \frac{1}{\sqrt{n^2 + 1}}$。

我们知道 $\dfrac{1}{\sqrt{n^2 + 1}}$ 与 $\dfrac{1}{\sqrt{n^2}} = \dfrac1n$ 相当，所以由极限比较可知，$\displaystyle\sum_{n=1}^\infty \frac{1}{\sqrt{n^2 + 1}}$ 和 $\displaystyle\sum_{n=1}^\infty \frac1n$ 同时收敛或同时发散。前面证明了 $\displaystyle\sum_{n=1}^\infty \frac1n$ 发散，所以 $\displaystyle\sum_{n=0}^\infty \frac{1}{\sqrt{n^2 + 1}}$ 也一定发散。

注意 $\displaystyle\sum_{n=0}^\infty \frac{1}{\sqrt{n^2 + 1}}$ 里可以包括 $n = 0$ 那一项，而 $\displaystyle\sum_{n=1}^\infty \frac1n$ 里不行。这没关系；极限比较判别法只关心长远的行为，不关心开头的部分和。

**例**：$\displaystyle\sum_{n=2}^\infty \frac{1}{\sqrt{n^5 - n^2}}$。

因为分母里有减法，要小心别除以零；我们让级数从 $n = 2$ 开始。

我们把 $\dfrac{1}{\sqrt{n^5 - n^2}}$ 和 $\dfrac{1}{\sqrt{n^5}} = \dfrac{1}{n^{5/2}}$ 比较。如果选对了放在分子上的函数，证明它们相似就比较简单：

$$
\lim_{n \to \infty} \frac{f(n)}{g(n)} = \lim_{n \to \infty} \frac{\frac{1}{\sqrt{n^5}}}{\frac{1}{\sqrt{n^5 - n^2}}} = \lim_{n \to \infty} \frac{\sqrt{n^5 - n^2}}{\sqrt{n^5}} = \lim_{n \to \infty} \sqrt{\frac{n^5}{n^5} - \frac{n^2}{n^5}} = \sqrt{1 - 0} = 1.
$$

既然两个函数相似，就可以用极限比较判别法，得出：因为 $\displaystyle\sum_{n=1}^\infty \frac{1}{n^{5/2}}$ 收敛（$\frac52 > 1$），$\displaystyle\sum_{n=2}^\infty \frac{1}{\sqrt{n^5 - n^2}}$ 也一定收敛。
