# 例题：线性近似的乘积

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

假设有两个复杂的函数，我们需要估计它们乘积的值。可以先把函数乘起来再近似结果，也可以先分别近似每个函数，再求两个（简单的）近似的乘积。先做哪一步有关系吗？关系不大。

证明：$f(x) \cdot g(x)$ 的线性近似，等于 $f(x)$ 和 $g(x)$ 的线性近似之积的（线性部分）。

<details>
<summary>解答</summary>

设 $f(x)$ 和 $g(x)$ 是在某个值 $x_0$ 附近有定义并可导的两个函数。我们知道

$$
f(x) \approx f(x_0) + f'(x_0)(x - x_0), \qquad g(x) \approx g(x_0) + g'(x_0)(x - x_0).
$$

这两个线性近似的乘积是

$$
\begin{aligned}
&\bigl(f(x_0) + f'(x_0)(x - x_0)\bigr) \cdot \bigl(g(x_0) + g'(x_0)(x - x_0)\bigr) \\
&= f(x_0)g(x_0) + f'(x_0)(x - x_0)g(x_0) + f(x_0)g'(x_0)(x - x_0) + f'(x_0)g'(x_0)(x - x_0)^2 \\
&= f(x_0)g(x_0) + \bigl(f'(x_0)g(x_0) + f(x_0)g'(x_0)\bigr)(x - x_0) + f'(x_0)g'(x_0)(x - x_0)^2.
\end{aligned}
$$

另一方面，乘积 $(f \cdot g)(x)$ 的线性近似是

$$
(f \cdot g)(x_0) + (f \cdot g)'(x_0) \cdot (x - x_0) = f(x_0)g(x_0) + \bigl(f'(x_0)g(x_0) + g'(x_0)f(x_0)\bigr)(x - x_0).
$$

两个近似之差是 $f'(x_0)g'(x_0)(x - x_0)^2$，当 $x$ 足够接近 $x_0$ 时，这个量可以忽略不计。例如，如果 $x - x_0 = 0.01$，那么 $(x - x_0)^2 = 0.0001$。

</details>
