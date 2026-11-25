# 隐函数求导与反函数

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：反函数的导数

隐函数求导的一个非常重要的应用，是求反函数的导数。

先看一个简单的例子。可以把方程 $y = \sqrt{x}$（$x > 0$）两边平方，化简成 $y^2 = x$。这里可以用函数记号说 $y = f(x) = \sqrt{x}$，$x = g(y) = y^2$。

一般地，我们找满足 $g(f(x)) = x$ 的函数 $y = f(x)$ 和 $g(y) = x$。如果是这样，就说 $g$ 是 $f$ 的**反函数**（记作 $g = f^{-1}$），$f$ 也是 $g$ 的反函数（记作 $f = g^{-1}$）。

函数和它的反函数的图像有什么关系？先画出 $f(x) = \sqrt{x}$ 的图像。接下来想画 $f$ 的反函数 $g(y) = y^2 = x$ 的图像——但这正是刚才画的那个图像。为了比较函数 $f$ 和 $f^{-1}$ 的图像，必须在 $f^{-1}$ 的方程中把 $x$ 和 $y$ 交换。所以，为了把 $f(x) = \sqrt{x}$ 和它的反函数比较，我们把 $y$ 换成 $x$，画出 $g(x) = x^2$ 的图像。

> 图 1：$f(x) = \sqrt{x}$ 和 $f^{-1}(x) = x^2$（$x \ge 0$）的图像，以及直线 $y = x$。$f^{-1}$ 的图像是 $f$ 的图像关于直线 $y = x$ 的反射。

一般地，如果有函数 $f$ 的图像，把图像上所有点的横坐标和纵坐标交换，就得到 $f^{-1}$ 的图像。换句话说，$f^{-1}$ 的图像是 $f$ 的图像关于直线 $y = x$ 的反射。

这提示我们：如果 $\dfrac{dy}{dx}$ 是 $f$ 的图像的切线斜率，那么

$$
\frac{dx}{dy} = \frac{1}{\dfrac{dy}{dx}}
$$

就是 $f^{-1}$ 的图像的切线斜率。我们可以用导数的定义和反函数的性质把这个提示变成证明，但用隐函数求导证明更容易。

我们用隐函数求导来求反函数的导数：

$$
y = f(x) \;\Longrightarrow\; f^{-1}(y) = x \;\Longrightarrow\; \frac{d}{dx}\bigl(f^{-1}(y)\bigr) = \frac{d}{dx}(x) = 1.
$$

由链式法则，

$$
\frac{d}{dy}\bigl(f^{-1}(y)\bigr)\frac{dy}{dx} = 1,
$$

所以

$$
\frac{d}{dy}\bigl(f^{-1}(y)\bigr) = \frac{1}{\dfrac{dy}{dx}}.
$$

只要知道原函数 $y = f(x)$ 的导数，隐函数求导就能让我们求出反函数 $x = f^{-1}(y)$ 的导数。

## 片段 2：arctan x 的导数

我们用反函数求导公式，求正切函数的反函数 $y = \tan^{-1} x = \arctan x$ 的导数。

两边取正切来化简方程：

$$
y = \tan^{-1} x \;\Longrightarrow\; \tan y = \tan(\tan^{-1} x) \;\Longrightarrow\; \tan y = x.
$$

为了心里有数，先画出正切函数的图像（图 1）。（作为反函数的来源，我们只取）$-\dfrac{\pi}{2} < x < \dfrac{\pi}{2}$ 上的 $\tan x$，它的图像从负无穷延伸到正无穷。

把 $\tan x$ 的图像关于直线 $y = x$ 反射，就得到 $y = \arctan x$ 的图像（图 2）。注意函数 $\arctan x$ 对从负无穷到正无穷的所有 $x$ 都有定义，并且 $\displaystyle\lim_{x \to \infty} \tan^{-1} x = \frac{\pi}{2}$。

