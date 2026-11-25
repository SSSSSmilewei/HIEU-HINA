# 例题：代换练习

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

用三角代换求函数 $f(x) = x\sqrt{x^2 - 9}$ 的积分。再用代换 $u = x^2$ 积分来检验你的结果。

<details>
<summary>解答</summary>

查三角代换小结，可以看到积含有 $\sqrt{x^2 - 3^2}$ 的表达式时，推荐的方法是代换 $x = 3\sec\theta$，这时 $dx = 3\sec\theta\tan\theta\,d\theta$，并且

$$
\sqrt{x^2 - 9} = \sqrt{(3\sec\theta)^2 - 9} = \sqrt{9\sec^2\theta - 9} = 3\sqrt{\sec^2\theta - 1} = 3\tan\theta.
$$

先做这个代换并化简：

$$
\int x\sqrt{x^2 - 9}\,dx = \int (3\sec\theta)(3\tan\theta)\,3\sec\theta\tan\theta\,d\theta = 27\int \sec^2\theta\tan^2\theta\,d\theta.
$$

这时代换 $u = \tan\theta$，于是 $du = \sec^2\theta\,d\theta$：

$$
\int x\sqrt{x^2 - 9}\,dx = 27\int \sec^2\theta\tan^2\theta\,d\theta = 27\int u^2\,du = 27\frac{u^3}{3} + c = 9\tan^3\theta + c.
$$

我们得到了一个用 $\tan\theta$ 表示的答案，而想要的是用 $x$ 表示的答案。我们知道 $x = 3\sec\theta$，即 $\sec\theta = \frac x3$。记住这一点（或者 $\cos\theta = \frac3x$），画一个直角三角形，其中一个角等于 $\theta$，$\theta$ 的邻边长 3，斜边长 $x$。由勾股定理，$\theta$ 的对边长 $\sqrt{x^2 - 9}$，并且

$$
\tan\theta = \frac{\sqrt{x^2 - 9}}{3}.
$$

现在可以完成计算：

$$
\int x\sqrt{x^2 - 9}\,dx = 9\tan^3\theta + c = 9\left(\frac{\sqrt{x^2 - 9}}{3}\right)^3 + c = \frac13(x^2 - 9)^{3/2} + c.
$$

上面的计算是对的，不过用代换 $u = x^2 - 9$ 算这个积分更快、更可靠。这样做，有 $du = 2x\,dx$，即 $x\,dx = \frac12du$：

$$
\int x\sqrt{x^2 - 9}\,dx = \int \sqrt u\,\frac12\,du = \frac12 \cdot \frac23u^{3/2} + c = \frac13u^{3/2} + c = \frac13(x^2 - 9)^{3/2} + c.
$$

</details>
