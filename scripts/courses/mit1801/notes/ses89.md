# 洛必达法则与增长速度

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：ln x 的增长速度

$$
\lim_{x \to 0^+} \underbrace{x}_{\to 0}\,\underbrace{\ln x}_{\to -\infty}
$$

这个式子是不定式，但看起来类型不对。它不是分式，所以得想想怎样用洛必达法则。

在这个式子里，因子 $x$ 趋于 0，而因子 $\ln x$ 趋于负无穷。我们是在用一个越来越小的数乘一个越来越大的数；结果可能非常大，也可能非常小，取决于增长速度。

求这个极限的第一步，是把式子改写成比，而不是积。我们选择写成

$$
x\ln x = \frac{\ln x}{1/x}.
$$

这是 $\dfrac{-\infty}{\infty}$ 型的式子，是可以用洛必达法则的形式之一。我们来用：

$$
\lim_{x \to 0^+} x\ln x = \lim_{x \to 0^+} \frac{\ln x}{1/x} = \lim_{x \to 0^+} \frac{1/x}{-1/x^2} \;(\text{洛必达}) = \lim_{x \to 0^+} (-x) = 0.
$$

我们得出：$x$ 趋于 0 的速度比 $\ln x$ 趋于负无穷的速度快，所以积的极限是 0。你可能没法事先猜到这一点。

## 片段 2：e^{px} 的增长速度

考察 $\displaystyle\lim_{x \to 0^+} x\ln x$ 时，我们发现极限值是 0，所以 $x$ 缩小到 0 比 $\ln x$ 增长到负无穷快。接下来的两个例子说明类似的速度性质，在学习反常积分等内容时会很重要。

**例**：$\displaystyle\lim_{x \to \infty} xe^{-px}$（$p > 0$）。

式子 $xe^{-px}$ 是积，不是比，所以在用洛必达法则之前要先改写。我们选择把它改写成 $\dfrac{x}{e^{px}}$。这是 $\dfrac\infty\infty$ 的形式，所以可以用洛必达法则计算：

$$
\lim_{x \to \infty} xe^{-px} = \lim_{x \to \infty} \frac{x}{e^{px}} = \lim_{x \to \infty} \frac{1}{pe^{px}} \;(\text{洛必达}) = \frac{1}{\infty} = 0.
$$

我们得出：当 $p > 0$ 时，$x$ 趋于无穷大的过程中，$x$ 比 $e^{px}$ 增长得慢。

**例**：$\displaystyle\lim_{x \to \infty} \frac{e^{px}}{x^{100}}$（$p > 0$）。

这个例子没有给我们多少新信息，但是很好的练习。这个极限的值告诉我们 $e^{px}$ 和 $x^{100}$ 的相对增长速度。

$\displaystyle\lim_{x \to \infty} \frac{e^{px}}{x^{100}}$ 是 $\dfrac\infty\infty$ 的形式，所以又可以用洛必达法则。事实上，有两种用法。慢的方法是这样的：

$$
\lim_{x \to \infty} \frac{e^{px}}{x^{100}} = \lim_{x \to \infty} \frac{pe^{px}}{100x^{99}} \;(\text{洛必达}) = \lim_{x \to \infty} \frac{p^2e^{px}}{100 \cdot 99x^{98}} \;(\text{洛必达}) = \lim_{x \to \infty} \frac{p^3e^{px}}{100 \cdot 99 \cdot 98x^{97}} \;(\text{洛必达}) = \cdots
$$

可以把洛必达法则用 100 次，最终得到答案。

聪明的方法是把式子改写成

$$
\lim_{x \to \infty} \frac{e^{px}}{x^{100}} = \lim_{x \to \infty} \left(\frac{e^{px/100}}{x}\right)^{100} = \left(\lim_{x \to \infty} \frac{\frac{p}{100}e^{px/100}}{1}\right)^{100} \;(\text{洛必达}) = \infty.
$$

在这个例子里，$\displaystyle\lim_{x \to a} \frac{f'(x)}{g'(x)} = \infty$，这是洛必达法则的另一种可能结果。

我们得出：当 $p$ 为正时，$e^{px}$ 比 $x^{100}$ 增长得快。事实上，$e^{px}$ 比 $x$ 的任何多项式都增长得快；指数函数比 $x$ 的幂增长得快。

## 片段 3：比较 ln x 和 x^{1/3} 的增长

我们原来的极限清单上还剩一项要讲；同样，我们看原问题的一个小变形。我们要求

$$
\lim_{x \to \infty} \frac{\ln x}{x^{1/3}}.
$$

这个极限是 $\dfrac\infty\infty$ 的形式，所以用洛必达法则得到

$$
\lim_{x \to \infty} \frac{\ln x}{x^{1/3}} = \lim_{x \to \infty} \frac{1/x}{\frac13x^{-2/3}} \;(\text{洛必达}) = \lim_{x \to \infty} 3x^{-1/3} = 0.
$$

我们得出：$x$ 趋于无穷大时，$\ln x$ 比 $x^{1/3}$ 以及 $x$ 的任何正数次幂都增长得慢。换句话说，$\ln x$ 增大得非常慢。

**问**：讨论洛必达法则的推广时，我们学到可以改变一些前提。一次能改变几个前提？

**答**：上面列出的三种改变，可以做其中任何一个，也可以全做。不过，$\dfrac{f(x)}{g(x)}$ 必须始终是 $\dfrac\infty\infty$、$\dfrac{-\infty}{\infty}$ 或 $\dfrac00$ 的形式。
