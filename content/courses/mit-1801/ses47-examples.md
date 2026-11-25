# 例题：定积分练习

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

用求原函数的方法计算下列定积分。用定积分的几何定义、画图和估计来检验你的结果。

a) $\displaystyle\int_0^2 x^2\,dx$　　b) $\displaystyle\int_1^e \frac1x\,dx$　　c) $\displaystyle\int_{-\pi/4}^0 \sin x\,dx$

<details>
<summary>解答</summary>

**a)** $x^2$ 的原函数是 $\frac13x^3$（加上一个常数），所以

$$
\int_0^2 x^2\,dx = \frac13x^3\Big|_0^2 = \frac13 \cdot 2^3 - \frac13 \cdot 0^3 = \frac83.
$$

> 图：$y = x^2$ 在 0 到 2 之间下方的区域。

从几何上看，曲线下方的面积看来在 2 和 4 之间，所以我们的答案似乎是对的。

**b)** $\frac1x$ 的原函数是 $\ln|x|$。

$$
\int_1^e \frac1x\,dx = \bigl[\ln|x|\bigr]_1^e = \ln e - \ln 1 = 1 - 0 = 1.
$$

> 图：$y = \frac1x$ 在 1 到 $e$（约 2.72）之间下方的区域。

曲线下方的面积看来确实在 1 和 1.5 之间。

**c)** $\sin x$ 的原函数是 $-\cos x$。

$$
\int_{-\pi/4}^0 \sin x\,dx = -\cos x\Big|_{-\pi/4}^0 = -\cos 0 - (-\cos(-\pi/4)) = -1 + \frac{1}{\sqrt2} = \frac{1 - \sqrt2}{\sqrt2} \approx -0.29.
$$

> 图：$y = \sin x$ 在 $-\frac\pi4$（约 $-0.79$）到 0 之间，位于 $x$ 轴下方的区域。

我们计算的区域位于 $x$ 轴下方，所以预期答案是负的。估计值 $-0.29$ 看起来很小，但把阴影区域和边长为 0.5 与 0.4 的矩形比较，就会看到它确实接近正确值。

</details>
