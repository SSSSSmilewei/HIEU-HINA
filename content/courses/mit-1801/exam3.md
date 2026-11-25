# 考试 3：试卷与解答

> 本页是 MIT 开放式课程 18.01SC 单元 3 考试及官方解答的中文翻译，原文见页面下方的「试卷原文（PDF）」和「试卷解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

**建议的做法**：找一段完整的 50 分钟，不看讲义，像真正考试一样做完六道题，再展开解答对照。

## 第 1 题

求曲线 $x = y^2 - 4y$ 和 $x = 2y - y^2$ 之间的面积。

<details>
<summary>解答</summary>

令 $f(y) = y^2 - 4y = y(y - 4)$。当 $y = 0$ 或 $y = 4$ 时 $f(y) = 0$。

令 $g(y) = 2y - y^2 = y(2 - y)$。当 $y = 0$ 或 $y = 2$ 时 $g(y) = 0$。

> 图：横轴为 $y$、纵轴为 $x$。两条抛物线都过原点：$x = 2y - y^2$ 向上拱起，在 $y = 2$ 处回到横轴；$x = y^2 - 4y$ 向下弯，两者在 $y = 3$ 处再次相交。两者之间的区域画了阴影。

$f$ 和 $g$ 的图像相交于 $(0, 0)$ 和另一点。求这一点：

$$
f(y) = g(y) \;\Longrightarrow\; y^2 - 4y = 2y - y^2 \;\Longrightarrow\; 2y^2 - 6y = 0 \;\Longrightarrow\; 2y(y - 3) = 0.
$$

图像在 $y = 0$ 和 $y = 3$ 处相交。$y = 3$ 时 $f(y) = -3$，所以第二个交点是 $(x, y) = (-3, 3)$。（可以算 $g(3)$ 来检验。）

在两个交点之间的区间上，$g(y) > f(y)$。两图像之间的距离是

$$
g(y) - f(y) = (2y - y^2) - (y^2 - 4y) = 6y - 2y^2.
$$

两图像之间的面积是

$$
\int_0^3 (6y - 2y^2)\,dy = \left[3y^2 - \frac23y^3\right]_0^3 = \left(3 \cdot 3^2 - \frac23 \cdot 3^3\right) - 0 = 27 - 18 = 9.
$$

</details>

## 第 2 题

求由曲线 $y = e^x$、$y = 2$ 和 $x = 0$ 围成的区域绕直线 $y = -1$ 旋转所得立体的体积。只需要给出表示这个体积的定积分，不必算出积分的值。

<details>
<summary>解答</summary>

> 图：区域在 $x = 0$ 与 $x = \ln 2$ 之间、曲线 $y = e^x$ 上方、直线 $y = 2$ 下方；旋转轴 $y = -1$ 画成虚线。

**垫圈法**（竖直的小矩形，对 $x$ 积分）：外半径是 $2 - (-1) = 3$，内半径是 $e^x - (-1) = 1 + e^x$，所以

$$
\int_0^{\ln 2} \pi\left(3^2 - (1 + e^x)^2\right)dx.
$$

**柱壳法**（水平的小矩形，对 $y$ 积分）：$y$ 从 1 到 2，小矩形长 $x = \ln y$，到旋转轴的距离是 $y + 1$，所以

$$
\int_1^2 2\pi(y + 1)\ln y\,dy.
$$

两种写法任选一种即可。

</details>

## 第 3 题

求下列各式的值。

(a)

$$
\lim_{n \to \infty}\sum_{i=1}^n \left(1 + i \cdot \frac3n\right)^2\frac3n
$$

(b) 连续函数 $f$ 满足

$$
x\sin\pi x = \int_0^{x^2} f(t)\,dt,
$$

求 $f(4)$。

<details>
<summary>解答</summary>

**(a)** 思路：把它看成一个黎曼和，用积分求出它的值。

考虑把区间 $[0, 3]$ 分成 $n$ 份，函数取 $f(x) = (1 + x)^2$。右黎曼和是

$$
\sum_{i=1}^n \left(1 + i\frac3n\right)^2\frac3n.
$$

所以

