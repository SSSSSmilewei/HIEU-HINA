# 习题课 1：微分（一）

> 本页是 MIT 开放式课程 18.01SC 习题课 1 指定练习题及解答的中文翻译。题目和解答出自 David Jerison、Arthur Mattuck 编写的 18.01 习题集（18.01 Exercises），原文见页面下方的「习题原文（PDF）」和「习题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。题号沿用原书，便于对照。建议先自己做完一节，再展开解答对照。

本次习题课覆盖单元 1 的 A 部分（第 1–12 节）。

## 1A. 作图

**1A-1 b)** 用配方，借助平移和伸缩画出 $y = 3x^2 + 6x + 2$ 的草图。

**1A-2 b)** 借助平移和伸缩画出 $y = \dfrac{2}{(x - 1)^2}$ 的草图。

<details>
<summary>解答</summary>

1A-1 b) $y = 3(x^2 + 2x) + 2 = 3(x + 1)^2 - 1$：把抛物线 $y = x^2$ 竖直拉伸 3 倍，再向左平移 1、向下平移 1，顶点在 $(-1, -1)$。

1A-2 b) 把 $y = \dfrac{1}{x^2}$ 竖直拉伸 2 倍，再向右平移 1：图像在 $x = 1$ 两侧都向上趋于无穷大，$x$ 远离 1 时趋于 0，并经过 $(0, 2)$ 和 $(2, 2)$。（原文的图见解答 PDF。）

</details>

**1A-3** 判断下列函数是偶函数、奇函数，还是都不是：

a) $\dfrac{x^3 + 3x}{1 - x^4}$　　b) $\sin^2 x$　　e) $J_0(x^2)$，其中 $J_0(x)$ 是一个你从没听说过的函数

<details>
<summary>解答</summary>

a) $f(-x) = \dfrac{(-x)^3 - 3x}{1 - (-x)^4} = \dfrac{-x^3 - 3x}{1 - x^4} = -f(x)$，所以是奇函数。

b) $(\sin(-x))^2 = (\sin x)^2$，所以是偶函数。

e) $J_0((-x)^2) = J_0(x^2)$，所以是偶函数。

</details>

**1A-6 b)** 把 $\sin x - \cos x$ 写成 $A\sin(x + c)$ 的形式。

**1A-7 b)** 求 $-4\cos(x + \pi/2)$ 的周期、振幅和相位角，并用它们画出草图。

<details>
<summary>解答</summary>

1A-6 b) $\sqrt2\sin\left(x - \dfrac{\pi}{4}\right)$。（$A = \sqrt{1^2 + 1^2} = \sqrt2$；展开 $\sqrt2\sin(x - \pi/4) = \sin x - \cos x$。）

1A-7 b) $-4\cos\left(x + \dfrac{\pi}{2}\right) = 4\sin x$：振幅 4，周期 $2\pi$，相位角 0。

</details>

## 1B. 速度与变化率

**1B-1** 一支试管从格林楼（Green building）楼顶的塔上被碰落。（为了这个实验，假设塔离地面 400 英尺，并且楼附近的空气都被抽空了，以消除空气阻力。）试管在 $t$ 秒内下落 $16t^2$ 英尺。计算：

a) 下落头两秒的平均速度；

b) 下落最后两秒的平均速度；

c) 落地时的瞬时速度。

<details>
<summary>解答</summary>

a) 设 $h$ 为试管的高度，$h = 400 - 16t^2$。

$$
\text{平均速度} = \frac{h(2) - h(0)}{2} = \frac{(400 - 16 \cdot 2^2) - 400}{2} = -32 \text{ 英尺/秒}.
$$

（负号表示试管在下落。也可以用函数 $s(t) = 16t^2$——从顶端向下量的距离——来做整道题，那样所有速度都是正的。）

b) 解 $h(t) = 0$（或 $s(t) = 400$），得落地时刻 $t = 5$。所以最后两秒的平均速度是

$$
\frac{h(5) - h(3)}{2} = \frac{0 - (400 - 16 \cdot 3^2)}{2} = -128 \text{ 英尺/秒}.
$$

c)

$$
\frac{h(t) - h(5)}{t - 5} = \frac{400 - 16t^2 - 0}{t - 5} = \frac{16(5 - t)(5 + t)}{t - 5} = -16(5 + t) \to -160 \text{ 英尺/秒}\quad(t \to 5).
$$

</details>

## 1C. 斜率与导数

**1C-1 a)** 用差商形式的导数定义，计算圆盘面积关于半径的变化率。（答案应该是圆的周长。）

