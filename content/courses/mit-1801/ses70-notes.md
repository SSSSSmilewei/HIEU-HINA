# 三角代换与极坐标预览

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：圆的一部分的面积

给定半径为 $a$ 的圆，从中切出一块高为 $b$ 的「小片」。这块小片的面积是多少？（见图 1。）

> 图 1：从圆里切出的一块：以原点为圆心、半径 $a$ 的圆在第一象限的部分中，$0 \le y \le b$ 的那一条（左边是 $y$ 轴，上边是直线 $y = b$，右边是圆弧，下边是 $x$ 轴）。图上标出了点 $(0, b)$ 和 $(a, 0)$。

计算面积的一种方法是把面积分成竖直的长条，对 $x$ 积分：

$$
\text{面积} = \int y\,dx.
$$

这很别扭，因为快到右端时，区域的高度从常数 $y = b$ 变成了圆的高度 $y = \sqrt{a^2 - x^2}$。

如果对 $y$ 积分呢？这样似乎好一些；每个水平长条的长度有一个简单的统一表达式：$x = \sqrt{a^2 - y^2}$。

$$
\text{面积} = \int_0^b x\,dy = \int_0^b \sqrt{a^2 - y^2}\,dy.
$$

我们还没有积这种形式的函数的法则。考虑到这个积分来自一个关于圆的问题，三角学在它的求解中起作用也就不奇怪了。

处理圆时，用极坐标常常有帮助。在这里，注意区域的右上角的极坐标是 $(a\cos\theta_0, a\sin\theta_0)$，其中 $\theta_0$ 是图 2 所示的角。

> 图 2：一点的极坐标：从原点到右上角 $(a\cos\theta_0, a\sin\theta_0)$ 的半径与 $x$ 轴的夹角是 $\theta_0$；半径、$x$ 轴和从这一点向 $x$ 轴作的垂线围成一个三角形（画了阴影）。

一般地，$x = a\cos\theta$，$y = a\sin\theta$。把 $y = a\sin\theta$ 代入被积函数，得到

$$
x = \sqrt{a^2 - y^2} = \sqrt{a^2 - a^2\sin^2\theta} = a\sqrt{1 - \sin^2\theta} = a\sqrt{\cos^2\theta} = a\cos\theta.
$$

换成极坐标让被积函数好看多了；我们从一个带根号、不带三角函数的被积函数，变成了一个带三角函数、不带根号的被积函数。

如果要在积分里用代换 $y = a\sin\theta$，还需要把 $dy$ 换成用极坐标表示的东西：

$$
y = a\sin\theta, \qquad dy = a\cos\theta\,d\theta.
$$

代入，得到

$$
\int \sqrt{a^2 - y^2}\,dy = \int (a\cos\theta)(a\cos\theta\,d\theta) = \int a^2\cos^2\theta\,d\theta.
$$

我们在前面的讲座里算过 $\cos^2x$ 的积分：

$$
\int \cos^2x\,dx = \frac x2 + \frac{\sin 2x}{4} + C.
$$

代入，得到

$$
\int \sqrt{a^2 - y^2}\,dy = a^2\left(\frac\theta2 + \frac{\sin(2\theta)}{4}\right) + c.
$$

现在我们想用原来的变量 $y$ 改写答案，以便代入积分上下限。为此，用二倍角公式 $\sin(2\theta) = 2\sin\theta\cos\theta$ 改写 $\sin(2\theta)$ 会有帮助：

$$
\int \sqrt{a^2 - y^2}\,dy = a^2\left(\frac\theta2 + \frac{\sin(2\theta)}{4}\right) + c = a^2\left(\frac\theta2 + \frac{\sin\theta\cos\theta}{2}\right) + c = \frac{a^2\theta}{2} + \frac{a\sin\theta \cdot a\cos\theta}{2} + c.
$$

接下来从 $y = a\sin\theta$ 解出 $\theta$ 代入：

$$
\theta = \arcsin\left(\frac ya\right).
$$

因为 $a\sin\theta = y$，$a\cos\theta = x = \sqrt{a^2 - y^2}$，得到

$$
\int \sqrt{a^2 - y^2}\,dy = \frac{a^2\arcsin(y/a)}{2} + \frac{y\sqrt{a^2 - y^2}}{2} + c.
$$

我们用三角代换求出了 $\sqrt{a^2 - y^2}$ 的不定积分。只要在积分里看到二次式的平方根，就应该想到三角学和 $\sin^2\theta + \cos^2\theta = 1$。

原来的问题要我们计算一个定积分的值；我们把它做完：

$$
\int_0^b \sqrt{a^2 - y^2}\,dy = \left[\frac{a^2\arcsin(y/a)}{2} + \frac{y\sqrt{a^2 - y^2}}{2}\right]_0^b = \left(\frac{a^2\arcsin(b/a)}{2} + \frac{b\sqrt{a^2 - b^2}}{2}\right) - 0 = \frac{a^2\arcsin(b/a)}{2} + \frac{b\sqrt{a^2 - b^2}}{2}.
$$

注意 $\theta_0 = \arcsin(b/a)$；可以把答案改写成

$$
\text{面积} = \frac{a^2\theta_0}{2} + \frac{b\sqrt{a^2 - b^2}}{2}.
$$

这说得通吗？第一项 $\dfrac{\theta_0}{2}a^2$ 正好是角 $\theta_0$ 扫过的扇形的面积。第二项 $\dfrac12b\sqrt{a^2 - b^2}$ 是底为 $b$、高为 $\sqrt{a^2 - b^2}$ 的三角形的面积；换句话说，它是图 2 中阴影三角形的面积。

用一些基本的几何知识，我们验证了这道复杂的微积分题的答案是对的。
