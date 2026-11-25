# 例题：估计 ln 5

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

a) 用中值定理和微积分基本定理求 $\displaystyle\int_1^5 \frac1x\,dx$ 的上界和下界。

b) 计算 $\displaystyle\int_1^5 \frac1x\,dx$。

c) (a) 的答案能很好地估计 $\ln 5$ 的值吗？

<details>
<summary>解答</summary>

**a)** 中值定理告诉我们：如果 $F$ 在 $a < x < b$ 上可导、在 $a \le x \le b$ 上连续，那么存在某个值 $c$，$a < c < b$，使得

$$
\frac{F(b) - F(a)}{b - a} = F'(c).
$$

在我们的例子里，$F(b) - F(a) = \displaystyle\int_1^5 \frac1x\,dx$，$F'(x) = \dfrac1x$。我们关心的是区间 $[1, 5]$，所以中值定理说，对 1 和 5 之间的某个 $c$，

$$
\frac{\int_1^5 \frac1x\,dx}{5 - 1} = \frac1c.
$$

换句话说，对 $(1, 5)$ 中的某个 $c$，$\displaystyle\int_1^5 \frac1x\,dx = \frac4c$。

在 1 和 5 之间的区间上，$F'(x) = \frac1x$ 在 $x = 1$ 处最大，在 $x = 5$ 处最小。函数 $F'(x)$ 在从 1 到 5 的整个区间上递减，所以对任何满足 $1 < c < 5$ 的 $c$，有 $1 > \frac1c > \frac15$。由此得到 $4 > \displaystyle\int_1^5 \frac1x\,dx > \frac45$，或者等价地，

$$
0.8 < \int_1^5 \frac1x\,dx < 4.
$$

**b)**

$$
\int_1^5 \frac1x\,dx = \ln x\Big|_1^5 = \ln 5 - \ln 1 = \ln 5 \approx 1.609.
$$

我们在 (a) 中知道答案应该在 0.8 和 4 之间，所以这大概是对的。也可以看函数 $F'(x) = \frac1x$ 的图像来检验。

**c)** 下界 $0.8 < \ln 5$ 有些用处，但 $\ln 5 < 4$ 这条信息没什么用。用计算器对这个不等式两边作用函数 $e^x$，得到的只是 $5 < e^4 \approx 55$。

中值定理给出上界和下界，但它们不一定适合用来估计。这只是求上下界的众多方法之一。

</details>
