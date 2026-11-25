# 例题：另一种解法

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

> 图 1：阴影区域的面积是 $\displaystyle\int_0^b \sqrt{a^2 - x^2}\,dx$。（半径 $a$ 的圆在第一象限的部分中，$0 \le x \le b$ 的那一条；图上标出了 $(0, a)$ 和 $(b, 0)$。）

正如 Miller 教授在讲座中解释的，图 1 中区域的面积是 $\displaystyle\int_0^b \sqrt{a^2 - x^2}\,dx$。用代换 $x = a\cos\theta$ 解这个积分。提示：特别注意积分上下限。

<details>
<summary>解答</summary>

在讲座里，Miller 教授的图画得让代换 $a\sin\theta$ 比 $a\cos\theta$ 更自然。在这道题里，我们验证两种求面积的方法得到相同的结果。

注意 $x = 0$ 时 $\theta = \pi/2$（假设用的是极坐标）。$x = b$ 时 $\theta = \arccos\left(\frac ba\right) < \pi/2$。$x$ 增大时 $\theta$ 减小。虽然不是严格必要，但这里给出的解法把积分上下限对调，保证 $\theta$ 在区间上是递增的。

$$
\begin{aligned}
\int_0^b \sqrt{a^2 - x^2}\,dx &= \int_{\pi/2}^{\arccos(b/a)} \sqrt{a^2 - (a\cos\theta)^2} \cdot (-a\sin\theta)\,d\theta \\
&= -\int_{\arccos(b/a)}^{\pi/2} \sqrt{a^2 - a^2\cos^2\theta} \cdot (-a\sin\theta)\,d\theta \\
&= a\int_{\arccos(b/a)}^{\pi/2} a\sqrt{1 - \cos^2\theta} \cdot \sin\theta\,d\theta \\
&= a^2\int_{\arccos(b/a)}^{\pi/2} \sqrt{\sin^2\theta} \cdot \sin\theta\,d\theta \\
&= a^2\int_{\arccos(b/a)}^{\pi/2} \sin^2\theta\,d\theta \qquad (\text{由图，} \sin\theta > 0) \\
&= a^2\int_{\arccos(b/a)}^{\pi/2} \frac{1 - \cos 2\theta}{2}\,d\theta \\
&= a^2\left[\frac\theta2 - \frac{\sin(2\theta)}{4}\right]_{\arccos(b/a)}^{\pi/2} \\
&= a^2\left[\left(\frac{\pi/2}{2} - \frac{\sin(2 \cdot \frac\pi2)}{4}\right) - \left(\frac{\arccos(b/a)}{2} - \frac{\sin(2\arccos(b/a))}{4}\right)\right] \\
&= a^2\left(\frac\pi4 - \frac{\arccos(b/a)}{2} + \frac{\sin(2\arccos(b/a))}{4}\right).
\end{aligned}
$$

正如 Miller 教授指出的，这时恒等式 $\sin(2t) = 2\sin t\cos t$ 很有用：

$$
\int_0^b \sqrt{a^2 - x^2}\,dx = a^2\left(\frac\pi4 - \frac{\arccos(b/a)}{2} + \frac{2\sin(\arccos(b/a))\cos(\arccos(b/a))}{4}\right) = a^2\left(\frac\pi4 - \frac{\arccos(b/a)}{2} + \frac{\sin(\arccos(b/a))\left(\frac ba\right)}{2}\right).
$$

要进一步化简，需要弄清 $\arccos\left(\frac ba\right)$。为此，可以在图 1 的阴影区域里画一条斜线，构成一个直角三角形：长为 $b$ 的直角边与长为 $a$ 的斜边相交成角 $t$。于是 $\cos t = \frac ba$，即 $t = \arccos\left(\frac ba\right)$。用这张图和勾股定理，得出 $\sin\left(\arccos\left(\frac ba\right)\right) = \dfrac{\sqrt{a^2 - b^2}}{a}$，所以

$$
\int_0^b \sqrt{a^2 - x^2}\,dx = a^2\left(\frac\pi4 - \frac{\arccos(b/a)}{2} + \frac{b}{2a}\frac{\sqrt{a^2 - b^2}}{a}\right) = a^2\left(\frac\pi4 - \frac{\arccos(b/a)}{2}\right) + \frac b2\sqrt{a^2 - b^2} = \frac{a^2\left(\frac\pi2 - t\right)}{2} + \frac{b\sqrt{a^2 - b^2}}{2}.
$$

Miller 教授用代换 $a\sin\theta$ 做这个计算时，得到的结果是 $\displaystyle\int_0^b \sqrt{a^2 - y^2}\,dy = \frac{a^2\theta_0}{2} + \frac{b\sqrt{a^2 - b^2}}{2}$。注意我们的 $\frac\pi2 - t$ 等于 Miller 教授的 $\theta_0$，就可以检验我们的计算。

另一种检验办法：阴影区域里包含的最大扇形的面积是 $\dfrac\pi4a^2 - \dfrac t2a^2$，阴影区域剩下部分的面积是 $\dfrac12b\sqrt{a^2 - b^2}$。

</details>
