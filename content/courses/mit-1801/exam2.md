# 考试 2：试卷与解答

> 本页是 MIT 开放式课程 18.01SC 单元 2 考试及官方解答的中文翻译，原文见页面下方的「试卷原文（PDF）」和「试卷解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

**建议的做法**：找一段完整的 50 分钟，不看讲义，像真正考试一样做完六道题，再展开解答对照。

## 第 1 题

(a) 写出二阶可导函数 $f(x)$ 在 $x = a$ 处的二次近似的一般表达式。

(b) 用 (a) 的答案给出 $\ln(1.2)$ 的近似值，其中 $\ln x$ 是自然对数函数。

<details>
<summary>解答</summary>

(a)

$$
f(x) \approx f(a) + f'(a)(x - a) + \frac{f''(a)}{2}(x - a)^2.
$$

(b) $(\ln x)' = \dfrac1x$，$(\ln x)'' = -\dfrac{1}{x^2}$。

$$
\ln(1.2) \approx \ln 1 + \ln'(1)(1.2 - 1) + \frac{\ln''(1)}{2}(1.2 - 1)^2 = 0 + 0.2 - \frac12(0.2)^2 = 0.2 - \frac{0.04}{2} = 0.18.
$$

</details>

## 第 2 题

盐从传送带上以每分钟 30 立方英尺的速度倒下来，堆成一个底面为圆的圆锥形盐堆，盐堆的高和底面直径始终相等。盐堆高 10 英尺时，它的高增长得多快？

<details>
<summary>解答</summary>

$$
h = 2r, \qquad V = \frac13\pi r^2h = \frac13\pi\left(\frac h2\right)^2h = \frac{1}{12}\pi h^3.
$$

$$
\frac{dV}{dt} = \frac14\pi h^2\frac{dh}{dt} \;\Longrightarrow\; \frac{dh}{dt} = \frac{dV}{dt}\left(\frac{4}{\pi h^2}\right) = 30\left(\frac{4}{10^2\pi}\right) = \frac{120}{100\pi} = \frac{12}{10\pi} \text{ 英尺/分钟}.
$$

（约 0.38 英尺/分钟。）

</details>

## 第 3 题

仔细画出函数

$$
f(x) = x - 3x^{1/3}
$$

的图像。一定要标出所有局部极大值和极小值的坐标、函数递增和递减的区间，以及渐近线（如果有这些特征的话）。算出拐点可能有助于画出准确的图，但不是必须的。

<details>
<summary>解答</summary>

当 $f(x) = 0$ 时，$x - 3x^{1/3} = 0$，所以 $x^{1/3}(x^{2/3} - 3) = 0$。$f(x) = 0$ 当 $x = 0, 3\sqrt3, -3\sqrt3$。

$f'(x) = 1 - 3 \cdot \frac13x^{-2/3} = 1 - x^{-2/3}$：临界点在 $x = \pm1$。

临界点是 $(-1, 2)$（极大值）和 $(1, -2)$（极小值）。

图像在 $x = 0$ 处的切线是竖直的。

$f(x)$ 在 $(-\infty, -1)$ 和 $(1, \infty)$ 上递增，在 $(-1, 1)$ 上递减。

> 图：从左下方上升，经过 $(-3\sqrt3, 0)$，在 $(-1, 2)$ 处达到局部最高点，下降并在原点处以竖直切线穿过，在 $(1, -2)$ 处达到局部最低点，再上升，经过 $(3\sqrt3, 0)$ 向右上方延伸。没有渐近线。

（译注：原文解答把极大值点写成了 $(1, 2)$；$f(-1) = -1 - 3(-1) = 2$，应为 $(-1, 2)$，原文图上标的也是 $(-1, 2)$，译文已更正。）

</details>

## 第 4 题

要做一个金属储罐，形状是底面为圆的圆柱加一个半球形的顶。求装下固定体积 $V$ 所用金属最少的储罐尺寸。

<details>
<summary>解答</summary>

先画一张示意图。设半径为 $r$，圆柱部分高为 $h$。

$$
\text{常数 } V = \frac12\left(\frac43\pi r^3\right) + \pi r^2h = \frac23\pi r^3 + \pi r^2h.
$$

（假设）用的金属量与表面积成正比，我们要让表面积 $SA$ 最小：

$$
SA = \frac12(4\pi r^2) + (2\pi r)h + \pi r^2 = 3\pi r^2 + 2\pi rh.
$$

