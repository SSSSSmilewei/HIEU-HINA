# 例题：lim sin x/(1 − cos x)

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

在这道题里，试着用近似来求

$$
\lim_{x \to 0} \frac{\sin x}{1 - \cos x}.
$$

a) 把 $\sin x$ 和 $\cos x$ 的线性近似代入这个式子。你能看出极限是怎样的吗？

b) 把 $\sin x$ 和 $\cos x$ 的二次近似代入这个式子。你能看出极限是怎样的吗？

<details>
<summary>解答</summary>

如果在商 $\dfrac{\sin x}{1 - \cos x}$ 中把 $x$ 换成 0，结果是 $\dfrac00$ 的形式。可以用近似来研究这个有意思的极限；结果和用洛必达法则得到的类似。

**a)** 记得 $\sin x$ 和 $\cos x$ 在 $x = 0$ 附近的线性近似是

$$
\cos x \approx 1, \qquad \sin x \approx x.
$$

于是

$$
\lim_{x \to 0} \frac{\sin x}{1 - \cos x} \approx \lim_{x \to 0} \frac{x}{1 - 1} = \lim_{x \to 0} \frac x0.
$$

把 $\cos x$ 换成它的线性近似，分母就等于 0 了。我们开始觉得这个函数的行为很糟，但从这个计算很难得出结论。

（译注：原文 (a) 里写的是「记得二次近似是」，按题意和列出的式子应为「线性近似」，译文已更正。）

**b)** $\sin x$ 和 $\cos x$ 在 $x = 0$ 附近的二次近似是

$$
\cos x \approx 1 - \frac12x^2, \qquad \sin x \approx x.
$$

所以

$$
\lim_{x \to 0} \frac{\sin x}{1 - \cos x} \approx \lim_{x \to 0} \frac{x}{1 - \left(1 - \frac12x^2\right)} = \lim_{x \to 0} \frac{x}{\frac12x^2} = \lim_{x \to 0} \frac2x.
$$

现在可以看出，$x$ 趋于 0 时，$\dfrac{\sin x}{1 - \cos x}$ 的分母比分子更快地趋于 0，所以这个函数在 $x = 0$ 附近会「爆掉」（$x \to 0^+$ 时趋于 $+\infty$，$x \to 0^-$ 时趋于 $-\infty$）。

</details>
