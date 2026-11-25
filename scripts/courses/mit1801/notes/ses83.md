# 极坐标（续）：面积

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：极坐标与面积

怎样用极坐标计算面积？我们的基本面积微元形状像一块馅饼。图 1 中的馅饼片

> 图 1：半径为 $r$、角为 $d\theta$ 的一块馅饼；它的外边是一段长为 $r\,d\theta$ 的圆弧。

边界上有一段圆弧，弧长 $r\,d\theta$。我们说 $dA$ 等于这块馅饼片的面积。

怎样用 $r$ 和 $\theta$ 表示 $dA$？切出这一片的整个馅饼的面积是 $\pi r^2$。要求面积 $dA$，注意到它占总面积的比例等于它占的弧长的比例。所以

$$
\frac{dA}{\pi r^2} = \frac{r\,d\theta}{2\pi r} \;\Longrightarrow\; dA = \frac{r\,d\theta}{2\pi r} \cdot \pi r^2 \;\Longrightarrow\; dA = \frac12r^2\,d\theta.
$$

这是极坐标中面积微元的基本公式。

我们想用极坐标计算圆以外的图形的面积。这时 $r$ 是 $\theta$ 的函数。曲线到原点的距离随射线的角度而变化。我们的参照中心是原点；想象从原点以某个角 $\theta$ 发出射线，$r(\theta)$ 大致是沿这条射线走到曲线需要的距离。

要求这样一个图形的面积，就把它分成角为 $\Delta\theta$ 的扇形。因为曲线不是圆，扇形不能完美覆盖这个区域，所以我们只是近似曲线与原点之间一块楔形的面积：

$$
\Delta A \approx \frac12r^2\Delta\theta.
$$

> 图 2：从一块形状古怪的馅饼上切下的一片，外边是曲线 $r = f(\theta)$。

取 $\Delta\theta$ 趋于零的极限，扇形面积之和就趋于精确的面积，得到

$$
dA = \frac12r^2\,d\theta.
$$

这和在矩形面积的黎曼和中让 $\Delta x$ 趋于零非常相似。

取极限，得到

$$
A = \int_{\theta_1}^{\theta_2} \frac12r^2\,d\theta.
$$

记住我们假设 $r$ 是 $\theta$ 的函数。

## 片段 2：不以原点为圆心的圆的面积

我们用极坐标求曲线 $r = 2a\cos\theta$ 围成的区域的面积。前面已经证明这条曲线描述的是以 $(a, 0)$ 为圆心、半径为 $a$ 的圆。它的直角坐标方程是 $(x - a)^2 + y^2 = a^2$。

> 图 1：不以原点为圆心的圆 $r = 2a\cos\theta$。

我们要对无穷小的面积 $dA$ 积分。积分从 $\theta_1 = -\frac\pi2$ 到 $\theta_2 = \frac\pi2$。这两个上下限可以看图 1 找到；画这个圆时，可以先沿角 $-\frac\pi2$「向下」走。沿圆的下半部分朝 $(2a, 0)$ 走时，角度增大到 0；画圆的上半部分时，角度从 0 变到 $\frac\pi2$（「向上」）。

也可以看着公式找上下限：余弦函数在 $-\frac\pi2 < \theta < \frac\pi2$ 时为正。$\theta = \pm\frac\pi2$ 时 $r = 2a\cos\theta$ 为 0，所以曲线的两端在原点相接。

无穷小面积微元是 $dA = \frac12r^2\,d\theta$，所以

$$
\begin{aligned}
A &= \int_{-\pi/2}^{\pi/2} \frac12r^2\,d\theta = \int_{-\pi/2}^{\pi/2} \frac12(2a\cos\theta)^2\,d\theta = \int_{-\pi/2}^{\pi/2} 2a^2\cos^2\theta\,d\theta \\
&= 2a^2\int_{-\pi/2}^{\pi/2} \cos^2\theta\,d\theta \qquad (\text{半角公式}) \\
&= 2a^2\int_{-\pi/2}^{\pi/2} \frac{1 + \cos 2\theta}{2}\,d\theta = a^2\left[\theta + \frac12\sin 2\theta\right]_{-\pi/2}^{\pi/2} \\
&= a^2\left(\frac\pi2 - \left(-\frac\pi2\right)\right) = \pi a^2.
\end{aligned}
$$

我们知道半径为 $a$ 的圆的面积是 $\pi a^2$；我们的答案是对的。
