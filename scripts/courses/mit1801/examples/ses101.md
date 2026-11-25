# 例题：双曲正弦

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

在这道题里，我们研究**双曲正弦**函数

$$
\sinh x = \frac{e^x - e^{-x}}{2},
$$

顺带复习课程各部分的技巧。

a) 求出 $y = \sinh x$ 的临界点、拐点、对称性，以及 $x \to \infty$ 和 $-\infty$ 时的极限，画出它的图像。

b) 给 $\sinh^{-1}x$（反双曲正弦）一个合适的定义，画出它的图像，标出定义域。

c) 求 $\dfrac{d}{dx}\sinh^{-1}x$。

d) 用你的结果求 $\displaystyle\int \frac{dx}{\sqrt{a^2 + x^2}}$。

<details>
<summary>解答</summary>

这道题很好地复习了课程中的各种内容，也解释了为什么电子积分工具给出的答案常常含有双曲正弦函数。

**a)** 我们需要检验对称性、求导、求极限。这些可以按任意顺序做；这里按题目列出的顺序来。

要求 $\sinh x$ 的临界点，就求它的一阶导数并令它等于零：

$$
\frac{d}{dx}\sinh x = \frac{d}{dx}\frac12(e^x - e^{-x}) = \frac12(e^x + e^{-x}) = \cosh x.
$$

因为 $e^x$ 总是正的，$\sinh x$ 的导数永远不为 0，所以 $\sinh x$ 没有临界点。

要求拐点，令二阶导数等于 0：

$$
\frac{d^2}{dx^2}\sinh x = \frac{d}{dx}\frac12(e^x + e^{-x}) = \frac12(e^x - e^{-x}) = \sinh x.
$$

当 $e^x = e^{-x}$，即 $x = 0$ 时，$\sinh x$ 的二阶导数等于 0。为了确认这是拐点，检验这一点左右两侧二阶导数的值：

$$
y''(1) = \sinh(1) = \frac12(e^1 - e^{-1}) = \frac12\left(e - \frac1e\right) > 0,
$$

$$
y''(-1) = \sinh(-1) = \frac12(e^{-1} - e^1) = \frac12\left(\frac1e - e\right) < 0.
$$

（译注：原文这里写成「$> 1$」和「$y'(-1) \ldots < 1$」；判断拐点要看二阶导数的符号，应为 $y''(1) > 0$、$y''(-1) < 0$，译文已更正。）

我们得出：$y = \sinh x$ 的图像没有临界点，在 $x = 0$ 处有一个拐点。

要求函数的对称性，就看输入 $-x$ 时函数的输出：

$$
\sinh(-x) = \frac12(e^{-x} - e^x) = -\frac12(e^x - e^{-x}) = -\sinh x.
$$

如果 $f(-x) = -f(x)$，就说 $f(x)$ 是奇函数；$y = \sinh x$ 的图像关于原点对称。

回想 $\sinh x = \frac12(e^x - e^{-x})$。$x$ 趋于正无穷时，$e^x$ 的值趋于正无穷，$e^{-x}$ 的值趋于零：

$$
\lim_{x \to \infty} \sinh x = \infty.
$$

类似地，$x$ 趋于 $-\infty$ 时，$e^{-x}$ 占主导，$e^x$ 消失：

$$
\lim_{x \to -\infty} \sinh x = -\infty.
$$

现在我们对图像有了相当多的信息，包括 $\sinh(1)$ 和 $\sinh(-1)$ 的值。此外，容易确定 $\sinh(0) = 0$。图像大致是这样的：

> 图：$y = \sinh x$ 的图像：过原点、一直递增的曲线，在原点处由下凹变为上凹，左端趋于 $-\infty$，右端趋于 $+\infty$，形状像一个被拉长的「S」。

**b)** 虽然可以求出 $\sinh x$ 的反函数的代数表达式（$\sinh^{-1}x = \ln\left(x + \sqrt{x^2 + 1}\right)$），但这道题不需要。

从 $\sinh x$ 的图像可以看出这个函数是可逆的（它严格递增），所以可以用反函数的定义：

$$
y = \sinh^{-1}x \text{ 是使 } x = \sinh y \text{ 成立的唯一的 } y \text{ 值}.
$$

$y = \sinh^{-1}x$ 的图像是 $y = \sinh x$ 的图像关于直线 $y = x$ 的反射。

> 图：$y = \sinh^{-1}x$ 的图像：过原点、一直递增，但增长越来越慢的曲线。

$\sinh^{-1}x$ 的定义域是全体实数。

**c)** 要回答这一问，必须复习学期第一单元的内容！我们学过怎样用隐函数求导求反函数的导数 $\dfrac{dy}{dx}$：

$$
y = \sinh^{-1}x \;\Longrightarrow\; \sinh y = x \;\Longrightarrow\; \frac{d}{dx}\sinh y = \frac{d}{dx}x \;\Longrightarrow\; (\cosh y)\frac{dy}{dx} = 1 \;\Longrightarrow\; \frac{dy}{dx} = \frac{1}{\cosh y}.
$$

这时我们想用 $x$ 改写 $\cosh y$。处理三角函数时，可以用直角三角形和勾股定理做这件事；这里必须依靠双曲函数恒等式。（如果期末考试需要这些恒等式，会给出。）用下面这个恒等式，可以把含 $\cosh y$ 的表达式化成含 $\sinh y = x$ 的表达式：

$$
\cosh^2t - \sinh^2t = 1 \;\Longrightarrow\; \cosh^2t = 1 + \sinh^2t \;\Longrightarrow\; \cosh t = \sqrt{1 + \sinh^2t} \quad (\cosh t > 0).
$$

于是

$$
\frac{dy}{dx} = \frac{1}{\cosh y} = \frac{1}{\sqrt{1 + \sinh^2y}} = \frac{1}{\sqrt{1 + x^2}}.
$$

注意到这个式子应该描述 $\sinh^{-1}x$ 的图像的切线斜率，就能大致判断我们的计算对不对。

**d)** 可以把上一问的结果重新解读为

$$
\int \frac{dx}{\sqrt{1 + x^2}} = \sinh^{-1}x + c.
$$

处理形如 $\dfrac{dx}{\sqrt{a^2 + x^2}}$ 的被积函数时，这给了我们三角代换 $x = a\tan\theta$ 以外的另一种选择：

$$
\int \frac{dx}{\sqrt{a^2 + x^2}} = \int \frac{a\,du}{\sqrt{a^2 + (au)^2}} \quad (\text{代换 } x = au) = \int \frac{du}{\sqrt{1 + u^2}} = \sinh^{-1}u + c = \sinh^{-1}\left(\frac xa\right) + c.
$$

注意这比用代换 $x = a\tan\theta$ 的计算简单得多。

</details>
