# 一个和 e 有关的有趣极限

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：又一个可变的指数

求

$$
\lim_{n \to \infty} \left(1 + \frac1n\right)^n
$$

的值。

严格说来，这不是一道微积分题，但我们要用一些微积分来解它。现在讨论它有两个原因：第一，答案非常有意思；第二，它又有一个可变的指数——取极限时，题目里的指数 $n$ 在变化。

每当遇到可变的指数，第一步总是用对数把指数变成一个乘数：

$$
\ln\left[\left(1 + \frac1n\right)^n\right] = n\ln\left(1 + \frac1n\right).
$$

现在我们开始考虑 $n$ 趋于无穷时这个量的极限。我们对 $\Delta x$ 趋于零的极限练习得很多，对数字趋于无穷的极限练习得很少，所以把问题从一个很大的数 $n$ 换成一个很小的数 $\Delta x$，是说得通的。

当 $n$ 趋于无穷时，$\Delta x = 1/n$ 趋于零。如果 $\Delta x = 1/n$，那么 $n = 1/\Delta x$，于是

$$
\lim_{n \to \infty} \left[n\ln\left(1 + \frac1n\right)\right] = \lim_{\Delta x \to 0} \left[\frac{1}{\Delta x}\ln(1 + \Delta x)\right].
$$

这看起来没什么改进，但从 $\ln(1 + \Delta x)$ 中减去 $0 = \ln 1$，就能把它化成熟悉的形式：

$$
\begin{aligned}
\lim_{\Delta x \to 0} \left[\frac{1}{\Delta x}\ln(1 + \Delta x)\right] &= \lim_{\Delta x \to 0} \frac{1}{\Delta x}\bigl(\ln(1 + \Delta x) - \ln 1\bigr) \\
&= \lim_{\Delta x \to 0} \frac{\ln(1 + \Delta x) - \ln 1}{\Delta x} \\
&= \left.\frac{d}{dx}\ln x\right|_{x = 1} = \left.\frac1x\right|_{x = 1} = 1.
\end{aligned}
$$

通过有策略地减去零（$\ln 1$），我们把这个难看的极限变成了一个差商，然后就能用微积分求出它的值。

现在只要倒推回去，求出原来问题的答案：

$$
\lim_{n \to \infty} \left(1 + \frac1n\right)^n = \lim_{n \to \infty} e^{\ln\left[\left(1 + \frac1n\right)^n\right]} = e^{\lim_{n \to \infty} \ln\left[\left(1 + \frac1n\right)^n\right]} = e^1 = e.
$$

没错，

$$
\lim_{n \to \infty} \left(1 + \frac1n\right)^n = e,
$$

我们现在有办法得到 $e$ 的数值了。用这个公式，计算器的精度允许多精确，就能把 $e$ 算得多精确。例如，

$$
\left(1 + \frac{1}{10000}\right)^{10000} \approx 2.7182.
$$

（译注：第二个等号把极限移进指数里，用到了指数函数 $e^x$ 的连续性。原文把 $\ln(1 + \Delta x) - \ln 1$ 除以 $\Delta x$ 这一形式称为「差分方程」，实际指的是差商。）

## 片段 2：e 的一个公式

我们算出：如果 $a_k = \left(1 + \frac1k\right)^k$，那么 $\displaystyle\lim_{k \to \infty} a_k = e$。做法是先证明 $\displaystyle\lim_{k \to \infty} \ln a_k = 1$。因为 $e^{\ln a_k} = a_k$，当 $k$ 趋于无穷时，$a_k = e^{\ln a_k}$ 会趋于 $e^1 = e$。

这里的关键是 $a_k = e^{\ln a_k}$；也就是自然对数函数是指数函数的反函数。

**问**：既然 $a_k$ 趋于 1，$\ln a_k$ 不是应该趋于零吗？

**答**：$\left(1 + \frac1k\right)$ 确实趋于 1，所以 $\ln\left(1 + \frac1k\right)$ 趋于 0。但那不是我们要的极限；我们问的是 $\ln a_k = k \cdot \ln\left(1 + \frac1k\right)$。$\ln\left(1 + \frac1k\right)$ 趋于 0 的同时，$k$ 趋于无穷。所以我们才需要用极限和导数来弄清这个式子的极限是什么。

（译注：「$a_k$ 趋于 1」是提问者的误解；$a_k$ 的底数 $1 + \frac1k$ 趋于 1，但 $a_k$ 本身趋于 $e$。）

我们知道 $\displaystyle\lim_{k \to \infty} a_k = e$，而所有等式都可以倒过来读。所以 $e = \displaystyle\lim_{k \to \infty} \left(1 + \frac1k\right)^k$。换句话说，这个极限就是 $e$ 的一个公式。

换个角度看这个公式，我们发现可以用式子 $\left(1 + \frac1k\right)^k$ 算出一个底数 $e$，使 $e^x$ 的图像在 $x = 0$ 处的斜率为 1。

从几个不同的角度看问题，往往能加深我们对数学的理解；这一讲在导数部分的最后要做的就是这件事。
