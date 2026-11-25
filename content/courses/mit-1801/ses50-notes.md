# 把微积分基本定理和中值定理结合起来

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：复习微积分基本定理

记得微积分第一基本定理（FTC1）说：如果 $F' = f$，那么 $\displaystyle\int_a^b f(x)\,dx = F(b) - F(a)$。

我们用它来求定积分的值；今天我们要反过来，倒着读这个等式：

$$
F(b) - F(a) = \int_a^b f(x)\,dx,
$$

用导数 $f = F'$ 来理解函数 $F$。

## 片段 2：基本定理与中值定理

我们的目标是用 $F'$ 的信息推出 $F$ 的信息。这个过程的第一个例子，是把第一基本定理和中值定理作比较。

用记号 $\Delta F = F(b) - F(a)$，$\Delta x = b - a$。于是第一基本定理告诉我们

$$
\Delta F = \int_a^b f(x)\,dx.
$$

两边除以 $\Delta x$，得到

$$
\frac{\Delta F}{\Delta x} = \underbrace{\frac{1}{b - a}\int_a^b f(x)\,dx}_{\text{Average}(f)},
$$

右边的式子是函数 $f(x)$ 在区间 $[a, b]$ 上的**平均值**。

为什么这是 $f$ 的平均值而不是 $F$ 的？考虑下面的黎曼和：

$$
\int_0^n f(x)\,dx \approx f(1) + f(2) + \cdots + f(n).
$$

这是 $f(x)$ 的值的累积和。而量

$$
\frac{\int_0^n f(x)\,dx}{n} \approx \frac{f(1) + f(2) + \cdots + f(n)}{n}
$$

是 $f(x)$ 的值的平均；在极限下，$f(x)$ 在区间 $[a, b]$ 上的平均值由 $\dfrac{1}{b - a}\displaystyle\int_a^b f(x)\,dx$ 给出。

我们把第一基本定理再改写一次：

$$
\Delta F = \text{Average}(F')\,\Delta x.
$$

换句话说，$F$ 的改变量等于无穷小改变（变化率）的平均值乘以经过的时间。现在可以用不等式把它和中值定理作比较。中值定理说，对 $a$ 和 $b$ 之间的某个 $c$，$\dfrac{F(b) - F(a)}{b - a} = F'(c)$。可以把它改写成

$$
\Delta F = F'(c)\Delta x.
$$

第一基本定理中 $\text{Average}(F')$ 的值非常具体，而中值定理中的 $F'(c)$ 则不然；我们对 $c$ 只知道它在 $a$ 和 $b$ 之间的某处。

即使不确切知道 $c$ 是多少，我们也确定地知道，$F'(c)$ 小于 $F'$ 在 $a$ 到 $b$ 区间上的最大值，大于 $F'$ 在这个区间上的最小值：

$$
\left(\min_{a<x<b} F'(x)\right)\Delta x \le \Delta F = F'(c)\Delta x \le \left(\max_{a<x<b} F'(x)\right)\Delta x.
$$

微积分第一基本定理给出了一个具体得多的值——$\text{Average}(F')$——从中也能得出同样的结论：

$$
\left(\min_{a<x<b} F'(x)\right)\Delta x \le \Delta F = \text{Average}(F')\,\Delta x \le \left(\max_{a<x<b} F'(x)\right)\Delta x.
$$

微积分基本定理比中值定理强得多；一旦有了积分，就可以抛开中值定理。我们从基本定理得到的结论和从中值定理得到的一样：平均值总是大于最小值、小于最大值。两个定理对 $F$ 的改变量给出同样的结论：

$$
\left(\min_{a<x<b} F'(x)\right)\Delta x \le \Delta F \le \left(\max_{a<x<b} F'(x)\right)\Delta x.
$$

## 片段 3：中值定理与估计

第二次考试出过这样一道题：

已知 $F'(x) = \dfrac{1}{1 + x}$，$F(0) = 1$，由中值定理可以得出 $A < F(4) < B$，$A$ 和 $B$ 是多少？

> 图 1：$F'(x) = \dfrac{1}{1 + x}$ 在 0 到 4 之间的图像，从高度 1 降到高度 $\frac15$；图上画出了水平线 $y = 1$ 和 $y = \frac15$。

为了解这道题，先用中值定理让 $F(4)$ 出现，再用我们对 $F'(c)$ 公式的了解求出这个值的界。记住 $c$ 是（在这里）0 和 4 之间一个未知的值。

$$
F(4) - F(0) = F'(c)(4 - 0) = \frac{1}{1 + c} \cdot 4 \qquad (\text{对 } F(4) \text{ 用中值定理}).
$$

我们不知道 $\frac{1}{1 + c}$ 是多少，但知道 $x$ 从 0 增大时 $\frac{1}{1 + x}$ 递减，所以

$$
1 = \frac11 > \frac{1}{1 + c} > \frac{1}{1 + 4} = \frac15.
$$

因此

$$
4 > \frac{1}{1 + c} \cdot 4 > \frac45.
$$

我们得出

$$
4 > F(4) - F(0) > \frac45,
$$

又因为 $F(0) = 1$，所以

$$
5 > F(4) > \frac95.
$$

最终答案是 $A = \frac95$，$B = 5$。

现在把它和用微积分基本定理能做的比较一下：

$$
F(4) - F(0) = \int_0^4 \frac{dx}{1 + x}.
$$

根据我们对 $y = \frac{1}{1 + x}$ 的图像和它下方面积的了解，可以推出

$$
F(4) - F(0) = \int_0^4 \frac{dx}{1 + x} < \int_0^4 1\,dx = 4,
$$

以及

$$
F(4) - F(0) = \int_0^4 \frac{dx}{1 + x} > \int_0^4 \frac15\,dx = \frac45.
$$

于是又一次得到

$$
\frac45 < F(4) - F(0) < 4.
$$

从几何上，我们把 $\displaystyle\int_0^4 \frac{dx}{1 + x}$ 理解为曲线下方的面积。把它和一个高为 $\frac{1}{1 + x}$ 在区间上的最大值的矩形比较，得到面积的上界；和一个高为 $\frac{1}{1 + x}$ 在 $[0, 4]$ 上的最小值的矩形比较，得到下界。

可以把这看作通过和两个只有一个矩形的黎曼和比较，来估计 $\displaystyle\int_0^4 \frac{dx}{1 + x}$：

$$
\text{下黎曼和} < \int_0^4 \frac{dx}{1 + x} < \text{上黎曼和}.
$$
