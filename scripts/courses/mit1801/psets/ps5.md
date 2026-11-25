# 习题课 5：中值定理、原函数与微分方程

> 本页是 MIT 开放式课程 18.01SC 习题课 5 指定练习题及解答的中文翻译。题目和解答出自 David Jerison、Arthur Mattuck 编写的 18.01 习题集（18.01 Exercises），2 开头的题在「Applications of Differentiation」一册，3 开头的在「Integration」一册。原文见页面下方的「习题原文（PDF）」和「习题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。题号沿用原书，便于对照。建议先自己做完一节，再展开解答对照。

本次习题课覆盖单元 2 的 C 部分（第 34–40 节）。题目中说的「形式 (1)」指 $\dfrac{f(b) - f(a)}{b - a} = f'(c)$，「形式 (2)」指 $f(b) = f(a) + f'(c)(b - a)$。

## 2G. 中值定理

**2G-1 b)** 对函数 $\ln x$ 在区间 $[1, 2]$ 上，明确求出中值定理所断言存在的点 $c$。（用形式 (1)。）

<details>
<summary>解答</summary>

割线斜率 $= \ln 2$；$f'(x) = \dfrac1x \Rightarrow f'(c) = \ln 2$ 当 $c = \dfrac{1}{\ln 2}$（约 1.44，确实在 1 和 2 之间）。

</details>

**2G-2 b)** 用形式 (2) 证明：$x > 0$ 时 $\sqrt{1 + x} < 1 + \dfrac x2$。

<details>
<summary>解答</summary>

$\dfrac{d}{dx}\sqrt{1 + x} = \dfrac{1}{2\sqrt{1 + x}}$，所以在 $[0, x]$ 上用形式 (2)：

$$
\sqrt{1 + x} = 1 + \frac{1}{2\sqrt{1 + c}}x < 1 + \frac12x,
$$

因为 $c > 0$（所以 $\sqrt{1 + c} > 1$）。

</details>

**2G-5** a) 设 $f''(x)$ 在区间 $I$ 上存在，并且 $f(x)$ 在 $I$ 中的三个不同的点 $a < b < c$ 处为零。证明 $[a, c]$ 中有一点 $p$ 使 $f''(p) = 0$。

b) 在三次函数 $f(x) = (x - a)(x - b)(x - c)$ 上说明 (a)。

<details>
<summary>解答</summary>

a) 设 $f(x)$ 在 $a$、$b$、$c$ 处为 0。

由罗尔定理（中值定理在 $f(a) = f(b)$ 时的特例），有两个点 $q_1 \in (a, b)$、$q_2 \in (b, c)$ 使 $f'(q_1) = 0$，$f'(q_2) = 0$。

再对 $f'(x)$ 在 $q_1$、$q_2$ 之间用罗尔定理，得到一点 $p$ 使 $f''(p) = 0$。因为 $p$ 在 $q_1$ 和 $q_2$ 之间，它也在 $a$ 和 $c$ 之间。

b)（本站补写，官方解答没有写这一问。）展开 $f(x) = x^3 - (a + b + c)x^2 + \cdots$，所以 $f''(x) = 6x - 2(a + b + c)$，它在 $p = \dfrac{a + b + c}{3}$ 处为零。三个数的平均数一定在最小的 $a$ 和最大的 $c$ 之间，正如 (a) 所说。$p$ 就是三次函数图像的拐点。

</details>

**2G-6** 用中值定理的形式 (2) 证明，在区间 $[a, b]$ 上：

a) $f'(x) > 0 \Rightarrow f(x)$ 递增；　　b) $f'(x) = 0 \Rightarrow f(x)$ 是常数。

<details>
<summary>解答</summary>

a) 给定两点 $x_1$、$x_2$，$a \le x_1 < x_2 \le b$，有

$$
f(x_2) = f(x_1) + f'(c)(x_2 - x_1), \qquad x_1 < c < x_2.
$$

因为在 $[a, b]$ 上 $f'(x) > 0$，所以 $f'(c) > 0$；又 $x_2 - x_1 > 0$。所以 $f(x_2) > f(x_1)$，这说明 $f(x)$ 递增。

b) 有 $f(x) = f(a) + f'(c)(x - a)$，其中 $a < c < x$。因为 $f'(c) = 0$，所以对 $a \le x \le b$ 都有 $f(x) = f(a)$，这说明 $f(x)$ 在 $[a, b]$ 上是常数。

</details>

## 3A. 微分、不定积分

**3A-1** 计算下列函数的微分 $df(x)$：d) $d(e^{3x}\sin x)$

e) 如果 $\sqrt x + \sqrt y = 1$，用 $x$ 和 $dx$ 表示 $dy$。

