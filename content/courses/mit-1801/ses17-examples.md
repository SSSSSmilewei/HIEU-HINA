# 例题：解含 e 和 ln x 的方程

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

我们知道，自然对数函数 $\ln x$ 的定义使得：如果 $\ln a = b$，那么 $e^b = a$。常用对数函数 $\log x$ 有这样的性质：如果 $\log c = d$，那么 $10^d = c$。对任何正的底数 $b$，都可以定义对数函数 $\log_b x$，使得 $\log_b e = f$ 意味着 $b^f = e$。实际上，我们很少见到 2、10 和 $e$ 以外的底数。

解出 $y$：

1. $\ln(y + 1) + \ln(y - 1) = 2x + \ln x$
2. $\log(y + 1) = x^2 + \log(y - 1)$
3. $2\ln y = \ln(y + 1) + x$

解出 $x$（提示：令 $u = e^x$，先解出 $u$）：

4. $\dfrac{e^x + e^{-x}}{e^x - e^{-x}} = y$
5. $y = e^x + e^{-x}$

<details>
<summary>解答</summary>

**1.** 这个方程含有自然对数。我们对两边作用函数 $\ln x$ 的反函数 $e^x$，来「抵消」自然对数：

$$
\begin{aligned}
e^{\ln(y + 1) + \ln(y - 1)} &= e^{2x + \ln x} \\
e^{\ln(y + 1)} \cdot e^{\ln(y - 1)} &= e^{2x} \cdot e^{\ln x} \\
(y + 1)(y - 1) &= e^{2x} \cdot x \\
y^2 - 1 &= xe^{2x} \\
y &= \pm\sqrt{xe^{2x} + 1}.
\end{aligned}
$$

我们知道不能取负数（或 0）的自然对数，而方程里有 $\ln(y - 1)$。所以解 $y = -\sqrt{xe^{2x} + 1}$ 无效。最终的解是

$$
y = \sqrt{xe^{2x} + 1}.
$$

**2.** 这个方程含有以 10 为底的对数，所以对两边作用反函数 $10^x$。如果愿意，也可以先在两边减去 $\log(y - 1)$；结果一样。

$$
\begin{aligned}
10^{\log(y + 1)} &= 10^{x^2 + \log(y - 1)} \\
y + 1 &= 10^{x^2} \cdot (y - 1) = 10^{x^2}y - 10^{x^2} \\
y - 10^{x^2}y &= -1 - 10^{x^2} \\
y(1 - 10^{x^2}) &= -1 - 10^{x^2} \\
y &= \frac{10^{x^2} + 1}{10^{x^2} - 1}.
\end{aligned}
$$

把 $y = \dfrac{10^{x^2} + 1}{10^{x^2} - 1}$ 代回原方程检验一下是个好主意。

**3.** 同样，对两边作用反函数 $e^x$。可以用恒等式 $e^{2\ln y} = (e^{\ln y})^2$，也可以像下面这样处理系数 2：

$$
\begin{aligned}
\ln y^2 &= \ln(y + 1) + x \\
e^{\ln y^2} &= e^{\ln(y + 1)} \cdot e^x \\
y^2 &= (y + 1)e^x \\
y^2 - e^x y - e^x &= 0.
\end{aligned}
$$

这是关于 $y$ 的二次多项式；有些系数是 $x$ 的函数，这不应该难住我们。用求根公式得到

$$
y = \frac{e^x \pm \sqrt{(-e^x)^2 - 4 \cdot 1 \cdot (-e^x)}}{2 \cdot 1} = \frac{e^x \pm \sqrt{e^{2x} + 4e^x}}{2}.
$$

原方程只在 $y > 0$ 时成立，而 $\sqrt{e^{2x} + 4e^x} > \sqrt{e^{2x}} = e^x$，所以最终答案是

$$
y = \frac{e^x + \sqrt{e^{2x} + 4e^x}}{2}.
$$

检验这个答案最好的办法，也许是取几个简单的 $x$ 值，用计算器算出原方程两边的值。

**4.** 先按提示令 $u = e^x$：

$$
\begin{aligned}
\frac{u + \frac1u}{u - \frac1u} &= y \\
\frac{u^2 + 1}{u^2 - 1} &= y \qquad (\text{分子分母同乘 } u) \\
u^2 + 1 &= y(u^2 - 1) \\
u^2(1 - y) &= -(y + 1) \\
u^2 &= \frac{y + 1}{y - 1}.
\end{aligned}
$$

因为 $u = e^x$ 总是正的，

$$
u = e^x = \sqrt{\frac{y + 1}{y - 1}}.
$$

前几题里，我们要解的变量是对数函数的输入，我们用那个对数函数的反函数（指数函数）把它孤立出来。这道题里我们的变量是指数函数的输入，我们用同底的对数函数把它孤立出来：

$$
x = \ln\left(\left(\frac{y + 1}{y - 1}\right)^{1/2}\right) = \frac12\ln\left(\frac{y + 1}{y - 1}\right) = \frac12\bigl(\ln(y + 1) - \ln(y - 1)\bigr).
$$

这道题有很多等价的正确答案。最好的答案是你用起来、理解起来最顺手的那个。

把 $e^x = \sqrt{\dfrac{y + 1}{y - 1}}$ 代入原方程，比较容易验证它是对的。检验最终答案时，可以把它代入这个式子而不是原方程。

注意这个解只对 $y > 1$ 成立。如果 $y < -1$，可以代换 $v = -x$，得到

$$
\frac{e^v + e^{-v}}{e^v - e^{-v}} = -y > 1.
$$

同样的计算给出

$$
v = \frac12\bigl(\ln((-y) + 1) - \ln((-y) - 1)\bigr), \qquad x = -\frac12\bigl(\ln(-y + 1) - \ln(-y - 1)\bigr).
$$

**5.** 同样先用提示 $u = e^x$。用配方或求根公式解出 $u$：

$$
y = u + \frac1u \;\Longrightarrow\; yu = u^2 + 1 \;\Longrightarrow\; u^2 - yu + 1 = 0 \;\Longrightarrow\; u = \frac{y \pm \sqrt{y^2 - 4}}{2}.
$$

现在把 $u$ 换回 $e^x$，用反函数 $\ln x$ 完成计算：

$$
e^x = \frac{y \pm \sqrt{y^2 - 4}}{2} \;\Longrightarrow\; x = \ln\left(\frac{y \pm \sqrt{y^2 - 4}}{2}\right) = \ln\left(y \pm \sqrt{y^2 - 4}\right) - \ln 2.
$$

（这要求 $y \ge 2$；$e^x + e^{-x}$ 的最小值就是 2。）

</details>
