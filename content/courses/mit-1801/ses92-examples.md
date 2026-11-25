# 例题：确认一个积分收敛

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

用极限比较证明 $\displaystyle\int_1^\infty \frac{dx}{(5x + 2)^2}$ 是有限的。

<details>
<summary>解答</summary>

前面我们证明过 $\displaystyle\int_1^\infty \frac{dx}{(5x + 2)^2} = \frac{1}{35}$。这个计算不算太难，但很多计算是难的。极限比较为我们处理棘手的积分提供了一个有用的技巧。

我们知道，如果 $x$ 趋于无穷大时 $f(x) \sim g(x)$，那么 $\displaystyle\int_a^\infty f(x)\,dx$ 和 $\displaystyle\int_a^\infty g(x)\,dx$ 要么都收敛，要么都发散。

第一步是找一个和给定函数 $g(x) = \dfrac{1}{(5x + 2)^2}$ 相当的函数 $f(x)$。可以把分母展开、丢掉低次项，取 $f(x) = \dfrac{1}{25x^2}$；也可以回想这个积分的计算，试试 $f(x) = \dfrac{1}{x^2}$。结果前一种策略才是对的（$\frac{1}{x^2}$ 与 $g(x)$ 之比趋于 25，而不是 1）。

要检验 $f(x) = \dfrac{1}{25x^2} \sim \dfrac{1}{(5x + 2)^2} = g(x)$，必须证明

$$
\lim_{x \to \infty} \frac{f(x)}{g(x)} = 1.
$$

$$
\lim_{x \to \infty} \frac{f(x)}{g(x)} = \lim_{x \to \infty} \frac{\frac{1}{25x^2}}{\frac{1}{(5x + 2)^2}} = \lim_{x \to \infty} \frac{(5x + 2)^2}{25x^2} = \lim_{x \to \infty} \frac{25x^2 + 20x + 4}{25x^2} = \lim_{x \to \infty} \left(1 + \frac{4}{5x} + \frac{4}{25x^2}\right) = 1.
$$

（如果当初取 $f(x) = \dfrac{1}{(5x + 2)^2}$、$g(x) = \dfrac{1}{25x^2}$，就得化简 $\dfrac{25x^2}{(5x + 2)^2}$。因为这个分式的倒数好处理得多，这时最好回到开头，把 $f(x)$ 和 $g(x)$ 的角色对调。）

最后我们确认了 $\dfrac{1}{25x^2} \sim \dfrac{1}{(5x + 2)^2}$，所以 $\displaystyle\int_1^\infty \frac{dx}{(5x + 2)^2}$ 收敛当且仅当 $\displaystyle\int_1^\infty \frac{dx}{25x^2}$ 收敛。我们可能知道 $k > 1$ 时 $\displaystyle\int_1^\infty \frac{dx}{x^k}$ 收敛，或者也可以算出这个更简单的积分：

$$
\int_1^\infty \frac{dx}{25x^2} = \frac{1}{25}\int_1^\infty x^{-2}\,dx = \frac{1}{25}\left[-x^{-1}\right]_1^\infty = \frac{1}{25}\left(0 - (-1)\right) = \frac{1}{25}.
$$

我们得出：如果 $g(x) = \dfrac{1}{(5x + 2)^2}$、$f(x) = \dfrac{1}{25x^2}$，那么 $f(x) \sim g(x)$，所以 $\displaystyle\int_1^\infty \frac{dx}{(5x + 2)^2}$ 一定收敛，因为 $\displaystyle\int_1^\infty \frac{dx}{25x^2} = \frac{1}{25}$ 收敛。

</details>
