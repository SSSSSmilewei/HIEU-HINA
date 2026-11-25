# 原函数

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：原函数入门

这是一个新记号，也是一个新概念。$G(x) = \displaystyle\int g(x)\,dx$ 是 $g$ 的**原函数**（antiderivative）。其他说法是：

$$
G'(x) = g(x), \qquad\text{或者}\qquad dG = g(x)\,dx.
$$

这个定义有几点要注意。它包含微分 $dx$。它还包含符号 $\displaystyle\int$，叫做**积分号**；式子 $\displaystyle\int g(x)\,dx$ 叫做一个积分。$g$ 的原函数的另一个名字是 $g$ 的**不定积分**。（马上就会知道「不定」在这里是什么意思。）

如果 $G(x)$ 是 $g(x)$ 的原函数，那么 $G'(x) = g(x)$。要求函数 $g$ 的原函数（对 $g$ 积分），就要找一个导数为 $g$ 的函数。在实践中，求原函数不像求导数那么容易，但我们希望能积出尽可能多的东西。我们从一些例子开始。

**例：$\sin x$**

先求 $g(x) = \sin x$ 的积分。这是一个导数为 $\sin x$ 的函数。什么函数的导数是 $\sin x$？

**学生**：$-\cos x$。

因为 $-\cos x$ 的导数是 $\sin x$，所以它是 $\sin x$ 的一个原函数。如果

$$
G(x) = -\cos x, \qquad\text{那么}\qquad G'(x) = \sin x.
$$

另一方面，如果改选 $G(x) = -\cos x + 7$，仍然有 $G'(x) = \sin x$。因为常数的导数是 0，我们可以给 $G(x)$ 加上任何常数，它仍然是 $\sin x$ 的原函数。我们写

$$
\int \sin x\,dx = -\cos x + c,
$$

并把它叫做 $\sin x$ 的**不定**积分，因为 $c$ 可以是任何常数——它是一个不确定的值。每当求某个东西的原函数时，我们的答案都有一个常数的不确定性。

## 片段 2：xᵃ 的原函数

什么函数的导数是 $x^a$？我们知道求导时指数会减 1，所以猜 $x^{a+1}$。这还不完全对：

$$
d(x^{a+1}) = (a + 1)x^a\,dx.
$$

必须把两边除以常数 $(a + 1)$ 才得到正确答案：

$$
d\left(\frac{x^{a+1}}{a + 1}\right) = x^a\,dx, \qquad \int x^a\,dx = \frac{x^{a+1}}{a + 1} + c.
$$

但是等等！虽然 $d(x^{a+1}) = (a + 1)x^a\,dx$ 总是成立，但 $\displaystyle\int x^a\,dx = \frac{x^{a+1}}{a + 1} + c$ 并不总是成立。$a = -1$ 时分母为零。不过，对 $a \ne -1$ 仍然可以说 $\displaystyle\int x^a\,dx = \frac{x^{a+1}}{a + 1} + c$。

$a = -1$ 时会怎样？$\displaystyle\int \frac1x\,dx$ 是什么？

到目前为止，我们用了公式 $\dfrac{d}{dx}\cos x = -\sin x$ 和 $\dfrac{d}{dx}x^{n+1} = (n + 1)x^n$。积分的一个重要部分，就是记住求导公式并「倒过来读」。这里需要的公式是 $\dfrac{d}{dx}\ln x = \dfrac1x$。用它就得到 $\displaystyle\int \frac1x\,dx = \ln x + c$。

这个公式在 $x > 0$ 时没问题，但 $x$ 为负时 $\ln x$ 没有定义。这个等式更标准的形式是

$$
\int \frac{dx}{x} = \ln|x| + c.
$$

当 $x > 0$ 时，绝对值不改变任何东西，所以只需要在 $x$ 为负时检验这个公式。为此要对 $\ln|x|$ 求导：

$$
\begin{aligned}
\frac{d}{dx}\ln|x| &= \frac{d}{dx}\ln(-x) && (x < 0 \text{ 时 } |x| = -x) \\
&= \frac{1}{-x}\frac{d}{dx}(-x) && (\text{链式法则}) \\
&= \frac{-1}{-x} = \frac1x.
\end{aligned}
$$

画出 $\ln|x|$ 的图像，可以看到这个函数的斜率确实是 $\dfrac1x$。

> 图 1：$y = \ln(-x)$（$x < 0$ 部分，上图）和 $y' = \dfrac1x$（下图）的图像。

## 片段 3：sec²x 和 1/√(1 − x²) 的原函数

**例**：$\displaystyle\int \sec^2 x\,dx$

寻找原函数会帮你记住具体的求导公式。这里你要记得 $\dfrac{d}{dx}\tan x = \sec^2 x$：

$$
\int \sec^2 x\,dx = \tan x + c.
$$

**例**：$\displaystyle\int \frac{1}{\sqrt{1 - x^2}}\,dx$

这个积分的另一种写法是 $\displaystyle\int \frac{dx}{\sqrt{1 - x^2}}$。这与「$dx$ 是无穷小量，可以像其他任何数一样处理」的想法是一致的。

我们记得 $\dfrac{d}{dx}\sin^{-1}x = \dfrac{1}{\sqrt{1 - x^2}}$，于是得出

$$
\int \frac{dx}{\sqrt{1 - x^2}} = \sin^{-1}x + c.
$$

**例**：$\displaystyle\int \frac{dx}{1 + x^2}$

$$
\int \frac{dx}{1 + x^2} = \tan^{-1}x + c.
$$

找原函数时，你会花很多时间想导数。有一段时间你可能会把两者弄混，该积分时去求导，或者反过来。练习多了，这个问题就会消失。

下面列出这一讲给出的原函数：

1. $\displaystyle\int \sin x\,dx = -\cos x + c$，其中 $c$ 是任意常数。
2. $\displaystyle\int x^n\,dx = \frac{x^{n+1}}{n + 1} + c$，$n \ne -1$。
3. $\displaystyle\int \frac{dx}{x} = \ln|x| + c$。（它处理了 2 中的例外情形 $n = -1$。）
4. $\displaystyle\int \sec^2 x\,dx = \tan x + c$。
5. $\displaystyle\int \frac{dx}{\sqrt{1 - x^2}} = \sin^{-1}x + c$（其中 $\sin^{-1}x$ 表示「反正弦」arcsin，而不是 $\dfrac{1}{\sin x}$）。
6. $\displaystyle\int \frac{dx}{1 + x^2} = \tan^{-1}x + c$。

## 片段 4：原函数在相差一个常数的意义下唯一

**定理**：如果 $F'(x) = f(x)$，$G'(x) = f(x)$，那么 $F(x) = G(x) + c$。

换句话说，一旦找到一个函数的一个原函数，我们就知道可能找到的任何其他原函数都只和它相差一个常数。

**证明**：如果 $F' = G'$，那么 $(F - G)' = F' - G' = f - f = 0$。

回顾我们作为中值定理的推论证明过：如果一个函数的导数是零，它就是常数。所以 $G(x) - F(x) = c$（$c$ 是某个常数），即 $G(x) = F(x) + c$。

这是一个非常重要的事实。它是微积分的基础；是做微积分之所以有意义的原因。这个定理告诉我们：如果知道一个函数的变化率，就能知道这个函数的一切，只除了那个起始值 $c$。
