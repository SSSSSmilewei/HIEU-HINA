# 例题：加权平均

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

平面区域的**形心**（或质心）是这个区域能完美平衡的那一点，就像在棍子顶端顶着的盘子。形心的坐标由加权平均给出。

形心的横坐标是 $\bar x = \dfrac{\int x\,dA}{\int dA}$，其中 $dA$ 是一小块无穷小的面积；这个平均中的权函数就是 $x$。

类似地，形心的纵坐标是 $\bar y = \dfrac{\int y\,dA}{\int dA}$。

求由 $x = -1$、$x = 3$、$y = (x - 1)^2$ 和 $y = 4$ 围成的抛物线区域的形心 $(\bar x, \bar y)$。

<details>
<summary>解答</summary>

> 图：抛物线 $y = (x - 1)^2$ 与直线 $y = 4$ 之间、$x = -1$ 到 $x = 3$ 的区域。

由区域的对称性，我们可能会猜 $\bar x = 1$。为了练习，我们还是算一下。因为对 $x$ 积分，面积元 $dA$ 是一个底在 $y = (x - 1)^2$、顶在 $y = 4$、宽为 $dx$ 的竖直矩形：

$$
\bar x = \frac{\int_{-1}^3 x\bigl(4 - (x - 1)^2\bigr)\,dx}{\int_{-1}^3 \bigl(4 - (x - 1)^2\bigr)\,dx}.
$$

$$
\int_{-1}^3 x\bigl(4 - (x - 1)^2\bigr)\,dx = \int_{-1}^3 (3x - x^3 + 2x^2)\,dx = \left[\frac32x^2 - \frac14x^4 + \frac23x^3\right]_{-1}^3 = \left(\frac32 \cdot 9 - \frac14 \cdot 81 + \frac23 \cdot 27\right) - \left(\frac32 - \frac14 - \frac23\right) = 10\frac23,
$$

$$
\int_{-1}^3 \bigl(4 - (x - 1)^2\bigr)\,dx = \int_{-1}^3 (3 - x^2 + 2x)\,dx = \left[3x - \frac13x^3 + x^2\right]_{-1}^3 = \left(9 - 9 + 9\right) - \left(-3 + \frac13 + 1\right) = 10\frac23.
$$

我们得出 $\bar x = \dfrac{10\frac23}{10\frac23} = 1$。

求 $\bar y$ 时对 $y$ 积分。面积元 $dA$ 的宽等于区域的宽，高为 $dy$。区域左边的方程是 $x = 1 - \sqrt y$，右边的方程是 $x = 1 + \sqrt y$，所以宽是 $(1 + \sqrt y) - (1 - \sqrt y) = 2\sqrt y$：

$$
\bar y = \frac{\int_0^4 y(2\sqrt y)\,dy}{\int_0^4 2\sqrt y\,dy}.
$$

$$
\int_0^4 y(2\sqrt y)\,dy = 2\int_0^4 y^{3/2}\,dy = 2 \cdot \frac25y^{5/2}\Big|_0^4 = \frac45(2^5 - 0) = \frac{128}{5},
$$

$$
\int_0^4 2\sqrt y\,dy = 2\int_0^4 y^{1/2}\,dy = 2 \cdot \frac23y^{3/2}\Big|_0^4 = \frac43(2^3 - 0) = \frac{32}{3}.
$$

所以 $\bar y = \dfrac{128/5}{32/3} = \dfrac{12}{5} = 2.4$。

抛物线区域的质心在 $(1, 2.4)$；考虑到抛物线区域靠近顶部（$y = 4$）的部分比靠近底部（$y = 0$）的部分宽、更「重」，这看起来是合理的。

</details>
