# 例题：概率函数

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

**泊松过程**是这样一种情形：某种现象以恒定的平均速率发生。每次发生都和其他所有发生相互独立；在泊松过程中，一个事件并不会因为距离上一次发生已经很久而变得更可能发生。公路上坑洼的位置，或放射性物质随时间发射粒子，可能都是泊松过程。

概率密度函数

$$
f(x) = \begin{cases} \lambda e^{-\lambda x}, & x \ge 0, \\ 0, & x < 0 \end{cases}
$$

描述了在时间或位置 $x$ 处发生一次事件的相对可能性，其中 $\lambda$ 描述平均发生率。

事件在 $a$ 和 $b$ 之间的区间里发生的概率 $P(a < x < b)$ 由

$$
\int_a^b f(x)\,dx
$$

给出。计算这个积分：

a) $a$ 和 $b$ 都为正（设 $a < b$）的情形；

b) $a \le 0$ 且 $b > 0$ 的情形；

c) $a \le 0$ 且 $b \le 0$ 的情形。

<details>
<summary>解答</summary>

三问的复杂程度是递减的；你可能想从最后一问开始，倒着做。

**a)** 因为在从 $a$ 到 $b$ 的整个区间上 $x > 0$，

$$
\int_a^b f(x)\,dx = \int_a^b \lambda e^{-\lambda x}\,dx.
$$

$\lambda e^{-\lambda x}$ 的原函数是 $-e^{-\lambda x}$；从这里开始计算就很直接了：

$$
\int_a^b \lambda e^{-\lambda x}\,dx = -e^{-\lambda x}\Big|_a^b = -e^{-\lambda b} - (-e^{-\lambda a}) = e^{-\lambda a} - e^{-\lambda b}.
$$

给定速率参数为 $\lambda$ 的泊松分布，当 $b \ge a > 0$ 时，事件在区间 $[a, b]$ 中发生的概率是 $e^{-\lambda a} - e^{-\lambda b}$。

**b)** 我们还没做过多少对分段定义的函数积分的例子，但可以用定积分的几何解释确定该怎么做。

在区间 $[a, 0]$ 上，$f(x) = 0$，所以图像这一部分下方的面积是 0。在区间 $[0, b]$ 上，$f(x) = \lambda e^{-\lambda x}$。$f(x)$ 的图像在 $a$ 和 $b$ 之间下方的面积一定是

$$
\int_a^b f(x)\,dx = \int_a^0 f(x)\,dx + \int_0^b f(x)\,dx = 0 + \int_0^b \lambda e^{-\lambda x}\,dx = -e^{-\lambda x}\Big|_0^b = 1 - e^{-\lambda b}.
$$

**c)** 这个计算很平凡。在区间 $[a, b]$ 上 $f(x) = 0$。$f$ 的图像与 $x$ 轴之间的面积是 0，所以 $a, b \le 0$ 时

$$
\int_a^b f(x)\,dx = 0.
$$

</details>
