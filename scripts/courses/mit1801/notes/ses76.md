# 分部积分法

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：分部积分法入门

和上一个方法不同，理解分部积分法所需要的一切我们都已经知道了。分部积分法就像乘积法则

$$
(uv)' = u'v + uv'
$$

的逆运算，再加上微积分基本定理。

要推导分部积分公式，只需把乘积法则移项再积分：

$$
(uv)' = u'v + uv' \;\Longrightarrow\; uv' = (uv)' - u'v \;\Longrightarrow\; \int uv'\,dx = \int (uv)'\,dx - \int u'v\,dx \;\Longrightarrow\; \int uv'\,dx = uv - \int u'v\,dx.
$$

**分部积分公式**是

$$
\int uv'\,dx = uv - \int u'v\,dx.
$$

对定积分，它变成

$$
\int_a^b uv'\,dx = uv\Big|_a^b - \int_a^b u'v\,dx.
$$

## 片段 2：例：∫ln x dx

这看起来很棘手，但如果把它套进 $\displaystyle\int uv'\,dx$ 的形式，分部积分就让计算相对容易了。

思路是：如果令 $u = \ln x$，那么应用分部积分公式时，会得到一个含 $u' = \frac1x$ 的积分。关键在于，$u = \ln x$ 的导数比我们开始时的函数更容易积分。

为了套进 $\displaystyle\int uv'\,dx$ 的形式，还需要一个函数 $v$。如果选 $v = x$，那么 $v' = 1$，并且

$$
\int \ln x\,dx = \int uv'\,dx.
$$

分部积分公式是

$$
\int uv'\,dx = uv - \int u'v\,dx.
$$

所以代入 $u = \ln x$ 和 $v = x$，得到

$$
\int \underbrace{\ln x}_{uv'}\,dx = \underbrace{\ln x \cdot x}_{uv} - \int \underbrace{\frac1x}_{u'}\underbrace{x}_{v}\,dx = x\ln x - x + c.
$$

## 片段 3：例：∫(ln x)² dx

要学会分部积分法，剩下的就只是大量练习了。为此我们再做两个稍复杂一点的例子。

要积

$$
\int (\ln x)^2\,dx,
$$

设

$$
u = (\ln x)^2, \quad u' = \frac{2(\ln x)}{x}, \qquad v = x, \quad v' = 1.
$$

对 $u$ 求导得到更简单的东西，这是个好开头。把 $u$ 和 $v$ 代入分部积分公式，得到

$$
\int \underbrace{(\ln x)^2}_{uv'}\,dx = \underbrace{(\ln x)^2 \cdot x}_{uv} - \int \underbrace{2\ln x\frac1x}_{u'}\underbrace{x}_{v}\,dx = x(\ln x)^2 - 2\int \ln x\,dx.
$$

问题还没解决，但我们回到了上一个情形；刚刚算过 $\displaystyle\int \ln x\,dx = x\ln x - x + c$。所以

$$
\int (\ln x)^2\,dx = x(\ln x)^2 - 2\underbrace{(x\ln x - x)}_{\int \ln x\,dx} + c.
$$

我们会在下一个例子里看到，这是很典型的。分部积分常常是把一个「难」积分换成一个更容易的积分。

## 片段 4：递推公式

用**递推公式**解积分题时，我们用某个规则把这个积分改写成另一个稍简单一点的积分。可能还得把那个积分再改写成另一个积分，如此进行 $n$ 步，但最终会得到答案。

例如，要计算

$$
\int (\ln x)^n\,dx,
$$

就把上一个例子中的分部积分重复 $n - 1$ 次，直到只需要算 $\displaystyle\int (\ln x)\,dx$。

第一步用

$$
u = (\ln x)^n, \quad u' = \frac{n(\ln x)^{n-1}}{x}, \qquad v = x, \quad v' = 1.
$$

于是

$$
\int (\ln x)^n\,dx = x(\ln x)^n - n\int (\ln x)^{n-1}\frac1x \cdot x\,dx = x(\ln x)^n - n\int (\ln x)^{n-1}\,dx.
$$

所以，如果

$$
F_n(x) = \int (\ln x)^n\,dx,
$$

我们刚刚证明了

$$
F_n(x) = x(\ln x)^n - nF_{n-1}(x).
$$

这是递推公式的一个例子；反复应用这个公式，就能用 $F_1(x) = \displaystyle\int \ln x\,dx$ 或 $F_0(x) = \displaystyle\int 1\,dx$ 写出 $F_n(x)$。

我们把这个递推公式用到前面两个例子上，说明它的用法。先算 $F_0(x)$ 和 $F_1(x)$：

$$
\begin{aligned}
F_0(x) &= \int (\ln x)^0\,dx = x + c, \\
F_1(x) &= x(\ln x)^1 - 1F_0(x) && (\text{用递推公式}) \\
&= x\ln x - x + c && (\text{例 1}), \\
F_2(x) &= x(\ln x)^2 - 2F_1(x) && (\text{用递推公式}) \\
&= x(\ln x)^2 - 2(x\ln x - x) + c \\
&= x(\ln x)^2 - 2x\ln x + 2x + c && (\text{例 2}).
\end{aligned}
$$

一般来说，递推公式就是这样用的。

## 片段 5：另一个递推公式：∫xⁿeˣ dx

要计算 $\displaystyle\int x^ne^x\,dx$，我们推导另一个递推公式。把这个积分里的 $e^x$ 换成 $\cos x$ 或 $\sin x$，过程也非常相似。

同样用分部积分求递推公式。这里选

$$
u = x^n,
$$

因为

$$
u' = nx^{n-1}
$$

是一个更简单（次数更低）的函数。如果 $u = x^n$，就得有

$$
v' = e^x, \qquad v = e^x.
$$

（注意 $v$ 作为原函数并不比 $v'$ 复杂——这又表明我们选对了。）

反过来，如果用 $u = e^x$，那么 $u' = e^x$ 不会更简单。

做分部积分，得到

$$
\int \underbrace{x^ne^x}_{uv'}\,dx = \underbrace{x^ne^x}_{uv} - \int \underbrace{nx^{n-1}e^x}_{u'v}\,dx.
$$

如果

$$
G_n(x) = \int x^ne^x\,dx,
$$

就得到递推公式

$$
G_n(x) = x^ne^x - nG_{n-1}(x).
$$

我们算几个积分来说明它。先直接计算

$$
G_0(x) = \int x^0e^x\,dx = e^x + c.
$$

现在可以用递推公式得出

$$
G_1(x) = xe^x - G_0(x) = xe^x - e^x + c.
$$

所以 $\displaystyle\int xe^x\,dx = xe^x - e^x + c$。

**问**：怎么知道这个方法什么时候管用？

**答**：问得好！答案是「只有靠经验和练习」。要对一个被积函数用这个方法，需要被积函数的一个因子 $u$ 在求导时变简单，另一个因子 $v$ 在积分时不变复杂。

我们看到了怎样用分部积分推导递推公式。也可以用高级猜测得到这些公式——猜出公式应该是什么，再检验。两种方法都可以。
