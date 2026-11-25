# 其他指数函数的导数

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：函数 10ˣ 和 2ˣ

我们算出了 $\dfrac{d}{dx}a^x = (\ln a)a^x$。所以

$$
\frac{d}{dx}2^x = (\ln 2)2^x, \qquad \frac{d}{dx}10^x = (\ln 10)10^x.
$$

即使我们坚持从别的底数（比如 2 或 10）出发，自然对数还是会出现。它们是自然而然地冒出来的，与我们人类偏爱以 2 或以 10 为底无关。底数 $e$ 一开始可能显得奇怪，但它无处不在。过一段时间，你就会体会到它有多么自然。

## 片段 2：aˣ 的导数（方法二）

我们在学怎样给任何指数函数 $a^x$ 求导。这是两种可行方法中的第二种。

**方法二：对数求导**

有时给函数 $u$ 求导很难，而给 $\ln u$ 求导更容易。我们希望能用 $\dfrac{d}{dx}\ln u$ 来求 $\dfrac{d}{dx}u$。

链式法则告诉我们 $\dfrac{d}{dx}\ln u = \dfrac{d}{du}\ln u \cdot \dfrac{du}{dx}$，而我们知道 $\dfrac{d}{du}\ln u = \dfrac1u$，所以

$$
(\ln u)' = \frac{u'}{u}.
$$

这对计算 $\dfrac{d}{dx}a^x$ 有什么帮助？

$$
u = a^x \;\Longrightarrow\; \ln u = \ln(a^x) = x\ln a.
$$

因为 $\ln a$ 是常数，这很容易求导：

$$
(\ln u)' = \ln a.
$$

因为 $(\ln u)' = u'/u$，所以 $u' = u(\ln u)'$。于是 $\dfrac{d}{dx}a^x = a^x\ln a = (\ln a)a^x$。

这和第一种方法用的是同样的算术，但不必换成以 $e$ 为底。

## 片段 3：对数求导的另一个例子

这个例子换成以 $e$ 为底来做也一样好，但我们要用对数求导来做。回顾对数求导用的法则是 $(\ln u)' = u'/u$。

这里的指数是「动」的（不是常数），底数也是动的。

**例**：设 $v = x^x$，求 $v'$。

首先，对两边取自然对数：$\ln v = \ln(x^x) = x\ln x$。

接着，对方程两边求导，右边用乘积法则和 $\ln x$ 的求导法则：

$$
(\ln v)' = \ln x + x \cdot \frac1x.
$$

现在用公式 $(\ln u)' = u'/u$，得到

$$
\frac{v'}{v} = 1 + \ln x.
$$

代入 $v = x^x$ 再解出 $v'$：

$$
\frac{v'}{x^x} = 1 + \ln x \;\Longrightarrow\; v' = x^x(1 + \ln x), \qquad\text{即}\qquad \frac{d}{dx}x^x = x^x(1 + \ln x).
$$

## 片段 4：幂函数法则

$\dfrac{d}{dx}x^r$ 是什么？我们先对正整数 $r$ 回答了这个问题，然后是所有整数，然后是有理数：

$$
\frac{d}{dx}x^r = rx^{r-1}.
$$

现在我们证明它对任何实数 $r$ 都成立。有两种做法：

**方法一：以 $e$ 为底**

因为 $x = e^{\ln x}$，可以写成

$$
x^r = \left(e^{\ln x}\right)^r = e^{r\ln x}.
$$

两边求导，得到

$$
\begin{aligned}
\frac{d}{dx}x^r &= \frac{d}{dx}e^{r\ln x} = e^{r\ln x}\frac{d}{dx}(r\ln x) && (\text{链式法则}) \\
&= e^{r\ln x}\left(\frac rx\right) && (\text{记住 } r \text{ 是常数}) \\
&= x^r\left(\frac rx\right) && (\text{因为 } x^r = e^{r\ln x}) \\
&= rx^{r-1}.
\end{aligned}
$$

**方法二：对数求导**

定义 $f(x) = x^r$，两边取自然对数得 $\ln f = r\ln x$。对数求导要求我们把函数代入公式

$$
(\ln f)' = \frac{f'}{f}.
$$

所以先计算

$$
\ln f = \ln x^r = r\ln x,
$$

再对两边求导，得到

$$
(\ln f)' = \frac rx.
$$

因为 $(\ln f)' = \dfrac{f'}{f}$，所以

$$
f' = f(\ln f)' = x^r\left(\frac rx\right) = rx^{r-1}.
$$

再把两种方法看一遍——计算几乎一样。这很典型。用第二种方法，得引入 $u$ 或 $f$ 这样的新符号；用第一种方法，得处理指数。两种方法都值得掌握。
