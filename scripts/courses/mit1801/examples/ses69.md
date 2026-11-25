# 例题：∫sin⁴x cos²x dx

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

计算 $\displaystyle\int \sin^4(x)\cos^2(x)\,dx$。

<details>
<summary>解答</summary>

因为这道题里所有指数都是偶数，我们选择的解法要用半角公式：

$$
\cos^2\theta = \frac{1 + \cos(2\theta)}{2}, \qquad \sin^2\theta = \frac{1 - \cos(2\theta)}{2}.
$$

因为在真正积分之前要写很多东西，我们先做一些「旁边的演算」，把被积函数化成我们会积的形式：

$$
\begin{aligned}
\sin^4x\cos^2x &= (\sin^2x)^2\cos^2x \\
&= \left(\frac{1 - \cos(2x)}{2}\right)^2\left(\frac{1 + \cos(2x)}{2}\right) \\
&= \left(\frac{1 - 2\cos(2x) + \cos^2(2x)}{4}\right)\left(\frac{1 + \cos(2x)}{2}\right) \\
&= \frac{1 - 2\cos(2x) + \cos^2(2x) + \cos(2x) - 2\cos^2(2x) + \cos^3(2x)}{8} \\
&= \frac{1 - \cos(2x) - \cos^2(2x) + \cos^3(2x)}{8}.
\end{aligned}
$$

旁边的演算到这里就够了，因为我们知道

$$
\int \cos^2(2x)\,dx = \frac x2 + \frac{\sin(4x)}{8} + c_1, \qquad \int \cos^3(2x)\,dx = \frac12\sin(2x) - \frac16\sin^3(2x) + c_2.
$$

（第一个式子由片段 1 的结果换元 $u = 2x$ 得到；第二个是第 68 节的例题。）

于是

$$
\begin{aligned}
\int \sin^4x\cos^2x\,dx &= \int \frac{1 - \cos(2x) - \cos^2(2x) + \cos^3(2x)}{8}\,dx \\
&= \frac18\left[x - \frac12\sin(2x) - \left(\frac x2 + \frac{\sin(4x)}{8} + c_1\right) + \left(\frac12\sin(2x) - \frac16\sin^3(2x) + c_2\right)\right] \\
&= \frac18\left[\frac x2 - \frac{\sin(4x)}{8} - \frac16\sin^3(2x)\right] + C \\
&= \frac{x}{16} - \frac{\sin(4x)}{64} - \frac{\sin^3(2x)}{48} + C.
\end{aligned}
$$

很难检验这个答案是否正确。如果 $C = 0$，它是一个奇函数，这至少和被积函数是偶函数相符。（也可以在计算器上取几个 $x$ 值，用数值求导检验。）

（译注：原文把 $\displaystyle\int \cos^2(2x)\,dx$ 写成了 $\dfrac x2 + \dfrac{\sin(2x)}{4} + c_1$，应为 $\dfrac x2 + \dfrac{\sin(4x)}{8} + c_1$，因此原文的最终答案 $\dfrac{x}{16} - \dfrac{\sin(2x)}{32} - \dfrac{\sin^3(2x)}{48} + C$ 也不对，求导得不回被积函数。译文已更正，更正后的答案经数值求导核对过。）

</details>
