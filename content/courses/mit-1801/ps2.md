# 习题课 2：微分（二）

> 本页是 MIT 开放式课程 18.01SC 习题课 2 指定练习题及解答的中文翻译。题目和解答出自 David Jerison、Arthur Mattuck 编写的 18.01 习题集（18.01 Exercises），原文见页面下方的「习题原文（PDF）」和「习题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。题号沿用原书（1 开头的在「Differentiation」一册，5 开头的在「Integration Techniques」一册），便于对照。建议先自己做完一节，再展开解答对照。

本次习题课覆盖单元 1 的 B 部分（第 13–20 节）：隐函数求导、反函数、指数与对数、双曲函数。

## 1F. 链式法则、隐函数求导

**1F-3** 用隐函数求导求 $y = x^{1/n}$ 的 $dy/dx$。

<details>
<summary>解答</summary>

$y = x^{1/n} \Rightarrow y^n = x \Rightarrow ny^{n-1}y' = 1$。所以

$$
y' = \frac{1}{ny^{n-1}} = \frac1n y^{1-n} = \frac1n x^{\frac1n - 1}.
$$

</details>

**1F-5** 求曲线 $\sin x + \sin y = 1/2$ 上所有切线水平的点。（这是一族有周期性重复图案的曲线，因为在变换 $y \to y + 2\pi$ 和 $x \to x + 2\pi$ 下方程不变。）

<details>
<summary>解答</summary>

隐函数求导得 $\cos x + y'\cos y = 0$。切线水平意味着 $y' = 0$，所以 $\cos x = 0$。这些点是对每个整数 $k$ 的 $x = \pi/2 + k\pi$。

回顾 $\sin(\pi/2 + k\pi) = (-1)^k$，即 $k$ 为偶数时是 1，$k$ 为奇数时是 $-1$。所以在 $x = \pi/2 + k\pi$ 处，$\pm1 + \sin y = 1/2$，即 $\sin y = \mp1 + 1/2$。但 $\sin y = 3/2$ 无解，所以只有 $k$ 为偶数时才有解，这时 $\sin y = -1 + 1/2 = -1/2$，于是 $y = -\pi/6 + 2n\pi$ 或 $y = 7\pi/6 + 2n\pi$。

总共是两组网格点，位于边长为 $2\pi$ 的正方形的顶点上：

$$
(\pi/2 + 2k\pi,\; -\pi/6 + 2n\pi) \qquad\text{和}\qquad (\pi/2 + 2k\pi,\; 7\pi/6 + 2n\pi), \qquad k, n \text{ 为任意整数}.
$$

</details>

**1F-8** 用隐函数求导求导数。除了导数中出现的自变量和因变量，所有字母都表示常数。

a) $V = \dfrac13\pi r^2h$，$\dfrac{dr}{dh} = ?$　　c) $c^2 = a^2 + b^2 - 2ab\cos\theta$，$\dfrac{da}{db} = ?$

<details>
<summary>解答</summary>

a) $V = \dfrac13\pi r^2h \Rightarrow 0 = \dfrac13\pi(2rr'h + r^2) \Rightarrow r' = \dfrac{-r^2}{2rh} = \dfrac{-r}{2h}$。

c) 对 $c^2 = a^2 + b^2 - 2ab\cos\theta$ 关于 $b$ 求导（$c$、$\theta$ 是常数）：

$$
0 = 2aa' + 2b - 2\cos\theta(a'b + a) \;\Longrightarrow\; a' = \frac{-2b + 2a\cos\theta}{2a - 2b\cos\theta} = \frac{a\cos\theta - b}{a - b\cos\theta}.
$$

</details>

## 1G. 高阶导数

**1G-4** 求 $y = 1/(x + 1)$ 的 $n$ 阶导数 $y^{(n)}$ 的公式。

<details>
<summary>解答</summary>

$y = (x + 1)^{-1}$，所以 $y^{(1)} = -(x + 1)^{-2}$，$y^{(2)} = (-1)(-2)(x + 1)^{-3}$，$y^{(3)} = (-1)(-2)(-3)(x + 1)^{-4}$。规律是

$$
y^{(n)} = (-1)^n\,n!\,(x + 1)^{-n-1}.
$$

</details>

**1G-5 b)** 设 $y = u(x)v(x)$。$n$ 阶导数 $y^{(n)}$ 的一般公式叫做**莱布尼茨公式**，它用的系数和二项式定理相同：

$$
y^{(n)} = u^{(n)}v + \binom n1 u^{(n-1)}v^{(1)} + \binom n2 u^{(n-2)}v^{(2)} + \cdots + uv^{(n)}.
$$

用它检验 1G-5 a) 的答案（见习题课 1），并用它计算 $y = x^p(1 + x)^q$ 的 $y^{(p+q)}$。

