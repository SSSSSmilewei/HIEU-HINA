# 例题：求收敛半径

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

用比值判别法求幂级数

$$
\sum_{n=1}^\infty \frac{x^n}{n}
$$

的收敛半径。

<details>
<summary>解答</summary>

正如 Christine 在习题课里解释的，要求级数 $\displaystyle\sum_{n=n_0}^\infty c_nx^n$ 的收敛半径，就用比值判别法求 $L = \displaystyle\lim_{n \to \infty} \left|\frac{c_{n+1}x^{n+1}}{c_nx^n}\right|$。使 $L = 1$ 的 $|x|$ 值就是这个幂级数的收敛半径。

在这里，

$$
\frac{c_{n+1}x^{n+1}}{c_nx^n} = \frac{x^{n+1}/(n + 1)}{x^n/n} = x \cdot \frac{n}{n + 1}.
$$

取 $n$ 趋于无穷大时的极限，得到

$$
L = \lim_{n \to \infty} \left|\frac{c_{n+1}x^{n+1}}{c_nx^n}\right| = \lim_{n \to \infty} \left|x \cdot \frac{n}{n + 1}\right| = \lim_{n \to \infty} \left|x \cdot \left(1 - \frac{1}{n + 1}\right)\right| = |x|.
$$

当 $|x| < 1$ 时，$L < 1$，比值判别法告诉我们级数收敛。当 $|x| > 1$ 时，$L > 1$，级数发散。收敛半径是 1。

这让我们体会到调和级数 $\displaystyle\sum_{n=1}^\infty \frac1n$（即 $x = 1$ 的情形）离收敛有多近。

</details>