<details>
<summary>解答</summary>

d) $(3e^{3x}\sin x + e^{3x}\cos x)\,dx$

e) $\dfrac{1}{2\sqrt x}dx + \dfrac{1}{2\sqrt y}dy = 0$，所以

$$
dy = -\frac{\frac{1}{2\sqrt x}dx}{\frac{1}{2\sqrt y}} = -\frac{\sqrt y}{\sqrt x}dx = -\frac{1 - \sqrt x}{\sqrt x}dx = \left(1 - \frac{1}{\sqrt x}\right)dx.
$$

</details>

**3A-2** 计算下列不定积分：

a) $\displaystyle\int (2x^4 + 3x^2 + x + 8)\,dx$　　c) $\displaystyle\int \sqrt{8 + 9x}\,dx$　　e) $\displaystyle\int \frac{x}{\sqrt{8 - 2x^2}}\,dx$

g) $\displaystyle\int 7x^4e^{x^5}\,dx$　　i) $\displaystyle\int \frac{dx}{3x + 2}$　　k) $\displaystyle\int \frac{x}{x + 5}\,dx$（写成 $\dfrac{x}{x + 5} = 1 + \ldots$）

<details>
<summary>解答</summary>

a) $\dfrac25x^5 + x^3 + \dfrac{x^2}{2} + 8x + c$

c) **方法一**（慢的办法）：换元 $u = 8 + 9x$，$du = 9\,dx$。所以

$$
\int \sqrt{8 + 9x}\,dx = \int u^{1/2}\frac19\,du = \frac19 \cdot \frac23u^{3/2} + c = \frac{2}{27}(8 + 9x)^{3/2} + c.
$$

**方法二**（猜测并检验）：先猜出原函数的形式，再算出前面的常数因子，往往更快。猜 $(8 + 9x)^{3/2}$：

$$
\frac{d}{dx}(8 + 9x)^{3/2} = \frac32 \cdot 9(8 + 9x)^{1/2} = \frac{27}{2}(8 + 9x)^{1/2}.
$$

所以把猜测乘以 $\frac{2}{27}$，让导数正确；答案是 $\dfrac{2}{27}(8 + 9x)^{3/2} + c$。

e) $\displaystyle\int \frac{x}{\sqrt{8 - 2x^2}}\,dx = -\frac{\sqrt{8 - 2x^2}}{2} + c$

下面几题应该试着用方法二在心里算出来：写出解的正确形式，再修正前面的系数。

g) $\dfrac75e^{x^5} + c$

i) $\dfrac13\ln(3x + 2) + c$。作为对比，看看换元慢多少：$u = 3x + 2$，$du = 3\,dx$，所以 $\displaystyle\int \frac{dx}{3x + 2} = \int \frac{\frac13du}{u} = \frac13\ln u + c = \frac13\ln(3x + 2) + c$。

k)

$$
\int \frac{x}{x + 5}\,dx = \int \left(1 - \frac{5}{x + 5}\right)dx = x - 5\ln(x + 5) + c.
$$

在单元 5 中，这种代数技巧会作为一般方法的一部分详细讲解。它背后是多项式的长除法。

（这几题中的 $\ln$ 严格说应写成 $\ln|\cdot|$，这里沿用原文的写法，默认括号里的量为正。）

</details>

**3A-3** 计算下列不定积分：

a) $\displaystyle\int \sin(5x)\,dx$　　c) $\displaystyle\int \cos^2 x\sin x\,dx$　　e) $\displaystyle\int \sec^2(x/5)\,dx$　　g) $\displaystyle\int \sec^9 x\tan x\,dx$

<details>
<summary>解答</summary>

a) $-\dfrac15\cos(5x) + c$

c) $-\dfrac13\cos^3 x + c$

e) $5\tan(x/5) + c$

g) $u = \sec x$，$du = \sec x\tan x\,dx$，

$$
\int \sec^9 x\tan x\,dx = \int (\sec x)^8\sec x\tan x\,dx = \frac19\sec^9 x + c.
$$

</details>

## 3F. 微分方程：分离变量法

**3F-1** 解下列微分方程：c) $\dfrac{dy}{dx} = \dfrac{3}{\sqrt y}$　　d) $\dfrac{dy}{dx} = xy^2$

<details>
<summary>解答</summary>

c) $y^{1/2}\,dy = 3\,dx \Rightarrow \dfrac23y^{3/2} = 3x + c \Rightarrow y = \left(\dfrac{9x}{2} + a\right)^{2/3}$，其中 $a = \frac32c$。

d) $y^{-2}\,dy = x\,dx \Rightarrow -y^{-1} = \dfrac{x^2}{2} + c \Rightarrow y = \dfrac{-1}{x^2/2 + c}$。

