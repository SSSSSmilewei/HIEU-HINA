# 例题：商法则练习

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

求下列有理函数的导数。

a) $\dfrac{x^2}{x + 1}$

b) $\dfrac{x^4 + 1}{x^2}$

c) $\dfrac{\sin x}{x}$

<details>
<summary>解答</summary>

**a)** 商法则告诉我们，如果 $u(x)$ 和 $v(x)$ 是可导函数，且 $v(x)$ 不为零，那么

$$
\left(\frac{u(x)}{v(x)}\right)' = \frac{u'(x)v(x) - u(x)v'(x)}{(v(x))^2}.
$$

这道题中 $u = x^2$、$v = x + 1$，所以 $u' = 2x$、$v' = 1$。用商法则得到

$$
\left(\frac{x^2}{x + 1}\right)' = \frac{2x \cdot (x + 1) - x^2 \cdot 1}{(x + 1)^2} = \frac{2x^2 + 2x - x^2}{(x + 1)^2} = \frac{x^2 + 2x}{(x + 1)^2}.
$$

**b)** 这里 $u(x) = x^4 + 1$，$u'(x) = 4x^3$，$v(x) = x^2$，$v'(x) = 2x$。商法则告诉我们

$$
\left(\frac{x^4 + 1}{x^2}\right)' = \frac{4x^3 \cdot x^2 - (x^4 + 1) \cdot 2x}{(x^2)^2} = \frac{4x^5 - 2x^5 - 2x}{x^4} = \frac{2x^4 - 2}{x^3}.
$$

**c)** $\sin x$ 的导数是 $\cos x$，$x$ 的导数是 1，所以商法则告诉我们

$$
\left(\frac{\sin x}{x}\right)' = \frac{\cos x \cdot x - \sin x \cdot 1}{x^2} = \frac{x\cos x - \sin x}{x^2}.
$$

等我们学会求这个式子在 $x = 0$ 处的值（极限），它会告诉我们 $\operatorname{sinc}(x) = \dfrac{\sin x}{x}$ 的图像在 $x = 0$ 处的斜率是 0。

</details>
