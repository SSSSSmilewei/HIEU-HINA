# 习题课 6：定积分与微积分基本定理

> 本页是 MIT 开放式课程 18.01SC 习题课 6 指定练习题及解答的中文翻译。题目和解答出自 David Jerison、Arthur Mattuck 编写的 18.01 习题集（18.01 Exercises），3 开头的题在「Integration」一册，4 开头的在「Applications of Integration」一册。原文见页面下方的「习题原文（PDF）」和「习题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。题号沿用原书，便于对照。建议先自己做完一节，再展开解答对照。

本次习题课覆盖单元 3 的 A 部分（第 43–50 节）。

## 3B. 定积分

**3B-2** 用 $\Sigma$ 记号表示：a) $3 - 5 + 7 - 9 + 11 - 13$　　b) $1 + \frac14 + \frac19 + \cdots + \frac{1}{n^2}$

<details>
<summary>解答</summary>

a) $\displaystyle\sum_{n=1}^6 (-1)^{n+1}(2n + 1)$　　b) $\displaystyle\sum_{k=1}^n \frac{1}{k^2}$

</details>

**3B-3 b)** 用 4 个相等的小区间，写出 $\displaystyle\int_{-1}^3 x^2\,dx$ 的上黎曼和、下黎曼和、左黎曼和和右黎曼和。

<details>
<summary>解答</summary>

小区间宽为 1，分点是 $-1, 0, 1, 2, 3$。

左和 $= (-1)^2 + 0^2 + 1^2 + 2^2 = 6$；右和 $= 0^2 + 1^2 + 2^2 + 3^2 = 14$；

上和 $= (-1)^2 + 1^2 + 2^2 + 3^2 = 15$；下和 $= 0^2 + 0^2 + 1^2 + 2^2 = 5$。

（上和在每个小区间取最大值，下和取最小值。在 $[-1, 0]$ 上 $x^2$ 递减，最大值在左端、最小值在右端；在其余小区间上递增。）

</details>

**3B-4 a)** 计算 $\displaystyle\int_0^b x^2\,dx$ 用 $n$ 个小区间时上黎曼和与下黎曼和之差。$n$ 趋于无穷时这个差趋于零吗？

<details>
<summary>解答</summary>

$x^2$ 在 $0 \le x \le b$ 上递增，所以上和就是右和，下和就是左和。右黎曼和与左黎曼和之差是

$$
\frac bn[f(x_1) + \cdots + f(x_n)] - \frac bn[f(x_0) + \cdots + f(x_{n-1})] = \frac bn[f(x_n) - f(x_0)].
$$

这里 $x_n = b$，$x_0 = 0$，所以公式是 $\dfrac bn(f(b) - f(0))$。

a) $\dfrac bn(b^2 - 0) = \dfrac{b^3}{n}$。是的，$n \to \infty$ 时它趋于零。

</details>

**3B-5** 把下面的极限和一个黎曼和联系起来，求出它的值：

$$
\lim_{n \to \infty} \frac{\sin(b/n) + \sin(2b/n) + \cdots + \sin((n - 1)b/n) + \sin(nb/n)}{n}.
$$

<details>
<summary>解答</summary>

这个式子是积分 $\displaystyle\int_0^1 \sin(bx)\,dx$ 的右黎曼和（小区间宽 $\frac1n$，取右端点 $x = \frac in$），所以极限是

$$
\int_0^1 \sin(bx)\,dx = -\frac1b\cos(bx)\Big|_0^1 = \frac{1 - \cos b}{b}.
$$

</details>

## 3C. 微积分基本定理

**3C-1** 求 $y = \dfrac{1}{\sqrt{x - 2}}$ 的图像在 $3 \le x \le 6$ 上下方的面积。

<details>
<summary>解答</summary>

$$
\int_3^6 (x - 2)^{-1/2}\,dx = 2(x - 2)^{1/2}\Big|_3^6 = 2\left[4^{1/2} - 1^{1/2}\right] = 2.
$$

</details>

