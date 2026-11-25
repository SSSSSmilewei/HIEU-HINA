# 例题：黎曼和练习

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

用 $n = 6$ 等分的黎曼和估计 $\displaystyle\int_0^2 (3x + 2)\,dx$ 的值。

<details>
<summary>解答</summary>

这个解答用的是**左黎曼和**，其中 $c_i = x_{i-1}$ 是 $[a, b]$ 每个小区间的左端点。用 $y_i = f(x_i)$ 表示矩形的高，得到左黎曼和的表达式

$$
f(c_1)\Delta x + f(c_2)\Delta x + \cdots + f(c_n)\Delta x = (y_0 + y_1 + \cdots + y_{n-1})\Delta x.
$$

在我们的例子里，$n = 6$，$a = 0$，$b = 2$，$\Delta x = \dfrac{b - a}{n} = \dfrac13$，$y_i$ 对应 $y = 3x + 2$ 的图像在每个小区间左边缘的高度，如图 1 所示。

> 图 1：计算黎曼和用的矩形：直线 $y = 3x + 2$ 从 $(0, 2)$ 升到 $(2, 8)$，下面是 6 个宽 $\frac13$、左上角在直线上的矩形。

可以算出 $x_i = a + i\Delta x = \dfrac i3$，于是 $y_i = 3x_i + 2 = i + 2$；也可以直接标出左端点 $0, \frac13, \frac23, 1, \frac43, \frac53$，再从图上读出矩形的高。无论哪种方法，左黎曼和的公式都告诉我们，$3x + 2$ 的图像在 $a = 0$ 和 $b = 2$ 之间下方的面积约为

$$
(y_0 + y_1 + \cdots + y_5)\Delta x = (2 + 3 + 4 + 5 + 6 + 7) \cdot \frac13 = 9.
$$

因为 $\displaystyle\int_0^2 (3x + 2)\,dx$ 是宽为 2、两边高为 2 和 8 的梯形的面积，很容易检验：

$$
\int_0^2 (3x + 2)\,dx = 2 \cdot \frac{2 + 8}{2} = 10.
$$

从图上可以看出，左黎曼和略微低估了面积，所以答案 9 大概是对的。

</details>
