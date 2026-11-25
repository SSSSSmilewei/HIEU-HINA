# 例题：求几何级数的和

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

在讲座中，我们看到了 $1 + \dfrac12 + \dfrac14 + \dfrac18 + \cdots = 2$ 的一个几何论证。回答下面的问题，就完成了这个结论的一个代数证明。

我们先用数学归纳法证明

$$
S_N = \sum_{n=0}^N \frac{1}{2^n} = \frac{2^{N+1} - 1}{2^N}.
$$

最后证明 $\displaystyle\lim_{N \to \infty} S_N = 2$。

a)（奠基）证明 $S_0 = \dfrac{2 - 1}{2^0} = 1$。

b)（归纳假设与归纳步骤）假设

$$
S_{N-1} = \frac{2^{(N-1)+1} - 1}{2^{N-1}} = \frac{2^N - 1}{2^{N-1}}.
$$

两边加上 $\dfrac{1}{2^N}$，证明

$$
S_N = \frac{2^{N+1} - 1}{2^N}.
$$

这就完成了归纳证明。

c) 证明：如果 $S_N = \dfrac{2^{N+1} - 1}{2^N}$，那么 $\displaystyle\lim_{N \to \infty} S_N = 2$。

<details>
<summary>解答</summary>

学生常常觉得数学归纳法吓人或令人困惑。不过，一旦掌握了这个技巧，就会发现证明中最难的部分可能是高中水平的代数变形。

**a)** 这一步最难的部分是理解和使用求和记号。

$$
S_0 = \sum_{n=0}^0 \frac{1}{2^n} = \frac{1}{2^0} = 1.
$$

**b)** 这一步需要仔细地处理分式，除此之外很直接。从

$$
S_{N-1} = \frac{2^N - 1}{2^{N-1}}
$$

出发，对左边用 $S_N$ 的定义，得到

$$
\sum_{n=0}^{N-1} \frac{1}{2^n} = \frac{2^N - 1}{2^{N-1}}.
$$

接着两边加上 $\dfrac{1}{2^N}$：

$$
\sum_{n=0}^{N-1} \frac{1}{2^n} + \frac{1}{2^N} = \frac{2^N - 1}{2^{N-1}} + \frac{1}{2^N}.
$$

把求和展开，再相加，就完成了证明：

$$
\begin{aligned}
\frac{1}{2^0} + \frac{1}{2} + \cdots + \frac{1}{2^{N-1}} + \frac{1}{2^N} &= \frac{2(2^N - 1)}{2 \cdot 2^{N-1}} + \frac{1}{2^N}, \\
S_N &= \frac{2^{N+1} - 2}{2^N} + \frac{1}{2^N} \qquad (S_N \text{ 的定义}) \\
S_N &= \frac{2^{N+1} - 1}{2^N}.
\end{aligned}
$$

**c)** 这是一个直接的求极限：

$$
\lim_{N \to \infty} S_N = \lim_{N \to \infty} \frac{2^{N+1} - 1}{2^N} = \lim_{N \to \infty} \left(\frac{2^{N+1}}{2^N} - \frac{1}{2^N}\right) = \lim_{N \to \infty} \left(2 - \frac{1}{2^N}\right) = 2 - \lim_{N \to \infty} \frac{1}{2^N} = 2.
$$

总结一下，我们先证明了 $\dfrac{1}{2^0} + \dfrac12 + \cdots + \dfrac{1}{2^{N-1}} + \dfrac{1}{2^N} = \dfrac{2^{N+1} - 1}{2^N}$，然后证明了当这个和的项数趋于无穷时，和的值趋于 2。

</details>
