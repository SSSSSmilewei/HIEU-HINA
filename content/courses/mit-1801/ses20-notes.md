# 双曲函数

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：双曲正弦和双曲余弦的导数

**双曲正弦**（英文读作「sinsh」）：

$$
\sinh x = \frac{e^x - e^{-x}}{2}.
$$

**双曲余弦**（英文读作「cosh」）：

$$
\cosh x = \frac{e^x + e^{-x}}{2}.
$$

$$
\frac{d}{dx}\sinh x = \frac{d}{dx}\left(\frac{e^x - e^{-x}}{2}\right) = \frac{e^x - (-e^{-x})}{2} = \cosh x.
$$

类似地，

$$
\frac{d}{dx}\cosh x = \sinh x.
$$

（注意这和 $\dfrac{d}{dx}\cos x$ 不同：没有负号。）

重要的恒等式：

$$
\cosh^2 x - \sinh^2 x = 1.
$$

证明：

$$
\cosh^2 x - \sinh^2 x = \left(\frac{e^x + e^{-x}}{2}\right)^2 - \left(\frac{e^x - e^{-x}}{2}\right)^2 = \frac14\left(e^{2x} + 2 + e^{-2x}\right) - \frac14\left(e^{2x} - 2 + e^{-2x}\right) = \frac14(2 + 2) = 1.
$$

**为什么这些函数叫「双曲」函数？**

令 $u = \cosh x$、$v = \sinh x$，那么

$$
u^2 - v^2 = 1,
$$

这是一条**双曲线**的方程。

普通的三角函数是「圆」函数。如果 $u = \cos x$、$v = \sin x$，那么

$$
u^2 + v^2 = 1,
$$

这是一个**圆**的方程。
