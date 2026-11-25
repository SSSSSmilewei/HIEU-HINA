# 考试 1：试卷与解答

> 本页是 MIT 开放式课程 18.01SC 单元 1 考试及官方解答的中文翻译，原文见页面下方的「试卷原文（PDF）」和「试卷解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

**建议的做法**：找一段完整的 50 分钟，不看讲义，像真正考试一样做完六道题，再展开解答对照。

## 第 1 题

计算下列导数。（能化简就化简。）

(a) $f'(x)$，其中 $f(x) = \dfrac{x}{1 - x^2}$。

(b) $f'(x)$，其中 $f(x) = \ln(\cos x) - \dfrac12\sin^2 x$。

(c) $f^{(5)}(x)$，即 $f$ 的五阶导数，其中 $f(x) = xe^x$。

<details>
<summary>解答</summary>

(a)

$$
f'(x) = \frac{1 \cdot (1 - x^2) - x \cdot (-2x)}{(1 - x^2)^2} = \frac{1 - x^2 + 2x^2}{(1 - x^2)^2} = \frac{1 + x^2}{(1 - x^2)^2}.
$$

(b)

$$
f'(x) = \frac{1}{\cos x}(-\sin x) - \frac12 \cdot 2\sin x\cos x = -\tan x - \sin x\cos x = -\sin x\left(\frac{1 + \cos^2 x}{\cos x}\right).
$$

(c)

$$
\begin{aligned}
f'(x) &= e^x + xe^x = 1 \cdot e^x + xe^x \\
f''(x) &= e^x + e^x + xe^x = 2 \cdot e^x + xe^x \\
f^{(3)}(x) &= 2e^x + e^x + xe^x = 3 \cdot e^x + xe^x \\
f^{(4)}(x) &= 4 \cdot e^x + xe^x \\
f^{(5)}(x) &= 5 \cdot e^x + xe^x.
\end{aligned}
$$

规律是：如果 $f^{(k)}(x) = ke^x + xe^x$，那么 $f^{(k+1)}(x) = ke^x + e^x + xe^x = (k + 1)e^x + xe^x$。

</details>

## 第 2 题

求由方程

$$
x^{2/3} + y^{2/3} = 4
$$

隐式定义的「星形线」（astroid）在点 $(-\sqrt{27}, 1)$ 处的切线方程。

<details>
<summary>解答</summary>

先检验这个点在曲线上：$-\sqrt{27} = -3^{3/2}$，$(-3^{3/2})^{2/3} + 1^{2/3} = 3 + 1 = 4$。

用隐函数求导得到 $\left.\dfrac{dy}{dx}\right|_{(-\sqrt{27}, 1)}$：

$$
\begin{aligned}
x^{2/3} + y^{2/3} &= 4 \\
\frac23x^{-1/3} + \frac23y^{-1/3}\frac{dy}{dx} &= 0 \\
\frac{dy}{dx} &= -\frac{x^{-1/3}}{y^{-1/3}} = -\frac{(-3^{3/2})^{-1/3}}{1} = 3^{-1/2} = \frac{1}{\sqrt3}.
\end{aligned}
$$

切线的斜率是 $\dfrac{1}{\sqrt3}$。由点斜式，切线方程是

$$
y - 1 = \frac{1}{\sqrt3}(x + \sqrt{27}) \;\Longrightarrow\; y = \frac{1}{\sqrt3}x + 3 + 1 = \frac{1}{\sqrt3}x + 4.
$$

</details>

## 第 3 题

一个质点沿竖直轴运动，它在时刻 $t$（秒）的位置 $y$（米）由方程

$$
y(t) = t^3 - 3t + 3, \qquad t \ge 0
$$

给出。求质点在头三秒内经过的总路程。

<details>
<summary>解答</summary>

三次函数往往先增、再减、再增；要求总路程（而不是净位移），可能需要把行程分成三段。所以先求 $y(t)$ 的极大值和极小值。

令 $y'(t) = 0$ 解出 $t$：

$$
y'(t) = 3t^2 - 3 = 3(t^2 - 1) = 0 \;\Longrightarrow\; t = \pm1.
$$

注意 $t < -1$ 和 $t > 1$ 时 $y'(t) > 0$，$-1 < t < 1$ 时 $y'(t) < 0$，所以质点一开始在下降，到 $t = 1$ 时开始上升。

$$
y(0) = 3, \qquad y(1) = 1 - 3 + 3 = 1, \qquad y(3) = 27 - 9 + 3 = 21.
$$

总路程是 $\underbrace{(3 - 1)}_{\text{下降}} + \underbrace{(21 - 1)}_{\text{上升}} = 22$ 米。

</details>

## 第 4 题

用你喜欢的记号写出两个可导函数 $f$ 和 $g$ 乘积的求导法则。然后用导数的**定义**证明乘积法则。每一步都要简要说明理由。

<details>
<summary>解答</summary>

