# 例题：∫cos³(2x) dx

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

计算 $\displaystyle\int \cos^3(2x)\,dx$。

<details>
<summary>解答</summary>

可以对这道题用二倍角甚至三倍角公式，但其实用 Miller 教授在讲座中介绍的方法算这个积分相当简单。先作代换 $u = 2x$（于是 $\frac12du = dx$）。题目就变成一个带奇数指数的三角函数的直接积分，用恒等式 $\cos^2(u) = 1 - \sin^2(u)$ 求解：

$$
\begin{aligned}
\int \cos^3(2x)\,dx &= \frac12\int \cos^3(u)\,du && (u = 2x) \\
&= \frac12\int \cos^2(u)\cos(u)\,du \\
&= \frac12\int (1 - \sin^2(u))\cos(u)\,du \\
&= \frac12\int (1 - v^2)\,dv && (v = \sin u) \\
&= \frac12\left(v - \frac13v^3\right) + c \\
&= \frac12\left(\sin(2x) - \frac13\sin^3(2x)\right) + c,
\end{aligned}
$$

即

$$
\int \cos^3(2x)\,dx = \frac12\sin(2x) - \frac16\sin^3(2x) + C.
$$

可以求导来检验这个答案；对 $\frac16\sin^3(2x)$ 求导时一定要用两次链式法则：

$$
\begin{aligned}
\frac{d}{dx}\left(\frac12\sin(2x) - \frac16\sin^3(2x) + C\right) &= \cos(2x) - \frac16 \cdot 3\sin^2(2x)\cos(2x) \cdot 2 + 0 \\
&= \cos(2x) - \sin^2(2x)\cos(2x) \\
&= \cos(2x) - (1 - \cos^2(2x))\cos(2x) \\
&= \cos(2x) - \cos(2x) + \cos^3(2x) \\
&= \cos^3(2x).
\end{aligned}
$$

</details>
