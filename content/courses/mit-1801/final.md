# 期末考试：试卷与解答

> 本页是 MIT 开放式课程 18.01SC 期末考试及官方解答的中文翻译，原文见页面下方的「试卷原文（PDF）」和「试卷解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

**建议的做法**：找一段完整的 3 小时，不看讲义，像真正考试一样做完 14 道题（第 15 题是附加题），再展开解答对照。

## 第 1 题

计算下列导数：

(a) $f'(x)$，其中 $f(x) = x^3e^x$；

(b) $f^{(7)}(x)$，即 $f$ 的七阶导数，其中 $f(x) = \sin(2x)$。

<details>
<summary>解答</summary>

**(a)** 由乘积法则，

$$
(x^3e^x)' = 3x^2e^x + x^3e^x = e^x(3x^2 + x^3).
$$

**(b)** 如果 $f(x) = \sin(2x)$，那么 $f^{(7)}(x) = -128\cos(2x)$，因为

$$
\begin{aligned}
f^{(1)}(x) &= 2\cos(2x), & f^{(2)}(x) &= -4\sin(2x), & f^{(3)}(x) &= -8\cos(2x), & f^{(4)}(x) &= 16\sin(2x), \\
f^{(5)}(x) &= 32\cos(2x), & f^{(6)}(x) &= -64\sin(2x), & f^{(7)}(x) &= -128\cos(2x).
\end{aligned}
$$

</details>

## 第 2 题

(a) 求 $y = 3x^2 - 5x + 2$ 在 $x = 2$ 处的切线。把答案写成 $y = mx + b$ 的形式，$m$ 是斜率，$b$ 是 $y$ 轴截距。

(b) 证明由方程

$$
xy^3 + x^3y = 4
$$

隐式定义的曲线没有水平切线。

<details>
<summary>解答</summary>

**(a)** $y = 3x^2 - 5x + 2$ 在 $x = 2$ 处的切线，斜率等于曲线在 $x = 2$ 处的斜率，并且经过点 $(2, 4)$。

切线的斜率是 $y'(2) = 6x - 5 = 6(2) - 5 = 7 = m$。

用斜率和已知点求切线的 $y$ 轴截距 $b$：$\dfrac{4 - b}{2 - 0} = 7 \Rightarrow b = -10$。

所以切线方程是

$$
y = mx + b = 7x - 10.
$$

**(b)** 如果曲线有水平切线，那么在某一点 $y$ 对 $x$ 的一阶导数等于零。

对方程 $xy^3 + x^3y = 4$ 求导：

$$
y^3 + x(3y^2)y' + 3x^2y + y'x^3 = 0 \;\Longrightarrow\; y'(3xy^2 + x^3) = -y^3 - 3x^2y.
$$

如果 $y'$ 等于 0，那么 $-y^3 - 3x^2y = 0$。这在 $x$ 和 $y$ 都为零时成立，或者在 $y^3 = -3x^2y$（$x$、$y$ 不为零）时成立。

第一种情况不可能，因为已知 $xy^3 + x^3y = 4$，$x$ 和 $y$ 都为零时这不可能成立。

第二种情况也不可能，因为 $y^3 = -3x^2y \Rightarrow y^2 = -3x^2$（这种情况下 $y$ 不为零，可以除以 $y$）；左边非负，右边当 $x \ne 0$ 时为负，不可能相等。（若 $x = 0$，则 $y = 0$，回到第一种情况。）

因此 $y'$ 永远不会是零，由 $xy^3 + x^3y = 4$ 定义的曲线没有水平切线。

</details>

## 第 3 题

(a) 用导数的**定义**计算 $\dfrac{d}{dx}\left(\dfrac{x}{x + 1}\right)$。

(b) 计算极限

$$
\lim_{x \to \sqrt3} \frac{\tan^{-1}(x) - \pi/3}{x - \sqrt3},
$$

其中 $\tan^{-1}(x)$ 照例表示反正切函数。

<details>
<summary>解答</summary>

**(a)**

$$
\begin{aligned}
\frac{d}{dx}\left(\frac{x}{x + 1}\right) &= \lim_{t \to x} \frac{f(t) - f(x)}{t - x} = \lim_{t \to x} \frac{\frac{t}{t + 1} - \frac{x}{x + 1}}{t - x} = \lim_{t \to x} \frac{t(x + 1) - x(t + 1)}{(t - x)(t + 1)(x + 1)} \\
&= \lim_{t \to x} \frac{tx + t - tx - x}{(t - x)(t + 1)(x + 1)} = \lim_{t \to x} \frac{t - x}{(t - x)(t + 1)(x + 1)} = \lim_{t \to x} \frac{1}{(t + 1)(x + 1)} = \frac{1}{(x + 1)^2}.
\end{aligned}
$$

