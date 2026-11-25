# 例题：用变量代换求积分

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

用变量代换计算下列积分。变量和积分上下限都要换。

a) $\displaystyle\int_0^4 \sqrt{3x + 4}\,dx$　　b) $\displaystyle\int_1^3 \frac{x}{x^2 + 1}\,dx$　　c) $\displaystyle\int_0^{\pi/2} \sin^5 x\cos x\,dx$

<details>
<summary>解答</summary>

**a)** $\displaystyle\int_0^4 \sqrt{3x + 4}\,dx$ 的被积函数是一个（相对复杂的）平方根函数，里面是一个简单的式子。作为复杂函数输入的式子，是换元的好候选；令 $u = 3x + 4$，那么 $du = 3\,dx$，$dx = \frac13du$。$x = 0$ 时 $u = 4$，$x = 4$ 时 $u = 16$。

现在已经知道足够多，可以用 $u$ 改写被积函数和积分上下限，然后完成积分：

$$
\int_{x=0}^{x=4} \sqrt{3x + 4}\,dx = \int_{u=4}^{u=16} \sqrt u\,\frac13du = \frac13\left[\frac23u^{3/2}\right]_4^{16} = \frac29\left(16^{3/2} - 4^{3/2}\right) = \frac29(64 - 8) = \frac{112}{9} \approx 12.
$$

从函数的粗略图像可以看出，积分的值一定在 8 和 16 之间，所以这是个合理的答案。

**b)** 这个例子里最复杂的运算是除以 $x^2 + 1$。试试换元 $u = x^2 + 1$：

$$
u = x^2 + 1, \qquad du = 2x\,dx, \qquad x\,dx = \frac12du.
$$

$x = 1$ 时 $u = 2$；$x = 3$ 时 $u = 10$。

$$
\int_1^3 \frac{x}{x^2 + 1}\,dx = \int_{u=2}^{u=10} \frac1u \cdot \frac12du = \frac12\ln u\Big|_2^{10} = \frac12(\ln 10 - \ln 2) = \frac12\ln\left(\frac{10}{2}\right) = \ln\sqrt5 \approx 0.80.
$$

这个答案不容易检验，但用电子作图工具可以确认它大致正确。

**c)** 虽然正弦和余弦函数可能是这道题里最复杂的部分，但换元 $u = x$ 对积分这个式子没有帮助。我们把注意力转到次复杂的运算——乘方上。

令 $u = \sin x$。那么 $du = \cos x\,dx$；$x = 0$ 时 $u = 0$，$x = \pi/2$ 时 $u = 1$。

$$
\int_0^{\pi/2} \sin^5 x\cos x\,dx = \int_{x=0}^{x=\pi/2} (\sin x)^5 \cdot \cos x\,dx = \int_0^1 u^5\,du = \frac16u^6\Big|_0^1 = \frac16 \cdot 1^6 - \frac16 \cdot 0^6 = \frac16.
$$

同样，不画图很难检验这个答案。考虑到在这个区间上 $0 \le \sin x \le 1$，它看起来是合理的。

</details>
