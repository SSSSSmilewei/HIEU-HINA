# 例题：笑脸的面积

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

曲线 $y = \frac12x^2 - \frac12$ 和 $y = x^4 - 1$ 之间的区域形如一张笑脸。求这个区域的面积。

<details>
<summary>解答</summary>

先画出要求面积的区域的草图。笑脸的「下唇」由 $y = x^4 - 1$ 描述，上唇对应 $y = \frac12x^2 - \frac12$。笑脸从 $x = -1$ 延伸到 $x = 1$，从 $y = -1$ 延伸到 $y = 0$。（两条曲线的交点是 $(-1, 0)$ 和 $(1, 0)$。）

下一步是决定对 $x$ 积分还是对 $y$ 积分。两个方程都已经写成了 $y = f(x)$ 的形式，而且笑脸的竖直切片比水平切片（分成两段）简单得多，所以对 $x$ 积分似乎最明智。

草图告诉我们，积分上下限是 $-1$ 和 1，上曲线的方程是 $y = \frac12x^2 - \frac12$，下曲线的方程是 $y = x^4 - 1$。于是面积是

$$
\begin{aligned}
\int_{-1}^1 \left[\left(\frac12x^2 - \frac12\right) - (x^4 - 1)\right]dx &= \int_{-1}^1 \left(-x^4 + \frac12x^2 + \frac12\right)dx = \left[-\frac15x^5 + \frac16x^3 + \frac12x\right]_{-1}^1 \\
&= \left(-\frac15 + \frac16 + \frac12\right) - \left(\frac15 - \frac16 - \frac12\right) = \frac{14}{30} + \frac{14}{30} = \frac{14}{15} \approx 1.
\end{aligned}
$$

把这个答案和图中显示的面积对比，来检验我们的结果。

另一种解法是注意到笑脸的左半边和右半边一样，只求一边的面积再加倍。这样做就要计算

$$
2\int_0^1 \left[\left(\frac12x^2 - \frac12\right) - (x^4 - 1)\right]dx,
$$

得到同样的最终答案。

</details>