**(b)** 当 $x \to \sqrt3$ 时，分子变成 $\pi/3 - \pi/3 = 0$，分母也趋于零，所以可以用洛必达法则计算这个极限：

$$
\lim_{x \to \sqrt3} \frac{(\tan^{-1}(x) - \pi/3)'}{(x - \sqrt3)'} = \lim_{x \to \sqrt3} \frac{1/(1 + x^2)}{1} = \frac{1}{1 + (\sqrt3)^2} = \frac14.
$$

（也可以把它看成 $\tan^{-1}x$ 在 $x = \sqrt3$ 处的导数的定义。）

</details>

## 第 4 题

画出函数

$$
y = \frac{x}{x^2 + 1}
$$

的图像。一定要用文字写出所有的局部极大值和极小值、函数递增和递减的区间、拐点、对称性，以及竖直和水平渐近线（如果有的话）。

<details>
<summary>解答</summary>

$y' = \dfrac{1 - x^2}{(x^2 + 1)^2}$，$y'' = \dfrac{2x(x^2 - 3)}{(x^2 + 1)^3}$。$y = \dfrac{x}{x^2 + 1}$ 有下列性质：

- 在 $x = 1$ 处有局部极大值（$y' = 0$，$y'' < 0$），$y(1) = \frac12$；
- 在 $x = -1$ 处有局部极小值（$y' = 0$，$y'' > 0$），$y(-1) = -\frac12$；
- 当 $|x| < 1$ 时函数递增（$y' > 0$）；
- 当 $|x| > 1$ 时函数递减（$y' < 0$）；
- 拐点（$y'' = 0$）在 $x = 0, \pm\sqrt3$；
- 图像关于原点对称（奇函数）；
- 水平渐近线 $\displaystyle\lim_{x \to \pm\infty} \frac{x}{x^2 + 1} = 0$，即直线 $y = 0$；
- 没有竖直渐近线。

> 图：过原点的曲线，从左边贴着 $x$ 轴下方出发，在 $x = -1$ 处降到最低点 $-\frac12$，经过原点上升到 $x = 1$ 处的最高点 $\frac12$，然后向右逐渐回落、贴近 $x$ 轴。

</details>

## 第 5 题

设计一张海报，印刷文字部分的面积是 50 平方英寸，上下页边距各 4 英寸，左右页边距各 2 英寸。求使用纸最少的海报尺寸。（一定要说明为什么你找到的答案是最小值。）

<details>
<summary>解答</summary>

> 图：海报，中间是宽 $x$、高 $y$ 的印刷区域，左右各留 2 英寸，上下各留 4 英寸。

印刷文字的面积是 50 平方英寸，所以 $xy = 50$，海报的总面积是 $(x + 4)(y + 8)$。要使用纸最少，就要使海报的总面积最小。

$$
(x + 4)(y + 8) = xy + 4y + 8x + 32 = 82 + 4y + 8x,
$$

因为已知 $xy = 50$。

还可以代入 $y = 50/x$，于是面积等于

$$
82 + \frac{4(50)}{x} + 8x.
$$

要求它的最小值，令它对 $x$ 的一阶导数等于零：

$$
-\frac{200}{x^2} + 8 = 0 \;\Longrightarrow\; x^2 = 25 \;\Longrightarrow\; x = 5,
$$

只取正根，因为 $x$ 表示物理量。

可以求 $-\dfrac{200}{x^2} + 8$ 的导数（即面积的二阶导数）$\dfrac{400}{x^3}$，检验 $x = 5$ 对应面积的最小值。因为它在 $x = 5$ 处为正，这一点确实对应最小值。

如果 $x = 5$，那么由 $xy = 50$ 得 $y = 10$。所以用纸最少的海报尺寸是宽 $x + 4 = 9$ 英寸、高 $y + 8 = 18$ 英寸。

</details>

## 第 6 题

