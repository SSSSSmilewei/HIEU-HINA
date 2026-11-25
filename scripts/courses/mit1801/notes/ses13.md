# 隐函数求导

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：隐函数求导入门

我们已经学了几个求导数的具体公式和几个一般公式。今天要用链式法则进一步扩大能求导的函数范围。今天的主题是**隐函数求导**（implicit differentiation），它能让我们给许多以前不会求导的函数求导。

## 片段 2：隐函数求导（有理指数法则）

我们知道，如果 $n$ 是整数，$y = x^n$ 的导数是 $nx^{n-1}$。如果 $n$ 不是整数，这个公式还成立吗？也就是说，

$$
\frac{d}{dx}(x^a) = ax^{a-1}
$$

成立吗？

对 $a = 1, 2, \ldots$，我们用导数的定义和二项式定理证明过这个公式。由此也得到了 $a = -1, -2, \ldots$ 时的公式。现在我们要把这个公式推广到有理数 $a = \dfrac{m}{n}$。特别地，这能让我们求 $y = \sqrt[n]{x} = x^{1/n}$ 的导数。

设 $y = x^{m/n}$，其中 $m$ 和 $n$ 是整数。我们想计算 $\dfrac{dy}{dx}$。目前学过的法则似乎都帮不上忙，而如果用导数的定义，就会卡在化简 $(x + \Delta x)^{m/n}$ 上。我们需要一个新想法。

妨碍我们使用导数定义的，是指数的分母 $n$ 迫使我们开 $x$ 的 $n$ 次方。可以把方程两边都取 $n$ 次方来解决这个问题：

$$
y = x^{m/n} \;\Longrightarrow\; y^n = \left(x^{m/n}\right)^n = x^{\frac mn \cdot n} = x^m.
$$

现在如果作用算子 $\dfrac{d}{dx}$ 来求导会怎样？我们有给变量的整数次幂求导的法则；可以把它用到方程 $y^n = x^m$ 的两边：

$$
\frac{d}{dx}y^n = \frac{d}{dx}x^m.
$$

怎样计算 $\dfrac{d}{dx}y^n$？我们知道 $y$ 是 $x$ 的函数，所以可以用链式法则，外层函数是 $y^n$，内层函数是 $y$。设 $u = y^n$，链式法则告诉我们

$$
\frac{du}{dx} = \frac{du}{dy}\frac{dy}{dx},
$$

所以

$$
\frac{d}{dx}y^n = \left(\frac{d}{dy}y^n\right)\frac{dy}{dx} = ny^{n-1}\frac{dy}{dx}.
$$

方程右边是 $\dfrac{d}{dx}x^m = mx^{m-1}$，于是得到

$$
ny^{n-1}\frac{dy}{dx} = mx^{m-1}.
$$

这个方程里只剩下一个未知量 $\dfrac{dy}{dx}$——这正是我们要求的。能解出 $\dfrac{dy}{dx}$，从而求出 $y = x^{m/n}$ 的导数吗？可以，但要做不少代数。

两边除以 $ny^{n-1}$，得到

$$
\frac{dy}{dx} = \frac mn \cdot \frac{x^{m-1}}{y^{n-1}}.
$$

这看起来有希望，但我们想要只用 $x$ 表示的答案，不要掺进 $y$。为了消去 $y$，现在可以把 $y$ 换成 $x^{m/n}$。（求导之前不能这样做，因为我们不知道怎样求 $x^{m/n}$ 的导数——这正是问题所在！）

$$
\begin{aligned}
\frac{dy}{dx} &= \frac mn \cdot \frac{x^{m-1}}{\left(x^{m/n}\right)^{n-1}} = \frac mn \cdot \frac{x^{m-1}}{x^{m(n-1)/n}} = \frac mn x^{(m-1) - \frac{m(n-1)}{n}} \\
&= \frac mn x^{\frac{n(m-1) - m(n-1)}{n}} = \frac mn x^{\frac{nm - n - nm + m}{n}} = \frac mn x^{\frac{m - n}{n}}.
\end{aligned}
$$

所以

$$
\frac{dy}{dx} = \frac mn x^{\frac mn - 1}.
$$

这正是我们希望得到的答案！现在我们知道，对任何有理数 $a$，$x^a$ 的导数都是 $ax^{a-1}$。

（译注：原文这里写作 $(x - \Delta x)^{m/n}$，按导数定义应为 $(x + \Delta x)^{m/n}$，译文已更正。）