$$
h = \frac{V - \frac23\pi r^3}{\pi r^2}, \qquad SA = 3\pi r^2 + 2\pi r\left(\frac{V - \frac23\pi r^3}{\pi r^2}\right) = 3\pi r^2 + \frac{2V}{r} - \frac43\pi r^2 = \frac53\pi r^2 + \frac{2V}{r}.
$$

$\dfrac{d}{dr}SA = \dfrac{10}{3}\pi r - \dfrac{2V}{r^2}$。设 $r \ne 0$，令它等于 0：

$$
\frac{10}{3}\pi r = \frac{2V}{r^2} \;\Longrightarrow\; V = \frac53\pi r^3.
$$

这告诉我们 $r = \sqrt[3]{\dfrac{3V}{5\pi}}$，并且

$$
h = \frac{\frac53\pi r^3 - \frac23\pi r^3}{\pi r^2} = \frac{\pi r^3}{\pi r^2} = r.
$$

$h = r = \sqrt[3]{\dfrac{3V}{5\pi}}$ 是临界点。通过检查边界 $r = 0$ 和 $h = 0$ 来说明它确实是最小值。

$r = 0$ 时，$SA = 0 + \infty$。这不是最小值。

$h = 0$ 时，$SA = 3\pi r^2$，$V = \frac23\pi r^3$。所以 $h = 0$ 时 $r = \sqrt[3]{\dfrac{3V}{2\pi}}$，$SA = 3\pi\left(\dfrac{3V}{2\pi}\right)^{2/3}$。

$h = r = \sqrt[3]{\dfrac{3V}{5\pi}}$ 时，$SA = 5\pi\left(\dfrac{3V}{5\pi}\right)^{2/3}$。

把两种情形的表面积都立方后比较：

$$
125 \cdot \frac{9}{25} = 45 < 27 \cdot \frac94 = 60.75.
$$

我们得出临界点给出最小表面积，所以问题的答案是 $h = r = \sqrt[3]{\dfrac{3V}{5\pi}}$。

</details>

## 第 5 题

解释为什么用牛顿法求 $f(x) = x^3 - 3x + 7$ 的零点、从初始值 $x_1 = 2$ 开始时，最终会失败。

<details>
<summary>解答</summary>

牛顿法说 $x_n = x_{n-1} - \dfrac{f(x_{n-1})}{f'(x_{n-1})}$。这里 $f'(x) = 3x^2 - 3$。

$x_1 = 2$ 时，$x_2 = 2 - \dfrac{f(2)}{f'(2)} = 2 - \dfrac99 = 1$。

$x_3 = 1 - \dfrac{f(1)}{f'(1)} = 1 - \dfrac50$，没有定义。

特别地，$f'(x_2) = 0$。问题在于 $f$ 的图像在 $x = x_2 = 1$ 处的切线是水平的。所以它与 $x$ 轴不相交，牛顿法没法继续下去。

</details>

## 第 6 题

证明

$$
\sqrt{1 + x} < 1 + \frac12x, \qquad x > 0.
$$

<details>
<summary>解答</summary>

令 $g(x) = 1 + \dfrac12x - \sqrt{1 + x}$。我们需要证明 $x > 0$ 时 $g(x) > 0$。

$g(0) = 1 + 0 - 1 = 0$，所以由中值定理，只要证明对所有 $x > 0$ 都有 $g'(x) > 0$ 就够了。

$$
g'(x) = 0 + \frac12 - \frac12 \cdot \frac{1}{\sqrt{1 + x}} = \frac12 - \frac{1}{2\sqrt{1 + x}}.
$$

因为 $x > 0$，

$$
\sqrt{1 + x} > \sqrt1 = 1, \qquad\text{所以}\qquad \frac{1}{\sqrt{1 + x}} < 1, \qquad -\frac{1}{2\sqrt{1 + x}} > -\frac12.
$$

因此 $g'(x) = \dfrac12 - \dfrac{1}{2\sqrt{1 + x}} > \dfrac12 - \dfrac12 = 0$。

我们证明了 $g(0) = 0$，并且 $x > 0$ 时 $g'(x) > 0$，所以 $x > 0$ 时 $g(x) > 0$，这意味着 $x > 0$ 时 $\sqrt{1 + x} < 1 + \dfrac12x$。

</details>
