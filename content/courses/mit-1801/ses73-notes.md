# 配方

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：配方

关于三角代换，最后要讨论的是配方。当我们要积的二次式的平方根不像 $ax^2 + c$ 那样简单时，就需要配方。

**例**：$\displaystyle\int \frac{dx}{\sqrt{x^2 + 4x}}$。

被积函数含有二次式的平方根，但它不符合三角代换表里的任何一种形式。我们要做的是用代换把它改写成表里有的形式。

先设法把二次式写成

$$
(x + a)^2 + c
$$

的形式：

$$
x^2 + 4x = (x + a)^2 + c = x^2 + 2xa + a^2 + c.
$$

因为左边 $x$ 的系数必须等于右边的，所以 $2xa = 4x$，即 $a = 2$。类似地，得到 $a^2 + c = 0$，即 $c = -4$。所以

$$
x^2 + 4x = (x + 2)^2 - 4.
$$

用一个一次函数的平方消去「中间项」的这个过程叫作**配方**。把它代入积分，积分变成

$$
\int \frac{dx}{\sqrt{x^2 + 4x}} = \int \frac{dx}{\sqrt{(x + 2)^2 - 4}}.
$$

这更接近三角代换表里列出的形式了，再直接代换 $u = x + 2$ 就更近了：

$$
\int \frac{dx}{\sqrt{x^2 + 4x}} = \int \frac{du}{\sqrt{u^2 - 4}}.
$$

现在查表，作三角代换 $u = 2\sec\theta$，$du = 2\sec\theta\tan\theta\,d\theta$：

$$
\int \frac{dx}{\sqrt{x^2 + 4x}} = \int \frac{2\sec\theta\tan\theta\,d\theta}{\sqrt{4\sec^2\theta - 4}} = \int \frac{2\sec\theta\tan\theta\,d\theta}{2\sqrt{\tan^2\theta}} = \int \frac{\sec\theta\tan\theta\,d\theta}{\tan\theta} = \int \sec\theta\,d\theta = \ln(\sec\theta + \tan\theta) + c.
$$

积分做完了，但还需要倒回两次代换。容易看出 $\sec\theta = \dfrac u2$，而在计算积分的过程中我们算出了 $\sqrt{u^2 - 4} = 2\tan\theta$，所以 $\tan\theta = \dfrac{\sqrt{u^2 - 4}}{2}$。因此不必画三角形就能写出

$$
\int \frac{dx}{\sqrt{x^2 + 4x}} = \ln\left(\frac u2 + \frac{\sqrt{u^2 - 4}}{2}\right) + c.
$$

最后，把 $u$ 换成 $x + 2$，倒回第一次代换：

$$
\int \frac{dx}{\sqrt{x^2 + 4x}} = \ln\left(\frac{x + 2}{2} + \frac{\sqrt{(x + 2)^2 - 4}}{2}\right) + c = \ln\left(\frac{x + 2}{2} + \frac{\sqrt{x^2 + 4x}}{2}\right) + c.
$$
