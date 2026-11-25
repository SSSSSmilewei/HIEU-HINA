# 例题：y = ln x 的弧长

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

把 $y = \ln x$ 的图像在 $x = 1/10$ 和 $x = 1$ 之间的弧长表示成一个积分。（不必计算。）

<details>
<summary>解答</summary>

弧长公式是 $\displaystyle\int_{\text{起点}}^{\text{终点}} ds$。

如果这段弧是 $y = f(x)$ 的图像的一部分，那么 $ds = \sqrt{dx^2 + dy^2}$，或者等价地

$$
\frac{ds}{dx} = \sqrt{1 + \left(\frac{dy}{dx}\right)^2}.
$$

在我们的例子里，$y = \ln x$，$\dfrac{dy}{dx} = \dfrac1x$，所以

$$
\text{弧长} = \int_{1/10}^1 \sqrt{1 + \left(\frac1x\right)^2}\,dx = \int_{1/10}^1 \frac{\sqrt{x^2 + 1}}{x}\,dx.
$$

如果用数值方法或其他方法算出这个积分，应该会发现它的值比 $|\ln(1/10)| = \ln(10)$ 稍大一点。（弧长不会小于竖直方向上走过的距离 $\ln 10$；数值计算的结果约为 2.53，而 $\ln 10 \approx 2.30$。）

</details>
