# 商法则

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：商法则

学会乘积法则以后，我们能求导的函数比以前多得多了。朝「给一切函数求导」迈出的下一步，是学会给商（分式）求导的公式。法则是

$$
\left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2}.
$$

为什么它成立？导数的定义告诉我们

$$
\left(\frac{u}{v}\right)' = \lim_{\Delta x \to 0} \frac{\dfrac{u(x + \Delta x)}{v(x + \Delta x)} - \dfrac{u(x)}{v(x)}}{\Delta x}.
$$

这是个很笨重的式子。我们先化简分子，并引入两个新变量 $\Delta u = u(x + \Delta x) - u(x)$ 和 $\Delta v = v(x + \Delta x) - v(x)$：

$$
\begin{aligned}
\frac{u(x + \Delta x)}{v(x + \Delta x)} - \frac{u(x)}{v(x)} &= \frac{u + \Delta u}{v + \Delta v} - \frac{u}{v} && (\text{因为 } u(x + \Delta x) = u(x) + \Delta u) \\
&= \frac{(u + \Delta u)v - u(v + \Delta v)}{(v + \Delta v)v} && (\text{通分}) \\
&= \frac{uv + (\Delta u)v - uv - u(\Delta v)}{(v + \Delta v)v} && (\text{展开}) \\
&= \frac{(\Delta u)v - u(\Delta v)}{(v + \Delta v)v} && (\text{因为 } uv - uv = 0).
\end{aligned}
$$

（译注：原文第三行把 $-u(\Delta v)$ 印成了 $+u(\Delta v)$，译文已更正。）

化简了分子，就可以用它来化简差商：

$$
\frac{\dfrac{u(x + \Delta x)}{v(x + \Delta x)} - \dfrac{u(x)}{v(x)}}{\Delta x} = \frac{1}{\Delta x} \cdot \frac{(\Delta u)v - u(\Delta v)}{(v + \Delta v)v} = \frac{\left(\dfrac{\Delta u}{\Delta x}\right)v - u\left(\dfrac{\Delta v}{\Delta x}\right)}{(v + \Delta v)v}.
$$

我们假设 $v$ 可导，因而连续，所以 $\displaystyle\lim_{\Delta x \to 0} v(x + \Delta x) = v(x)$，即 $\Delta v \to 0$。因此由导数的定义，当 $\Delta x \to 0$ 时，

$$
\frac{\left(\dfrac{\Delta u}{\Delta x}\right)v - u\left(\dfrac{\Delta v}{\Delta x}\right)}{(v + \Delta v)v} \longrightarrow \frac{\left(\dfrac{du}{dx}\right)v - u\left(\dfrac{dv}{dx}\right)}{v^2}.
$$

结论是

$$
\left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2}.
$$

## 片段 2：例子：倒数

我们用商法则做一个简单的例子。商法则告诉我们

$$
\frac{d}{dx}\left(\frac{u}{v}\right) = \frac{\dfrac{du}{dx}v - u\dfrac{dv}{dx}}{v^2}.
$$

这个例子里 $u = 1$，所以我们要求 $\dfrac1v$，即 $v$ 的倒数的导数：

$$
\frac{d}{dx}\left(\frac1v\right) = \;?
$$

我们要用上面的公式。已知 $u = 1$、$v = v$，所以在套公式之前还需要求出 $\dfrac{du}{dx}$ 和 $\dfrac{dv}{dx}$。

常数（例如 1）的导数是零，所以 $\dfrac{du}{dx} = 0$。我们不知道 $v$ 是什么，所以就写 $\dfrac{dv}{dx} = v'$。把这些代入商法则的公式，得到

$$
\frac{d}{dx}\left(\frac1v\right) = \frac{0 \cdot v - 1 \cdot v'}{v^2} = \frac{-v'}{v^2} = -v^{-2}v'.
$$

现在我们有了给倒数求导的一般公式！接下来，用这个公式看看 $u = 1$、$v = x^n$ 时会怎样。这里同样 $\dfrac{du}{dx} = 0$，而 $v' = \dfrac{d}{dx}x^n = nx^{n-1}$：

$$
\frac{d}{dx}\left(\frac{1}{x^n}\right) = -v^{-2}v' = -(x^n)^{-2}(nx^{n-1}) = -x^{-2n}(nx^{n-1}) = -nx^{-n-1}.
$$

而 $\dfrac{1}{x^n} = x^{-n}$，也是 $x$ 的幂。我们已经有给 $x$ 的正整数次幂求导的法则；它和这条负整数次幂的新法则相比如何？

$$
\frac{d}{dx}x^{-n} = -nx^{-n-1}.
$$

这与公式 $\dfrac{d}{dx}x^n = nx^{n-1}$ 一致，所以商法则证实了：$n$ 为负整数时，$x^n$ 的求导法则同样成立。
