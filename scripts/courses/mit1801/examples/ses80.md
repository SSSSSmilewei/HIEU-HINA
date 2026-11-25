# 例题：探索一条参数曲线

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

a) 描述参数化

$$
x = t\cos t, \qquad y = t\sin t, \qquad 0 \le t \le 4\pi
$$

画出的曲线。

b) 列出并化简（但不必积分）这条曲线弧长 $\displaystyle\int_0^{4\pi} \frac{ds}{dt}\,dt$ 的表达式。

<details>
<summary>解答</summary>

**a)** 我们知道方程

$$
x = a\cos t, \qquad y = a\sin t
$$

描述半径为 $a$ 的圆，其中 $a$ 是常数。

在给定的问题里，倍数 $a$ 是变化的：

$$
x = a(t)\cos t, \qquad y = a(t)\sin t,
$$

其中 $a(t) = t$。随着 $t$ 增大，曲线仍然绕原点逆时针运动；但它到原点的距离也随着 $t$ 增大而增大。

可以算出曲线上几个点的坐标，更好地了解它的行为。下表给出其中几个：

| $t$ | $(x, y)$ |
|---|---|
| $0$ | $(0, 0)$ |
| $\frac\pi4$ | $\left(\frac{\pi\sqrt2}{8}, \frac{\pi\sqrt2}{8}\right)$ |
| $\frac\pi2$ | $\left(0, \frac\pi2\right)$ |
| $\pi$ | $(-\pi, 0)$ |
| $\frac{3\pi}{2}$ | $\left(0, -\frac{3\pi}{2}\right)$ |

我们看到，曲线从 $(0, 0)$ 出发，逆时针前进，远离原点。$t$ 从 0 增大到 $4\pi$ 时，它绕原点转两圈，画出的图形叫作**阿基米德螺线**。

**b)** 我们知道 $ds = \sqrt{dx^2 + dy^2}$，所以

$$
\frac{ds}{dt} = \sqrt{\left(\frac{dx}{dt}\right)^2 + \left(\frac{dy}{dt}\right)^2}.
$$

计算得

$$
\frac{dx}{dt} = -t\sin t + \cos t, \qquad \frac{dy}{dt} = t\cos t + \sin t,
$$

$$
\left(\frac{dx}{dt}\right)^2 = t^2\sin^2t - 2t\sin t\cos t + \cos^2t, \qquad \left(\frac{dy}{dt}\right)^2 = t^2\cos^2t + 2t\sin t\cos t + \sin^2t,
$$

$$
\left(\frac{dx}{dt}\right)^2 + \left(\frac{dy}{dt}\right)^2 = t^2(\sin^2t + \cos^2t) - 2t\sin t\cos t + 2t\sin t\cos t + (\cos^2t + \sin^2t) = t^2 + 1.
$$

于是

$$
\text{弧长} = \int_0^{4\pi} \frac{ds}{dt}\,dt = \int_0^{4\pi} \sqrt{t^2 + 1}\,dt.
$$

如果愿意，可以用反代换 $t = \tan\theta$、再积 $\sec^3\theta$ 来完成这个计算。然后可以把最终结果和一个合适的圆的周长比较，来检验计算。

</details>
