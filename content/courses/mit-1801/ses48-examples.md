# 例题：sin x + cos x 的积分

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

考虑积分

$$
\int_0^\pi \bigl(\sin x + \cos x\bigr)\,dx.
$$

a) 用你学过的定积分知识猜一猜这个积分的值。

b) 求 $\cos x$ 和 $\sin x$ 的原函数。检验你的结果。

c) 用积分的加法性质计算 $\displaystyle\int_0^\pi (\sin x + \cos x)\,dx$ 的值。与 a) 的答案比较，检验你的结果。

<details>
<summary>解答</summary>

**a)** 积分的加法性质告诉我们

$$
\int_0^\pi (\sin x + \cos x)\,dx = \int_0^\pi \sin x\,dx + \int_0^\pi \cos x\,dx.
$$

讲座中我们看到 $\displaystyle\int_0^\pi \sin x\,dx = 2$。

$\displaystyle\int_0^\pi \cos x\,dx$ 的值等于 $y = \cos x$ 的图像与 $x$ 轴之间的（带符号的）面积。在 0 和 $\pi$ 之间，轴上方的面积等于轴下方的面积，所以 $\displaystyle\int_0^\pi \cos x\,dx = 0$。

我们得出

$$
\int_0^\pi (\sin x + \cos x)\,dx = 2.
$$

**b)** $\sin x$ 的导数是 $\cos x$，所以 $\sin x$ 是 $\cos x$ 的一个原函数。

$\cos x$ 的导数是 $-\sin x$。要找导数为 $\sin x$ 的函数，就乘以 $-1$，得到 $-\cos x$。

检验：

$$
\frac{d}{dx}(-\cos x) = -(-\sin x) = \sin x; \qquad \frac{d}{dx}\sin x = \cos x.
$$

**c)**

$$
\begin{aligned}
\int_0^\pi (\sin x + \cos x)\,dx &= \int_0^\pi \sin x\,dx + \int_0^\pi \cos x\,dx && (\text{加法性质}) \\
&= -\cos x\Big|_0^\pi + \sin x\Big|_0^\pi && (\text{微积分基本定理}) \\
&= [-\cos\pi - (-\cos 0)] + [\sin\pi - \sin 0] \\
&= [-(-1) + 1] + [0 - 0] = 2.
\end{aligned}
$$

这与 a) 的答案一致。

</details>
