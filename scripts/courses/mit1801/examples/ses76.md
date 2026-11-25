# 例题：∫x⁴cos x dx

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

这道题提供大量分部积分的练习。

求 $x^4\cos x$ 的积分。

<details>
<summary>解答</summary>

用一次分部积分能化简这个积分，但解不出来。我们必须重复分部积分好几次（或者查 $x^n\cos x$ 积分的递推公式）才能完成。

对 $\cos x$ 求导并不能化简它，而 $x^4$ 的导数要简单一些。（一般地，如果看到正弦、余弦或指数函数，应该考虑让它们充当 $v'$。）我们用下面的设定做分部积分：

$$
u = x^4, \quad v = \sin x, \qquad u' = 4x^3, \quad v' = \cos x,
$$

得到

$$
\int x^4\cos x\,dx = x^4\sin x - \int 4x^3\sin x\,dx.
$$

我们没有 $\displaystyle\int 4x^3\sin x\,dx$ 的公式，但类似的分部积分能让我们更接近：

$$
u = 4x^3, \quad v = -\cos x, \qquad u' = 12x^2, \quad v' = \sin x
$$

$$
\Longrightarrow\quad \int 4x^3\sin x\,dx = -4x^3\cos x + \int 12x^2\cos x\,dx.
$$

还要再做两次分部积分才能把题做完：

$$
u = 12x^2, \quad v = \sin x, \qquad u' = 24x, \quad v' = \cos x
$$

$$
\Longrightarrow\quad \int 12x^2\cos x\,dx = 12x^2\sin x - \int 24x\sin x\,dx,
$$

$$
u = 24x, \quad v = -\cos x, \qquad u' = 24, \quad v' = \sin x
$$

$$
\Longrightarrow\quad \int 24x\sin x\,dx = -24x\cos x + \int 24\cos x\,dx.
$$

现在所有部件都有了，可以组装成最终答案：

$$
\begin{aligned}
\int x^4\cos x\,dx &= x^4\sin x - \int 4x^3\sin x\,dx \\
&= x^4\sin x - \left(-4x^3\cos x + \int 12x^2\cos x\,dx\right) \\
&= x^4\sin x + 4x^3\cos x - \left(12x^2\sin x - \int 24x\sin x\,dx\right) \\
&= x^4\sin x + 4x^3\cos x - 12x^2\sin x + \left(-24x\cos x + \int 24\cos x\,dx\right) \\
&= x^4\sin x + 4x^3\cos x - 12x^2\sin x - 24x\cos x + 24\sin x + c.
\end{aligned}
$$

</details>
