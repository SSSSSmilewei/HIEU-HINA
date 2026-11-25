# 例题：扁椭球的体积

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

把曲线 $x^2 + 4y^2 = 4$ 和 $x = 0$ 围成的区域（的任一半）绕 $y$ 轴旋转，得到的旋转体是**扁椭球**（oblate spheroid）的一个例子。求它的体积。

<details>
<summary>解答</summary>

可以用柱壳法或圆盘法计算体积。用 $y$ 表示 $x$ 的方程比用 $x$ 表示 $y$ 的方程稍简单，所以我们对 $y$ 积分，用圆盘法。

首先，解出 $x$：

$$
x^2 + 4y^2 = 4 \;\Longrightarrow\; x^2 = 4 - 4y^2 \;\Longrightarrow\; x = \pm\sqrt{4 - 4y^2} = \pm2\sqrt{1 - y^2}.
$$

题目说可以用区域的任一半，所以选 $x = 2\sqrt{1 - y^2}$。

接着确定积分上下限。如果熟悉椭圆，就知道 $(0, 1)$ 和 $(0, -1)$ 是椭圆的最高点和最低点。如果不熟悉，至少可以看出 $|y| > 1$ 时 $x$ 的表达式没有定义。所以积分上下限是 $y = -1$ 和 $y = 1$。

我们的积分把半径为 $2\sqrt{1 - y^2}$、高为 $dy$ 的圆盘的体积加起来：

$$
\int_{-1}^1 \pi\left(2\sqrt{1 - y^2}\right)^2\,dy = 4\pi\int_{-1}^1 (1 - y^2)\,dy = 4\pi\left[y - \frac{y^3}{3}\right]_{-1}^1 = 4\pi\left[\left(1 - \frac13\right) - \left(-1 + \frac13\right)\right] = \frac{16\pi}{3}.
$$

这是包住这个扁椭球的圆柱（半径 2、高 2，体积 $8\pi$）体积的三分之二，所以大概是对的。

</details>
