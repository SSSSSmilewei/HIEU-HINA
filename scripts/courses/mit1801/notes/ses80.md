# 参数曲线

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：参数曲线

我们继续在多维空间里工作，转到参数方程；特别要讨论参数曲线。这又是一个帮我们为多元微积分做准备的主题；它是向多元思维过渡的开始。

我们要考虑这样描述的曲线：$x$ 是 $t$ 的函数，$y$ 是 $t$ 的函数，

$$
x = x(t), \qquad y = y(t).
$$

变量 $t$ 叫作**参数**。理解参数曲线最容易的方式，是把 $t$ 看作时间，把位置 $(x(t), y(t))$ 看作描述平面上的一条运动轨迹。

点 $(x(0), y(0))$ 描述时刻 $t = 0$ 的位置。点 $(x(1), y(1))$ 描述稍后时刻 $t = 1$ 的位置。画轨迹时，最好在曲线上画箭头，表示随着 $t$ 增大 $(x(t), y(t))$ 往哪个方向走。

第一个例子是弄清楚

$$
x = a\cos t, \qquad y = a\sin t
$$

描述的是什么样的曲线。为此，我们要找出用直角坐标描述这条曲线的方程。最理想的是很快意识到

$$
x^2 + y^2 = (x(t))^2 + (y(t))^2 = a^2\cos^2t + a^2\sin^2t = a^2.
$$

这条曲线是半径为 $a$ 的圆。

还要留意的一件事是我们在这个圆上往哪个方向走。这条曲线不只有形状；还有什么时刻在什么位置，就像行星的轨道一样。我们画几个点来弄清这一点：

- $t = 0$ 时，$(x, y) = (a\cos 0, a\sin 0) = (a, 0)$。
- $t = \frac\pi2$ 时，$(x, y) = \left(a\cos\frac\pi2, a\sin\frac\pi2\right) = (0, a)$。

我们推出，这条轨迹绕以原点为圆心、半径为 $a$ 的圆逆时针运动。（见图 1。）

下次我们会学习跟踪弧长，并理解 $(x(t), y(t))$ 变化得有多快。

> 图 1：参数化的圆：$t = 0$ 时在 $(a, 0)$，$t = \frac\pi2$ 时在 $(0, a)$，逆时针运动。

## 片段 2：参数曲线的弧长

我们讨论过圆的下面这个参数表示：

$$
x = a\cos t, \qquad y = a\sin t.
$$

我们注意到 $x^2 + y^2 = a^2$，并且随着 $t$ 增大，点 $(x(t), y(t))$ 沿逆时针方向绕圆运动。

> 图 1：参数化 $(a\cos t, a\sin t)$ 的轨迹是逆时针的。

现在我们学习怎样计算这条轨迹走过的路径的弧长；结果应该和以前求圆弧弧长的结果一致。

回忆基本关系：

$$
ds^2 = dx^2 + dy^2 \qquad \text{或} \qquad ds = \sqrt{dx^2 + dy^2}.
$$

我们这样把参数 $t$ 放进这个公式：

$$
ds = \sqrt{\left(\frac{dx}{dt}\right)^2 + \left(\frac{dy}{dt}\right)^2}\,dt.
$$

所以，要计算无穷小的弧长 $ds$，先计算 $\dfrac{dx}{dt}$ 和 $\dfrac{dy}{dt}$：

$$
\frac{dx}{dt} = -a\sin t, \qquad \frac{dy}{dt} = a\cos t.
$$

因此

$$
ds = \sqrt{(-a\sin t)^2 + (a\cos t)^2}\,dt = \sqrt{a^2(\sin^2t + \cos^2t)}\,dt = \sqrt{a^2 \cdot 1}\,dt = a\,dt.
$$

由此得出，点绕圆运动的速率是 $\dfrac{ds}{dt} = a$。因为速率是常数，我们说这个点在做**匀速**运动。

像

$$
x = a\cos kt, \qquad y = a\sin kt
$$

这样的参数化在数学和物理课上很常见。这同样是圆的参数化，但这次点以匀速 $ak$ 运动。（我们假设 $a$ 和 $k$ 都是正的。）

## 片段 3：关于记号的说明

我们用 $ds^2$ 这样的记号有一段时间了；它是什么意思？对这些无穷小量，哪些运算是合法的，哪些不是？

我们弧长公式的基础是

$$
\Delta s^2 \approx \Delta x^2 + \Delta y^2.
$$

现在来看参数弧长的公式

$$
ds = \sqrt{\left(\frac{dx}{dt}\right)^2 + \left(\frac{dy}{dt}\right)^2}\,dt
$$

怎样从同一个基础更严格地推导出来。

因为 $\Delta t$ 不完全等于 0，可以先把公式两边除以 $\Delta t^2$：

$$
\Delta s^2 \approx \Delta x^2 + \Delta y^2 \;\Longrightarrow\; \left(\frac{\Delta s}{\Delta t}\right)^2 \approx \left(\frac{\Delta x}{\Delta t}\right)^2 + \left(\frac{\Delta y}{\Delta t}\right)^2.
$$

最后，两边取 $\Delta t$ 趋于零的极限，得出

$$
\left(\frac{ds}{dt}\right)^2 = \left(\frac{dx}{dt}\right)^2 + \left(\frac{dy}{dt}\right)^2.
$$

（这正是导数的意义所在。）

（译注：原文这里把左边印成了 $\left(\frac{ds}{dx}\right)^2$，并写成「$t$ 趋于零」，应为 $\left(\frac{ds}{dt}\right)^2$ 和「$\Delta t$ 趋于零」，译文已更正。）

**警告**：千万别把 $\left(\dfrac{dx}{dt}\right)^2 = (x'(t))^2$ 写成 $\dfrac{dx^2}{dt^2}$。如果这样写，它可能被误解为 $\dfrac{d^2x}{dt^2} = x''(t)$。

另一件不幸的事是，我们用 $\sin^2x$ 表示 $(\sin x)^2$，也许是因为排字工人偷懒。数学记号里有不一致的地方，我们只能按现有的约定来用。
