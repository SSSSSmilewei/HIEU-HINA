# 链式法则

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：链式法则

乘积法则告诉我们怎样求 $f(x) \cdot g(x)$ 这样的函数乘积的导数。复合法则，或者说「链式」法则，告诉我们怎样求 $f(g(x))$ 这样的复合函数的导数。函数的复合就是代入——把 $x$ 的值代入 $g$ 的公式，再把结果代入 $f$ 的公式。两个函数复合的一个例子是 $y = (\sin t)^{10}$（通常写成 $y = \sin^{10} t$）。

> 图 1：函数的复合：$x \xrightarrow{\;g\;} g(x) \xrightarrow{\;f\;} f(g(x))$，即 $(f \circ g)(x) = f(g(x))$。

理解复合函数的一种方法是使用新的变量名。例如对函数 $y = \sin^{10} t$，可以令 $x = \sin t$，于是 $y = x^{10}$。注意，把 $x = \sin t$ 代入 $y$ 的公式，就回到了 $y = \sin^{10} t$。方便的时候引入新变量是好习惯，而这里就非常方便。

那么，怎样求复合函数的导数？我们要求切线的斜率；为此要取割线斜率 $\dfrac{\Delta y}{\Delta t}$ 的极限。这里 $y$ 是 $x$ 的函数，$x$ 是 $t$ 的函数，我们想知道 $y$ 相对于原来的变量 $t$ 怎样变化。这里再次用到中间变量 $x$，它帮了大忙：

$$
\frac{\Delta y}{\Delta t} = \frac{\Delta y}{\Delta x} \cdot \frac{\Delta x}{\Delta t},
$$

因为做乘法时，小改变量 $\Delta x$ 约掉了。

$y$ 关于 $t$ 的导数是 $\displaystyle\lim_{\Delta t \to 0} \frac{\Delta y}{\Delta t}$；$\Delta t$ 变小时会怎样？因为 $x = \sin t$ 是连续函数，当 $\Delta t$ 趋近 0 时，$\Delta x$ 也趋近零。结果是：

$$
\lim_{\Delta t \to 0} \frac{\Delta y}{\Delta t} = \frac{dy}{dt} = \frac{dy}{dx}\frac{dx}{dt} \qquad \longleftarrow \text{链式法则！}
$$

复合函数的导数是一个乘积。在 $y = (\sin t)^{10}$ 的例子里，「内层函数」是 $x = \sin t$，「外层函数」是 $y = x^{10}$。链式法则告诉我们：求 $y$ 关于 $x$ 的导数，再乘以 $x$ 关于 $t$ 的导数。

$y = x^{10}$ 的导数是 $\dfrac{dy}{dx} = 10x^9$。$x = \sin t$ 的导数是 $\dfrac{dx}{dt} = \cos t$。链式法则告诉我们 $\dfrac{d}{dt}\sin^{10} t = 10x^9 \cdot \cos t$。这是对的，但如果朋友问你 $\sin^{10} t$ 的导数，你回答 $10x^9 \cdot \cos t$，你的朋友不会知道 $x$ 代表什么。这个过程的最后一步，是用 $t$ 把 $x$ 改写出来：

$$
\frac{d}{dt}\sin^{10} t = 10(\sin t)^9 \cdot \cos t = 10\sin^9 t \cdot \cos t.
$$

链式法则的另一种写法是

$$
\frac{d}{dx}(f \circ g)(x) = \frac{d}{dx}f(g(x)) = f'(g(x))\,g'(x).
$$

（译注：上面「$\Delta x$ 约掉」的论证在 $\Delta x = 0$ 时需要额外处理，严格证明见分析学教材；这里只是直观解释。）

## 片段 2：例子：sin(10t)

链式法则（复合法则）说 $\dfrac{dy}{dt} = \dfrac{dy}{dx}\dfrac{dx}{dt}$。换句话说，复合函数 $f(g(t))$ 的导数，是外层函数 $f(x)$ 的导数乘以内层函数 $g(t)$ 的导数。

对例子 $\dfrac{d}{dt}\sin(10t)$，内层函数是 $x = 10t$，外层函数是 $y = \sin x$。用已知的法则可以算出 $\dfrac{dy}{dx} = \cos x$、$\dfrac{dx}{dt} = 10$，所以

$$
\frac{dy}{dt} = \frac{dy}{dx}\frac{dx}{dt} = \cos x \cdot 10.
$$

因为只有我们自己知道这个公式里 $x$ 的值，所以把 $x$ 换成 $10t$，得到

$$
\frac{dy}{dt} = \cos(10t) \cdot 10 = 10\cos(10t).
$$

链式法则用得多了，就不总是需要表示内层函数的变量 $x$ 了。看到 $\dfrac{d}{dt}\sin(10t)$ 时，你可以对自己说：「外层函数正弦的导数是余弦。我把 $10t$ 代进去。而 $10t$ 的导数就是 10。所以 $\dfrac{d}{dt}\sin(10t) = \cos(10t) \cdot 10$。」
