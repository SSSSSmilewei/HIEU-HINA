# 正弦和余弦的极限

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：sin x / x 的极限是 1

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$

为了算出 $\sin x$ 和 $\cos x$ 导数的具体公式，我们需要弄清楚 $\sin x / x$ 在 $x = 0$ 附近的行为（性质 B）。在讲座中，Jerison 教授用「$\sin\theta$ 是单位圆上一点的纵坐标」这个定义，证明了 $\displaystyle\lim_{\theta \to 0} \frac{\sin\theta}{\theta} = 1$。

我们从 $x$ 换成 $\theta$，因为我们想开始把正弦函数看作图 1 中三角形两条边的比。我们关心的变量是一个角，而不是水平位置，所以讨论 $\sin\theta / \theta$ 而不是 $\sin x / x$。

> 图 1：半径为 1 的圆，圆心角为 $\theta$ 的一段弧（弧长 $= \theta$），从弧的端点向水平半径作垂线，垂线段长 $\sin\theta$。

我们的论证依赖于这样一个事实：当图 1 中圆的半径为 1 时，$\theta$ 就是那段弧的长度。只有用**弧度**表示角 $\theta$ 时这才成立，用**度**来量时就不成立。

另外，因为圆的半径是 1，$\sin\theta = \dfrac{|\text{对边}|}{|\text{斜边}|}$ 就等于图中标出的那条边的长度（斜边长为 1）。

换句话说，$\sin\theta / \theta$ 是这条边长与弧长之比。当 $\theta = \pi/2$ 弧度时，$\sin\theta = 1$，$\sin\theta / \theta = 2/\pi \approx 2/3$。当 $\theta = \pi/4$ 弧度时，$\sin\theta = \sqrt2/2$，$\sin\theta / \theta = 2\sqrt2/\pi \approx 9/10$。当 $\theta$ 越来越接近 0 弧度时，$\sin\theta / \theta$ 的值会怎样？

> 图 2：图 1 中的扇形在 $\theta$ 变得很小时的样子：竖直的线段和弧几乎重合。

从图 2 可以看出，随着 $\theta$ 缩小，线段的长度 $\sin\theta$ 越来越接近弧的长度 $\theta$。我们得出：当 $\theta \to 0$ 时，$\dfrac{\sin\theta}{\theta} \to 1$。换句话说，

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1.
$$

把很短的一段曲线和直线段相比较，这个技巧在微积分中强大而重要；这一讲就用了好几次。

## 片段 2：(1 − cos θ) / θ 的极限是 0

$$
\lim_{\theta \to 0} \frac{1 - \cos\theta}{\theta} = 0
$$

在计算 $\cos x$ 和 $\sin x$ 的导数时，Jerison 教授说 $\displaystyle\lim_{\theta \to 0} \frac{1 - \cos\theta}{\theta} = 0$。这是对的，但为了确信我们的求导公式正确，应该弄明白它为什么成立。

和讨论 $\sin\theta / \theta$ 时一样，我们的解释要看单位圆的图，把长度为 $\theta$ 的弧和一条直线段作比较。（记住 $\theta$ 是用弧度量的！）如图 1 所示，弧的起点到圆心的水平距离是 $\cos\theta$，而弧两端的水平距离是 $1 - \cos\theta$。

> 图 1：和 $\dfrac{\sin x}{x}$ 的图一样，只是另外标出了三角形的竖边与圆周之间的水平距离 $1 - \cos\theta$。

从图 2 可以看出，当 $\theta \to 0$ 时，弧两端的水平距离 $1 - \cos\theta$（Jerison 教授称之为「缝隙」）比弧长 $\theta$ 小得多。因此 $\dfrac{1 - \cos\theta}{\theta} \to 0$。

> 图 2：图 1 中的扇形在 $\theta$ 变得很小时的样子：「缝隙」$1 - \cos\theta$ 几乎看不见了。

如果你觉得这难以置信，可以用计算器验证：$x$ 很小时，$1 - \cos x$ 小得多。也可以看看 $y = 1 - \cos x$ 在 $x = 0$ 附近的图像，或者用网页工具对很小的角 $\theta$ 比较 $1 - \cos\theta$ 和弧长 $\theta$。

## 片段 3：问与答

在证明

$$
\lim_{\theta \to 0} \frac{1 - \cos\theta}{\theta} = 0
$$

的几何论证中，弧长 $\theta$ 和线段长 $1 - \cos\theta$ 之间的关系很难想象。Jerison 教授花了十分钟回答学生的问题，把论证讲清楚。

