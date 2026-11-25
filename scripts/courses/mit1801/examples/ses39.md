# 例题：怎样检验你的答案

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

求解微分方程可能很难，但要看一个给出的解是否正确却相当容易。把给出的答案代入原方程，检验下面的结果。

a) $y = \dfrac13e^x$ 是 $4y'' - y = e^x$ 的解。

b) $y = \dfrac1x$ 是 $x^2\dfrac{d^2y}{dx^2} + 3x\dfrac{dy}{dx} + y = 0$ 的解。

<details>
<summary>解答</summary>

**a)** 如果 $y = \frac13e^x$，那么 $y' = \frac13e^x$，$y'' = \frac13e^x$。把这些式子代入原方程：

$$
4y'' - y = 4\left(\frac13e^x\right) - \frac13e^x = \frac33e^x = e^x.
$$

所以 $y = \frac13e^x$ 时 $4y'' - y = e^x$ 确实成立。

**b)** 这里 $y = x^{-1}$，$\dfrac{dy}{dx} = -x^{-2}$，$\dfrac{d^2y}{dx^2} = 2x^{-3}$。代入原方程得到

$$
x^2\frac{d^2y}{dx^2} + 3x\frac{dy}{dx} + y = x^2 \cdot 2x^{-3} + 3x \cdot (-x^{-2}) + x^{-1} = 2x^{-1} - 3x^{-1} + x^{-1} = 0.
$$

所以 $y = \dfrac1x$ 是这个微分方程的解。

</details>