一架公路巡逻飞机在一条笔直的长公路上空 1 英里处飞行，对地速度恒为每小时 120 英里。飞行员用雷达发现一辆汽车，它与飞机的距离是 1.5 英里，并以每小时 136 英里的速率在减小。这辆汽车沿公路行驶的速度是多少？（提示：可以给出精确答案，也可以用 $\sqrt5 \approx 2.2$。）

<details>
<summary>解答</summary>

设 $y$ 是飞机到汽车的总距离，$x$ 是飞机与汽车之间的水平距离。题目问的是汽车的速度 $dc/dt$。

由勾股定理，$y = \sqrt{x^2 + 1}$，因为飞机在公路上方 1 英里。距离的变化率 $dx/dt$ 是飞机和汽车相对运动的结果；飞机相对地面的速度是每小时 120 英里，所以汽车的速度是 $|dx/dt|$ 与 120 之差。另外，因为在 $t = 0$ 时 $y = 3/2$，所以那时 $x = \sqrt{y^2 - 1} = \sqrt{5/4} = \dfrac{\sqrt5}{2}$。

于是

$$
\frac{dy}{dt} = \frac12(x^2 + 1)^{-1/2}(2x)\frac{dx}{dt} = -136,
$$

代入 $x = \dfrac{\sqrt5}{2}$（此时 $\sqrt{x^2 + 1} = \frac32$），得到

$$
\frac{dx}{dt} = -136 \cdot \frac{3}{\sqrt5} = -\frac{408}{\sqrt5} \approx -\frac{408}{2.2}.
$$

由此可以算出汽车的速度：

$$
\frac{dc}{dt} = \frac{408}{\sqrt5} - 120 \approx \frac{408}{2.2} - 120 \approx 65.5 \text{ 英里/小时}.
$$

（本站补充：按精确值 $\sqrt5 \approx 2.236$ 计算，$\frac{408}{\sqrt5} - 120 \approx 62.5$ 英里/小时；65.5 是用题目允许的 $\sqrt5 \approx 2.2$ 得到的近似值。）

</details>

## 第 7 题

求下列极限：

(a)

$$
\lim_{n \to \infty} \sum_{i=1}^n \left(\sqrt{1 + \frac{2i}{n}}\right)\frac2n
$$

(b)

$$
\lim_{h \to 0} \frac1h\int_2^{2+h} \sin(x^2)\,dx
$$

<details>
<summary>解答</summary>

**(a)** 这是 $\sqrt{1 + x}$ 在 $[0, 2]$ 上的右黎曼和：

$$
\lim_{n \to \infty} \sum_{i=1}^n \sqrt{1 + \frac{2i}{n}}\,\frac2n = \int_0^2 \sqrt{1 + x}\,dx = \frac23(1 + x)^{3/2}\Big|_0^2 = \frac23(3)^{3/2} - \frac23 = 2\sqrt3 - \frac23.
$$

**(b)**

$$
\lim_{h \to 0} \frac1h\int_2^{2+h} \sin(x^2)\,dx = \lim_{h \to 0} \frac{\int_2^{2+h} \sin(x^2)\,dx}{h}.
$$

由洛必达法则（和微积分第二基本定理），它等于

$$
\lim_{h \to 0} \sin\bigl((2 + h)^2\bigr) = \sin(4).
$$

</details>

## 第 8 题

计算下列定积分：

(a) $\displaystyle\int_0^{\pi/4} \tan x\sec^2x\,dx$

(b) $\displaystyle\int_1^2 x\ln x\,dx$

<details>
<summary>解答</summary>

**(a)**

$$
\int_0^{\pi/4} \tan x\sec^2x\,dx = \int_0^{\pi/4} \left(\frac{\sin x}{\cos x}\right)\frac{1}{\cos^2x}\,dx = \int_0^{\pi/4} \frac{\sin x}{\cos^3x}\,dx.
$$

令 $u = \cos x$，则 $\dfrac{du}{dx} = -\sin x$。代入积分：

$$
-\int_{x=0}^{x=\pi/4} \frac{du}{u^3} = \frac12\cos(x)^{-2}\Big|_0^{\pi/4} = \frac12\left(\cos(\pi/4)^{-2} - 1\right) = \frac12.
$$

（也可以直接令 $u = \tan x$：$\int_0^1 u\,du = \frac12$。）

**(b)** 用分部积分：

$$
\int_1^2 x\ln x\,dx = \frac12x^2\ln x\Big|_1^2 - \int_1^2 \frac12x\,dx = \frac12(4)\ln 2 - \frac12\ln 1 - \frac14x^2\Big|_1^2 = 2\ln 2 - \frac34.
$$