<details>
<summary>解答</summary>

$$
\frac{\pi(r + h)^2 - \pi r^2}{h} = \frac{\pi(r^2 + 2rh + h^2) - \pi r^2}{h} = \frac{\pi(2rh + h^2)}{h} = \pi(2r + h) \to 2\pi r \quad (h \to 0).
$$

</details>

**1C-2** 设 $f(x) = (x - a)g(x)$。假设 $g$ 连续，用导数的定义算出 $f'(a) = g(a)$。

<details>
<summary>解答</summary>

$$
\frac{f(x) - f(a)}{x - a} = \frac{(x - a)g(x) - 0}{x - a} = g(x) \to g(a) \quad (x \to a).
$$

</details>

**1C-3** 直接从定义出发，计算下列函数的导数。

a) $f(x) = \dfrac{1}{2x + 1}$　　b) $f(x) = 2x^2 + 5x + 4$

e) 对 (a) 和 (b)，求斜率为 $+1$、$-1$、$0$ 的点。

<details>
<summary>解答</summary>

a)

$$
\frac1h\left[\frac{1}{2(x + h) + 1} - \frac{1}{2x + 1}\right] = \frac1h\left[\frac{2x + 1 - (2(x + h) + 1)}{(2(x + h) + 1)(2x + 1)}\right] = \frac{-2}{(2(x + h) + 1)(2x + 1)} \to \frac{-2}{(2x + 1)^2} \quad (h \to 0).
$$

b)

$$
\frac{2(x + h)^2 + 5(x + h) + 4 - (2x^2 + 5x + 4)}{h} = \frac{4xh + 2h^2 + 5h}{h} = 4x + 2h + 5 \to 4x + 5 \quad (h \to 0).
$$

e) 对 (a)，$-2/(2x + 1)^2 < 0$，所以没有斜率为 1 或 0 的点。斜率为 $-1$ 时，

$$
\frac{-2}{(2x + 1)^2} = -1 \Rightarrow (2x + 1)^2 = 2 \Rightarrow 2x + 1 = \pm\sqrt2 \Rightarrow x = -\frac12 \pm \frac{\sqrt2}{2}.
$$

对 (b)，斜率在 $x = -5/4$ 处为 0，在 $x = -1$ 处为 1，在 $x = -3/2$ 处为 $-1$。

</details>

**1C-4** 写出下列函数的切线方程：

a) $f(x) = \dfrac{1}{2x + 1}$，在 $x = 1$ 处　　b) $f(x) = 2x^2 + 5x + 4$，在 $x = a$ 处

<details>
<summary>解答</summary>

利用 1C-3：

a) $f'(1) = -2/9$，$f(1) = 1/3$，所以 $y = -\dfrac29(x - 1) + \dfrac13 = \dfrac{-2x + 5}{9}$。

b) $f(a) = 2a^2 + 5a + 4$，$f'(a) = 4a + 5$，所以

$$
y = (4a + 5)(x - a) + 2a^2 + 5a + 4 = (4a + 5)x - 2a^2 + 4.
$$

</details>

**1C-5** 求 $y = 1 + (x - 1)^2$ 的图像的所有经过原点的切线。

<details>
<summary>解答</summary>

**方法一**：$y'(x) = 2(x - 1)$，所以经过 $(a, 1 + (a - 1)^2)$ 的切线是

$$
y = 2(a - 1)(x - a) + 1 + (a - 1)^2.
$$

要看原点是否在这条直线上，代入 $x = 0$、$y = 0$，得到关于 $a$ 的方程：

$$
0 = 2(a - 1)(-a) + 1 + (a - 1)^2 = -2a^2 + 2a + 1 + a^2 - 2a + 1 = -a^2 + 2.
$$

所以 $a = \pm\sqrt2$，经过原点的两条切线是

$$
y = 2(\sqrt2 - 1)x \qquad\text{和}\qquad y = -2(\sqrt2 + 1)x.
$$

（因为这是经过原点的直线，常数项必须抵消掉：这是检查代数运算的好办法！）

**方法二**：找形如 $y = mx$ 的切线。设 $y = mx$ 与 $y = 1 + (x - 1)^2$ 在 $x = a$ 处相交，那么 $ma = 1 + (a - 1)^2$。此外还要求斜率 $y'(a) = 2(a - 1)$ 等于 $m$，所以 $m = 2(a - 1)$。代入 $m$，得到

$$
2(a - 1)a = 1 + (a - 1)^2.
$$

