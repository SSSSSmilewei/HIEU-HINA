# 积分的比较

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：极限比较入门

回想一下，我们是想弄清一个函数的尾巴是肥还是瘦——是可以在某一点之后放心忽略函数的值，还是函数图像下方的面积是无穷大。如果没法直接算出尾巴的面积，可以用**极限比较**，把你的函数和某个能算出值的函数比较。

如果 $x$ 趋于无穷大时 $f(x) \sim g(x)$，那么 $\displaystyle\int_a^\infty f(x)\,dx$ 和 $\displaystyle\int_a^\infty g(x)\,dx$ 要么都收敛，要么都发散。

（记住「$x$ 趋于无穷大时 $f \sim g$」的意思是 $x \to \infty$ 时 $\dfrac{f(x)}{g(x)} \to 1$。）

**例**：$\displaystyle\int_0^\infty \frac{dx}{\sqrt{x^2 + 10}}$。

因为 $\sqrt{x^2 + 10} \sim \sqrt{x^2} = x$，可以把这个积分和 $\displaystyle\int_1^\infty \frac{dx}{x}$ 比较。（因为 $1/x$ 在 $x = 0$ 处是奇点，我们先不管有限值 $\displaystyle\int_0^1 \frac{dx}{\sqrt{x^2 + 10}}$——如果最后积分收敛，可以再把它加上。）

$$
\int_1^\infty \frac{dx}{\sqrt{x^2 + 10}} \sim \int_1^\infty \frac{dx}{x}.
$$

我们知道 $\displaystyle\int_1^\infty \frac{dx}{x}$ 发散，所以极限比较告诉我们 $\displaystyle\int_0^\infty \frac{dx}{\sqrt{x^2 + 10}}$ 也发散。

**问**：为什么把下限从 0 换成了 1？

**答**：因为 $\displaystyle\int_0^1 \frac{dx}{x}$ 由于不相干的原因是无穷大，我们不希望它影响结果。0 到 1 之间不是我们关心的那部分函数。我们真正担心的是函数尾巴的面积。我们也完全可以做这样的比较：

$$
\int_{100}^\infty \frac{dx}{\sqrt{x^2 + 10}} \sim \int_{100}^\infty \frac{dx}{x},
$$

得到相同的结论——$\dfrac{1}{\sqrt{x^2 + 10}}$ 的图像尾巴的面积是无穷大。

## 片段 2：例：∫₁₀^∞ dx/√(x³ + 3)

在上一个例子里，本可以用三角代换算出 $\displaystyle\int_0^\infty \frac{dx}{\sqrt{x^2 + 10}}$。即使找不到原函数，也可以用极限比较法判断一个积分是否有限。

例如，我们没法算出 $\displaystyle\int_{10}^\infty \frac{dx}{\sqrt{x^3 + 3}}$。但是因为

$$
\frac{1}{\sqrt{x^3 + 3}} \sim \frac{1}{\sqrt{x^3}} = \frac{1}{x^{3/2}},
$$

我们知道

$$
\int_{10}^\infty \frac{dx}{\sqrt{x^3 + 3}} \sim \int_{10}^\infty \frac{dx}{x^{3/2}},
$$

所以这个积分收敛到某个有限值。

## 片段 3：例：∫_{−∞}^∞ e^{−x²} dx

我们被告知 $\displaystyle\int_{-\infty}^\infty e^{-x^2}\,dx = \sqrt\pi$。我们算不出这个积分的精确值，但可以用简单的比较检验它的值是有限的。

先利用这是一个关于 $y$ 轴对称的偶函数，把积分改写成

$$
\int_{-\infty}^\infty e^{-x^2}\,dx = 2\int_0^\infty e^{-x^2}\,dx.
$$

函数 $f(x) = e^{-x^2}$ 趋于零的速度太快，找不到一个和 $f(x)$ 相当的函数 $g(x)$ 来做极限比较，所以要用普通的比较来判断这个反常积分是否收敛。

因为 $x \ge 1$ 时 $x^2 \ge x$，所以 $x \ge 1$ 时 $-x^2 \le -x$，$e^{-x^2} \le e^{-x}$。为了证明 $\displaystyle\int_{-\infty}^\infty e^{-x^2}\,dx$ 收敛，再把积分在 $x = 1$ 处分开。我们利用「被积函数增大，积分的值也增大」来比较积分：

$$
\int_{-\infty}^\infty e^{-x^2}\,dx = 2\int_0^\infty e^{-x^2}\,dx = 2\int_0^1 e^{-x^2}\,dx + 2\int_1^\infty e^{-x^2}\,dx \le 2\int_0^1 e^{-x^2}\,dx + 2\int_1^\infty e^{-x}\,dx \quad (\text{被积函数更大}).
$$

因为 $\displaystyle\int_0^1 e^{-x^2}\,dx$ 有限，$\displaystyle\int_1^\infty e^{-x}\,dx$ 收敛，我们得出 $\displaystyle\int_0^\infty e^{-x^2}\,dx$ 收敛。

普通比较是证明被积函数衰减得非常快的积分收敛的好工具。
