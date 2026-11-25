# 习题课 8：平均值

> 本页是 MIT 开放式课程 18.01SC 习题课 8 指定练习题及解答的中文翻译。题目和解答出自 David Jerison、Arthur Mattuck 编写的 18.01 习题集（18.01 Exercises）「Applications of Integration」一册，原文见页面下方的「习题原文（PDF）」和「习题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。题号沿用原书，便于对照。建议先自己做完一节，再展开解答对照。

本次习题课覆盖单元 3 的 C 部分（第 60–65 节）。

## 4D. 平均值

**4D-2** 证明 $1/x$ 在区间 $[a, 2a]$ 上的平均值具有 $C/a$ 的形式，其中 $C$ 是与 $a$ 无关的常数。（设 $a > 0$。）

<details>
<summary>解答</summary>

$$
\text{平均值} = \frac1a\int_a^{2a}\frac{dx}{x} = \frac1a\ln x\Big|_a^{2a} = \frac1a(\ln 2a - \ln a) = \frac1a\ln\left(\frac{2a}{a}\right) = \frac{\ln 2}{a}.
$$

所以 $C = \ln 2$。

</details>

**4D-3** 一个点沿 $x$ 轴运动，位置函数为 $x = s(t)$。证明：在时间区间 $[a, b]$ 上，速度 $v(t)$ 的平均值等于这段时间内的平均速度。

<details>
<summary>解答</summary>

设 $s(t)$ 是位置函数，则速度是 $v(t) = s'(t)$。

$$
\text{速度的平均值} = \frac{1}{b - a}\int_a^b s'(t)\,dt = \frac{s(b) - s(a)}{b - a} \quad (\text{由微积分第一基本定理}),
$$

这正是时间区间 $[a, b]$ 上的平均速度。

</details>

**4D-5** 如果 $f(t)$ 在 0 到 $x$ 之间的平均值由函数 $g(x)$ 给出，用 $g(x)$ 表示 $f(x)$。

<details>
<summary>解答</summary>

由假设，$g(x) = \dfrac1x\displaystyle\int_0^x f(t)\,dt$。要用 $g(x)$ 表示 $f(x)$，两边乘以 $x$，再用微积分第二基本定理：

$$
\int_0^x f(t)\,dt = xg(x) \;\Longrightarrow\; f(x) = g(x) + xg'(x).
$$

</details>