<details>
<summary>解答</summary>

$n = 1$ 和 $n = 2$ 时，上面的公式和 a) 的结果一致。

要计算 $y = x^p(1 + x)^q$ 的 $y^{(p+q)}$，令 $u = x^p$、$v = (1 + x)^q$，$n = p + q$。莱布尼茨公式中唯一不为 0 的项是 $\dbinom np u^{(p)}v^{(q)}$，因为其他每一项中，要么 $u$ 被求导超过 $p$ 次，要么 $v$ 被求导超过 $q$ 次，都得 0。$u = x^p$ 时 $u^{(p)} = p!$，$v^{(q)} = q!$，所以

$$
y^{(p+q)} = \binom np p!\,q! = \frac{n!}{p!\,q!} \cdot p!\,q! = n! = (p + q)!.
$$

</details>

## 1H. 指数与对数：代数

**1H-1** 按规律 $y = y_0e^{-kt}$ 衰变的放射性物质，它的**半衰期** $\lambda$ 定义为数量减少到初始量 $y_0$ 的 $1/2$ 所需的时间。

a) 用 $k$ 表示半衰期 $\lambda$。（从头推导——不要直接套用这里或别处给出的公式。）

b) 用你求出的 $\lambda$ 的表达式证明：如果在 $t_1$ 时刻数量是 $y_1$，那么在 $t_1 + \lambda$ 时刻数量就是 $y_1/2$，不管 $t_1$ 是多少。

<details>
<summary>解答</summary>

a) 要看什么时候 $y = y_0/2$，必须解方程 $\dfrac{y_0}{2} = y_0e^{-kt}$，即 $\dfrac12 = e^{-kt}$。两边取 $\ln$：$-\ln 2 = -kt$，所以

$$
\lambda = \frac{\ln 2}{k}.
$$

b) 由假设 $y_1 = y_0e^{-kt_1}$。于是

$$
y_0e^{-k(t_1 + \lambda)} = y_0e^{-kt_1} \cdot e^{-k\lambda} = y_1 \cdot e^{-\ln 2} = \frac{y_1}{2}.
$$

（译注：原文解答里把指数写成了 $e^{kt_1}$、$\lambda = -\ln 2/k$，符号与题设的 $e^{-kt}$ 不一致，译文统一按 $e^{-kt}$ 写。）

</details>

**1H-2** 一种含高浓度氢离子的溶液（即强酸）用等体积的水稀释后，它的 pH 值大约改变多少？（用 $(\text{pH})_{\text{原}}$ 表示 $(\text{pH})_{\text{稀释后}}$。）

<details>
<summary>解答</summary>

$\text{pH} = -\log_{10}[\mathrm{H}^+]$；按假设，$[\mathrm{H}^+]_{\text{稀释后}} = \frac12[\mathrm{H}^+]_{\text{原}}$。对两边取 $-\log_{10}$（注意 $\log 2 \approx 0.3$）：

$$
-\log[\mathrm{H}^+]_{\text{稀释后}} = \log 2 - \log[\mathrm{H}^+]_{\text{原}} \;\Longrightarrow\; \text{pH}_{\text{稀释后}} = \text{pH}_{\text{原}} + \log 2 \approx \text{pH}_{\text{原}} + 0.3.
$$

</details>

**1H-3 a)** 解出 $y$：$\ln(y + 1) + \ln(y - 1) = 2x + \ln x$。

**1H-5 b)** 解出 $x$（提示：令 $u = e^x$，先解出 $u$）：$y = e^x + e^{-x}$。

<details>
<summary>解答</summary>

这两题和第 17 节例题的第 1、5 题相同，详细过程见那里。

1H-3 a) 两边取指数再解出 $y$：$(y + 1)(y - 1) = e^{2x} \cdot x \Rightarrow y^2 - 1 = xe^{2x} \Rightarrow y = \sqrt{xe^{2x} + 1}$（因为 $y > 0$）。

1H-5 b) 令 $u = e^x$，得 $u + \dfrac1u = y$，即 $u^2 - yu + 1 = 0$，所以 $u = \dfrac{y \pm \sqrt{y^2 - 4}}{2} = e^x$；取对数：

$$
x = \ln\left(\frac{y \pm \sqrt{y^2 - 4}}{2}\right).
$$

</details>

## 1I. 指数与对数：微积分

**1I-1** 求下列函数的导数：

c) $e^{-x^2}$　　d) $x\ln x - x$　　e) $\ln(x^2)$　　f) $(\ln x)^2$　　m) $(1 - e^x)/(1 + e^x)$

<details>
<summary>解答</summary>

