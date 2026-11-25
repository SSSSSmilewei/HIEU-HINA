# 例题：酒杯的表面积

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

Jerison 教授求过把 $y = e^x$（$0 \le x \le 1$）的图像绕 $y$ 轴旋转形成的「酒杯」形状的体积。列出（但不必计算）求这个形状的曲面面积的积分。

<details>
<summary>解答</summary>

这道题和讲座中的例子的主要区别是，我们绕 $y$ 轴而不是 $x$ 轴旋转。因此，我们加起来的是一条条圆环形「丝带」的面积，丝带的半径是 $x$（不是 $y$），宽是 $ds$：

$$
\text{面积} = \int_{x_1}^{x_2} 2\pi x\,ds.
$$

记得 $\dfrac{ds}{dx} = \sqrt{1 + \left(\dfrac{dy}{dx}\right)^2}$，得到

$$
\text{面积} = \int_0^1 2\pi x\sqrt{1 + (e^x)^2}\,dx = \int_0^1 2\pi x\sqrt{1 + e^{2x}}\,dx.
$$

数值方法算出这个积分的值接近 7。一个圆锥，底面在杯口、顶点在杯底中心，它的侧面积约为 6，所以我们的答案看起来是对的。

</details>