这和方法一的方程相同：$a^2 - 2 = 0$，所以 $a = \pm\sqrt2$，$m = 2(\pm\sqrt2 - 1)$，两条切线同上。

</details>

**1C-6 a)、b)** 在函数图像的正下方画出它的导数的图像：a) 半圆；b) 抛物线。知道「奇函数的导数是偶函数、偶函数的导数是奇函数」会很有帮助（见 1F-6）。（原题还有 c)–e) 三个由图给出的函数，见习题原文 PDF。）

<details>
<summary>解答（本站补写，官方解答没有收这道题）</summary>

a) 上半圆 $y = \sqrt{1 - x^2}$ 是偶函数，在 $x = 0$ 处切线水平，往右越来越陡地下降，往左越来越陡地上升。所以导数是奇函数：$y' = \dfrac{-x}{\sqrt{1 - x^2}}$，在 $x = 0$ 处为 0，当 $x \to 1^-$ 时趋于 $-\infty$，当 $x \to -1^+$ 时趋于 $+\infty$。

b) 抛物线 $y = ax^2 + bx + c$ 的导数 $y' = 2ax + b$ 是一条直线，在抛物线顶点的横坐标处穿过 $x$ 轴。

</details>

## 1D. 极限与连续

**1D-1** 计算下列极限（如果存在）。如果不存在，指出它是 $+\infty$、$-\infty$，还是无定义。

a) $\displaystyle\lim_{x \to 0} \frac{4}{x - 1}$　　c) $\displaystyle\lim_{x \to -2} \frac{4x^2}{x + 2}$　　d) $\displaystyle\lim_{x \to 2^+} \frac{4x^2}{2 - x}$

f) $\displaystyle\lim_{x \to \infty} \frac{4x^2}{x - 2}$　　g) $\displaystyle\lim_{x \to \infty} \left(\frac{4x^2}{x - 2} - 4x\right)$

<details>
<summary>解答</summary>

a) $-4$

c) 无定义（$\pm\infty$ 两种都可能）

d) 注意 $x > 2$ 时 $2 - x$ 是负的，所以极限是 $-\infty$。

f) $\dfrac{4x^2}{x - 2} = \dfrac{4x}{1 - (2/x)} \to \dfrac{\infty}{1} = \infty$（$x \to \infty$）。

g) $\dfrac{4x^2}{x - 2} - 4x = \dfrac{4x^2 - 4x(x - 2)}{x - 2} = \dfrac{8x}{x - 2} = \dfrac{8}{1 - (2/x)} \to 8$（$x \to \infty$）。

</details>

**1D-3** 找出下列函数的间断点，并指出间断的类型：

a) $\dfrac{x - 2}{x^2 - 4}$　　c) $\dfrac{x^4}{x^3}$　　d) $f(x) = \begin{cases} x + a, & x > 0 \\ a - x, & x < 0 \end{cases}$　　e) d) 中 $f(x)$ 的导数 $f'(x)$

<details>
<summary>解答</summary>

a) $x = 2$ 是可去间断，$x = -2$ 是无穷间断。

c) $x = 0$ 是可去间断。

d) $x = 0$ 是可去间断。

e) $x = 0$ 是跳跃间断。

</details>

**1D-6 a)** 求常数 $a$、$b$ 的所有值，使函数 $f(x) = \begin{cases} x^2 + 4x + 1, & x \ge 0; \\ ax + b, & x < 0 \end{cases}$ 可导。

<details>
<summary>解答</summary>

$f(0) = 0^2 + 4 \cdot 0 + 1 = 1$。让函数值一致：$f(0^-) = \displaystyle\lim_{x \to 0^-} (ax + b) = b$，所以由连续性 $b = 1$。

再让斜率一致：$f'(0^+) = \displaystyle\lim_{x \to 0^+} (2x + 4) = 4$，而 $f'(0^-) = a$。因为 $f'(0)$ 存在，所以 $a = 4$。

</details>

**1D-8 a)** 求常数 $a$、$b$ 的值，使函数 $f(x) = \begin{cases} ax + b, & x > 0; \\ \sin 2x, & x \le 0 \end{cases}$ 连续但不可导。

<details>
<summary>解答</summary>

$f(0) = \sin(2 \cdot 0) = 0$，$f(0^+) = \displaystyle\lim_{x \to 0^+} (ax + b) = b$。所以连续性要求 $b = 0$。两侧的斜率是

$$
f'(0^-) = \lim_{x \to 0^-} 2\cos(2x) = 2, \qquad f'(0^+) = a.
$$

所以要使 $f$ 不可导，需要 $a \ne 2$。