**$\theta$ 不是也趋于 0 吗？**

是的。每次求导数，我们都在除以一个趋于零的量。$\displaystyle\lim_{\theta \to 0} \frac{1 - \cos\theta}{\theta}$ 恰好就是 $\cos\theta$ 在零处的导数（的相反数）。这个比值是「零除以零」的形式，不足为奇。我们关心的是：当 $\theta$ 趋于零时，近似长度为 $\theta$ 的弧的那条直线，比长度为 $1 - \cos\theta$ 的「缝隙」长得多。

随着角 $\theta$ 减小，我们「放大」来看，就会发现「缝隙」的大小和「弓弦」的长度之比越来越小——缝隙缩小得比弓弦快。所以当角 $\theta$ 趋近 0 时，比值 $\dfrac{1 - \cos\theta}{\theta}$ 也趋近 0。

在 $\dfrac{\sin\theta}{\theta}$ 的例子里，我们比较的是两个差不多大、以大致相同的速度趋于零的量，所以它们的比趋于 1。

**Stata 中心在哪儿？**

Stata 中心是 MIT 的一栋楼，离这一讲所在的教室大约 100 米。

**$\dfrac{\cos\theta - 1}{\theta}$ 和 $\dfrac{1 - \cos\theta}{\theta}$ 一样吗？**

$\dfrac{\cos\theta - 1}{\theta}$ 是 $\dfrac{1 - \cos\theta}{\theta}$ 的相反数：

$$
-\frac{1 - \cos\theta}{\theta} = \frac{-1 + \cos\theta}{\theta} = \frac{\cos\theta - 1}{\theta}.
$$

**「弧长」是什么意思？**

这里说的弧，是单位圆上被角 $\theta$ 扫过的那一部分。弧长就是它的长度。

**为什么它的长度是 $\theta$？**

因为我们用弧度来量角 $\theta$，而圆的半径长为 1，所以 $\theta$ 扫过的弧长等于角 $\theta$。

这在讨论 $\dfrac{\sin\theta}{\theta}$ 时尤其重要。例如，如果用度来量 $\theta$，就得先算出弧长，才能把它和竖直距离 $\sin\theta$ 比较。只有用弧度量 $\theta$ 时，弧长才等于 $\theta$。

在这个计算中，量 $\theta$ 最好的方式是沿单位圆的长度，这正是弧度。可惜，要到这门课快结束时我们才会看到这件事的证明。

**为什么半径的长度等于 1？**

处理 $\cos x$ 这类三角函数时，考虑以点 $(0, 0)$ 为圆心、半径为 1 的圆非常有用，因为圆上角为 $\theta$ 的点 $(x, y)$ 的坐标是 $(\cos\theta, \sin\theta)$。

黑板上画的半径看起来不止一个单位长，是因为 $\theta$ 小得看不清时，我们把图「放大」了。

**我很难想象 $\dfrac{1 - \cos\theta}{\theta} \to 0$ 是怎么回事。**

觉得难的大概不止你一个。

首先，想象角 $\theta$ 变得越来越小。

当 $\theta$ 非常非常小时，不把图「放大」就看不清发生了什么。（事实上，如果让 $\theta$ 一直减小到 0，三角形就塌成一条线，$\dfrac{1 - \cos\theta}{\theta} = \dfrac00$。这就是为什么必须用极限。）

要估计 $\theta$ 缩小时 $\dfrac{1 - \cos\theta}{\theta}$ 的值，需要分别看分子 $(1 - \cos\theta)$ 和分母 $\theta$ 的几何意义，再比较它们。

分子是那条小「缝隙」的长度，分母是「弓弦」长度的一半。从图上看，$\theta$ 很小时缝隙比弓弦短得多。

随着 $\theta$ 缩小，我们进一步放大，圆弧这张「弓」越来越贴近弓弦，于是缝隙越来越小，而弓弦看起来长度不变。所以缝隙大小与弓弦长度之比越来越小，趋近于零。

缝隙的大小不仅趋于零，而且比弓弦的长度趋于零得更快。

（译注：「弓弦」指连接角 $-\theta$ 和 $\theta$ 两点的弦，长 $2\sin\theta \approx 2\theta$，所以 $\theta$ 约为它的一半。）

## 片段 4：sin x 的导数是 cos x 的几何证明

在这一讲开头，我们看了 $\sin x$ 的导数是 $\cos x$ 的代数证明。这个证明完全成立，但有点抽象——它没有用到正弦函数的定义。