</details>

## 第 9 题

计算不定积分

$$
\int \frac{x^2\,dx}{\sqrt{9 - x^2}}.
$$

<details>
<summary>解答</summary>

用反三角代换 $x = 3\sin\theta$，$dx = 3\cos\theta\,d\theta$，积分变成

$$
\int \frac{9\sin^2\theta(3\cos\theta\,d\theta)}{\sqrt{9 - 9\sin^2\theta}} = 9\int \sin^2\theta\,d\theta.
$$

然后用二倍角公式 $\sin^2\theta = \frac12(1 - \cos 2\theta)$ 得到

$$
\frac92\int (1 - \cos 2\theta)\,d\theta.
$$

求出积分：

$$
\frac92\theta - \frac94\sin 2\theta + C,
$$

其中 $C$ 是积分常数。把 $x$ 代回去（$\sin 2\theta = 2\sin\theta\cos\theta = 2 \cdot \frac x3 \cdot \frac{\sqrt{9 - x^2}}{3}$）：

$$
\int \frac{x^2\,dx}{\sqrt{9 - x^2}} = \frac92\sin^{-1}\left(\frac x3\right) - \frac12x\sqrt{9 - x^2} + C.
$$

</details>

## 第 10 题

把圆 $x^2 + y^2 = a^2$ 围成的圆盘绕 $y$ 轴旋转，得到一个球。然后沿 $y$ 轴穿过球钻一个直径为 $a$ 的孔（从北极到南极，像去了核的苹果）。求这个「去核」的球的体积。（提示：画出要旋转的二维区域，在图上标出各部分，帮助列出积分。）

<details>
<summary>解答</summary>

一般地，一块区域绕 $y$ 轴旋转所得的体积可以用柱壳法求出：

$$
V = 2\pi\int_a^b x\,h(x)\,dx,
$$

其中 $h(x)$ 是区域在 $x$ 处的高度。

> 图：要旋转的区域：在 $x = a/2$ 和 $x = a$ 之间、上半圆 $y = \sqrt{a^2 - x^2}$ 与下半圆 $y = -\sqrt{a^2 - x^2}$ 之间的部分。

对 $\sqrt{a^2 - x^2}$、$-\sqrt{a^2 - x^2}$、$x = a$ 和 $x = a/2$ 围成的区域用这个公式，高度是 $2\sqrt{a^2 - x^2}$，得到

$$
V = 2\pi\int_{a/2}^a x \cdot 2\sqrt{a^2 - x^2}\,dx.
$$

代换 $u = x^2$，$du = 2x\,dx$：

$$
V = 2\pi\int_{x=a/2}^{x=a} \sqrt{a^2 - u}\,du = 2\pi\left[-\frac23(a^2 - u)^{3/2}\right]_{x=a/2}^{x=a}.
$$

把 $u$ 换回 $x^2$：

$$
V = -\frac{4\pi}{3}(a^2 - x^2)^{3/2}\Big|_{a/2}^a = -\frac{4\pi}{3}\left(0 - \left(a^2 - (a/2)^2\right)^{3/2}\right) = \frac{4\pi}{3}\left(\frac{3a^2}{4}\right)^{3/2} = \frac{\sqrt3\pi a^3}{2}.
$$

</details>

## 第 11 题

下面这个积分没有初等原函数：

$$
\int_1^5 \frac{e^x}{x}\,dx.
$$

用两个梯形的梯形法则和下表的值（精确到一位小数）估计这个定积分。

| $x$ | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| $e^x/x$ | 2.7 | 3.7 | 6.7 | 13.6 | 29.7 |

（提示：粗略画出要算的曲线下方面积、分成两个梯形，可能有帮助。）

<details>
<summary>解答</summary>

设 $y(x) = \dfrac{e^x}{x}$。用两个梯形，图大致如下：

> 图：$x = 1$ 到 $x = 5$ 之间分成两个梯形（$[1, 3]$ 和 $[3, 5]$），每个梯形再分成下面一个矩形（区域 I、II）和上面一个三角形（区域 III、IV）。

各区域的面积是：