</details>

## 1E. 求导公式：多项式、乘积、商

**1E-1** 求下列多项式的导数：a) $x^{10} + 3x^5 + 2x^3 + 4$　　c) $x/2 + \pi$

**1E-2 b)** 求多项式 $x^6 + 5x^5 + 4x^3$ 的原函数。

<details>
<summary>解答</summary>

1E-1 a) $10x^9 + 15x^4 + 6x^2$；c) $1/2$。

1E-2 b) $\dfrac{x^7}{7} + \dfrac56x^6 + x^4 + c$（$c$ 为任意常数）。

</details>

**1E-3** 求 $y = x^3 + x^2 - x + 2$ 的图像上切线水平的点 $(x, y)$。

<details>
<summary>解答</summary>

$y' = 3x^2 + 2x - 1 = 0 \Rightarrow (3x - 1)(x + 1) = 0$。所以 $x = 1/3$ 或 $x = -1$，对应的点是 $(1/3, 49/27)$ 和 $(-1, 3)$。

</details>

**1E-4 b)** 求所有使 $f(x) = \begin{cases} ax^2 + bx + 4, & x \le 1; \\ 5x^5 + 3x^4 + 7x^2 + 8x + 4, & x > 1 \end{cases}$ 可导的 $a$、$b$。

<details>
<summary>解答</summary>

$f(1) = a + b + 4$，$f(1^+) = 5 + 3 + 7 + 8 + 4 = 27$。所以由连续性，$a + b = 23$。

$f'(1^-) = \displaystyle\lim_{x \to 1^-} (2ax + b) = 2a + b$；$f'(1^+) = \displaystyle\lim_{x \to 1^+} (25x^4 + 12x^3 + 14x + 8) = 59$。所以可导性要求 $2a + b = 59$。

减去第一个方程，得 $a = 59 - 23 = 36$，因此 $b = -13$。

</details>

**1E-5** 求下列有理函数的导数：a) $\dfrac{x}{1 + x}$　　c) $\dfrac{x + 2}{x^2 - 1}$

<details>
<summary>解答</summary>

a) $\dfrac{1}{(1 + x)^2}$　　c) $\dfrac{-x^2 - 4x - 1}{(x^2 - 1)^2}$

</details>

## 1F. 链式法则、隐函数求导

**1F-1** 求下列函数的导数：

a) $(x^2 + 2)^2$（用两种方法）

b) $(x^2 + 2)^{100}$。(a) 中的两种方法你更喜欢哪一种？

<details>
<summary>解答</summary>

a) 令 $u = x^2 + 2$，则

$$
\frac{d}{dx}u^2 = \frac{du}{dx}\frac{d}{du}u^2 = (2x)(2u) = 4x(x^2 + 2) = 4x^3 + 8x.
$$

另一种方法：

$$
\frac{d}{dx}(x^2 + 2)^2 = \frac{d}{dx}(x^4 + 4x^2 + 4) = 4x^3 + 8x.
$$

b) 令 $u = x^2 + 2$，则 $\dfrac{d}{dx}u^{100} = \dfrac{du}{dx}\dfrac{d}{du}u^{100} = (2x)(100u^{99}) = 200x(x^2 + 2)^{99}$。（把 100 次方展开显然不现实，所以链式法则好得多。）

</details>

**1F-2** 求 $x^{10}(x^2 + 1)^{10}$ 的导数。

<details>
<summary>解答</summary>

用乘积法则和链式法则：

$$
10x^9(x^2 + 1)^{10} + x^{10}\bigl[10(x^2 + 1)^9(2x)\bigr] = 10(3x^2 + 1)x^9(x^2 + 1)^9.
$$

</details>

**1F-6** 证明偶函数的导数是奇函数，奇函数的导数是偶函数。（写出「$f$ 是偶函数」的等式，对两边求导，用链式法则。）

<details>
<summary>解答</summary>

按提示，令 $z = -x$。如果 $f$ 是偶函数，那么 $f(x) = f(z)$。两边求导并用链式法则：

$$
f'(x) = f'(z)\frac{dz}{dx} = -f'(z), \qquad\text{因为 } \frac{dz}{dx} = -1.
$$

这正说明 $f'$ 是奇函数。类似地，如果 $g$ 是奇函数，那么 $g(x) = -g(z)$。两边求导并用链式法则：

$$
g'(x) = -g'(z)\frac{dz}{dx} = g'(z),
$$

所以 $g'$ 是偶函数。

</details>