$$
\lim_{n \to \infty}\sum_{i=1}^n \left(1 + i\frac3n\right)^2\frac3n = \int_0^3 (1 + x)^2\,dx = \int_0^3 (1 + 2x + x^2)\,dx = \left[x + x^2 + \frac13x^3\right]_0^3 = (3 + 9 + 9) - 0 = 21.
$$

**(b)** 思路：用微积分基本定理。

$$
\begin{aligned}
\frac{d}{dx}(x\sin\pi x) &= \frac{d}{dx}\int_0^{x^2} f(t)\,dt \\
\Longrightarrow\quad \sin\pi x + \pi x\cos\pi x &= f(x^2) \cdot 2x \\
\Longrightarrow\quad f(x^2) &= \frac{1}{2x}\sin\pi x + \frac{1}{2x}\pi x\cos\pi x \\
\Longrightarrow\quad f(4) = f(2^2) &= \frac{1}{2 \cdot 2}\sin 2\pi + \frac\pi2\cos 2\pi = \frac\pi2.
\end{aligned}
$$

</details>

## 第 4 题

(a) 求高为 $h$、底为 $r$ 的直角三角形的形心（即质心；设三角形密度均匀）。对密度均匀的平面图形，质心的坐标由加权平均给出：

$$
\left(\frac{\int xf(x)\,dx}{\int f(x)\,dx},\ \frac{\int yg(y)\,dy}{\int g(y)\,dy}\right).
$$

(b) 帕普斯定理说：一个区域旋转形成的立体的体积，等于区域的面积乘以形心经过的距离。用帕普斯定理和上一问的答案，求高为 $h$、底面半径为 $r$ 的圆锥的体积。

<details>
<summary>解答</summary>

**(a)**

> 图：直角三角形，直角顶点在原点，一条直角边沿横轴从 0 到 $r$，另一条沿纵轴从 0 到 $h$。

注意三角形的斜边在直线 $y = h - \frac hrx$ 上。

你可能从习题里知道，质心在 $\left(\frac r3, \frac h3\right)$。

如果不知道，就要分别计算质心的 $x$ 坐标和 $y$ 坐标。质心 $x$ 坐标的公式大致是

$$
\frac{\int xf(x)\,dx}{\int f(x)\,dx}.
$$

在这里，这个式子的分子是

$$
\int_0^r x\left(h - \frac hrx\right)dx = \int_0^r \left(hx - \frac hrx^2\right)dx = \left[\frac h2x^2 - \frac{h}{3r}x^3\right]_0^r = \left(\frac h2r^2 - \frac{h}{3r}r^3\right) - 0 = \frac h6r^2.
$$

分母就是三角形的面积 $\frac12rh$。所以质心的 $x$ 坐标是

$$
\frac{hr^2/6}{hr/2} = \frac r3.
$$

对 $y$ 坐标，注意斜边在直线 $x = r - \frac rhy$ 上，所以分子是

$$
\int_0^h y\left(r - \frac rhy\right)dy = \int_0^h \left(ry - \frac rhy^2\right)dy = \left[\frac r2y^2 - \frac{r}{3h}y^3\right]_0^h = \left(\frac r2h^2 - \frac{r}{3h}h^3\right) - 0 = \frac r6h^2.
$$

除以三角形的面积，得到质心的 $y$ 坐标

$$
\frac{rh^2/6}{hr/2} = \frac h3.
$$

图中高为 $h$、底为 $r$ 的直角三角形的形心在 $\left(\dfrac r3, \dfrac h3\right)$。

（译注：原文的图把横轴标成 $y$、纵轴标成 $x$，正文又先写质心在 $(h/3, r/3)$，与后面的计算不一致。按解答的计算，横轴是 $x$（从 0 到 $r$），纵轴是 $y$（从 0 到 $h$），形心是 $(r/3, h/3)$，译文已按此统一。另外原文说「权函数是转动惯量」，并不准确：这里的权函数是区域在每个 $x$（或 $y$）处的高度（或宽度），译文的题干删去了这半句。）

**(b)** 把上面的三角形绕 $y$ 轴（纵轴）旋转，就得到高为 $h$、底面半径为 $r$ 的圆锥。旋转区域的面积是 $\frac12rh$。形心到 $y$ 轴的距离是 $r/3$，所以旋转一周经过的距离是 $2\pi r/3$。