- 区域 I：$(3 - 1)y(1) = 2y(1) = 2(2.7) = 5.4$；
- 区域 II：$(5 - 3)y(3) = 2y(3) = 2(6.7) = 13.4$；
- 区域 III：$0.5(3 - 1)(y(3) - y(1)) = y(3) - y(1) = 6.7 - 2.7 = 4$；
- 区域 IV：$0.5(5 - 3)(y(5) - y(3)) = y(5) - y(3) = 29.7 - 6.7 = 23$。

所以总面积是 45.8。（等价地，梯形法则给出 $\frac22(2.7 + 2 \cdot 6.7 + 29.7) = 45.8$。）

</details>

## 第 12 题

一块镭 226 的放射性衰变速率（记作 $dm/dt$）与时刻 $t$ 时镭的量 $m$ 成正比。设在时刻 $t = 0$ 时有 100 毫克镭。

(a) 已知镭 226 的半衰期大约是 1600 年（半衰期是质量衰减一半所需的时间），通过解一个微分方程，求出 $t$ 年后剩余的镭的质量公式。

(b) 求 1000 年后剩余的镭的量。用 $2^{-10/16} \approx 0.65$ 化简答案。

<details>
<summary>解答</summary>

**(a)** 已知镭 226 的衰变速率 $dm/dt$ 与时刻 $t$ 时镭的量 $m$ 成正比。于是可以写出

$$
\frac{dm}{dt} = Am,
$$

其中 $A$ 是常数。改写方程并积分：

