# 例题：指数增长与受抑制的增长

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

a) 微分方程 $\dfrac{dy}{dx} = ry$ 描述的情形是：种群规模 $y$ 以与自身大小成正比的速率增长。用分离变量法求这个方程的解。

b) 微分方程 $\dfrac{dy}{dx} = ry(s - y)$（$s > 0$）描述的是一个趋向固定规模 $s$ 的种群的变化。例如，它可以描述食物或空间有限的种群。用分离变量法和事实

$$
\int \frac{dy}{y(s - y)} = \frac1s\ln\left|\frac{y}{s - y}\right| + c
$$

求这个方程的解。

<details>
<summary>解答</summary>

**a)** 这道题的解法和讲座中的例子类似。分离变量，两边积分，再化简得到的对数方程：

$$
\begin{aligned}
\frac{dy}{dx} &= ry \\
\frac{dy}{y} &= r\,dx \\
\int \frac{dy}{y} &= \int r\,dx \\
\ln|y| &= rx + c \\
|y| &= e^{rx + c} = e^ce^{rx} \\
y &= ae^{rx}.
\end{aligned}
$$

注意 $x = 0$ 时 $y = a$。如果变量 $x$ 表示时间，那么在初始种群为 $a$、种群变化率是当前规模的 $r$ 倍时，方程 $y = ae^{rx}$ 给出时刻 $x$ 的种群规模。

**b)** 开始解题之前，先想想方程 $\dfrac{dy}{dx} = ry(s - y)$ 说明了种群的变化率什么。注意 $0 < y < s$ 时 $y(s - y)$ 为正，其他情况下为负。如果种群规模 $y$ 大于 $s$，变化率 $\dfrac{dy}{dx}$ 为负，种群会缩小，直到 $y \le s$。

这个微分方程也可以用分离变量法解，但涉及的求原函数更难：

$$
\begin{aligned}
\frac{dy}{y(s - y)} &= r\,dx && (\text{分离变量}) \\
\int \frac{dy}{y(s - y)} &= \int r\,dx && (\text{两边积分}) \\
\frac1s\ln\left|\frac{y}{s - y}\right| &= rx + c && (\text{用题目给的提示}) \\
\ln\left|\frac{y}{s - y}\right| &= s(rx + c) && (\text{化简}) \\
\left|\frac{y}{s - y}\right| &= e^{srx + sc} \\
\frac{y}{s - y} &= ae^{srx} \\
y &= ae^{srx}(s - y) \\
y + yae^{srx} &= sae^{srx} \\
y &= \frac{sae^{srx}}{1 + ae^{srx}}.
\end{aligned}
$$

注意当 $x$ 趋于无穷时，$y$ 的值趋于 $s$。我们一开始对这个微分方程的分析表明，$y$ 低于 $s$ 时会增大、高于 $s$ 时会减小，所以 $y$ 的值趋向 $s$ 并不奇怪。

（这条曲线叫做**逻辑斯谛曲线**（logistic curve），在生态学和流行病学中很常见。）

</details>
