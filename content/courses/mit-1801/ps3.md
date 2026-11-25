# 习题课 3：近似与函数作图

> 本页是 MIT 开放式课程 18.01SC 习题课 3 指定练习题及解答的中文翻译。题目和解答出自 David Jerison、Arthur Mattuck 编写的 18.01 习题集（18.01 Exercises）「Applications of Differentiation」一册，原文见页面下方的「习题原文（PDF）」和「习题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。题号沿用原书，便于对照。建议先自己做完一节，再展开解答对照。

本次习题课覆盖单元 2 的 A 部分（第 23–28 节）。题目中说的「公式 (2)」指线性近似的一般公式 $f(x) \approx f(a) + f'(a)(x - a)$。

## 2A. 近似

**2A-1** 求 $\sqrt{a + bx}$ 在 0 处的线性近似：一次用公式 (2)，一次用基本近似公式。（这里 $a$ 和 $b$ 是常数，设 $a > 0$。）

<details>
<summary>解答</summary>

$\dfrac{d}{dx}\sqrt{a + bx} = \dfrac{b}{2\sqrt{a + bx}}$，所以由公式，$f(x) \approx \sqrt a + \dfrac{b}{2\sqrt a}x$。

用代数：$\sqrt{a + bx} = \sqrt a\sqrt{1 + \dfrac{bx}{a}} \approx \sqrt a\left(1 + \dfrac{bx}{2a}\right)$，和上面相同。

</details>

**2A-3** 用基本近似公式求 $\dfrac{(1 + x)^{3/2}}{1 + 2x}$ 在 0 处的线性近似，再用公式 (2) 求一次。

<details>
<summary>解答</summary>

$$
\frac{d}{dx}\left(\frac{(1 + x)^{3/2}}{1 + 2x}\right) = \frac{(1 + 2x) \cdot \frac32(1 + x)^{1/2} - (1 + x)^{3/2} \cdot 2}{(1 + 2x)^2} \;\Longrightarrow\; f'(0) = \frac32 - 2 = -\frac12,
$$

所以 $f(x) \approx 1 - \dfrac12x$。

或者用代数：$\dfrac{(1 + x)^{3/2}}{1 + 2x} \approx \left(1 + \dfrac32x\right)(1 - 2x) \approx 1 - \dfrac12x$。

</details>

**2A-6** 求 $\theta \approx 0$ 时 $\tan\theta$ 的二次近似。

<details>
<summary>解答</summary>

$$
\tan\theta = \frac{\sin\theta}{\cos\theta} \approx \frac{\theta}{1 - \theta^2/2} \approx \theta(1 + \theta^2/2) \approx \theta.
$$

（$\theta \cdot \theta^2/2$ 是三次项，二次近似里要舍掉；所以 $\tan\theta$ 的二次近似就是 $\theta$，没有二次项。）

</details>

**2A-11** 对恒温下的理想气体，压强 $p$ 和体积 $v$ 满足方程 $pv^k = C$，其中 $k$ 和 $C$ 是常数。如果体积从 $v_0$ 稍稍变为 $v_0 + \Delta v$，你会用什么二次近似、用 $\Delta v$ 表示 $p$？（求在 $\Delta v \approx 0$ 时成立的近似。）

<details>
<summary>解答</summary>

$$
pv^k = C \;\Longrightarrow\; p = Cv^{-k} = C(v_0 + \Delta v)^{-k} = Cv_0^{-k}\left(1 + \frac{\Delta v}{v_0}\right)^{-k} \approx \frac{C}{v_0^k}\left(1 - k\frac{\Delta v}{v_0} + \frac{k(k + 1)}{2}\left(\frac{\Delta v}{v_0}\right)^2\right).
$$

</details>

**2A-12** 在指定的点给出指定类型的近似。（这一题要在学过对数和指数函数之后做。）

a) $\dfrac{e^x}{1 - x}$（二次，$x \approx 0$）　　d) $\ln\cos x$（二次，$x \approx 0$）　　e) $x\ln x$（二次，$x \approx 1$）（提示：令 $x = 1 + h$。）

<details>
<summary>解答</summary>

a) $\dfrac{e^x}{1 - x} \approx \left(1 + x + \dfrac{x^2}{2}\right)(1 + x + x^2) \approx 1 + 2x + \dfrac52x^2$。

d) $\ln(\cos x) \approx \ln\left(1 - \dfrac{x^2}{2}\right) \approx -\dfrac{x^2}{2}$（因为 $\ln(1 + h) \approx h$）。

e) $x\ln x = (1 + h)\ln(1 + h) \approx (1 + h)\left(h - \dfrac{h^2}{2}\right) \approx h + \dfrac{h^2}{2}$，所以 $x\ln x \approx (x - 1) + \dfrac{(x - 1)^2}{2}$。

</details>

## 2B. 函数作图

**2B-2** 求下列函数图像的拐点：a) $y = x^3 - 3x + 1$　　e) $y = \dfrac{x}{x + 4}$　　h) $y = e^{-x^2}$

