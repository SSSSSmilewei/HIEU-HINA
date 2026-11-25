# 考试 4：试卷与解答

> 本页是 MIT 开放式课程 18.01SC 单元 4 考试及官方解答的中文翻译，原文见页面下方的「试卷原文（PDF）」和「试卷解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

**建议的做法**：找一段完整的 50 分钟，不看讲义，像真正考试一样做完五道题，再展开解答对照。

## 第 1 题

计算积分

$$
\int_1^4 \sqrt t\ln t\,dt.
$$

<details>
<summary>解答</summary>

用分部积分：

$$
u = \ln t, \quad v = \frac23t^{3/2}, \qquad du = \frac1t\,dt, \quad dv = \sqrt t\,dt.
$$

于是

$$
\begin{aligned}
\int_1^4 \sqrt t\ln t\,dt &= \frac23t^{3/2}\ln t\Big|_1^4 - \int_1^4 \frac23\underbrace{t^{3/2} \cdot t^{-1}}_{t^{1/2}}\,dt \\
&= \left[\frac23t^{3/2}\ln t - \frac49t^{3/2}\right]_1^4 \\
&= \frac{16}{3}\ln 4 - \frac49(4^{3/2} - 1) \\
&= \frac{16}{3}\ln 4 - \frac{28}{9}.
\end{aligned}
$$

</details>

## 第 2 题

计算积分

$$
\int_0^{\pi/4} \tan^4\theta\sec^6\theta\,d\theta.
$$

<details>
<summary>解答</summary>

记得 $\sec^2\theta = 1 + \tan^2\theta$，所以

$$
\int_0^{\pi/4} \tan^4\theta\sec^6\theta\,d\theta = \int_0^{\pi/4} \tan^4\theta(1 + \tan^2\theta)^2\sec^2\theta\,d\theta.
$$

令 $u = \tan\theta$。于是 $du = \sec^2\theta\,d\theta$，并且 $0 \le \theta \le \pi/4 \Rightarrow 0 \le u \le 1$。

$$
\begin{aligned}
\int_0^{\pi/4} \tan^4\theta\sec^6\theta\,d\theta &= \int_0^1 u^4(1 + u^2)^2\,du = \int_0^1 u^4(1 + 2u^2 + u^4)\,du \\
&= \int_0^1 (u^4 + 2u^6 + u^8)\,du = \left[\frac15u^5 + \frac27u^7 + \frac19u^9\right]_0^1 \\
&= \frac15 + \frac27 + \frac19 = \frac{188}{315}.
\end{aligned}
$$

</details>

## 第 3 题

计算积分

$$
\int \frac{10}{(x - 1)(x^2 + 9)}\,dx.
$$

<details>
<summary>解答</summary>

部分分式分解为 $\dfrac{10}{(x - 1)(x^2 + 9)} = \dfrac{1}{x - 1} - \dfrac{x + 1}{x^2 + 9}$（遮盖法得 $\frac{1}{x - 1}$ 的系数为 $\frac{10}{10} = 1$，再比较系数）。于是

$$
\begin{aligned}
\int \frac{10}{(x - 1)(x^2 + 9)}\,dx &= \int \left(\frac{1}{x - 1} - \frac{x + 1}{x^2 + 9}\right)dx \\
&= \int \frac{1}{x - 1}\,dx - \int \frac{x}{x^2 + 9}\,dx - \int \frac{1}{x^2 + 9}\,dx \\
&= \ln|x - 1| - \frac12\ln(x^2 + 9) - \frac13\tan^{-1}\left(\frac x3\right) + c.
\end{aligned}
$$

</details>

## 第 4 题

计算积分

$$
\int \frac{1}{(5 - 4x - x^2)^{5/2}}\,dx.
$$

<details>
<summary>解答</summary>

配方：

$$
\int \frac{1}{(5 - 4x - x^2)^{5/2}}\,dx = \int \frac{1}{\left(9 - (2 + x)^2\right)^{5/2}}\,dx.
$$

令 $x + 2 = 3\sin\theta$。于是 $dx = 3\cos\theta\,d\theta$，并且

$$
\int \frac{1}{\left(9 - (2 + x)^2\right)^{5/2}}\,dx = \int \frac{3\cos\theta}{9^{5/2}(1 - \sin^2\theta)^{5/2}}\,d\theta = \int \frac{3\cos\theta}{3^5\cos^5\theta}\,d\theta = \frac{1}{3^4}\int \sec^4\theta\,d\theta.
$$

令 $u = \tan\theta$。于是 $du = \sec^2\theta\,d\theta$。记得 $\sec^2\theta = 1 + \tan^2\theta$：

$$
\frac{1}{3^4}\int \sec^4\theta\,d\theta = \frac{1}{3^4}\int (1 + \tan^2\theta)\sec^2\theta\,d\theta = \frac{1}{3^4}\int (1 + u^2)\,du = \frac{1}{3^4}\left(u + \frac{u^3}{3}\right) + c = \frac{1}{3^4}\left(\tan\theta + \frac{\tan^3\theta}{3}\right) + c.
$$

我们知道 $\dfrac{x + 2}{3} = \sin\theta$。画一个直角三角形，对边长 $x + 2$，斜边长 3。由勾股定理，$\tan\theta = \dfrac{x + 2}{\sqrt{5 - 4x - x^2}}$。因此

$$
\boxed{\int \frac{1}{(5 - 4x - x^2)^{5/2}}\,dx = \frac{1}{3^4}\left(\frac{x + 2}{\sqrt{5 - 4x - x^2}} + \frac{(x + 2)^3}{3(5 - 4x - x^2)^{3/2}}\right) + c.}
$$

</details>

## 第 5 题

(a) 列出（但不必计算）曲线 $x = y + y^3$ 从 $y = 1$ 到 $y = 4$ 的弧长积分。

(b) 列出（但不必计算）把曲线

$$
x = a\cos^3t, \qquad y = a\sin^3t, \qquad 0 \le t \le \pi/2
$$

绕 $x$ 轴旋转所得曲面的面积积分。这里 $a$ 是任意常数。

<details>
<summary>解答</summary>

**(a)** 把曲线参数化：$y = t$，$x = t + t^3$。

$$
\text{弧长} = \int dS = \int_{t=1}^4 \sqrt{(x'(t))^2 + (y'(t))^2}\,dt = \int_1^4 \sqrt{(1 + 3t^2)^2 + 1}\,dt.
$$

**(b)**

$$
\begin{aligned}
\text{曲面面积} &= 2\pi\int_{t=0}^{\pi/2} |a|\sin^3t\sqrt{(x'(t))^2 + (y'(t))^2}\,dt \\
&= 2\pi\int_0^{\pi/2} |a|\sin^3t\sqrt{(-3a\cos^2t\sin t)^2 + (3a\sin^2t\cos t)^2}\,dt \\
&= 2\pi\int_0^{\pi/2} 3a^2\sin^3t\sqrt{\sin^2t\cos^2t(\cos^2t + \sin^2t)}\,dt \\
&= 6a^2\pi\int_0^{\pi/2} \sin^4t\cos t\,dt.
\end{aligned}
$$

（这个积分其实很容易算：$6a^2\pi \cdot \frac15\sin^5t\Big|_0^{\pi/2} = \frac65\pi a^2$。）

</details>
