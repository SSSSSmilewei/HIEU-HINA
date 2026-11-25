# 例题：配方

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

用配方计算积分 $\displaystyle\int \frac{dx}{\sqrt{2x - x^2}}$。

<details>
<summary>解答</summary>

我们希望把平方根里的表达式 $2x - x^2$ 化成常见三角代换表里的形式。这里减去了 $x^2$，提示我们的目标是一个类似 $\sqrt{b^2 - x^2}$ 的表达式。

可以查配方的公式，或者看出 $2x - x^2$ 是 $-1 + 2x - x^2 = -(x - 1)^2$ 的一部分，或者对下面的方程解出 $a$ 和 $c$：

$$
2x - x^2 = c - (x + a)^2 \;\Longrightarrow\; -x^2 + 2x = c - (x^2 + 2ax + a^2) = -x^2 - 2ax + c - a^2.
$$

比较同类项，得到

$$
2x = -2ax \;\Longrightarrow\; a = -1, \qquad 0 = c - a^2 \;\Longrightarrow\; c = 1.
$$

换句话说，$2x - x^2 = 1 - (x - 1)^2$。

现在可以列出积分了，它含有表达式 $\sqrt{1 - (x - 1)^2}$。三角代换小结建议：如果积分中出现 $\sqrt{b^2 - u^2}$，就代换 $u = b\sin\theta$。所以我们代换

$$
x - 1 = \sin\theta, \qquad dx = \cos\theta\,d\theta.
$$

$$
\int \frac{dx}{\sqrt{2x - x^2}} = \int \frac{dx}{\sqrt{1 - (x - 1)^2}} = \int \frac{\cos\theta\,d\theta}{\sqrt{1 - \sin^2\theta}} = \int \frac{\cos\theta\,d\theta}{\cos\theta} = \int d\theta = \theta + c = \arcsin(x - 1) + c.
$$

如果知道 $\dfrac{d}{dv}\arcsin v = \dfrac{1}{\sqrt{1 - v^2}}$，这个答案很容易检验。

</details>