<details>
<summary>解答</summary>

a) 只有一个拐点 $x = 0$。（$y'' = 6x$）

e) 没有拐点。$y = 1 - \dfrac{4}{x + 4}$，$y'' = \dfrac{-8}{(x + 4)^3}$。$y''$ 在 $x = -4$ 处变号，但那里是函数的奇点（函数在那里没有定义），不是拐点。

h) $y'' = (-2 + 4x^2)e^{-x^2}$。所以有两个拐点 $x = \pm\dfrac{1}{\sqrt2}$。

（译注：原文 e) 的解答写的是另一个函数的二阶导数 $-8/(x + 1)^3$，与题目不符，这里按题目 $y = x/(x + 4)$ 重算；结论「没有拐点」不变。）

</details>

**2B-4** 设 $f$ 是 $0 \le x \le 10$ 上的连续函数。按下面的描述画出图像：$f$ 在 4、7、9 处为零。$f'(x)$ 在 $0 < x < 5$ 和 $8 < x < 10$ 上大于 0，在 $5 < x < 8$ 上小于 0。根据这些信息，关于 $f$ 的最大值、最小值，你能确定地说些什么吗？关于最大值、最小值在哪里取得呢？

<details>
<summary>解答</summary>

（官方解答只给了一张草图和结论「最大值在 $x = 5$ 或 $x = 10$ 处，最小值在 $x = 0$ 或 $x = 8$ 处」，下面的文字说明是本站补写的。）

$f$ 在 $[0, 5]$ 上递增，在 4 处穿过零点，所以 $f(0) < 0$，$f(5) > 0$；在 $[5, 8]$ 上递减，在 7 处穿过零点，所以 $f(8) < 0$；在 $[8, 10]$ 上递增，在 9 处穿过零点，所以 $f(10) > 0$。图像大致是：从负值上升，在 4 处穿过 $x$ 轴，在 5 处达到局部最高点，下降并在 7 处穿过 $x$ 轴，在 8 处达到局部最低点，再上升并在 9 处穿过 $x$ 轴。

能确定的是：最大值是正的，只可能在 $x = 5$ 或 $x = 10$ 处取得；最小值是负的，只可能在 $x = 0$ 或 $x = 8$ 处取得。但根据所给信息，无法判断 $f(5)$ 和 $f(10)$ 哪个更大，也无法判断 $f(0)$ 和 $f(8)$ 哪个更小。

</details>

**2B-6** a) 求一个在 $x = -1$ 处有局部极大值、在 $x = 1$ 处有局部极小值的三次多项式。

b) 在 $-3 \le x \le 3$ 上画出这个三次多项式的图像。

<details>
<summary>解答</summary>

a) 试 $y' = (x + 1)(x - 1) = x^2 - 1$。那么 $y = x^3/3 - x + c$。常数 $c$ 无关紧要，所以取 $c = 0$。乘以 3 更方便：

$$
y = x^3 - 3x.
$$

b) 这是一个奇函数，局部极小值 $y(1) = -2$，局部极大值 $y(-1) = 2$。端点值是 $y(3) = 18$ 和 $y(-3) = -18$。图像在端点附近很陡：$y'(3) = 24$。

（译注：原文印作 $y'(3) = 8$；按 $y' = 3x^2 - 3$，应为 24，译文已更正。）

</details>

**2B-7** a) 证明：如果 $f(x)$ 递增，并且在 $a$ 处有导数，那么 $f'(a) \ge 0$。（可以用「正函数的极限 $\ge 0$」这个事实。）

b) 如果把 (a) 的结论改为 $f'(a) > 0$，命题就不成立了。指出为什么 (a) 的证明不能说明 $f'(a) > 0$，并给出结论 $f'(a) > 0$ 的一个反例（即结论不成立的例子）。

<details>
<summary>解答</summary>

a) $f'(a) = \displaystyle\lim_{\Delta x \to 0} \frac{\Delta y}{\Delta x}$。如果 $y$ 递增，那么 $\Delta x > 0 \Rightarrow \Delta y > 0$，$\Delta x < 0 \Rightarrow \Delta y < 0$。所以两种情形下都有 $\dfrac{\Delta y}{\Delta x} > 0$。因此 $\displaystyle\lim_{\Delta x \to 0} \frac{\Delta y}{\Delta x} \ge 0$。

b) 证明在最后一步失效了。也就是说，$\dfrac{\Delta y}{\Delta x} > 0$ 并不能推出 $\displaystyle\lim_{\Delta x \to 0} \frac{\Delta y}{\Delta x} > 0$。

（极限不保持严格不等式，只保持非严格不等式。例如 $u \ne 0$ 时 $u^2 > 0$，但 $\displaystyle\lim_{u \to 0} u^2 = 0$，只是 $\ge 0$，而不是 $> 0$。）

反例：$f(x) = x^3$ 对所有 $x$ 递增，但 $f'(0) = 0$。

</details>