$$
\int \frac{dm}{m} = \int A\,dt \;\Longrightarrow\; \ln(m) = At + C' \;\Longrightarrow\; m = e^{At + C'} = e^{At}e^{C'} \;\Longrightarrow\; m = Ce^{At},
$$

其中 $C$ 是常数。用题目给的信息求 $A$ 和 $C$。首先，$t = 0$ 时有 100 毫克镭，所以

$$
m(0) = C = 100 \text{ 毫克}.
$$

还知道 $m$ 减少一半需要 1600 年。因此

$$
\frac{50}{100} = 0.5 = e^{1600A} \;\Longrightarrow\; \ln(0.5) = 1600A \;\Longrightarrow\; A = \frac{\ln(0.5)}{1600}.
$$

最后，

$$
m = Ce^{At} = 100e^{(\ln(0.5)/1600)t} = 100\left(e^{\ln(0.5)}\right)^{t/1600} = 100(0.5)^{t/1600},
$$

其中 $t$ 以年计，$m(t)$ 以毫克计。

**(b)** $t = 1000$ 年时，用题目给的近似：

$$
m = 100(0.5)^{1000/1600} = 100(2)^{-10/16} \approx 100(0.65) = 65 \text{ 毫克}.
$$

</details>

## 第 13 题

**考纽螺线**由参数方程

$$
x = C(t) = \int_0^t \cos(\pi u^2/2)\,du, \qquad y = S(t) = \int_0^t \sin(\pi u^2/2)\,du
$$

定义。也就是说，参数方程由本学期前面见过的菲涅耳函数给出。

求这条螺线从 $t = 0$ 到某个固定时刻 $t = t_0$ 的弧长。

<details>
<summary>解答</summary>

由参数方程 $x(t)$ 和 $y(t)$ 定义的曲线的弧长 $S$ 的公式是

$$
S = \int_a^b \sqrt{x'(t)^2 + y'(t)^2}\,dt.
$$

由微积分第二基本定理，它们的导数是

$$
x'(t) = \cos\left(\frac{\pi t^2}{2}\right), \qquad y'(t) = \sin\left(\frac{\pi t^2}{2}\right).
$$

把 $x'(t)$、$y'(t)$ 和相应的上下限代入弧长公式，得到

$$
S = \int_0^{t_0} \sqrt{\cos^2(\pi t^2/2) + \sin^2(\pi t^2/2)}\,dt = \int_0^{t_0} dt = t\Big|_0^{t_0} = t_0.
$$

</details>

## 第 14 题

(a) 求 $\ln(1 + x)$ 在 $a = 0$ 处的泰勒级数。

(b) 求这个泰勒级数的收敛半径。

(c) 用 (a) 中求出的幂级数的前两个非零项近似 $\ln\frac32$。

(d) 用泰勒不等式给出 (c) 中近似误差的一个上界。

<details>
<summary>解答</summary>

**(a)** 函数 $f(x)$ 在 $x = a$ 处的泰勒级数是

$$
f(a) + \frac{f'(a)(x - a)}{1!} + \frac{f^{(2)}(a)(x - a)^2}{2!} + \frac{f^{(3)}(a)(x - a)^3}{3!} + \frac{f^{(4)}(a)(x - a)^4}{4!} + \cdots
$$

于是 $\ln(1 + x)$ 在 $x = a$ 处的泰勒级数是

$$
\ln(1 + a) + \frac{(1 + a)^{-1}(x - a)}{1!} + \frac{-(1 + a)^{-2}(x - a)^2}{2!} + \frac{2(1 + a)^{-3}(x - a)^3}{3!} + \frac{-(2)(3)(1 + a)^{-4}(x - a)^4}{4!} + \cdots
$$

因此 $\ln(1 + x)$ 在 $a = 0$ 处的泰勒级数是

$$
\ln(1) + \frac{x}{1!} + \frac{-x^2}{2!} + \frac{2x^3}{3!} + \frac{-(2)(3)x^4}{4!} + \cdots = 0 + \frac x1 - \frac{x^2}{2} + \frac{x^3}{3} - \frac{x^4}{4} + \cdots = \sum_{n=1}^\infty (-1)^{n+1}\frac{x^n}{n}.
$$

**(b)** 用比值判别法：

$$
\left|\frac{(-1)^{n+2}x^{n+1}/(n + 1)}{(-1)^{n+1}x^n/n}\right| = |x|\frac{n}{n + 1} \to |x| \qquad (n \to \infty).
$$

所以 $|x| < 1$ 时级数收敛，$|x| > 1$ 时发散，收敛半径是 1（收敛区间的内部是 $-1 < x < 1$）。

**(c)** $\ln(3/2) = \ln(1 + 0.5)$ 可以用 (a) 中泰勒级数的前两个非零项近似：

$$
\ln(1 + x) \approx \frac x1 - \frac{x^2}{2} = 0.5 - \frac{0.25}{2} = \frac38.
$$

**(d)** (c) 中近似的误差上界用泰勒不等式求：

$$
|R_n(x)| \le M_n\frac{|x|^{n+1}}{(n + 1)!},
$$

其中 $x = 1/2$，$n = 2$。此外，

$$
M_2 \ge |f^{(3)}(x)| = \frac{2}{(1 + x)^3}
$$

对所有 $|x| \le 1/2$ 成立；在这个范围内最大值在 $x = -1/2$ 处取得，给出 $M_2 = 16$。把这些数代入上面的公式：

$$
|R_2(0.5)| \le 16\frac{(0.5)^3}{3!} = \frac13.
$$

（本站补充：其实只需要在 $[0, \frac12]$ 上估计 $f^{(3)}$，那里 $|f^{(3)}| \le 2$，误差上界可以缩小到 $2 \cdot \frac{(0.5)^3}{3!} = \frac{1}{24} \approx 0.042$。实际误差是 $\ln 1.5 - 0.375 \approx 0.0305$。）

</details>

## 第 15 题（附加题）

（附加题——只在做完考试、还有时间时才做。）

证明或否定下面的命题：

$$
\frac{x}{1 + x^2} < \tan^{-1}(x) < x \qquad \text{对所有 } x > 0.
$$

<details>
<summary>解答</summary>

命题成立。我们先证明三项的导数满足这个不等式（对 $x > 0$），再倒推回去：

$$
\frac{d}{dx}\left(\frac{x}{1 + x^2}\right) = \frac{1}{1 + x^2} - \frac{2x^2}{(1 + x^2)^2}, \qquad \frac{d}{dx}\tan^{-1}(x) = \frac{1}{1 + x^2}, \qquad \frac{d}{dx}(x) = 1.
$$

$$
\frac{1}{1 + x^2} - \frac{2x^2}{(1 + x^2)^2} < \frac{1}{1 + x^2} < 1 \qquad \text{对所有 } x > 0.
$$

从 0 积到 $t$（三个函数在 0 处的值都是 0）：

$$
\int_0^t \left(\frac{1}{1 + x^2} - \frac{2x^2}{(1 + x^2)^2}\right)dx < \int_0^t \frac{1}{1 + x^2}\,dx < \int_0^t 1\,dx \qquad \text{对所有 } t > 0,
$$

$$
\Longrightarrow\quad \frac{t}{1 + t^2} < \tan^{-1}(t) < t \qquad \text{对所有 } t > 0,
$$

即

$$
\frac{x}{1 + x^2} < \tan^{-1}(x) < x \qquad \text{对所有 } x > 0.
$$

</details>