**3C-2 a)** 计算 $\displaystyle\int_0^2 \sqrt{3x + 5}\,dx$。

**3C-3 a)** 计算 $\displaystyle\int_1^2 \frac{x\,dx}{x^2 + 1}$。

<details>
<summary>解答</summary>

3C-2 a) $\dfrac23 \cdot \dfrac13(3x + 5)^{3/2}\Big|_0^2 = \dfrac29\left(11^{3/2} - 5^{3/2}\right)$。

3C-3 a) $\dfrac12\ln(x^2 + 1)\Big|_1^2 = \dfrac12[\ln 5 - \ln 2] = \dfrac12\ln\dfrac52$。

</details>

**3C-5 a)** 求 $\sin x$ 一个拱下方的面积。

<details>
<summary>解答</summary>

$$
\int_0^\pi \sin x\,dx = -\cos x\Big|_0^\pi = -(\cos\pi - \cos 0) = 2.
$$

</details>

## 3E. 变量代换；积分的估计

**3E-6** 把给出的积分和一个更容易计算的积分作比较，证明下面的估计：

b) $\displaystyle\int_0^\pi \sin^2 x\,dx < 2$　　c) $\displaystyle\int_{10}^{20} \sqrt{x^2 + 1}\,dx > 150$

<details>
<summary>解答</summary>

b) 在 $(0, \pi)$ 上 $0 < \sin x < 1$，所以 $\sin^2 x < \sin x$。因此

$$
\int_0^\pi \sin^2 x\,dx < \int_0^\pi \sin x\,dx = -\cos x\Big|_0^\pi = -(-1 - 1) = 2.
$$

c)

$$
\int_{10}^{20} \sqrt{x^2 + 1}\,dx > \int_{10}^{20} \sqrt{x^2}\,dx = \frac{x^2}{2}\Big|_{10}^{20} = \frac12(400 - 100) = 150.
$$

</details>

## 4J. 其他应用

**4J-1** 设把一立方米的水提升一米需要 $k$ 单位的能量。要把一个直径 1 米、深 100 米、灌满了水的圆形井抽干，大约需要多少能量 $E$？（说明理由。）（只需列出积分，不必计算。）

<details>
<summary>解答</summary>

把井里的水分成 $n$ 个厚度为 $\Delta y$ 的相同圆盘。

每个圆盘的体积：$\pi\left(\frac12\right)^2\Delta y$。

把深度为 $y_i$ 的那一盘水提到地面所需的能量：$\dfrac\pi4ky_i\Delta y$。

把各个圆盘的能量加起来，再取极限：

$$
E = \lim_{n \to \infty} \sum_{i=1}^n \frac\pi4ky_i\Delta y = \int_0^{100} \frac\pi4ky\,dy \quad \left(= \frac{\pi k}{4}\frac{y^2}{2}\Big|_0^{100} = \frac{\pi k10^4}{8}\right).
$$

</details>

**4J-2** 一种放射性物质的量 $x$（克）随时间（分钟）按规律 $x = x_0e^{-kt}$ 指数递减，其中 $x_0$ 是 $t = 0$ 时的初始量。如果一克这种物质每分钟产生 $r$ 单位的辐射，$x_0$ 克这种物质在一小时内大约产生多少辐射 $R$？（说明理由。）

<details>
<summary>解答</summary>

把这一小时分成 $n$ 个相等的小时间段 $\Delta t$。

在时刻 $t_i$（$i = 1, \ldots, n$），有 $x_0e^{-kt_i}$ 克物质，在时间段 $[t_i, t_i + \Delta t]$ 内大约产生 $rx_0e^{-kt_i}\Delta t$ 单位的辐射。

加起来再取极限：

$$
R = \lim_{n \to \infty} \sum_{i=1}^n rx_0e^{-kt_i}\Delta t = \int_0^{60} rx_0e^{-kt}\,dt = rx_0\frac{e^{-kt}}{-k}\Big|_0^{60} = \frac{rx_0}{k}\left(1 - e^{-60k}\right).
$$

</details>
