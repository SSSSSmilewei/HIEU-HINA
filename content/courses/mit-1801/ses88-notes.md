# 洛必达法则的例子

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：例：lim sin 5x / sin 2x

这和课程前面见过的一个例子相似。这里 $f(x) = \sin 5x$，$g(x) = \sin 2x$，$a = 0$。因为 $f(a) = g(a) = \sin 0 = 0$，可以用洛必达法则求这个极限：

$$
\lim_{x \to 0} \frac{\sin 5x}{\sin 2x} = \lim_{x \to 0} \frac{5\cos 5x}{2\cos 2x} \;(\text{洛必达}) = \frac{5\cos(5 \cdot 0)}{2\cos(2 \cdot 0)} = \frac52.
$$

## 片段 2：重复使用洛必达法则

这个例子说明了第 1 版洛必达法则的优越之处；即使 $g'(a) = 0$ 它也管用。

这里 $f(x) = \cos x - 1$，$g(x) = x^2$，$a = 0$。我们要求

$$
\lim_{x \to 0} \frac{\cos x - 1}{x^2}.
$$

容易验证 $f(a) = g(a) = 0$。

用洛必达法则：

$$
\lim_{x \to 0} \frac{\cos x - 1}{x^2} = \lim_{x \to 0} \frac{-\sin x}{2x}.
$$

注意 $\dfrac{-\sin x}{2x}$ 在 $x = 0$ 处没有定义；它是 $\dfrac00$ 型。没关系；这一版洛必达法则在 $g'(a) = 0$ 时仍然成立；只要 $\displaystyle\lim_{x \to a} \frac{f'(x)}{g'(x)}$ 存在，它就成立。

我们需要求 $\displaystyle\lim_{x \to 0} \frac{-\sin x}{2x}$。这可以再用一次洛必达法则！

$$
\lim_{x \to 0} \frac{-\sin x}{2x} = \lim_{x \to 0} \frac{-\cos x}{2}.
$$

整个计算合起来是

$$
\lim_{x \to 0} \frac{\cos x - 1}{x^2} = \lim_{x \to 0} \frac{-\sin x}{2x} \;(\text{洛必达}) = \lim_{x \to 0} \frac{-\cos x}{2} \;(\text{洛必达}) = \frac{-\cos 0}{2} = -\frac12.
$$

注意，只有到最后求出极限时，我们才知道这道题满足洛必达法则的前提。定理说洛必达法则只在极限存在时成立，而我们是用洛必达法则算出极限，才发现极限存在的。这在逻辑上有点微妙，但实践中这个定理非常好用。

**问**：为什么极限必须存在？不是只要导数存在就行吗？

**答**：不是，我们需要分子的导数、分母的导数和那个极限都存在。

出人意料的是，我们不需要 $f'(a)$ 存在；我们处理的是 $x$ 趋于 $a$ 时的极限，所以 $x = a$ 处发生什么不一定要紧。我们又一次在用极限去接近一个在 $x = a$ 处恰好没有定义的东西。

如果三个极限 $\displaystyle\lim_{x \to a} f'(x)$、$\displaystyle\lim_{x \to a} g'(x)$ 和 $\displaystyle\lim_{x \to a} \frac{f'(x)}{g'(x)}$ 中有任何一个不存在，就不能用洛必达法则。这是因为，如果这些极限没有定义，我们用来证明法则的那个定理可能就不成立。

稍微提前说一点：注意在

$$
\lim_{x \to \infty} xe^{-x}
$$

中，极限 $\displaystyle\lim_{x \to \infty} x$ 并不存在（是无穷大）。尽管如此，洛必达法则在这里仍然适用（见片段 4 的推广）。

## 片段 3：与近似法的比较

我们刚刚用洛必达法则证明了

$$
\lim_{x \to 0} \frac{\cos x - 1}{x^2} = -\frac12.
$$

我们把它和用近似法得到的结果比较一下，即把涉及的函数换成它们的线性或二次近似。

在 $\displaystyle\lim_{x \to 0} \frac{\sin 5x}{\sin 2x}$ 的例子里，对 0 附近的 $u$ 用线性近似 $\sin u \approx u$，得到在 0 附近的 $x$，

$$
\frac{\sin 5x}{\sin 2x} \approx \frac{5x}{2x} = \frac52.
$$

因为 $u$ 趋于 0 时近似 $\sin u \approx u$ 变成精确的，我们可以得出

$$
\lim_{x \to 0} \frac{\sin 5x}{\sin 2x} = \frac52.
$$

要用这个方法求

$$
\lim_{x \to 0} \frac{\cos x - 1}{x^2},
$$

我们把 $\dfrac{\cos x - 1}{x^2}$ 近似为

$$
\frac{(1 - x^2/2) - 1}{x^2} = \frac{-x^2/2}{x^2} = -\frac12.
$$

同样，$x$ 趋于 0 时近似变成精确的，所以

$$
\lim_{x \to 0} \frac{\cos x - 1}{x^2} = -\frac12.
$$

近似法给出和洛必达法则相同的结果，理应如此。两种方法都正确，工作量也差不多。我们对余弦函数用的近似与 $\cos x$ 的二阶导数有关，而用洛必达法则时我们也得求 $\cos x$ 的二阶导数。

## 片段 4：洛必达法则的推广

第一版洛必达法则告诉我们

$$
\lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f'(x)}{g'(x)},
$$

前提是 $f(a) = g(a) = 0$ 且 $\displaystyle\lim_{x \to a} \frac{f'(x)}{g'(x)}$ 存在。

我们已经看到，把 $f(x)$ 和 $g(x)$ 换成线性或二次近似，可以得到几乎等价的结果。洛必达法则优于近似法，因为它在某些情形下更好用。

结果是，洛必达法则在下列条件下也成立：

- $a = \pm\infty$；
- $f(x)$、$g(x)$ 都趋于 $\pm\infty$；
- $\displaystyle\lim_{x \to a} \frac{f'(x)}{g'(x)} = \pm\infty$。

换句话说，洛必达法则不只在 $\dfrac00$ 的情形成立，取 $\dfrac\infty\infty$ 形式的极限时也成立。无论 $\dfrac{f'(x)}{g'(x)}$ 趋于 $-\infty$、$\infty$ 还是某个有限数，它都给出正确答案。如果 $\dfrac{f'(x)}{g'(x)}$ 剧烈振荡，它就失效了，但这门课里不会遇到那种情况；我们能期望洛必达法则处理的一切它都能处理，而且它很好用。
