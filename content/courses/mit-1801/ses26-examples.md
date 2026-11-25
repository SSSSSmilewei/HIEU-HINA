# 例题：求最佳 n 次近似的公式

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

线性近似用函数在 $x_0$ 处的值和一阶导数——也就是切线的斜率和切点——求出近似这个函数的一次多项式的方程。$x = x_0$ 附近函数 $f(x)$ 的线性近似公式是

$$
f(x) \approx f(x_0) + f'(x_0) \cdot (x - x_0).
$$

二次近似公式

$$
f(x) \approx f(x_0) + f'(x_0) \cdot (x - x_0) + \frac{f''(x_0)}{2}(x - x_0)^2
$$

描述 $x \approx x_0$ 时函数 $f(x)$ 的最佳二次近似。也可以描述零次近似：$x$ 足够接近 $x_0$ 时 $f(x) \approx f(x_0)$。随着近似的次数增加，我们添加新的项，而低次项保持不变。

能不能定义更高次的近似？如果能，应该加上什么项？我们只考虑 $x_0 = 0$ 附近的近似；一般情形的计算非常类似。

a) 求函数 $f(x)$ 在 $x = 0$ 附近的最佳三次近似

$$
A(x) = a_0 + a_1x + a_2x^2 + a_3x^3.
$$

换句话说，求 $a_i$ 的值，使 $x = 0$ 时 $f(x)$ 的一阶、二阶、三阶导数分别与 $a_0 + a_1x + a_2x^2 + a_3x^3$ 的一阶、二阶、三阶导数相同（函数值也相同）。（可以参考你推导二次近似公式时的笔记。）

b) 利用「$m < n$ 时 $x^m$ 的 $n$ 阶导数为 0」这个事实，求

$$
A(x) = a_0 + a_1x^1 + a_2x^2 + \cdots + a_{n-1}x^{n-1} + a_nx^n
$$

的 $n$ 阶导数。

c) 用 (b) 的答案，写出函数 $f(x)$ 在 $x = 0$ 附近的 $n$ 次多项式近似的公式。

<details>
<summary>解答</summary>

**a)** 先对近似函数 $A(x)$ 求导：

$$
\begin{aligned}
A(x) &= a_0 + a_1x + a_2x^2 + a_3x^3 \\
A'(x) &= a_1 + 2a_2x + 3a_3x^2 \\
A''(x) &= 2a_2 + 6a_3x \\
A^{(3)}(x) &= 6a_3.
\end{aligned}
$$

接着，令 $A(x)$ 的 $n$ 阶导数等于 $f(x)$ 的 $n$ 阶导数，在 $x = 0$ 处求值，解出 $a_n$：

$$
\begin{aligned}
f(0) &= A(0) = a_0 &&\Longrightarrow\; a_0 = f(0) \\
f'(0) &= A'(0) = a_1 &&\Longrightarrow\; a_1 = f'(0) \\
f''(0) &= A''(0) = 2a_2 &&\Longrightarrow\; a_2 = \frac{f''(0)}{2} \\
f^{(3)}(0) &= A^{(3)}(0) = 6a_3 &&\Longrightarrow\; a_3 = \frac{f^{(3)}(0)}{6}.
\end{aligned}
$$

知道了近似函数 $A(x)$ 的系数，就可以说

$$
f(x) \approx f(0) + f'(0)x + \frac{f''(0)}{2}x^2 + \frac{f^{(3)}(0)}{6}x^3 \qquad (x \approx 0).
$$

**b)** 对多项式求导时，低次项会消失，只剩下最高次项的导数。如果对 $A(x)$ 求 $n$ 次导数，就只剩下 $a_nx^n$ 的 $n$ 阶导数。

要求 $a_nx^n$ 的 $n$ 阶导数，就逐次求导并寻找规律：

$$
\begin{aligned}
\frac{d}{dx}a_nx^n &= na_nx^{n-1} \\
\frac{d^2}{dx^2}a_nx^n &= (n - 1)na_nx^{n-2} \\
\frac{d^3}{dx^3}a_nx^n &= (n - 2)(n - 1)na_nx^{n-3} \\
&\;\;\vdots \\
\frac{d^{n-1}}{dx^{n-1}}a_nx^n &= 2 \cdot 3 \cdots (n - 2)(n - 1)na_nx^1 \\
\frac{d^n}{dx^n}a_nx^n &= 1 \cdot 2 \cdot 3 \cdots (n - 2)(n - 1)na_n = n!\,a_n.
\end{aligned}
$$

**c)** 我们的目标是让 $x = 0$ 时 $f(x)$ 和 $A(x)$ 的 $n$ 阶导数相同：$f^{(n)}(0) = A^{(n)}(0)$。已知 $A^{(n)}(x) = \dfrac{d^n}{dx^n}a_nx^n = n!\,a_n$，所以

$$
f^{(n)}(0) = n!\,a_n \;\Longrightarrow\; a_n = \frac{f^{(n)}(0)}{n!}.
$$

这和前面算出的 $a_3 = \dfrac{f^{(3)}(0)}{6}$ 一致。

结论：$x$ 接近 0 时，

$$
f(x) \approx f(0) + f'(0)x + \frac{f''(0)}{2}x^2 + \cdots + \frac{f^{(n-1)}(0)}{(n - 1)!}x^{n-1} + \frac{f^{(n)}(0)}{n!}x^n.
$$

（这就是单元 5 要学的泰勒多项式。）

</details>
