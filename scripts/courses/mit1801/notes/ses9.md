# 乘积法则

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：一般的求导法则

刚才我们看了求余弦和正弦函数导数的一些具体法则。下面是几条一般法则，稍后会详细讨论。

**乘积法则**

$$
(uv)' = u'v + uv'
$$

记住它的方法是：每次只让一个函数（$u$ 或 $v$）变化。对涉及多个函数的求导来说，这是一个很好的一般做法。

**商法则**

$$
\left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2} \qquad (v \ne 0).
$$

你很快会看到它们的证明，做作业和考试时你也应该能证明这类结论。

## 片段 2：一般求导法则入门

我们已经见过好几条具体的求导法则，例如 $x^n$ 的导数是 $nx^{n-1}$，甚至还用这个公式做过几个例子。我们也见过一些推广这些计算的一般法则，例如 $(cu)' = c \cdot u'$ 和 $(u + v)' = u' + v'$。

今天我们要学更多一般法则：怎样给函数的乘积、函数的商求导，最妙的是怎样给复合函数求导。最后我们还会学一点高阶导数。

## 片段 3：乘积公式（一般情形）

乘积法则告诉我们怎样求两个函数乘积的导数：

$$
(uv)' = u'v + uv'.
$$

这看起来有点怪——乘积的导数是一个和，而不只是导数的乘积——但马上我们就会看到为什么是这样。

首先，用这条法则求乘积 $x^n \sin x$ 的导数——没有这条法则，我们没法给这个函数求导。这里第一个函数 $u$ 是 $x^n$，第二个函数 $v$ 是 $\sin x$。根据 $x^n$ 导数的具体法则，$u'$ 一定是 $nx^{n-1}$。如果 $v = \sin x$，那么 $v' = \cos x$。乘积法则告诉我们 $(uv)' = u'v + uv'$，所以

$$
\frac{d}{dx}\bigl(x^n \sin x\bigr) = nx^{n-1}\sin x + x^n \cos x.
$$

反复运用这条法则，可以求更复杂的乘积的导数：

$$
(uvw)' = u'(vw) + u(vw)' = u'vw + u(v'w + vw') = u'vw + uv'w + uvw'.
$$

现在来看为什么它成立：

$$
(uv)' = \lim_{\Delta x \to 0} \frac{(uv)(x + \Delta x) - (uv)(x)}{\Delta x} = \lim_{\Delta x \to 0} \frac{u(x + \Delta x)v(x + \Delta x) - u(x)v(x)}{\Delta x}.
$$

我们想让最后的公式用 $u$、$v$、$u'$、$v'$ 表示。我们知道 $u' = \displaystyle\lim_{\Delta x \to 0} \frac{u(x + \Delta x) - u(x)}{\Delta x}$，而 $u(x + \Delta x)v(x + \Delta x) - u(x)v(x)$ 看起来有点像 $\bigl(u(x + \Delta x) - u(x)\bigr)v(x)$。用一点代数，就能让 $\bigl(u(x + \Delta x) - u(x)\bigr)v(x)$ 出现在公式里；过程如下。

首先注意

$$
u(x + \Delta x)v(x) - u(x + \Delta x)v(x) = 0.
$$

在分子上加零不改变式子的值，所以

$$
(uv)' = \lim_{\Delta x \to 0} \frac{u(x + \Delta x)v(x) - u(x)v(x) + u(x + \Delta x)v(x + \Delta x) - u(x + \Delta x)v(x)}{\Delta x}.
$$

重新整理这个式子，得到

$$
(uv)' = \lim_{\Delta x \to 0} \left[\left(\frac{u(x + \Delta x) - u(x)}{\Delta x}\right)v(x) + u(x + \Delta x)\left(\frac{v(x + \Delta x) - v(x)}{\Delta x}\right)\right].
$$

我们证明过，如果 $u$ 和 $v$ 可导，它们一定连续，所以和的极限等于极限的和：

$$
\lim_{\Delta x \to 0} \left(\frac{u(x + \Delta x) - u(x)}{\Delta x}\right)v(x) + \lim_{\Delta x \to 0} u(x + \Delta x)\left(\frac{v(x + \Delta x) - v(x)}{\Delta x}\right),
$$

换句话说，

$$
(uv)' = u'(x)v(x) + u(x)v'(x).
$$

注意，我们还用到了

$$
\lim_{\Delta x \to 0} u(x + \Delta x) = u(x),
$$

这是成立的，因为 $u$ 可导，因而连续。
