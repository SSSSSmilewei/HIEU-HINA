# 例题：lim x^{1/x}

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

用推广版的洛必达法则计算 $\displaystyle\lim_{x \to \infty} x^{1/x}$。

<details>
<summary>解答</summary>

这个计算和讲座中计算 $\displaystyle\lim_{x \to 0^+} x^x$ 非常相似，只是不定式不是 $0^0$，而是 $\infty^0$。

和前面一样，我们用指数函数和自然对数函数改写问题：

$$
x^{1/x} = e^{\ln x^{1/x}} = e^{\frac{\ln x}{x}}.
$$

于是 $\displaystyle\lim_{x \to \infty} x^{1/x} = \lim_{x \to \infty} e^{\frac{\ln x}{x}}$。因为函数 $e^t$ 是连续的，

$$
\lim_{x \to \infty} e^{\frac{\ln x}{x}} = e^{\lim_{x \to \infty}\frac{\ln x}{x}}.
$$

现在可以把注意力集中在指数上的极限；$\displaystyle\lim_{x \to \infty} \frac{\ln x}{x}$ 是 $\dfrac\infty\infty$ 型的不定式，所以可以用洛必达法则：

$$
\lim_{x \to \infty} \frac{\ln x}{x} = \lim_{x \to \infty} \frac{1/x}{1} \;(\text{如果这个极限存在}) = 0.
$$

我们得出 $\displaystyle\lim_{x \to \infty} x^{1/x} = e^{\lim_{x \to \infty}\frac{\ln x}{x}} = e^0 = 1$。

这意味着 $n$ 趋于无穷大时，$n$ 的 $n$ 次方根趋于 1。

</details>
