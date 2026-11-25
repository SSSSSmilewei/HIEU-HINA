# sinⁿx cosᵐx 的积分：奇数次幂

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：复习三角恒等式

这一部分的主题是在积分中使用三角代换。我们先复习三角学的一些基本事实。

> 图 1：单位圆；角 $\theta$ 处的点是 $(\cos\theta, \sin\theta)$。

三角学建立在以 $(0, 0)$ 为圆心、半径为 1 的圆上。圆上角度为 $\theta$ 的点（见图 1）的坐标是 $(\cos\theta, \sin\theta)$。因为圆的半径是 1，勾股定理立刻告诉我们 $\sin^2\theta + \cos^2\theta = 1$。（记住 $\sin^2\theta$ 表示 $(\sin\theta)^2$。）你可能还记得一些二倍角公式：

$$
\begin{aligned}
\sin^2\theta + \cos^2\theta &= 1, \\
\cos(2\theta) &= \cos^2\theta - \sin^2\theta, \\
\sin(2\theta) &= 2\sin\theta\cos\theta.
\end{aligned}
$$

从 $\cos(2\theta)$ 的二倍角公式可以推出半角公式：

$$
\cos(2\theta) = \cos^2\theta - \sin^2\theta = \cos^2\theta - (1 - \cos^2\theta) = 2\cos^2\theta - 1 \;\Longrightarrow\; \cos^2\theta = \frac{1 + \cos(2\theta)}{2}.
$$

这个公式让我们能把 $\cos^2\theta$ 这样的幂改写成次数更低的项。类似的计算表明

$$
\sin^2\theta = \frac{1 - \cos(2\theta)}{2}.
$$

## 片段 2：∫sinⁿx cosᵐx dx，m = 1

你已经知道一些关于三角函数积分的事；把关于三角函数导数的任何结论反过来，就得到关于原函数的结论：

$$
d\sin x = \cos x\,dx \;\Longrightarrow\; \int \cos x\,dx = \sin x + c,
$$

$$
d\cos x = -\sin x\,dx \;\Longrightarrow\; \int \sin x\,dx = -\cos x + c.
$$

我们的计划是用这两个积分公式和几个三角恒等式，推出涉及三角函数的更复杂的公式。

第一个主题是形如

$$
\int \sin^n x\cos^m x\,dx
$$

的积分，其中 $m$、$n$ 是非负整数。这样的积分会出现在傅里叶级数等地方。

这里要考虑两种情形。容易的情形是至少有一个指数是奇数。

**例**：$m = 1$。

计算 $\displaystyle\int \sin^n(x)\cos(x)\,dx$ 的诀窍是作代换 $u = \sin x$，于是 $du = \cos x\,dx$：

$$
\int \sin^n(x)\cos(x)\,dx = \int u^n\,du = \frac{u^{n+1}}{n + 1} + c = \frac{\sin^{n+1}x}{n + 1} + c.
$$

虽然答案 $\dfrac{u^{n+1}}{n + 1} + c$ 看起来很漂亮，但最后需要把代换倒回去，把 $u$ 换成 $\sin x$，因为你可能知道 $u$ 是什么，你的阅卷人或雇主却不知道。

这道题之所以容易，是因为 $\cos x$ 是 $\sin x$ 的导数。

## 片段 3：例：∫sin³x cos²x dx

有一个指数是奇数，所以这是容易的情形，不过没有上一个例子那么容易。我们用三角恒等式 $\sin^2x + \cos^2x = 1$，从带奇数指数的那一项里去掉最大的偶数次幂，把这个积分变成奇数指数为 1 的积分。

这里奇数指数在 $\sin x$ 上，所以用

$$
\sin^2x = 1 - \cos^2x.
$$

$$
\int \sin^3x\cos^2x\,dx = \int (\sin^2x \cdot \sin x)\cos^2x\,dx = \int (1 - \cos^2x) \cdot \sin x\cos^2x\,dx = \int (\cos^2x - \cos^4x)\sin x\,dx.
$$

这和上一个例子非常相似。我们用代换

$$
u = \cos x, \qquad du = -\sin x\,dx,
$$

得到

$$
\int \sin^3x\cos^2x\,dx = \int (u^2 - u^4) \cdot (-du) = -\frac{u^3}{3} + \frac{u^5}{5} + c = -\frac{\cos^3x}{3} + \frac{\cos^5x}{5} + c.
$$

（译注：原文这一行误印成 $(u^2 - u^4x)$ 和 $\dfrac{u^6}{5}$，最后一行的结果是对的，译文已更正。）

这时最好对答案求导，再用三角恒等式验证结果等于原来的被积函数，以此检验你的计算。

## 片段 4：例：∫sin³x dx

积分 $\displaystyle\int \sin^3x\,dx$ 具有 $\displaystyle\int \sin^nx\cos^mx\,dx$ 的形式，一个指数是奇数，另一个指数是零，所以属于容易的情形。我们再次用三角恒等式 $\sin^2x + \cos^2x = 1$，从立方里去掉尽可能高的 $\sin x$ 的幂：

$$
\int \sin^3x\,dx = \int (1 - \cos^2x)\sin x\,dx.
$$

代入 $u = \cos x$、$du = -\sin x\,dx$，得到

$$
\int \sin^3x\,dx = \int (1 - u^2)(-du) = -u + \frac{u^3}{3} + c = -\cos x + \frac{\cos^3x}{3} + c.
$$

一般地，只要形如 $\displaystyle\int \sin^nx\cos^mx\,dx$ 的积分里有一个奇数次幂，就可以用三角恒等式 $\sin^2x + \cos^2x = 1$ 加一次代换把它积出来。
