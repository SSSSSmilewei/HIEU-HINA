# 例题：双曲函数的和角公式

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

用 $\sinh x$、$\cosh x$、$\sinh y$ 和 $\cosh y$ 表示 $\sinh(x + y)$ 和 $\cosh(x + y)$。

<details>
<summary>解答</summary>

**sinh(x + y)**

回顾

$$
\sinh u = \frac{e^u - e^{-u}}{2}, \qquad \cosh u = \frac{e^u + e^{-u}}{2}.
$$

解这道题最容易的思路，也许是猜测双曲函数的和角公式和普通三角函数的类似，再调整公式使之吻合。

如果不参考三角和角公式，就先用 $e^x$ 和 $e^y$ 改写 $\sinh(x + y)$，再试着把各项分开。第一次尝试可能是这样的：

$$
\sinh(x + y) = \frac12\left(e^{x+y} - e^{-x-y}\right) = \frac12\left(e^{x+y} - e^{-x-y} + e^{y-x} - e^{x-y} - e^{y-x} + e^{x-y}\right).
$$

利用

$$
(e^a + e^{-a})(e^b - e^{-b}) = e^{a+b} + e^{b-a} - e^{a-b} - e^{-a-b},
$$

可以把 $\sinh(x + y)$ 写成 $2\cosh x\sinh y$ 加上一些剩余项。但那样还得处理剩余项，而且 $2\cosh x\sinh y$ 前面的系数 2 看起来不对劲。我们再试一次：

$$
\begin{aligned}
\sinh(x + y) &= \frac14\left(2e^{x+y} - 2e^{-x-y}\right) \\
&= \frac14\left(e^{x+y} - e^{-x-y} + e^{y-x} - e^{x-y}\right) + \frac14\left(e^{x+y} - e^{-x-y} - e^{y-x} + e^{x-y}\right) \\
&= \frac14(e^x + e^{-x})(e^y - e^{-y}) + \frac14(e^x - e^{-x})(e^y + e^{-y}) \\
&= \frac{e^x + e^{-x}}{2} \cdot \frac{e^y - e^{-y}}{2} + \frac{e^x - e^{-x}}{2} \cdot \frac{e^y + e^{-y}}{2} \\
&= \cosh x\sinh y + \sinh x\cosh y.
\end{aligned}
$$

我们知道 $\sin(x + y) = \sin x\cos y + \cos x\sin y$，所以这个答案看来是合理的。用 $\sinh u$ 和 $\cosh u$ 的公式检验这个结果，是个直接的练习。

（译注：原文所列恒等式右边最后一项的符号印错了，应为 $-e^{-a-b}$，译文已更正。）

**cosh(x + y)**

和前面一样做，这次不走弯路：

$$
\begin{aligned}
\cosh(x + y) &= \frac12\left(e^{x+y} + e^{-x-y}\right) \\
&= \frac14\left(e^{x+y} + e^{-x-y} + e^{y-x} + e^{x-y}\right) + \frac14\left(e^{x+y} + e^{-x-y} - e^{y-x} - e^{x-y}\right) \\
&= \frac14(e^x + e^{-x})(e^y + e^{-y}) + \frac14(e^x - e^{-x})(e^y - e^{-y}) \\
&= \cosh x\cosh y + \sinh x\sinh y.
\end{aligned}
$$

我们知道 $\cos(x + y) = \cos x\cos y - \sin x\sin y$，所以这同样是个说得通的结果（只是符号变成了正号）。

</details>