因此，由帕普斯定理，圆锥的体积是

$$
\frac12rh \cdot 2\pi\frac r3 = \frac{\pi r^2h}{3}.
$$

</details>

## 第 5 题

给定定积分

$$
\int_a^b f(x)\,dx,
$$

设 $T_n$ 是用 $n$ 个小区间的**梯形**近似，$M_n$ 是用 $n$ 个小区间的**中点**近似，$S_{2n}$ 是用 $2n$ 个小区间的**辛普森法则**近似。证明

$$
\frac13T_n + \frac23M_n = S_{2n}.
$$

<details>
<summary>解答</summary>

把区间 $[a, b]$ 分成 $2n$ 个小区间。令 $x_0 = a$，$x_{2n} = b$，$x_i = a + \dfrac{(b - a)i}{2n}$。于是

$$
\begin{aligned}
T_n &= \frac{b - a}{2n}\left(f(x_0) + f(x_{2n}) + 2\sum_{i=1}^{n-1} f(x_{2i})\right), \\
M_n &= \frac{b - a}{n}\left(\sum_{i=1}^n f(x_{2i-1})\right), \\
S_{2n} &= \frac{b - a}{6n}\bigl(f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + 2f(x_4) + \cdots + 4f(x_{2n-1}) + f(x_{2n})\bigr) \\
&= \frac{b - a}{6n}\left(f(x_0) + f(x_{2n}) + 4\sum_{i=1}^n f(x_{2i-1}) + 2\sum_{i=1}^{n-1} f(x_{2i})\right).
\end{aligned}
$$

因此

$$
\frac13T_n + \frac23M_n = \frac13T_n + \frac46M_n = \frac{b - a}{6n}\left(f(x_0) + f(x_{2n}) + 2\sum_{i=1}^{n-1} f(x_{2i}) + 4\sum_{i=1}^n f(x_{2i-1})\right) = S_{2n}.
$$

（译注：原文 $S_{2n}$ 展开式的最后一项印成了 $x_{2n}$，应为 $f(x_{2n})$，译文已更正。）

</details>

## 第 6 题

一个水箱里有 1000 升盐水，溶有 15 千克盐。纯水以每分钟 10 升的恒定速率从水箱顶部流入。溶液充分混合，并以同样的速率从水箱底部流出，所以水箱里液体的体积不变。

(a) 写出一个表示盐离开水箱的速率的微分方程。

(b) 解这个微分方程，求出时刻 $t$ 混合液里盐的量（单位千克）的表达式。

(c) 盐水里盐的总量减少到原来的一半需要多长时间？（已知 $\ln 2 \approx 0.693$。）

<details>
<summary>解答</summary>

**(a)** 设 $s(t)$ 是时刻 $t$ 盐的量，单位千克。那么

$$
\frac{ds}{dt} = -10 \text{ 升/分} \cdot \frac{s(t)}{1000}\,\frac{\text{千克}}{\text{升}} = -\frac{s(t)}{100} \text{ 千克/分}.
$$

**(b)** 用分离变量法：

$$
\frac{ds}{s(t)} = -\frac{1}{100}\,dt.
$$

然后积分：

$$
\ln(s(t)) = -\frac{1}{100}t + c.
$$

为了去掉对数，两边取指数，令 $k = e^c$：

$$
\ln(s(t)) = -\frac{1}{100}t + c \;\Longrightarrow\; e^{\ln(s(t))} = e^{-\frac{1}{100}t + c} \;\Longrightarrow\; s(t) = e^{-\frac{1}{100}t}e^c \;\Longrightarrow\; s(t) = ke^{-\frac{1}{100}t}.
$$

已知 $s(0) = 15$，所以 $k = 15$。因此

$$
\boxed{s(t) = 15e^{-\frac{1}{100}t}}.
$$

**(c)** 需要

$$
e^{-\frac{1}{100}t} = \frac12 \;\Longrightarrow\; \ln\left(e^{-\frac{1}{100}t}\right) = \ln\left(\frac12\right) \;\Longrightarrow\; -\frac{1}{100}t = -\ln 2 \;\Longrightarrow\; t = 100 \cdot \ln 2 \approx \boxed{69.3 \text{ 分钟}}.
$$

</details>
