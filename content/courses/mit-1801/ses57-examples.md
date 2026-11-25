# 例题：绕 x 轴旋转

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

把由下列曲线围成的区域绕 $x$ 轴旋转，求所得旋转体的体积。

a) $y = 3x - x^2$，$y = 0$

b) $y = \sqrt{ax}$，$y = 0$，$x = a$

<details>
<summary>解答</summary>

**a)** 先画出区域的草图，它是 $x = 0$ 和 $x = 3$ 之间的一个抛物线「拱」，顶点在 $(1.5, 2.25)$。

可以用柱壳法或圆盘法计算立体的体积。因为给出的是用 $x$ 表示 $y$ 的方程 $y = 3x - x^2$，用圆盘法似乎最容易。每个圆盘的半径等于曲线的高 $3x - x^2$，所以一个圆盘的体积是 $\pi(3x - x^2)^2\,dx$。积分上下限是 $x$ 截距（交点）$x = 0$ 和 $x = 3$。

旋转体的体积是

$$
\begin{aligned}
\int_0^3 \pi(3x - x^2)^2\,dx &= \pi\int_0^3 (9x^2 - 6x^3 + x^4)\,dx = \pi\left[3x^3 - \frac32x^4 + \frac15x^5\right]_0^3 \\
&= \pi\left(3 \cdot 3^3 - \frac32 \cdot 3^4 + \frac15 \cdot 3^5\right) - 0 = 3^4\pi\left(1 - \frac32 + \frac35\right) = \frac{3^4\pi}{10} \approx 8\pi.
\end{aligned}
$$

这看来是个合理的答案；$8\pi$ 是半径为 2、高为 2 的圆柱的体积。

**b)** 我们必须手绘这个区域的草图，或者用电子作图工具时给 $a$ 选一个值。无论哪种方法，都会发现这个区域是半个开口向右、顶点在 $(0, 0)$ 的抛物线「拱」。区域的右边界是连接 $(a, 0)$ 和 $(a, a)$ 的线段。

同样，可以用垫圈法或柱壳法计算旋转体的体积。用垫圈法计算大概稍微简单一点，但为了换换花样，这个解答用柱壳法、对 $y$ 积分。

每个柱壳从曲线 $y = \sqrt{ax}$（等价地，$x = \frac{y^2}{a}$）延伸到直线 $x = a$。每个柱壳的体积是 $2\pi y\left(a - \dfrac{y^2}{a}\right)dy$。区域从 $y = 0$ 延伸到 $y = a$，所以旋转体的体积是

$$
\int_0^a 2\pi y\left(a - \frac{y^2}{a}\right)dy = 2\pi\int_0^a \left(ay - \frac{y^3}{a}\right)dy = 2\pi\left[\frac{ay^2}{2} - \frac{y^4}{4a}\right]_0^a = 2\pi\left(\frac{a^3}{2} - \frac{a^3}{4}\right) = \frac{\pi a^3}{2}.
$$

如果记得半径为 $a$、高为 $a$ 的圆锥的体积是 $\frac{\pi a^3}{3}$，就可以相当有把握地认为我们的答案是对的。不知道圆锥体积公式的人，可以把答案和一个合适的圆柱的体积比较。

（用圆盘法检验：$\displaystyle\int_0^a \pi(\sqrt{ax})^2\,dx = \pi a\frac{a^2}{2} = \frac{\pi a^3}{2}$，结果相同。柱壳法在第 59 节讲。）

</details>