> 图 1：正切函数在 $-\dfrac{\pi}{2} < x < \dfrac{\pi}{2}$ 上的图像，两端有竖直渐近线。
>
> 图 2：$\tan^{-1} x$ 的图像，左右两端分别趋近水平渐近线 $y = -\dfrac{\pi}{2}$ 和 $y = \dfrac{\pi}{2}$。

你可能知道

$$
\frac{d}{dy}\tan y = \frac{d}{dy}\frac{\sin y}{\cos y} = \cdots = \frac{1}{\cos^2 y} = \sec^2 y.
$$

（如果以前没见过，用商法则验证一下是很好的练习！）

现在可以用隐函数求导，对原方程两边求导：

$$
\begin{aligned}
\tan y &= x \\
\frac{d}{dx}(\tan y) &= \frac{d}{dx}x \\
\frac{d}{dy}(\tan y)\frac{dy}{dx} &= 1 && (\text{链式法则}) \\
\left(\frac{1}{\cos^2 y}\right)\frac{dy}{dx} &= 1 \\
\frac{dy}{dx} &= \cos^2 y.
\end{aligned}
$$

也就是 $y' = \cos^2 y$。可惜我们想要的是关于 $x$ 的导数，而不是关于 $y$ 的。现在必须代入 $y$ 原来的式子 $y = \tan^{-1} x$，得到 $y' = \cos^2(\arctan x)$。这是正确答案，但还能大大化简。我们用一些几何来化简它。

> 图 3：一个直角三角形，一个锐角为 $y$，它的对边长 $x$，邻边长 1，斜边长 $(1 + x^2)^{1/2}$。

在这个三角形中，$\tan y = x$，所以 $y = \arctan x$。勾股定理告诉我们斜边的长度：

$$
h = \sqrt{1 + x^2},
$$

现在可以算出

$$
\cos y = \frac{1}{\sqrt{1 + x^2}}.
$$

由此得到

$$
\cos^2 y = \left(\frac{1}{\sqrt{1 + x^2}}\right)^2 = \frac{1}{1 + x^2},
$$

所以

$$
\frac{dy}{dx} = \frac{1}{1 + x^2}.
$$

换句话说，

$$
\frac{d}{dx}\arctan x = \frac{1}{1 + x^2}.
$$

## 片段 3：arcsin x 的导数

最后一个例子，我们很快地求出 $y = \sin^{-1} x = \arcsin x$ 的导数。

和往常一样，两边取正弦来化简方程：

$$
y = \sin^{-1} x \;\Longrightarrow\; \sin y = x.
$$

接下来对方程两边求导，解出 $y' = \dfrac{dy}{dx}$：

$$
\sin y = x \;\Longrightarrow\; (\cos y) \cdot y' = 1 \;\Longrightarrow\; y' = \frac{1}{\cos y}.
$$

我们想用 $x = \sin y$ 来改写它。幸运的是，有一个简单的三角恒等式把 $\cos y$ 和 $\sin y$ 联系起来。从中解出 $\cos y$ 再「代进去」：

$$
\cos^2 y + \sin^2 y = 1 \;\Longrightarrow\; \cos^2 y = 1 - \sin^2 y \;\Longrightarrow\; \cos y = \sqrt{1 - \sin^2 y}
$$

（在 $y = \sin^{-1} x$ 的值域上 $\cos y > 0$）。代入 $y' = \dfrac{d}{dx}\sin^{-1} x$ 的式子，得到

$$
y' = \frac{1}{\cos y} = \frac{1}{\sqrt{1 - \sin^2 y}} = \frac{1}{\sqrt{1 - x^2}}.
$$

注意，解 $\cos y$ 时我们在正、负平方根之间做了选择。我们选了正的平方根，因为通常把 $\sin^{-1} x$ 的输出定义在 $-\pi/2$ 到 $\pi/2$ 之间，而余弦函数在这个区间上总是正的。

处理反函数时，我们经常面临这样的选择；拿不准的时候就画个图，确认自己的选择在问题的背景下说得通。