而 $\displaystyle\lim_{\theta \to 0} \frac{\sin\theta}{\theta} = 1$ 的证明用到了角的正弦的单位圆定义。它还说明了 $\sin x$ 在 $x = 0$ 处的导数是 1：

$$
\left.\frac{d}{dx}\sin x\right|_{x = 0} = \lim_{\Delta x \to 0} \frac{\sin(0 + \Delta x) - \sin 0}{\Delta x} = \lim_{\Delta x \to 0} \frac{\sin \Delta x}{\Delta x} = 1.
$$

现在我们直接从正弦函数「直角三角形中 $\dfrac{|\text{对边}|}{|\text{斜边}|}$」的定义出发，证明 $\sin\theta$ 的导数是 $\cos\theta$。

> 图 1：以 $O$ 为圆心的单位圆上，点 $P$ 对应的角为 $\theta$，点 $Q$ 对应的角为 $\theta + \Delta\theta$。点 $P$ 的竖直位置是 $\sin\theta$。

从以 $O$ 为圆心的单位圆上一点 $P$ 和 $P$ 对应的角 $\theta$ 出发。如图 1 所示，$\sin\theta$ 是 $P$ 到 $x$ 轴的竖直距离。接着，给角 $\theta$ 加上一个小量 $\Delta\theta$；设 $Q$ 是单位圆上角为 $\theta + \Delta\theta$ 的点。$Q$ 的纵坐标是 $\sin(\theta + \Delta\theta)$。要求 $\sin\theta$ 关于 $\theta$ 的变化率，只要求 $y = \sin\theta$ 的变化率。

> 图 2：$\Delta\theta$ 很小时，线段 $PQ$ 约等于弧 $PQ$。从 $P$ 向上作竖直线，从 $Q$ 作水平线，两线交于 $R$，$\Delta y = |PR|$。求 $\dfrac{dy}{d\theta}$。

如图 2 所示，$\Delta y = |PR|$，线段 $PQ$ 是圆弧 $PQ$ 的直线近似。如果 $\Delta\theta$ 足够小，线段 $PQ$ 和弧 $PQ$ 实际上一样，所以 $|PQ| \approx \Delta\theta$。

我们要求的是 $\Delta y$。既然知道了斜边 $PQ$ 的长度，只要再知道 $\angle QPR$ 的大小，就能求出 $\Delta y = |PR|$。

因为 $\Delta\theta$ 很小，线段 $PQ$（几乎）与圆相切，所以 $\angle OPQ$（几乎）是直角。我们知道 $PR$ 是竖直的，知道 $\theta$ 是 $OP$ 与水平方向的夹角，把这些事实结合起来，就能证明 $\angle RPQ$ 与 $\theta$（几乎）相等。¹

弧长 $\Delta\theta$ 约等于斜边 $PQ$ 的长度，而 $\angle RPQ$ 约等于 $\theta$。由余弦函数的定义，$\cos\theta \approx \dfrac{|PR|}{\Delta\theta}$。而 $|PR|$ 就是 $Q$ 和 $P$ 的竖直距离，也就是 $\sin(\theta + \Delta\theta)$ 与 $\sin\theta$ 之差。换句话说，当 $\Delta\theta$ 非常小时，

$$
\cos\theta \approx \frac{\sin(\theta + \Delta\theta) - \sin\theta}{\Delta\theta}.
$$

当 $\Delta\theta$ 趋近 0 时，线段 $QP$ 越来越接近弧 $QP$，$\angle QPO$ 越来越接近直角，所以 $\dfrac{\sin(\theta + \Delta\theta) - \sin\theta}{\Delta\theta}$ 的值越来越接近 $\cos\theta$。我们得出

$$
\lim_{\Delta\theta \to 0} \frac{\sin(\theta + \Delta\theta) - \sin\theta}{\Delta\theta} = \cos\theta,
$$

因此 $\sin\theta$ 的导数是 $\cos\theta$。

（译注：原文这里把弧长 $\Delta\theta$ 约等于的斜边写成了 $|PR|$，应为 $|PQ|$，译文已更正。）

¹ Jerison 教授的做法是把角 $\theta$ 旋转、平移到与 $\angle RPQ$ 重合。另一种看法是：延长线段 $RP$，与过 $O$ 的水平线交于点 $S$，注意到 $\angle RPQ + \angle QPO + \angle OPS = \pi$，并且 $\theta + \angle PSO + \angle OPS = \pi$。因为 $\angle QPO \approx \angle PSO$（都约等于直角），所以 $\angle RPQ \approx \theta$。（如果 $\theta > \pi/2$，要用另一种类似的论证。）
