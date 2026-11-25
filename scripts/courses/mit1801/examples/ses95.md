# 例题：用比值判别法

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

**比值判别法**是判断形如 $\displaystyle\sum_{n=n_0}^\infty a_n$（对所有 $n$ 有 $a_n > 0$）的和收敛还是发散的另一种方法。做比值判别时，求出比值 $\dfrac{a_{n+1}}{a_n}$，令

$$
L = \lim_{n \to \infty} \frac{a_{n+1}}{a_n}.
$$

这个判别法有三种可能的结果：

- $L < 1$ ⟹ 级数收敛。
- $L > 1$ ⟹ 级数发散。
- $L = 1$　无结论；级数可能收敛，也可能发散。

对下列每个级数用比值判别法。注意并不是所有级数都满足这种形式的比值判别法所需的条件。

a) $\displaystyle\sum_{n=1}^\infty \frac{1}{\sqrt[3]{n}}$

b) $\displaystyle\sum_{n=0}^\infty \frac{(n!)^2}{(2n)!}$

c) $\displaystyle\sum_{n=0}^\infty \frac{(-3)^n}{n!}$

（a 题原文从 $n = 0$ 开始，但 $n = 0$ 那一项没有定义，译文改为从 $n = 1$ 开始，不影响结论。）

<details>
<summary>解答</summary>

**a)** 这个级数满足用比值判别法的条件；这里 $a_n = \dfrac{1}{\sqrt[3]{n}} > 0$。

用这个判别法，先计算相邻两项的比值：

$$
\frac{a_{n+1}}{a_n} = \frac{1/\sqrt[3]{n + 1}}{1/\sqrt[3]{n}} = \frac{\sqrt[3]{n}}{\sqrt[3]{n + 1}} = \sqrt[3]{\frac{n}{n + 1}}.
$$

接下来求 $n$ 趋于无穷大时这个比值的极限。当我们难以确定多项式之比的极限时，就用多项式长除法把这个「假分式」化开：

$$
L = \lim_{n \to \infty} \sqrt[3]{\frac{n}{n + 1}} = \lim_{n \to \infty} \sqrt[3]{1 - \frac{1}{n + 1}} = \sqrt[3]{1} = 1.
$$

比值判别法没有结论；我们仍然不知道这个级数收敛还是发散。换一种判别法，比如积分判别法，可能更有效。

（本站补写：用积分比较，$\displaystyle\int_1^\infty \frac{dx}{x^{1/3}}$ 发散（$\frac13 \le 1$），所以这个级数发散。）

**b)** 这道题提供一些阶乘的练习。我们见过，对多项式反复求导会得出类似阶乘的整数乘积；这是阶乘常常出现在级数计算中的众多原因之一。开始时，我们把每个阶乘都改写成乘积：

$$
n! = 1 \cdot 2 \cdot 3 \cdots (n - 1) \cdot n.
$$

练习之后，就不需要这样展开了。

这个级数满足用比值判别法的条件，$a_n = \dfrac{(n!)^2}{(2n)!} > 0$。相邻两项之比是

$$
\frac{a_{n+1}}{a_n} = \frac{((n + 1)!)^2/(2(n + 1))!}{(n!)^2/(2n)!} = \frac{((n + 1)!)^2}{(2(n + 1))!} \cdot \frac{(2n)!}{(n!)^2}.
$$

我们可能想把 2 约掉，但运算顺序不允许——必须先把阶乘展开。注意

$$
(n + 1)! = 1 \cdot 2 \cdot 3 \cdots n \cdot (n + 1) = n! \cdot (n + 1).
$$

$$
\begin{aligned}
\frac{a_{n+1}}{a_n} &= \frac{(n!(n + 1))^2}{1 \cdot 2 \cdots 2n \cdot (2n + 1) \cdot (2n + 2)} \cdot \frac{1 \cdot 2 \cdots (2n - 1) \cdot 2n}{(n!)^2} \\
&= \frac{(n!)^2 \cdot (n + 1)^2}{(2n + 1) \cdot (2n + 2)} \cdot \frac{1}{(n!)^2} = \frac{(n + 1)^2}{(2n + 1) \cdot (2n + 2)} = \frac{n + 1}{2(2n + 1)}.
\end{aligned}
$$

现在取极限，得到判别的结果：

$$
L = \lim_{n \to \infty} \frac{a_{n+1}}{a_n} = \lim_{n \to \infty} \frac{n + 1}{2(2n + 1)} = \lim_{n \to \infty} \left(\frac14 + \frac{1}{4(2n + 1)}\right) = \frac14.
$$

因为 $L < 1$，我们知道这个级数一定收敛。这告诉我们，$n$ 很大时，每一项的值 $\dfrac{1 \cdot 2 \cdots n}{(n + 1)(n + 2) \cdots 2n}$ 非常小。

（译注：原文这里写成了「因为 $L < 0$」，应为 $L < 1$，译文已更正。）

**c)** 这个级数**不**满足用比值判别法的条件；级数的项并不全是正的。

确实有 $\left|\displaystyle\sum_{n=0}^\infty \frac{(-3)^n}{n!}\right| \le \displaystyle\sum_{n=0}^\infty \left|\frac{(-3)^n}{n!}\right|$。（你会怎样证明它？）我们对第二个级数用比值判别法，来判断第一个级数是否收敛。

于是 $a_n = \left|\dfrac{(-3)^n}{n!}\right| > 0$，可以用比值判别法：

$$
\frac{a_{n+1}}{a_n} = \frac{|(-3)^{n+1}/(n + 1)!|}{|(-3)^n/n!|} = \left|\frac{(-3)^{n+1} \cdot n!}{(n + 1)! \cdot (-3)^n}\right| = \left|\frac{-3}{n + 1}\right| = \frac{3}{n + 1},
$$

$$
L = \lim_{n \to \infty} \frac{a_{n+1}}{a_n} = \lim_{n \to \infty} \frac{3}{n + 1} = 0.
$$

由比值判别法，级数各项绝对值之和收敛，所以这个级数本身一定收敛（绝对收敛的级数一定收敛）。这告诉我们 $n!$ 比 $3^n$ 增长得快得多。

</details>