</details>

**3F-2** 在给定的初始条件下解下列微分方程，并求解在给定 $x$ 处的值：

a) $\dfrac{dy}{dx} = 4xy$，$y(1) = 3$。求 $y(3)$。

e) $\dfrac{dy}{dx} = e^y$，$y(3) = 0$。求 $y(0)$。解 $y$ 对哪些 $x$ 有定义？

<details>
<summary>解答</summary>

a) 答案：$3e^{16}$。

$$
y^{-1}\,dy = 4x\,dx \;\Longrightarrow\; \ln y = 2x^2 + c.
$$

$y(1) = 3 \Rightarrow \ln 3 = 2 + c \Rightarrow c = \ln 3 - 2$。所以 $\ln y = 2x^2 + (\ln 3 - 2)$。在 $x = 3$ 处，$y = e^{18 + \ln 3 - 2} = 3e^{16}$。

e) 答案：$x = 0$ 时 $y = -\ln 4$。解在 $-\infty < x < 4$ 上有定义。

$$
e^{-y}\,dy = dx \;\Longrightarrow\; -e^{-y} = x + c.
$$

$y(3) = 0 \Rightarrow -e^0 = 3 + c \Rightarrow c = -4$。所以 $y = -\ln(4 - x)$，$y(0) = -\ln 4$。解只在 $x < 4$ 时有定义。

</details>

**3F-4** 牛顿冷却定律说：温度的变化率与温差成正比。用符号表示：如果一个物体在时刻 $t$ 的温度是 $T$，周围环境处于恒定温度 $T_e$（$e$ 表示外部），那么 $T$ 的变化率是

$$
\frac{dT}{dt} = k(T_e - T).
$$

常数 $k > 0$ 是比例常数，取决于物体的比热、表面积等性质。

b) 如果在 $t = 0$ 时初始温度是 $T_0$，求 $T$ 的公式。

c) 证明 $t \to \infty$ 时 $T \to T_e$。

d) 设一块金属锭离开锻炉时温度为 680 °C，放在 40 °C 的房间里。它在 8 小时内冷却到 200 °C。它从 680 °C 冷却到 50 °C 需要多少小时？（最简单的是跟踪温差 $T - T_e$，而不是 $T$。温差按指数衰减。）

<details>
<summary>解答</summary>

b) 分离变量并积分：

$$
(T - T_e)^{-1}\,dT = -k\,dt \;\Longrightarrow\; \ln|T - T_e| = -kt + c.
$$

取指数，$T - T_e = \pm e^ce^{-kt} = Ae^{-kt}$。初始条件 $T(0) = T_0$ 意味着 $A = T_0 - T_e$。于是

$$
T = T_e + (T_0 - T_e)e^{-kt}.
$$

c) 因为 $k > 0$，$t \to \infty$ 时 $e^{-kt} \to 0$。所以

$$
T = T_e + (T_0 - T_e)e^{-kt} \longrightarrow T_e \qquad (t \to \infty).
$$

d) $T - T_e = (T_0 - T_e)e^{-kt}$。数据是 $T_0 = 680$，$T_e = 40$，$T(8) = 200$。所以

$$
200 - 40 = (680 - 40)e^{-8k} \;\Longrightarrow\; e^{-8k} = \frac{160}{640} = \frac14 \;\Longrightarrow\; -8k = -\ln 4.
$$

冷却到 50 °C 所需的小时数 $t$ 满足

$$
50 - 40 = 640e^{-kt} \;\Longrightarrow\; e^{-kt} = \frac{1}{64} \;\Longrightarrow\; -kt = -3\ln 4.
$$

要同时解右边这两个方程求 $t$，最简单的是用下面一个除以上面一个，得到 $\dfrac t8 = 3$，$t = 24$ 小时。

</details>

**3F-8 b)** 求第一象限中所有这样的平面曲线：对曲线上每一点 $P$，$P$ 平分 $P$ 处切线位于第一象限内的那一段。

<details>
<summary>解答</summary>

设 $P = (x, y)$，切线与 $x$ 轴交于 $Q$，$P$ 在 $x$ 轴上的投影为 $P_0$。如果 $P$ 平分切线段，那么 $P_0$ 平分 $OQ$（由欧几里得几何）。所以 $P_0Q = x$（因为 $OP_0 = x$）。

于是切线的斜率是 $y' = \dfrac{-y}{x}$，即 $\dfrac{dy}{y} = -\dfrac{dx}{x}$，所以 $\ln y = -\ln x + c_1$。

取指数：$y = \dfrac1x \cdot e^{c_1} = \dfrac cx$，$c > 0$。这些曲线是双曲线。

</details>
