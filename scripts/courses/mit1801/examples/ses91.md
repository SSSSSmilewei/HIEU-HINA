# 例题：∫₁^∞ dx/(5x + 2)²

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

计算

$$
\int_1^\infty \frac{dx}{(5x + 2)^2}.
$$

<details>
<summary>解答</summary>

这是一个反常积分；第一步是把它化成常义积分的极限：

$$
\int_1^\infty \frac{dx}{(5x + 2)^2} = \lim_{N \to \infty} \int_1^N \frac{dx}{(5x + 2)^2}.
$$

现在可以用代换求这个积分。令 $u = 5x + 2$，则 $du = 5\,dx$，$dx = \frac15du$。$x = 1$ 时 $u = 7$，$x = N$ 时 $u = 5N + 2$。因此

$$
\int_1^N \frac{dx}{(5x + 2)^2} = \int_7^{5N+2} \frac{\frac15\,du}{u^2} = \frac15\int_7^{5N+2} u^{-2}\,du = \frac15(-u^{-1})\Big|_7^{5N+2} = \frac15\left(-\frac{1}{5N + 2} - \left(-\frac17\right)\right) = \frac{1}{35} - \frac{1}{5(5N + 2)}.
$$

求极限，就得到反常积分的值：

$$
\int_1^\infty \frac{dx}{(5x + 2)^2} = \lim_{N \to \infty} \int_1^N \frac{dx}{(5x + 2)^2} = \lim_{N \to \infty} \left(\frac{1}{35} - \frac{1}{5(5N + 2)}\right) = \frac{1}{35} - 0 = \frac{1}{35} \approx 0.03.
$$

从几何上看，这告诉我们：如果把 $\dfrac{1}{x^2}$ 的图像在水平方向压缩（把 $x$ 乘以 5），再把结果向左平移，最后的图像在 $x > 1$ 时非常贴近 $x$ 轴。

</details>
