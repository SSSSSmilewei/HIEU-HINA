# 习题课 9：三角积分与三角代换

> 本页是 MIT 开放式课程 18.01SC 习题课 9 指定练习题及解答的中文翻译。题目和解答出自 David Jerison、Arthur Mattuck 编写的 18.01 习题集（18.01 Exercises）「Integration Techniques」一册，原文见页面下方的「习题原文（PDF）」和「习题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。题号沿用原书，便于对照。建议先自己做完一节，再展开解答对照。

本次习题课覆盖单元 4 的 A 部分（第 68–73 节）。

## 5B. 直接代换法

求下列积分。

**5B-9** $\displaystyle\int e^x(1 + e^x)^{-1/3}\,dx$

<details>
<summary>解答</summary>

令 $u = 1 + e^x$，$du = e^x\,dx$：

$$
\int e^x(1 + e^x)^{-1/3}\,dx = \int u^{-1/3}\,du = \frac32(1 + e^x)^{2/3} + c.
$$

</details>

**5B-11** $\displaystyle\int \sec^2 9x\,dx$

<details>
<summary>解答</summary>

令 $u = 9x$，$du = 9\,dx$：

$$
\int \sec^2 9x\,dx = \frac{\tan 9x}{9} + c.
$$

</details>

**5B-13** $\displaystyle\int \frac{x^2\,dx}{1 + x^6}$。提示：试试 $u = x^3$。

<details>
<summary>解答</summary>

$u = x^3$，$du = 3x^2\,dx$，于是

$$
\int \frac{x^2\,dx}{1 + x^6} = \int \frac{du}{3(1 + u^2)} = \frac{\tan^{-1}u}{3} + c = \frac{\tan^{-1}(x^3)}{3} + c.
$$

</details>

**5B-16** 用代换并改变积分上下限，求 $\displaystyle\int_{-1}^1 \frac{\tan^{-1}x\,dx}{1 + x^2}$。

<details>
<summary>解答</summary>

令 $u = \tan^{-1}x$，$du = \dfrac{dx}{1 + x^2}$：

$$
\int_{-1}^1 \frac{\tan^{-1}x\,dx}{1 + x^2} = \int_{\tan^{-1}(-1)}^{\tan^{-1}1} u\,du = \int_{-\pi/4}^{\pi/4} u\,du = \frac{u^2}{2}\Big|_{-\pi/4}^{\pi/4} = 0.
$$

（$\tan x$ 是奇函数，所以 $\tan^{-1}x$ 也是奇函数，积分理应为 0。）

</details>

## 5C. 三角积分

求下列积分。

**5C-5** $\displaystyle\int \sin^3x\cos^2x\,dx$

<details>
<summary>解答</summary>

令 $u = \cos x$，$du = -\sin x\,dx$：

$$
\int \sin^3x\cos^2x\,dx = \int (1 - \cos^2x)\cos^2x\sin x\,dx = \int -(1 - u^2)u^2\,du = -\frac{u^3}{3} + \frac{u^5}{5} + c = -\frac{\cos^3x}{3} + \frac{\cos^5x}{5} + c.
$$

</details>

**5C-7** $\displaystyle\int \sin^2(4x)\cos^2(4x)\,dx$

<details>
<summary>解答</summary>

$$
\int \sin^2(4x)\cos^2(4x)\,dx = \int \frac{\sin^2 8x\,dx}{4} = \int \frac{(1 - \cos 16x)\,dx}{8} = \frac x8 - \frac{\sin 16x}{128} + c.
$$

较慢的方法是用

$$
\sin^2(4x)\cos^2(4x) = \left(\frac{1 - \cos(8x)}{2}\right)\left(\frac{1 + \cos(8x)}{2}\right),
$$

乘开后再用类似的技巧处理 $\cos^2(8x)$。

（译注：原文结果的第一项印成了 $\frac18$，应为 $\frac x8$，译文已更正。）

</details>

**5C-9** $\displaystyle\int \sin^3x\sec^2x\,dx$

