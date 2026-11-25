# 洛必达法则的进阶例子

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：不定式 0⁰

接下来考虑极限

$$
\lim_{x \to 0^+} x^x.
$$

能算出来吗？

不定式有很多种；$x^x$ 是比较简单的例子之一。在这里，因为 $x$ 是变动的指数，可以用一个技巧求极限。

因为有变动的指数，我们用以 $e$ 为底。把原来的式子改写成

$$
x^x = e^{x\ln x}.
$$

现在可以把注意力集中在指数上：

$$
\lim_{x \to 0^+} x\ln x = \lim_{x \to 0^+} \frac{\ln x}{1/x} = \lim_{x \to 0^+} \frac{1/x}{-1/x^2} \;(\text{洛必达}) = \lim_{x \to 0^+} (-x) = 0.
$$

因此

$$
\lim_{x \to 0^+} x^x = \lim_{x \to 0^+} e^{x\ln x} = e^0 = 1.
$$

这算起来相对容易，因为我们有这么多强大的工具可用。

## 片段 2：例：lim sin x / x²

如果对这道题用洛必达法则，会得到

$$
\lim_{x \to 0} \frac{\sin x}{x^2} = \lim_{x \to 0} \frac{\cos x}{2x} \;(\text{洛必达}) = \lim_{x \to 0} \frac{-\sin x}{2} \;(\text{洛必达}) = 0.
$$

如果改用线性近似法，代入 $\sin x \approx x$，会得到

$$
\frac{\sin x}{x^2} \approx \frac{x}{x^2} = \frac1x.
$$

于是得出

$$
\lim_{x \to 0^+} \frac{\sin x}{x^2} = \infty, \qquad \lim_{x \to 0^-} \frac{\sin x}{x^2} = -\infty.
$$

这里有点不对劲。错在哪里？

**学生**：第二次用洛必达法则时用错了。

对；$\displaystyle\lim_{x \to 0} \frac{\cos x}{2x}$ 是 $\dfrac10$ 型，不是 $\dfrac00$ 或别的什么不定式。

这正是使用洛必达法则时必须小心的地方。用这个法则之前，必须确认你面对的是 $\dfrac00$ 或 $\dfrac\infty\infty$ 这样的不定式。这个故事的寓意是：先看清楚，再用洛必达。

另外，别把洛必达法则当拐杖。如果要求

$$
\lim_{x \to \infty} \frac{x^5 - 2x^4 + 1}{x^4 + 2},
$$

可以用四次洛必达法则，也可以把分子分母同除以 $x^5$，得出

$$
\lim_{x \to \infty} \frac{x^5 - 2x^4 + 1}{x^4 + 2} = \lim_{x \to \infty} \frac{1 - 2/x + 1/x^5}{1/x + 2/x^5} = \frac{1}{0^+} = \infty.
$$

对增长速度练习得够多之后，几乎能立刻算出这个极限：

$$
\lim_{x \to \infty} \frac{x^5 - 2x^4 + 1}{x^4 + 2} \sim \lim_{x \to \infty} \frac{x^5}{x^4} = \infty.
$$

## 片段 3：洛必达法则（续）

本着「处理无穷大」的精神，我们看洛必达法则在 $\dfrac\infty\infty$ 型极限上的应用。也就是说，当 $x$ 趋于 $a$ 时有：

- $f(x) \to \infty$；
- $g(x) \to \infty$；
- $\dfrac{f'(x)}{g'(x)} \to L$，

于是可以得出

$$
\lim_{x \to a} \frac{f(x)}{g(x)} = L.
$$

（记得 $a$ 和 $L$ 可以是无穷大。）

**增长速度**

我们把它用到「增长速度」上，即研究函数增大得有多快。我们知道 $x$ 趋于无穷大时，函数 $\ln x$ 和 $x^2$ 都趋于无穷大，而且 $x^2$ 比 $\ln x$ 增大得快得多。可以把这个想法这样形式化：

如果 $x$ 趋于无穷大时 $f(x) > 0$ 且 $g(x) > 0$，那么

$$
f(x) \ll g(x) \quad (x \to \infty) \qquad \text{表示} \qquad \lim_{x \to \infty} \frac{f(x)}{g(x)} = 0.
$$

（把 $f(x) \ll g(x)$ 读作「$f(x)$ 远小于 $g(x)$」。）在我们的例子里，$f(x) = \ln x$，$g(x) = x^2$。用洛必达法则求 $\displaystyle\lim_{x \to \infty} \frac{f(x)}{g(x)} = \lim_{x \to \infty} \frac{\ln x}{x^2}$，得到

$$
\lim_{x \to \infty} \frac{\ln x}{x^2} = \lim_{x \to \infty} \frac{1/x}{2x} = \lim_{x \to \infty} \frac{1}{2x^2} = 0.
$$

我们得出：$x \to \infty$ 时 $\ln x \ll x^2$。

如果 $p > 0$，那么

$$
\ln x \ll x^p \ll e^x \ll e^{x^2} \qquad (x \to \infty).
$$

**衰减速度**

「衰减速度」是 $x$ 趋于无穷大时函数趋于 0 的速度。我们的新记号同样很方便；如果 $p > 0$，那么

$$
\frac{1}{\ln x} \gg \frac{1}{x^p} \gg e^{-x} \gg e^{-x^2} \qquad (x \to \infty).
$$