c) $-2xe^{-x^2}$　　d) $\ln x$　　e) $2/x$　　f) $2(\ln x)/x$　　m) $-2e^x/(1 + e^x)^2$

</details>

**1I-4 a)** 利用 $\displaystyle\lim_{n \to \infty}\left(1 + \frac1n\right)^n = e$，计算 $\displaystyle\lim_{n \to \infty}\left(1 + \frac1n\right)^{3n}$。

<details>
<summary>解答</summary>

$$
\left(1 + \frac1n\right)^{3n} = \left(\left(1 + \frac1n\right)^n\right)^3 \longrightarrow e^3 \qquad (n \to \infty).
$$

</details>

## 5A. 反三角函数、双曲函数

**5A-1** 求值：

a) $\tan^{-1}\sqrt3$　　b) $\sin^{-1}(\sqrt3/2)$

c) 如果 $\theta = \tan^{-1}5$，求 $\sin\theta$、$\cos\theta$ 和 $\sec\theta$。

<details>
<summary>解答</summary>

a) $\tan^{-1}\sqrt3 = \dfrac{\pi}{3}$　　b) $\sin^{-1}\left(\dfrac{\sqrt3}{2}\right) = \dfrac{\pi}{3}$

c) $\tan\theta = 5$，画一个对边为 5、邻边为 1、斜边为 $\sqrt{26}$ 的直角三角形，得 $\sin\theta = 5/\sqrt{26}$，$\cos\theta = 1/\sqrt{26}$，$\sec\theta = \sqrt{26}$。

</details>

**5A-3** 求下列函数关于 $x$ 的导数：

f) $\sin^{-1}(a/x)$　　g) $\tan^{-1}\left(x/\sqrt{1 - x^2}\right)$　　h) $\sin^{-1}\sqrt{1 - x}$

<details>
<summary>解答</summary>

f) 链式法则：

$$
\frac{d}{dx}\sin^{-1}(a/x) = \frac{1}{\sqrt{1 - (a/x)^2}} \cdot \frac{-a}{x^2} = \frac{-a}{x\sqrt{x^2 - a^2}}.
$$

（这里设 $x > 0$。）

g) $y = x/\sqrt{1 - x^2}$，$dy/dx = (1 - x^2)^{-3/2}$，$1 + y^2 = 1/(1 - x^2)$。所以

$$
\frac{d}{dx}\tan^{-1}y = \frac{dy/dx}{1 + y^2} = (1 - x^2)^{-3/2}(1 - x^2) = \frac{1}{\sqrt{1 - x^2}}.
$$

为什么这和 $\sin^{-1}x$ 的导数一样？（想一想：如果 $\theta = \sin^{-1}x$，那么 $\tan\theta = x/\sqrt{1 - x^2}$。）

h) $y = \sqrt{1 - x}$，$dy/dx = -1/(2\sqrt{1 - x})$，$1 - y^2 = x$。所以

$$
\frac{d}{dx}\sin^{-1}y = \frac{dy/dx}{\sqrt{1 - y^2}} = \frac{-1}{2\sqrt{x(1 - x)}}.
$$

</details>

**5A-5** a) 求出 $y = \sinh x$ 的临界点、拐点、对称性以及 $x \to \infty$ 和 $x \to -\infty$ 时的极限，画出它的图像。

b) 给 $\sinh^{-1}x$（反双曲正弦）一个合适的定义，画出它的图像，标明定义域。

c) 求 $\dfrac{d}{dx}\sinh^{-1}x$。

<details>
<summary>解答</summary>

a)

$$
y = \sinh x = \frac{e^x - e^{-x}}{2}, \qquad y' = \cosh x = \frac{e^x + e^{-x}}{2}, \qquad y'' = \sinh x.
$$

$y'$ 永远不为零，所以没有临界点。拐点在 $x = 0$，那里的斜率是 1。$y$ 是奇函数，$x$ 很大时像 $e^x/2$（$x \to \infty$ 时趋于 $\infty$，$x \to -\infty$ 时趋于 $-\infty$）。

（「临界点」「拐点」是单元 2 的内容：临界点是 $y' = 0$ 的点，拐点是凹凸性改变的点。）

b) $y = \sinh^{-1}x \iff x = \sinh y$。定义域是整条 $x$ 轴。图像是 $\sinh x$ 的图像关于 $y = x$ 的反射。

c) 对 $x = \sinh y$ 关于 $x$ 做隐函数求导：

$$
1 = \cosh y \cdot \frac{dy}{dx} \;\Longrightarrow\; \frac{dy}{dx} = \frac{1}{\cosh y} = \frac{1}{\sqrt{\sinh^2 y + 1}} \;\Longrightarrow\; \frac{d}{dx}\sinh^{-1}x = \frac{1}{\sqrt{x^2 + 1}}.
$$

</details>
