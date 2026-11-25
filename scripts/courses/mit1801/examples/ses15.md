# 例题：平方根函数的导数

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

a) 用隐函数求导，求 $f(x) = x^2$（$x > 0$）的反函数的导数。

b) 显式求出反函数再求导，以此检查你的结果。

<details>
<summary>解答</summary>

如果这道题做不出来，复习一下 Jerison 教授求反正切函数导数的例子可能有帮助。

**a)** 我们要求 $y' = \dfrac{dy}{dx}$，其中 $y = f^{-1}(x)$，$f(x) = x^2$。我们的目的是练习隐函数求导，所以不马上求出 $f^{-1}(x)$，而是按讲座中的步骤来。

从 $y = f^{-1}(x)$ 出发，两边作用函数 $f$：

$$
y = f^{-1}(x) \;\Longrightarrow\; f(y) = f(f^{-1}(x)) \;\Longrightarrow\; y^2 = x.
$$

接下来对方程两边求导，再解出 $y'$：

$$
\frac{d}{dx}y^2 = \frac{d}{dx}x \;\Longrightarrow\; 2yy' = 1 \;\Longrightarrow\; y' = \frac{1}{2y}.
$$

这给出了用 $y$ 表示 $y'$ 的式子。回到方程 $y^2 = x$ 把它改写成关于 $x$ 的式子。记住 $x > 0$，得到 $y = \sqrt{x}$。代入 $y'$ 的式子，得到

$$
y' = \frac{1}{2y} = \frac{1}{2\sqrt{x}}.
$$

我们得出：如果 $f(x) = x^2$，那么 $f^{-1}$ 的导数是 $\dfrac{1}{2\sqrt{x}}$。

**b)** 如果 $f(x) = x^2$，那么 $x > 0$ 时 $f^{-1}(x) = \sqrt{x}$。

$$
\frac{d}{dx}\sqrt{x} = \frac{d}{dx}x^{1/2} = \frac12x^{-1/2} = \frac{1}{2\sqrt{x}}.
$$

</details>