如果 $f$ 和 $g$ 都是 $x$ 的可导函数，那么

$$
(f \cdot g)'(x) = f'(x)g(x) + f(x)g'(x).
$$

证明：

$$
\begin{aligned}
(f \cdot g)'(x) &= \lim_{h \to 0} \frac{f(x + h)g(x + h) - f(x)g(x)}{h} \\
&= \lim_{h \to 0} \frac{f(x + h)g(x + h) - f(x)g(x + h) + f(x)g(x + h) - f(x)g(x)}{h} && (\text{加上又减去 } f(x)g(x + h)) \\
&= \lim_{h \to 0} \left[\frac{f(x + h)g(x + h) - f(x)g(x + h)}{h} + \frac{f(x)g(x + h) - f(x)g(x)}{h}\right] \\
&= \lim_{h \to 0} \left[\frac{f(x + h) - f(x)}{h}g(x + h) + f(x)\frac{g(x + h) - g(x)}{h}\right].
\end{aligned}
$$

因为 $f$ 和 $g$ 可导，它们一定连续，所以 $\displaystyle\lim_{h \to 0} g(x + h) = g(x)$。因此

$$
(f \cdot g)'(x) = f'(x)g(x) + f(x)g'(x).
$$

</details>

## 第 5 题

是否存在一组实数 $a$、$b$、$c$，使函数

$$
f(x) = \begin{cases} \tan^{-1}(x), & x \le 0 \\ ax^2 + bx + c, & 0 < x < 2 \\ x^3 - \frac14x^2 + 5, & x \ge 2 \end{cases}
$$

可导（即处处可导）？说明为什么存在或不存在。（这里 $\tan^{-1}(x)$ 表示正切函数的反函数。）

<details>
<summary>解答</summary>

先求使函数连续的 $a$、$b$、$c$ 的约束条件。在 $x = 0$ 处：

$$
\tan^{-1}(0) = 0 \;\Longrightarrow\; c = 0.
$$

在 $x = 2$ 处：$2^3 - \frac14 \cdot 2^2 + 5 = 8 - 1 + 5 = 12$。所以 $a \cdot 2^2 + b \cdot 2 + c = 12$，即 $4a + 2b = 12$，$b = 6 - 2a$。

接着求保证在 $x = 0$ 和 $x = 2$ 处可导的条件。

$$
f'(x)\Big|_{x = 2} = \left[3x^2 - \frac12x\right]_{x = 2} = 3 \cdot 4 - \frac12 \cdot 2 = 11.
$$

所以要求 $[2ax + b]_{x = 2} = 4a + b = 11$。

为了连续必须有 $b = 6 - 2a$，所以如果 $f$ 既可导又连续，就有 $4a + (6 - 2a) = 11$，从而 $a = 5/2$，$b = 1$。

如果 $f$ 可导，那么 $a = 5/2$、$b = 1$、$c = 0$。还必须检查在这些条件下 $f$ 在 $x = 0$ 处可导。

在 $x = 0$ 处，$\frac52x^2 + x$ 的导数是 $5 \cdot 0 + 1 = 1$。

如果忘了 $\tan^{-1}(x)$ 的导数是 $\dfrac{1}{1 + x^2}$，就得像讲座中那样，对函数 $\tan y = x$ 做隐函数求导重新推出它。在 $x = 0$ 处，$\tan^{-1}(x)$ 的导数是 $\dfrac{1}{1 + 0} = 1$。

结论：当 $a = 5/2$、$b = 1$、$c = 0$ 时，上面定义的函数 $f(x)$ 可导。

</details>

## 第 6 题

设函数 $f$ 对所有实数 $x$ 和 $y$ 满足方程 $f(x + y) = f(x) + f(y) + x^2y + xy^2$，并且

$$
\lim_{x \to 0} \frac{f(x)}{x} = 1.
$$

(a) 求 $f(0)$。

(b) 求 $f'(0)$。

(c) 求 $f'(x)$。

<details>
<summary>解答</summary>

(a) 因为 $\displaystyle\lim_{x \to 0} \frac{f(x)}{x} = 1$，所以 $x \to 0$ 时 $f(x) \to 0$，因此 $f(0) = 0$。

（也可以在方程中令 $x = y = 0$：$f(0) = 2f(0)$，所以 $f(0) = 0$。）

(b)

$$
f'(0) = \lim_{h \to 0} \frac{f(0 + h) - f(0)}{h} = \lim_{h \to 0} \frac{f(h)}{h} = 1.
$$

(c)

$$
f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h} = \lim_{h \to 0} \frac{f(x) + f(h) + x^2h + xh^2 - f(x)}{h} = \lim_{h \to 0} \left[\frac{f(h)}{h} + x^2 + xh\right] = 1 + x^2.
$$

（译注：(a) 原解答只由极限推出 $f(x) \to 0$，严格地说还需要 $f$ 在 0 处连续；括号里补的代入法不需要这个假设。）

</details>