**1F-7** 求导数。除了导数中出现的自变量和因变量，所有字母都表示常数。

b) $m = \dfrac{m_0}{\sqrt{1 - v^2/c^2}}$，$\dfrac{dm}{dv} = ?$　　c) $F = \dfrac{mg}{(1 + r^2)^{3/2}}$，$\dfrac{dF}{dr} = ?$

<details>
<summary>解答</summary>

b) $\dfrac{dm}{dv} = m_0 \cdot \left(-\dfrac12\right)\left(1 - \dfrac{v^2}{c^2}\right)^{-3/2} \cdot \left(\dfrac{-2v}{c^2}\right) = \dfrac{m_0v}{c^2(1 - v^2/c^2)^{3/2}}$

c) $\dfrac{dF}{dr} = mg \cdot \left(-\dfrac32\right)(1 + r^2)^{-5/2} \cdot 2r = \dfrac{-3mgr}{(1 + r^2)^{5/2}}$

</details>

## 1G. 高阶导数

**1G-1** 对下列函数计算 $y''$：b) $\dfrac{x}{x + 5}$　　c) $\dfrac{-5}{x + 5}$

<details>
<summary>解答</summary>

b) $\dfrac{-10}{(x + 5)^3}$　　c) $\dfrac{-10}{(x + 5)^3}$

（两个答案相同并非巧合：$\dfrac{x}{x + 5} = 1 - \dfrac{5}{x + 5}$，两个函数只差一个常数。）

</details>

**1G-5 a)** 设 $y = u(x)v(x)$。求 $y'$、$y''$ 和 $y'''$。

<details>
<summary>解答</summary>

$$
y' = u'v + uv' \;\Longrightarrow\; y'' = u''v + 2u'v' + uv'' \;\Longrightarrow\; y''' = u'''v + 3u''v' + 3u'v'' + uv'''.
$$

（系数和二项式定理的系数一样：1, 2, 1 和 1, 3, 3, 1。原文解答只写到 $y''$，$y'''$ 是本站补的。）

</details>

## 1J. 三角函数

**1J-1** 求下列函数的导数：

a) $\sin(5x^2)$　　e) $\dfrac{\sin x}{x^2}$　　k) $\tan^2(3x)$

m) 下面三个函数有相同的导数：$\cos(2x)$、$\cos^2 x - \sin^2 x$ 和 $2\cos^2 x$。验证这一点。这三个函数相等吗？说明理由。

<details>
<summary>解答</summary>

a) $10x\cos(5x^2)$

e) $\dfrac{x\cos x - 2\sin x}{x^3}$

k) $6\tan(3x)\sec^2(3x) = \dfrac{6\sin(3x)}{\cos^3(3x)}$

m) 反复使用链式法则和二倍角公式：

$$
\begin{aligned}
(\cos^2 x - \sin^2 x)' &= -2\cos x\sin x - 2\sin x\cos x = -4\cos x\sin x; \\
(2\cos^2 x)' &= -4\cos x\sin x; \\
(\cos(2x))' &= -2\sin(2x) = -2(2\sin x\cos x).
\end{aligned}
$$

三个函数的导数相同，所以它们相差常数。确实，

$$
\cos(2x) = \cos^2 x - \sin^2 x = 2\cos^2 x - 1 \qquad (\text{利用 } \sin^2 x = 1 - \cos^2 x).
$$

前两个相等，第三个 $2\cos^2 x$ 比它们大 1。

（译注：原文 (e) 的解答写成了 $\dfrac{x\cos x - \sin x}{x^2}$，那是 $\dfrac{\sin x}{x}$ 的导数；题目是 $\dfrac{\sin x}{x^2}$，按商法则应为 $\dfrac{x^2\cos x - 2x\sin x}{x^4} = \dfrac{x\cos x - 2\sin x}{x^3}$。原文 (k) 的最后一步把 $3x$ 写成了 $x$。译文都已更正。）

</details>

**1J-2** 通过把 $\displaystyle\lim_{x \to \pi/2} \frac{\cos x}{x - \pi/2}$ 和 $(\cos x)'$ 的某个值联系起来，求出这个极限。

<details>
<summary>解答</summary>

因为 $\cos(\pi/2) = 0$，

$$
\lim_{x \to \pi/2} \frac{\cos x}{x - \pi/2} = \lim_{x \to \pi/2} \frac{\cos x - \cos(\pi/2)}{x - \pi/2} = \left.\frac{d}{dx}\cos x\right|_{x = \pi/2} = -\sin x\Big|_{x = \pi/2} = -1.
$$

</details>