<details>
<summary>解答</summary>

令 $u = \cos x$，$du = -\sin x\,dx$：

$$
\int \sin^3x\sec^2x\,dx = \int \frac{1 - \cos^2x}{\cos^2x}\sin x\,dx = \int -\frac{1 - u^2}{u^2}\,du = u + \frac1u + c = \cos x + \sec x + c.
$$

</details>

**5C-11** $\displaystyle\int \sin x\cos(2x)\,dx$（用二倍角公式。）

<details>
<summary>解答</summary>

令 $u = \cos x$，$du = -\sin x\,dx$：

$$
\int \sin x\cos(2x)\,dx = \int \sin x(2\cos^2x - 1)\,dx = \int (1 - 2u^2)\,du = u - \frac23u^3 + c = \cos x - \frac23\cos^3x + c.
$$

</details>

## 5D. 反代换法（三角代换）

求下列积分。

**5D-1** $\displaystyle\int \frac{dx}{(a^2 - x^2)^{3/2}}$

<details>
<summary>解答</summary>

令 $x = a\sin\theta$，$dx = a\cos\theta\,d\theta$：

$$
\int \frac{dx}{(a^2 - x^2)^{3/2}} = \frac{1}{a^2}\int \sec^2\theta\,d\theta = \frac{1}{a^2}\tan\theta + c = \frac{x}{a^2\sqrt{a^2 - x^2}} + c.
$$

</details>

**5D-2** $\displaystyle\int \frac{x^3\,dx}{\sqrt{a^2 - x^2}}$

<details>
<summary>解答</summary>

令 $x = a\sin\theta$，$dx = a\cos\theta\,d\theta$：

$$
\begin{aligned}
\int \frac{x^3\,dx}{\sqrt{a^2 - x^2}} &= a^3\int \sin^3\theta\,d\theta = a^3\int (1 - \cos^2\theta)\sin\theta\,d\theta \\
&= a^3\left(-\cos\theta + \frac13\cos^3\theta\right) + c \\
&= -a^2\sqrt{a^2 - x^2} + \frac{(a^2 - x^2)^{3/2}}{3} + c.
\end{aligned}
$$

</details>

**5D-7** $\displaystyle\int \frac{\sqrt{x^2 - a^2}\,dx}{x^2}$

<details>
<summary>解答</summary>

令 $x = a\sec\theta$，$dx = a\sec\theta\tan\theta\,d\theta$：

$$
\begin{aligned}
\int \frac{\sqrt{x^2 - a^2}\,dx}{x^2} &= \int \frac{\tan^2\theta\,d\theta}{\sec\theta} = \int \frac{(\sec^2\theta - 1)\,d\theta}{\sec\theta} = \int (\sec\theta - \cos\theta)\,d\theta \\
&= \ln(\sec\theta + \tan\theta) - \sin\theta + c \\
&= \ln\left(\frac xa + \frac{\sqrt{x^2 - a^2}}{a}\right) - \frac{\sqrt{x^2 - a^2}}{x} + c \\
&= \ln\left(x + \sqrt{x^2 - a^2}\right) - \frac{\sqrt{x^2 - a^2}}{x} + c_1 \qquad (c_1 = c - \ln a).
\end{aligned}
$$

</details>

**配方**

**5D-10** $\displaystyle\int \frac{dx}{(x^2 + 4x + 13)^{3/2}}$

<details>
<summary>解答</summary>

$x^2 + 4x + 13 = (x + 2)^2 + 3^2$。令 $x + 2 = 3\tan\theta$，$dx = 3\sec^2\theta\,d\theta$：

$$
\int \frac{dx}{(x^2 + 4x + 13)^{3/2}} = \int \frac{dx}{\left((x + 2)^2 + 3^2\right)^{3/2}} = \frac19\int \cos\theta\,d\theta = \frac19\sin\theta + c = \frac{x + 2}{9\sqrt{x^2 + 4x + 13}} + c.
$$

</details>
