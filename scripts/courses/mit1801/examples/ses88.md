# 例题：eˣ/x 与 x/eˣ 在无穷远处的极限

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

当 $x$ 趋于无穷大时，式子 $\dfrac{e^x}{x}$ 和 $\dfrac{x}{e^x}$ 取 $\dfrac\infty\infty$ 的形式。用推广版的洛必达法则求下列极限（如果存在的话）。

a) $\displaystyle\lim_{x \to +\infty} \frac{e^x}{x}$

b) $\displaystyle\lim_{x \to +\infty} \frac{x}{e^x}$

<details>
<summary>解答</summary>

推广版的洛必达法则告诉我们

$$
\lim_{x \to +\infty} \frac{f(x)}{g(x)} = \lim_{x \to +\infty} \frac{f'(x)}{g'(x)},
$$

前提是 $\displaystyle\lim_{x \to +\infty} f(x)$ 和 $\displaystyle\lim_{x \to +\infty} g(x)$ 具有合适的性质，并且 $\displaystyle\lim_{x \to +\infty} \frac{f'(x)}{g'(x)}$ 存在。因为我们已经验证了这两个极限是 $\dfrac\infty\infty$ 的形式，可以用这个法则。

**a)** 因为它是 $\dfrac\infty\infty$ 的形式，我们知道，如果极限存在，那么

$$
\lim_{x \to +\infty} \frac{e^x}{x} = \lim_{x \to +\infty} \frac{e^x}{1} = \infty.
$$

$x$ 趋于无穷大时，$\dfrac{e^x}{1}$ 也趋于无穷大；所以 $\dfrac{e^x}{x}$ 也一样。

**b)** 如果极限存在，那么

$$
\lim_{x \to +\infty} \frac{x}{e^x} = \lim_{x \to +\infty} \frac{1}{e^x} = 0.
$$

$x$ 趋于无穷大时，这个分式的分母比分子增长得快，所以商的极限是 0。

我们很快会看到，怎样用这样的极限比较两个函数的增长速度。

</details>
