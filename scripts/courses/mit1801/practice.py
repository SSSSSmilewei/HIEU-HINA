from qhelp import choice, text

PRACTICE = {}

S = "改编自本节讲义。\n\n"
X = "改编自本节例题。\n\n"

PRACTICE["ses1"] = [
    choice("tangent", S + "函数图像在点 $P$ 处的切线是什么？",
           [r"割线 $PQ$ 在 $Q$ 趋近 $P$ 时的极限", "和图像只有一个交点的直线", "经过 $P$ 的水平直线", "经过 $P$ 和原点的直线"], 0, "切线不只是「只碰一下」的直线；它是割线的极限。"),
    choice("formula", S + "导数 $f'(x_0)$ 的定义式是？",
           [r"$\displaystyle\lim_{\Delta x \to 0} \frac{f(x_0 + \Delta x) - f(x_0)}{\Delta x}$", r"$\dfrac{f(x_0 + \Delta x) - f(x_0)}{\Delta x}$（取 $\Delta x = 1$）",
            r"$\displaystyle\lim_{\Delta x \to 0} \bigl(f(x_0 + \Delta x) - f(x_0)\bigr)$", r"$\dfrac{f(x_0)}{x_0}$"], 0, "差商 $\\Delta f / \\Delta x$ 在 $\\Delta x \\to 0$ 时的极限。"),
    text("secant", X + r"$f(x) = 0.5x^3 - x$。经过 $x = 0$ 和 $x = 0.5$ 两点的割线斜率 $\dfrac{\Delta y}{\Delta x}$ 是多少？（保留三位小数）", ["-0.875", "−0.875", "-7/8"],
         r"$f(0.5) = 0.0625 - 0.5 = -0.4375$，$f(0) = 0$，斜率 $= -0.4375 / 0.5 = -0.875$。"),
]

PRACTICE["ses2"] = [
    choice("inv", S + r"$f(x) = \dfrac1x$ 的导数是？", [r"$-\dfrac{1}{x^2}$", r"$\dfrac{1}{x^2}$", r"$\ln x$", r"$-\dfrac1x$"], 0, r"差商化简为 $\dfrac{-1}{x_0(x_0 + \Delta x)}$，令 $\Delta x \to 0$。"),
    text("area", S + r"$y = \dfrac1x$ 的图像在第一象限任意一点的切线，与两条坐标轴围成的三角形面积是多少？", ["2"], r"切线在两轴上的截距是 $2x_0$ 和 $2/x_0$，面积 $\tfrac12 \cdot 2x_0 \cdot \tfrac{2}{x_0} = 2$。"),
    text("intercept", S + r"$y = \dfrac1x$ 在 $x_0 = 3$ 处的切线与 $x$ 轴交于 $x = $ ？", ["6"], r"$x$ 截距是 $2x_0$。"),
    choice("abs", X + r"$f(x) = |x|$ 在 $x = 0$ 处的导数是？", ["不存在", "0", "1", "−1"], 0, "右侧差商恒为 1，左侧恒为 −1，极限不存在。"),
]

PRACTICE["ses3"] = [
    text("pumpkin-avg", S + r"南瓜从 80 米高处落下，高度 $h = 80 - 5t^2$（米），4 秒落地。下落过程的平均速度是多少米/秒？", ["-20", "−20"], r"$\dfrac{0 - 80}{4 - 0} = -20$；末位置减初位置，所以是负的。"),
    text("pumpkin-inst", S + r"同上，$h'(t) = -10t$。南瓜落地瞬间的速度是多少米/秒？", ["-40", "−40"], r"$h'(4) = -40$。"),
    choice("gradient", S + r"$T$ 表示温度、$x$ 表示位置，$\dfrac{dT}{dx}$ 叫做？", ["温度梯度", "平均温度", "比热", "温度的积分"], 0, "温度随位置的变化率。"),
    text("balance-max", X + r"账户余额 $f(t) = -5t^2 + 60t + 120$，$f'(t) = -10t + 60$。第几个月余额最多？", ["6"], r"$f'(t) = 0 \Rightarrow t = 6$；$f(6) = 300$ 比 $f(5) = f(7) = 295$ 都大。"),
]

PRACTICE["ses4"] = [
    text("easy", S + r"$\displaystyle\lim_{x \to 3} \frac{x^2 + x}{x + 1}$ 等于多少？", ["3"], "函数在 3 处连续，直接代入：$12/4 = 3$。"),
    text("right", S + r"$f(x) = x + 1$（$x > 0$），$f(x) = -x$（$x \le 0$）。右极限 $\displaystyle\lim_{x \to 0^+} f(x)$ 是多少？", ["1"], "只看 $x > 0$ 的部分 $x + 1$。"),
    choice("cont-def", S + r"$f$ 在 $x_0$ 处连续的定义是？", [r"$\displaystyle\lim_{x \to x_0} f(x) = f(x_0)$", r"$f(x_0)$ 有定义", r"左极限和右极限都存在", r"$f'(x_0)$ 存在"], 0, "三件事都要成立：两侧极限存在且相等，$f(x_0)$ 有定义，并且等于这个极限。"),
    text("corner", X + r"$f(x) = ax + b$（$x > 0$），$f(x) = \sin 2x$（$x \le 0$）。要使 $f$ 连续，$b$ 必须等于多少？", ["0"], r"$\sin 0 = 0$，右极限是 $b$。"),
]

PRACTICE["ses5"] = [
    choice("removable", S + r"$\dfrac{\sin x}{x}$ 在 $x = 0$ 处是哪种间断？", ["可去间断", "跳跃间断", "无穷间断", "振荡间断"], 0, r"$\displaystyle\lim_{x \to 0} \frac{\sin x}{x} = 1$，两侧极限相等，只是函数在 0 处没有定义。"),
    choice("jump", S + r"$\dfrac{|x|}{x}$ 在 $x = 0$ 处是哪种间断？", ["跳跃间断", "可去间断", "无穷间断", "它在 0 处连续"], 0, "右极限 1，左极限 −1，都存在但不相等。"),
    choice("diff-cont", S + "下面哪个说法正确？", ["可导一定连续，连续不一定可导", "连续一定可导", "可导和连续是一回事", "可导不一定连续"], 0, r"例如 $|x|$ 在 0 处连续但不可导。"),
    choice("odd-even", S + r"奇函数的导数是？", ["偶函数", "奇函数", "常数", "可能是任何函数"], 0, r"例如 $\dfrac1x$（奇）的导数 $-\dfrac{1}{x^2}$ 是偶函数。"),
    text("one-sided", X + r"$\displaystyle\lim_{x \to -1^-} \frac{1}{x + 1}$ 是 $\infty$ 还是 $-\infty$？（填 `∞` 或 `-∞`）", ["-∞", "−∞", "-inf", "-infinity"], r"$x < -1$ 时分母是很小的负数。"),
]

PRACTICE["ses6"] = [
    choice("sum", S + r"$(u + v)'$ 等于？", [r"$u' + v'$", r"$u'v'$", r"$u'v + uv'$", r"$(u')^2 + (v')^2$"], 0, "和的导数等于导数的和。"),
    text("poly", S + r"用 $(u + v)' = u' + v'$、$(cu)' = cu'$ 和 $(x^n)' = nx^{n-1}$，求 $f(x) = 3x^2 + 5x$ 在 $x = 2$ 处的导数。", ["17"], r"$f'(x) = 6x + 5$，$f'(2) = 17$。"),
]

PRACTICE["ses7"] = [
    choice("dsin", S + r"$\dfrac{d}{dx}\sin x$ 等于？", [r"$\cos x$", r"$-\cos x$", r"$\sin x$", r"$-\sin x$"], 0, "用和角公式和两个基本极限。"),
    choice("dcos", S + r"$\dfrac{d}{dx}\cos x$ 等于？", [r"$-\sin x$", r"$\sin x$", r"$\cos x$", r"$-\cos x$"], 0, r"$\cos x \cdot 0 + (-\sin x) \cdot 1$。"),
    choice("zero-slope", X + r"$\sin x$ 的斜率在哪些地方等于 0？", [r"$x = \pm\dfrac{\pi}{2}, \pm\dfrac{3\pi}{2}, \ldots$（波峰和波谷）", r"$x = 0, \pm\pi, \pm2\pi, \ldots$", r"只在 $x = 0$", "没有这样的点"], 0, r"在这些点 $\cos x = 0$。"),
]

PRACTICE["ses8"] = [
    text("sinlim", S + r"$\displaystyle\lim_{\theta \to 0} \frac{\sin\theta}{\theta}$ 等于多少？（$\theta$ 用弧度）", ["1"], "弧长 $\\theta$ 和竖直线段 $\\sin\\theta$ 越来越接近。"),
    text("coslim", S + r"$\displaystyle\lim_{\theta \to 0} \frac{1 - \cos\theta}{\theta}$ 等于多少？", ["0"], "「缝隙」$1 - \\cos\\theta$ 比弧长缩小得快得多。"),
    choice("radian", S + r"为什么 $\displaystyle\lim_{\theta \to 0} \frac{\sin\theta}{\theta} = 1$ 要求 $\theta$ 用弧度？",
           ["只有用弧度时，单位圆上的弧长才等于 $\\theta$", "用度的话 $\\sin\\theta$ 没有定义", "弧度更小", "这只是习惯，用度也一样"], 0, r"用度量时极限是 $\pi/180$。"),
    text("sinc0", X + r"$\operatorname{sinc}(x) = \dfrac{\sin x}{x}$ 在 $x = 0$ 处补上定义，使它连续，$\operatorname{sinc}(0)$ 应该等于多少？", ["1"], r"$\displaystyle\lim_{x \to 0} \frac{\sin x}{x} = 1$。"),
]

PRACTICE["ses9"] = [
    choice("product", S + r"$(uv)'$ 等于？", [r"$u'v + uv'$", r"$u'v'$", r"$u'v - uv'$", r"$\dfrac{u'}{v'}$"], 0, "每次只让一个函数变化。"),
    text("xsin", S + r"$\dfrac{d}{dx}\bigl(x^2\sin x\bigr)$ 在 $x = 0$ 处的值是多少？", ["0"], r"$2x\sin x + x^2\cos x$，在 0 处为 0。"),
    text("piece-b", X + r"$f(x) = ax^2 + bx + 6$（$x \le 1$），$f(x) = 2x^5 + 3x^4 + 4x^2 + 5x + 6$（$x > 1$）在 $x = 1$ 处可导。$a$ 是多少？", ["21"],
         r"连续：$a + b = 14$；斜率相同：$2a + b = 35$。所以 $a = 21$，$b = -7$。"),
]

PRACTICE["ses10"] = [
    choice("quot", S + r"$\left(\dfrac{u}{v}\right)'$ 等于？", [r"$\dfrac{u'v - uv'}{v^2}$", r"$\dfrac{uv' - u'v}{v^2}$", r"$\dfrac{u'}{v'}$", r"$\dfrac{u'v + uv'}{v^2}$"], 0, "分子是「上导下不导，减去上不导下导」。"),
    choice("recip", S + r"$\dfrac{d}{dx}x^{-3}$ 等于？", [r"$-3x^{-4}$", r"$-3x^{-2}$", r"$3x^{-4}$", r"$-\dfrac{1}{3}x^{-4}$"], 0, r"$\dfrac{d}{dx}x^{-n} = -nx^{-n-1}$。"),
    text("quot-val", X + r"$f(x) = \dfrac{x^2}{x + 1}$，$f'(1)$ 是多少？（写成分数）", ["3/4", "0.75"], r"$f'(x) = \dfrac{x^2 + 2x}{(x + 1)^2}$，$f'(1) = 3/4$。"),
]

PRACTICE["ses11"] = [
    choice("chain", S + r"$\dfrac{d}{dt}\sin^{10} t$ 等于？", [r"$10\sin^9 t\cos t$", r"$10\sin^9 t$", r"$\cos^{10} t$", r"$10\cos^9 t$"], 0, "外层 $x^{10}$ 的导数乘以内层 $\\sin t$ 的导数。"),
    choice("sin10t", S + r"$\dfrac{d}{dt}\sin(10t)$ 等于？", [r"$10\cos(10t)$", r"$\cos(10t)$", r"$10\cos t$", r"$\cos(10)$"], 0, "内层 $10t$ 的导数是 10。"),
    text("chain-val", X + r"$\dfrac{d}{dx}(x + 1)^{-1}$ 在 $x = 1$ 处的值是多少？（写成分数）", ["-1/4", "−1/4", "-0.25"], r"$-(x + 1)^{-2}$，在 $x = 1$ 处是 $-1/4$。"),
]

PRACTICE["ses12"] = [
    text("d4sin", S + r"$\sin x$ 的四阶导数是？（例如写 `sin x`）", ["sin x", "sinx", "sin(x)"], r"$\sin \to \cos \to -\sin \to -\cos \to \sin$。"),
    text("dnxn", S + r"$D^5 x^5$ 等于多少？", ["120"], "$5! = 120$。"),
    text("dn1", S + r"$D^6 x^5$ 等于多少？", ["0"], "常数的导数是 0。"),
    choice("ode", X + r"下面哪个函数满足 $f''(x) = -f(x)$？", [r"$3\cos x - 2\sin x$", r"$e^x$", r"$x^2$", r"$\tan x$"], 0, r"$a\cos x + b\sin x$ 都满足。"),
]

P = "改编自习题课 1 的官方练习题 "
PRACTICE["ps1"] = [
    text("1b1c", P + "1B-1。\n\n" + r"试管从 400 英尺高处落下，高度 $h = 400 - 16t^2$（英尺）。落地瞬间的速度是多少英尺/秒？", ["-160", "−160"], r"$t = 5$ 落地，$h'(5) = -32 \cdot 5 = -160$。"),
    text("1c3b", P + "1C-3。\n\n" + r"$f(x) = 2x^2 + 5x + 4$ 的斜率在哪一点等于 0？（写成小数或分数）", ["-1.25", "-5/4", "−5/4", "−1.25"], r"$f'(x) = 4x + 5 = 0$。"),
    choice("1c5", P + "1C-5。\n\n" + r"$y = 1 + (x - 1)^2$ 的图像有几条经过原点的切线？", ["2", "1", "0", "无穷多条"], 0, r"切点满足 $a^2 = 2$，$a = \pm\sqrt2$。"),
    text("1d1g", P + "1D-1。\n\n" + r"$\displaystyle\lim_{x \to \infty} \left(\frac{4x^2}{x - 2} - 4x\right)$ 等于多少？", ["8"], r"通分得 $\dfrac{8x}{x - 2} \to 8$。"),
    text("1d6a", P + "1D-6。\n\n" + r"$f(x) = x^2 + 4x + 1$（$x \ge 0$），$f(x) = ax + b$（$x < 0$）可导。$a$ 是多少？", ["4"], r"连续要求 $b = 1$；右侧斜率 $f'(0^+) = 4$，所以 $a = 4$。"),
    text("1e4b", P + "1E-4。\n\n" + r"$f(x) = ax^2 + bx + 4$（$x \le 1$），$f(x) = 5x^5 + 3x^4 + 7x^2 + 8x + 4$（$x > 1$）可导。$a$ 是多少？", ["36"], r"$a + b = 23$，$2a + b = 59$。"),
    text("1g1", P + "1G-1。\n\n" + r"$y = \dfrac{x}{x + 5}$，$y''$ 在 $x = 0$ 处的值是多少？（写成分数）", ["-10/125", "-2/25", "−2/25", "-0.08"], r"$y'' = \dfrac{-10}{(x + 5)^3}$，在 0 处为 $-10/125 = -2/25$。"),
    text("1j2", P + "1J-2。\n\n" + r"$\displaystyle\lim_{x \to \pi/2} \frac{\cos x}{x - \pi/2}$ 等于多少？", ["-1", "−1"], r"它就是 $\cos x$ 在 $\pi/2$ 处的导数 $-\sin(\pi/2)$。"),
]

PRACTICE["ses13"] = [
    choice("rational", S + r"$\dfrac{d}{dx}x^{2/3}$ 等于？", [r"$\dfrac23x^{-1/3}$", r"$\dfrac23x^{1/3}$", r"$\dfrac32x^{1/3}$", r"$x^{-1/3}$"], 0, r"对有理数 $a$，$(x^a)' = ax^{a-1}$。"),
    text("ellipse", X + r"$x^2 + 4y^2 = 1$。用隐函数求导，$y'$ 在点 $(0, 1/2)$ 处等于多少？", ["0"], r"$y' = -\dfrac{x}{4y}$。"),
]

PRACTICE["ses14"] = [
    choice("circle", S + r"单位圆 $x^2 + y^2 = 1$ 上一点 $(x, y)$ 处的切线斜率是？", [r"$-\dfrac xy$", r"$\dfrac xy$", r"$-\dfrac yx$", r"$\dfrac{1}{\sqrt{1 - x^2}}$"], 0, r"$2x + 2yy' = 0$。"),
    text("y4", S + r"$y^4 + xy^2 - 2 = 0$ 经过点 $(1, 1)$。$y'$ 在这一点等于多少？（写成分数）", ["-1/6", "−1/6"], r"$y' = \dfrac{-y^2}{4y^3 + 2xy} = \dfrac{-1}{4 + 2}$。"),
    text("hyper", X + r"双曲线 $y^2 - x^2 = 1$ 上，$y'$ 在点 $(0, -1)$ 处等于多少？", ["0"], r"$y' = x/y = 0$，切线水平。"),
]

PRACTICE["ses15"] = [
    choice("arctan", S + r"$\dfrac{d}{dx}\arctan x$ 等于？", [r"$\dfrac{1}{1 + x^2}$", r"$\dfrac{1}{\sqrt{1 - x^2}}$", r"$\sec^2 x$", r"$\dfrac{-1}{1 + x^2}$"], 0, r"$\tan y = x$，$y' = \cos^2 y = \dfrac{1}{1 + x^2}$。"),
    choice("arcsin", S + r"$\dfrac{d}{dx}\arcsin x$ 等于？", [r"$\dfrac{1}{\sqrt{1 - x^2}}$", r"$\dfrac{-1}{\sqrt{1 - x^2}}$", r"$\dfrac{1}{1 + x^2}$", r"$\cos x$"], 0, r"$\cos y \cdot y' = 1$，且在值域上 $\cos y > 0$。"),
    text("inv-slope", S + r"$f(x) = x^3 + x$ 满足 $f(1) = 2$，$f'(1) = 4$。反函数 $f^{-1}$ 在 $y = 2$ 处的导数是多少？（写成分数）", ["1/4", "0.25"], r"$\dfrac{d}{dy}f^{-1}(y) = \dfrac{1}{dy/dx}$。"),
    text("sqrt", X + r"$\dfrac{d}{dx}\sqrt{x}$ 在 $x = 4$ 处等于多少？（写成分数）", ["1/4", "0.25"], r"$\dfrac{1}{2\sqrt x} = \dfrac14$。"),
]

PRACTICE["ses16"] = [
    choice("m-of-a", S + r"$\dfrac{d}{dx}a^x = M(a)a^x$，其中 $M(a)$ 的几何意义是？", [r"$y = a^x$ 的图像在 $x = 0$ 处的切线斜率", r"$a^x$ 在 $x = 1$ 处的值", r"$y = a^x$ 与 $y$ 轴的交点", "$a$ 的平方根"], 0, r"$M(a) = \left.\dfrac{d}{dx}a^x\right|_{x = 0}$。"),
    text("apr", X + r"年利率 5%、按月复利，年化利率 APR 约为百分之多少？（保留两位小数，例如 `5.12`）", ["5.12", "5.12%"], r"$(1 + 0.05/12)^{12} - 1 \approx 0.0512$。"),
]

PRACTICE["ses17"] = [
    choice("e-def", S + r"$e$ 是怎样定义的？", [r"使 $y = a^x$ 在 $x = 0$ 处的斜率 $M(a)$ 等于 1 的那个底数 $a$", r"使 $a^1 = 1$ 的数", "圆周率除以某个数", r"$\ln 10$"], 0, r"$M(e) = 1$，所以 $(e^x)' = e^x$。"),
    choice("dln", S + r"$\dfrac{d}{dx}\ln x$ 等于？", [r"$\dfrac1x$", r"$\ln x$", r"$e^x$", r"$\dfrac{1}{x\ln 10}$"], 0, r"由 $e^w = x$ 做隐函数求导。"),
    choice("m-equals-ln", S + r"$M(a) = \displaystyle\lim_{h \to 0} \frac{a^h - 1}{h}$ 等于？", [r"$\ln a$", r"$a$", r"$\dfrac1a$", r"$e^a$"], 0, r"$a^x = e^{x\ln a}$，所以 $(a^x)' = (\ln a)a^x$。"),
    text("solve", X + r"解方程 $y = e^x + e^{-x}$，当 $y = 2$ 时 $x$ 等于多少？", ["0"], r"$u = e^x$ 满足 $u^2 - 2u + 1 = 0$，$u = 1$，$x = 0$。"),
]

PRACTICE["ses18"] = [
    choice("d2x", S + r"$\dfrac{d}{dx}2^x$ 等于？", [r"$(\ln 2)2^x$", r"$x2^{x-1}$", r"$2^x$", r"$\dfrac{2^x}{\ln 2}$"], 0, r"$(a^x)' = (\ln a)a^x$。"),
    choice("xx", S + r"$\dfrac{d}{dx}x^x$ 等于？", [r"$x^x(1 + \ln x)$", r"$x \cdot x^{x-1}$", r"$x^x\ln x$", r"$x^x$"], 0, r"$\ln v = x\ln x$，$(\ln v)' = \ln x + 1$。"),
    text("xx1", S + r"$\dfrac{d}{dx}x^x$ 在 $x = 1$ 处等于多少？", ["1"], r"$1^1(1 + \ln 1) = 1$。"),
]

PRACTICE["ses19"] = [
    choice("elim", S + r"$\displaystyle\lim_{n \to \infty} \left(1 + \frac1n\right)^n$ 等于？", [r"$e$", "1", r"$\infty$", "0"], 0, r"取对数后化成 $\ln x$ 在 1 处的导数，等于 1。"),
    text("lnlim", S + r"$\displaystyle\lim_{\Delta x \to 0} \frac{\ln(1 + \Delta x)}{\Delta x}$ 等于多少？", ["1"], r"它是 $\ln x$ 在 $x = 1$ 处的导数。"),
]

PRACTICE["ses20"] = [
    choice("dsinh", S + r"$\dfrac{d}{dx}\cosh x$ 等于？", [r"$\sinh x$", r"$-\sinh x$", r"$\cosh x$", r"$-\cos x$"], 0, "和余弦不同，没有负号。"),
    text("identity", S + r"$\cosh^2 x - \sinh^2 x$ 恒等于多少？", ["1"], "所以 $(\\cosh x, \\sinh x)$ 在双曲线 $u^2 - v^2 = 1$ 上。"),
    choice("sum", X + r"$\cosh(x + y)$ 等于？", [r"$\cosh x\cosh y + \sinh x\sinh y$", r"$\cosh x\cosh y - \sinh x\sinh y$", r"$\cosh x\sinh y + \sinh x\cosh y$", r"$\cosh x + \cosh y$"], 0, "和余弦的和角公式相比，减号变成了加号。"),
]

P = "改编自习题课 2 的官方练习题 "
PRACTICE["ps2"] = [
    text("1g4", P + "1G-4。\n\n" + r"$y = \dfrac{1}{x + 1}$ 的三阶导数在 $x = 0$ 处等于多少？", ["-6", "−6"], r"$y^{(n)} = (-1)^n n!(x + 1)^{-n-1}$，$n = 3$ 时为 $-6$。"),
    choice("1h1", P + "1H-1。\n\n" + r"按 $y = y_0e^{-kt}$ 衰变的物质，半衰期 $\lambda$ 是？", [r"$\dfrac{\ln 2}{k}$", r"$\dfrac{k}{\ln 2}$", r"$\dfrac{1}{2k}$", r"$k\ln 2$"], 0, r"解 $\tfrac12 = e^{-k\lambda}$。"),
    text("1h2", P + "1H-2。\n\n" + r"强酸用等体积的水稀释后，pH 值大约增加多少？（保留一位小数）", ["0.3", ".3"], r"$\text{pH}_{\text{稀释后}} = \text{pH}_{\text{原}} + \log 2$。"),
    text("1i4", P + "1I-4。\n\n" + r"$\displaystyle\lim_{n \to \infty}\left(1 + \frac{2}{n}\right)^{5n}$ 等于 $e$ 的几次方？", ["10"], r"令 $m = n/2$，得 $\left(\left(1 + \frac1m\right)^m\right)^{10}$。"),
    choice("5a5", P + "5A-5。\n\n" + r"$\dfrac{d}{dx}\sinh^{-1}x$ 等于？", [r"$\dfrac{1}{\sqrt{x^2 + 1}}$", r"$\dfrac{1}{\sqrt{1 - x^2}}$", r"$\dfrac{1}{1 + x^2}$", r"$\cosh x$"], 0, r"$x = \sinh y$，$y' = 1/\cosh y = 1/\sqrt{1 + x^2}$。"),
    text("5a1", P + "5A-1。\n\n" + r"$\tan^{-1}\sqrt3$ 等于 $\pi$ 的几分之几？（写成分数，例如 `1/3`）", ["1/3"], r"$\tan(\pi/3) = \sqrt3$。"),
]

S = "改编自本节讲义。\n\n"
PRACTICE["ses21"] = [
    choice("sec", S + r"$\dfrac{d}{dx}\sec x$ 等于？", [r"$\sec x\tan x$", r"$\sec^2 x$", r"$-\csc x$", r"$\tan^2 x$"], 0, r"$(\cos x)^{-1}$ 用链式法则。"),
    choice("lnsec", S + r"$\dfrac{d}{dx}\ln(\sec x)$ 等于？", [r"$\tan x$", r"$\sec x$", r"$\dfrac{1}{\sec x}$", r"$\cot x$"], 0, r"$\dfrac{\sec x\tan x}{\sec x}$。"),
    text("eu", S + r"$\displaystyle\lim_{u \to 0} \frac{e^u - 1}{u}$ 等于多少？", ["1"], r"它就是 $e^u$ 在 $u = 0$ 处的导数。"),
]

E = "改编自考试 1 "
PRACTICE["exam1"] = [
    text("q1c", E + "第 1 题。\n\n" + r"$f(x) = xe^x$，$f^{(5)}(0)$ 等于多少？", ["5"], r"$f^{(n)}(x) = ne^x + xe^x$。"),
    text("q2", E + "第 2 题。\n\n" + r"星形线 $x^{2/3} + y^{2/3} = 4$ 在点 $(-\sqrt{27}, 1)$ 处的切线在 $y$ 轴上的截距是多少？", ["4"], r"斜率 $1/\sqrt3$，切线 $y = x/\sqrt3 + 4$。"),
    text("q3", E + "第 3 题。\n\n" + r"质点位置 $y(t) = t^3 - 3t + 3$（米），头三秒经过的总路程是多少米？", ["22"], r"$t = 1$ 时转向：下降 2 米，上升 20 米。"),
    text("q5", E + "第 5 题。\n\n" + r"使分段函数（$\tan^{-1}x$；$ax^2 + bx + c$；$x^3 - \tfrac14x^2 + 5$）处处可导的 $a$ 是多少？（写成分数或小数）", ["5/2", "2.5"], r"$c = 0$，$4a + 2b = 12$，$4a + b = 11$。"),
    text("q6", E + "第 6 题。\n\n" + r"$f(x + y) = f(x) + f(y) + x^2y + xy^2$，$\displaystyle\lim_{x \to 0} \frac{f(x)}{x} = 1$。$f'(2)$ 等于多少？", ["5"], r"$f'(x) = 1 + x^2$。"),
]

PRACTICE["ses23"] = [
    choice("lin", S + r"$f$ 在 $x_0$ 处的线性近似是？", [r"$f(x_0) + f'(x_0)(x - x_0)$", r"$f(x_0) + f'(x)(x - x_0)$", r"$f'(x_0)x$", r"$f(x_0) + f''(x_0)(x - x_0)$"], 0, "用切线代替曲线。"),
    text("ln11", S + r"用 $x = 1$ 处的线性近似 $\ln x \approx x - 1$，估计 $\ln 1.05$。", ["0.05", ".05"], r"$\ln 1.05 \approx 0.05$（真实值约 0.0488）。"),
    choice("powr", S + r"$x \approx 0$ 时 $(1 + x)^r$ 的线性近似是？", [r"$1 + rx$", r"$1 + x^r$", r"$rx$", r"$1 + (r - 1)x$"], 0, r"$f(0) = 1$，$f'(0) = r$。"),
    text("sin01", X + r"用 $\sin x \approx x$ 近似 $\sin(0.01)$，误差（近似值减真实值）大约是多少？（用科学计数法，例如 `1.7e-7`）", ["1.7e-7", "1.67e-7", "1.7×10^-7", "1.7*10^-7"], r"$\sin(0.01) = 0.0099998333\ldots$，误差约 $1.67 \times 10^{-7}$。"),
]

PRACTICE["ses24"] = [
    text("ln11b", S + r"用线性近似估计 $\ln(1.1)$。", ["0.1", ".1"], r"$\ln(1 + x) \approx x$。"),
    text("combo", S + r"$\dfrac{e^{-3x}}{\sqrt{1 + x}}$ 在 $x = 0$ 处的线性近似是 $1 + mx$，$m$ 等于多少？（写成分数或小数）", ["-7/2", "−7/2", "-3.5"], r"$(1 - 3x)(1 - \tfrac12x) \approx 1 - \tfrac72x$。"),
    choice("reltime", S + r"时间膨胀 $T_m = T/\sqrt{1 - v^2/c^2}$ 的相对误差 $\Delta T/T$ 约为？", [r"$\dfrac12\dfrac{v^2}{c^2}$", r"$\dfrac{v^2}{c^2}$", r"$\dfrac vc$", r"$-\dfrac12\dfrac{v^2}{c^2}$"], 0, r"$(1 - u)^{-1/2} \approx 1 + \tfrac12u$。"),
    choice("prod", X + r"$f \cdot g$ 的线性近似与 $f$、$g$ 线性近似之积相差多少？", [r"$f'(x_0)g'(x_0)(x - x_0)^2$", "两者完全相同", r"$f(x_0)g(x_0)$", r"$(f'(x_0) + g'(x_0))(x - x_0)$"], 0, r"$x$ 接近 $x_0$ 时可忽略。"),
]

PRACTICE["ses25"] = [
    choice("qformula", S + r"二次近似中 $(x - x_0)^2$ 的系数是？", [r"$\dfrac{f''(x_0)}{2}$", r"$f''(x_0)$", r"$2f''(x_0)$", r"$\dfrac{f'(x_0)}{2}$"], 0, r"$\frac12$ 保证近似式的二阶导数等于 $f''(x_0)$。"),
    text("ln11q", S + r"用二次近似 $\ln(1 + x) \approx x - \dfrac{x^2}{2}$ 估计 $\ln(1.1)$。", ["0.095", ".095"], r"$0.1 - 0.005$。"),
    choice("cosq", S + r"$x \approx 0$ 时 $\cos x$ 的二次近似是？", [r"$1 - \dfrac{x^2}{2}$", r"$1 + \dfrac{x^2}{2}$", r"$1 - x^2$", r"$x - \dfrac{x^2}{2}$"], 0, r"$f''(0) = -1$。"),
    text("e01", X + r"用 $e^x \approx 1 + x + \dfrac{x^2}{2}$ 估计 $e^{0.1}$。", ["1.105"], r"$1 + 0.1 + 0.005$。"),
]

PRACTICE["ses26"] = [
    text("q51", S + r"$\dfrac{e^{-3x}}{\sqrt{1 + x}} \approx 1 - \dfrac72x + cx^2$（$x \approx 0$），$c$ 等于多少？（写成分数）", ["51/8", "6.375"], r"$\frac92 + \frac32 + \frac38 = \frac{51}{8}$。"),
    choice("sqrtq", S + r"$x \approx 0$ 时 $\sqrt{1 + x}$ 的二次近似是？", [r"$1 + \dfrac x2 - \dfrac{x^2}{8}$", r"$1 + \dfrac x2 + \dfrac{x^2}{8}$", r"$1 + \dfrac x2$", r"$1 - \dfrac x2 + \dfrac{3x^2}{8}$"], 0, r"$r = \frac12$：$\frac{r(r-1)}{2} = -\frac18$。"),
    choice("taylor3", X + r"$f(x)$ 在 0 附近的最佳三次近似中，$x^3$ 的系数是？", [r"$\dfrac{f'''(0)}{6}$", r"$f'''(0)$", r"$\dfrac{f'''(0)}{3}$", r"$\dfrac{f'''(0)}{2}$"], 0, r"一般地 $a_n = f^{(n)}(0)/n!$。"),
]

PRACTICE["ses27"] = [
    choice("crit", S + r"$x_0$ 叫做 $f$ 的临界点，是指？", [r"$f'(x_0) = 0$", r"$f''(x_0) = 0$", r"$f(x_0) = 0$", r"$f$ 在 $x_0$ 处不连续"], 0, "临界值是 $f(x_0)$。"),
    text("crit-val", S + r"$f(x) = 3x - x^3$ 在 $x = 1$ 处的临界值是多少？", ["2"], r"$f(1) = 3 - 1 = 2$，是局部极大值。"),
    text("asym", S + r"$f(x) = \dfrac{x + 1}{x + 2}$ 的水平渐近线是 $y = $ ？", ["1"], r"$x \to \pm\infty$ 时 $f(x) \to 1$。"),
    choice("concave", S + r"$f''(x) > 0$ 的区间上，$f$ 的图像是？", ["向上凹（下凸），切线斜率在增大", "向下凹（上凸）", "递增", "递减"], 0, r"$f''$ 是 $f'$ 的导数；$f'' > 0$ 说明斜率在增大。"),
]

PRACTICE["ses28"] = [
    text("xlnx-crit", S + r"$f(x) = \dfrac{x}{\ln x}$（$x > 1$）的最低点的横坐标是多少？（写成 `e`）", ["e"], r"$f'(x) = \dfrac{\ln x - 1}{(\ln x)^2} = 0 \Rightarrow x = e$。"),
    choice("xlnx-infl", S + r"$f(x) = \dfrac{x}{\ln x}$ 的拐点在哪里？", [r"$x = e^2$", r"$x = e$", r"$x = 1$", "没有拐点"], 0, r"$f''(x) = \dfrac{2 - \ln x}{x(\ln x)^3}$ 在 $x = e^2$ 处变号。"),
    text("cubic", X + r"$f(x) = ax^3 + bx^2 + cx + d$ 在 $x = 1$、$x = 3$ 处有临界点，$x = 2$ 处有拐点，且 $a = -\dfrac16$。$b$ 是多少？", ["1"], r"$f'(x) = -\frac12(x - 1)(x - 3) = -\frac12x^2 + 2x - \frac32$，所以 $3a = -\frac12$，$2b = 2$。"),
]

P = "改编自习题课 3 的官方练习题 "
PRACTICE["ps3"] = [
    text("2a3", P + "2A-3。\n\n" + r"$\dfrac{(1 + x)^{3/2}}{1 + 2x}$ 在 0 处的线性近似是 $1 + mx$，$m$ 等于多少？（写成分数或小数）", ["-1/2", "−1/2", "-0.5"], r"$(1 + \frac32x)(1 - 2x) \approx 1 - \frac12x$。"),
    text("2a12a", P + "2A-12。\n\n" + r"$\dfrac{e^x}{1 - x} \approx 1 + 2x + cx^2$（$x \approx 0$），$c$ 等于多少？（写成分数或小数）", ["5/2", "2.5"], r"$(1 + x + \frac12x^2)(1 + x + x^2)$ 的 $x^2$ 系数是 $1 + 1 + \frac12$。"),
    choice("2a12d", P + "2A-12。\n\n" + r"$x \approx 0$ 时 $\ln(\cos x)$ 的二次近似是？", [r"$-\dfrac{x^2}{2}$", r"$\dfrac{x^2}{2}$", r"$-x$", r"$1 - \dfrac{x^2}{2}$"], 0, r"$\ln(1 - \frac{x^2}{2}) \approx -\frac{x^2}{2}$。"),
    choice("2b2h", P + "2B-2。\n\n" + r"$y = e^{-x^2}$ 的拐点在哪里？", [r"$x = \pm\dfrac{1}{\sqrt2}$", r"$x = 0$", r"$x = \pm1$", "没有拐点"], 0, r"$y'' = (4x^2 - 2)e^{-x^2}$。"),
    choice("2b7", P + "2B-7。\n\n" + r"$f$ 处处递增并且可导。关于 $f'$，下面哪个一定正确？", [r"$f'(x) \ge 0$", r"$f'(x) > 0$", r"$f'(x) = 0$ 至少有一个解", r"$f'$ 也递增"], 0, r"$x^3$ 递增但 $f'(0) = 0$：极限只保持非严格不等式。"),
]

PRACTICE["ses29"] = [
    choice("where", S + "求函数的最大值和最小值时，需要检查哪些点？", ["临界点、端点和间断点", "只有临界点", "只有端点", "只有二阶导数为零的点"], 0, "最值可能在端点取到，例如两个正方形问题里的最大面积。"),
    text("squares-min", S + r"长为 1 的铁丝剪成两段，各围成一个正方形。两个正方形的总面积最小是多少？（写成分数）", ["1/32", "0.03125"], r"$A = \frac{x^2 + (1 - x)^2}{16}$，在 $x = \frac12$ 处取最小值。"),
    text("squares-max", S + r"同一问题，总面积最大是多少？（写成分数）", ["1/16", "0.0625"], "在端点 $x = 0$ 或 $1$：整根铁丝围一个正方形。"),
]

PRACTICE["ses30"] = [
    text("box", S + r"体积固定、表面积最小的无盖方底盒子，底边长 $x$ 与高 $y$ 之比 $x/y$ 是多少？", ["2"], r"$\frac{dA}{dx} = 2x - 4y = 0$。"),
    choice("dimless", S + r"为什么用 $x/y$ 这样的无量纲量来回答最好？", ["它与体积和单位无关，直接给出最佳形状", "它总是整数", "它让计算更快", "题目要求的"], 0, "比例对任何尺度的盒子都相同。"),
    choice("can", X + "容积固定、表面积最小的圆柱形罐子，高 $h$ 和半径 $r$ 的关系是？", [r"$h = 2r$", r"$h = r$", r"$h = \pi r$", r"$h = 4r$"], 0, r"$r^3 = \frac{1}{2\pi}$，$h = \frac{1}{\pi r^2} = 2r$。"),
]

PRACTICE["ses31"] = [
    text("radar", S + r"警察离路边 30 英尺，你的车离测速雷达 50 英尺时，雷达测到距离以每秒 80 英尺减小。你的车速是每秒多少英尺？", ["100"], r"$30^2 + x^2 = D^2$，$x' = DD'/x = 50 \cdot 80/40$。"),
    text("cone", S + r"倒立圆锥形水箱顶部半径 4 英尺、深 10 英尺，以每分钟 2 立方英尺注水。水深 5 英尺时，水面上升速度是 $1/(k\pi)$ 英尺/分钟，$k$ 是多少？", ["2"], r"$V = \frac{4}{75}\pi h^3$，$V' = \frac{4}{25}\pi h^2h'$，$2 = 4\pi h'$。"),
    choice("order", S + "解相关变化率问题时，什么时候代入给定的数值？", ["求完导数之后", "求导之前", "画图之前", "什么时候都行"], 0, "先代入会把变量误当成常数，导数就变成 0 了。"),
]

PRACTICE["ses32"] = [
    choice("ring", S + "绳上的圆环停在最低点时，两段绳子与竖直方向的夹角 $\\alpha$、$\\beta$ 满足？", [r"$\alpha = \beta$", r"$\alpha + \beta = 90^\circ$", r"$\alpha = 2\beta$", "没有固定关系"], 0, r"临界点条件化为 $\sin\alpha = \sin\beta$。"),
    text("ring-y", S + r"绳长 $L = 5$，两端在 $(0, 0)$ 和 $(3, 0)$。圆环最低点的纵坐标 $y$ 是多少？", ["-2", "−2"], r"$y = \frac12(b - \sqrt{L^2 - a^2}) = \frac12(0 - 4)$。"),
]

PRACTICE["ses33"] = [
    choice("newton", S + "牛顿法的迭代公式是？", [r"$x_{n+1} = x_n - \dfrac{f(x_n)}{f'(x_n)}$", r"$x_{n+1} = x_n - \dfrac{f'(x_n)}{f(x_n)}$", r"$x_{n+1} = x_n + f(x_n)$", r"$x_{n+1} = \dfrac{x_n + f(x_n)}{2}$"], 0, "取切线与 $x$ 轴的交点。"),
    text("sqrt5", S + r"用牛顿法解 $x^2 = 5$，从 $x_0 = 2$ 开始，$x_1$ 是多少？（写成分数）", ["9/4", "2.25"], r"$x_1 = \frac12x_0 + \frac{5}{2x_0} = 1 + \frac54$。"),
    choice("digits", S + "牛顿法在好的情况下，误差 $E_{n+1}$ 和 $E_n$ 的关系大约是？", [r"$E_{n+1} \sim E_n^2$（准确位数每步翻倍）", r"$E_{n+1} \sim E_n/2$", r"$E_{n+1} \sim E_n - 1$", r"$E_{n+1} \sim \sqrt{E_n}$"], 0, "例如 $10^{-2}, 10^{-4}, 10^{-8}$。"),
    text("cube", X + r"对 $f(x) = x^3$ 用牛顿法，$x_{n+1}$ 等于 $x_n$ 的多少倍？（写成分数）", ["2/3"], r"$x - \frac{x^3}{3x^2} = \frac23x$。"),
]

P = "改编自习题课 4 的官方练习题 "
PRACTICE["ps4"] = [
    text("2c1", P + "2C-1。\n\n" + r"从 12 × 12 英寸的硬纸板四角各剪去边长 $x$ 的正方形，折成无盖盒子。$x$ 等于多少英寸时体积最大？", ["2"], r"$V = x(12 - 2x)^2$，$V' = (12 - 2x)(12 - 6x)$。"),
    text("2c2", P + "2C-2。\n\n" + r"三面用篱笆、一面靠墙围出 20000 平方英尺的矩形畜栏，篱笆最短是多少英尺？", ["400"], r"$L = 2x + 20000/x$，$x = 100$，$y = 200$。"),
    text("2c13", P + "2C-13。\n\n" + r"票价 200 美元时坐满 100 人，每涨 5 美元少 2 人。收入最大的票价是多少美元？", ["225"], r"$R = p(180 - \frac25p)$，$R' = 180 - \frac45p$。"),
    text("2e5", P + "2E-5。\n\n" + r"绳子在滑轮下方 10 英尺处握着，重物以每秒 4 英尺上升。人离滑轮正下方 20 英尺时，走路速度是每秒多少英尺？（写成 `2√5` 或小数）", ["2√5", "2sqrt(5)", "2*sqrt(5)", "4.47", "4.472"], r"$x' = zz'/x = 4\sqrt{500}/20$。"),
    text("2e7", P + "2E-7。\n\n" + r"梯形水槽（下底 $\frac12$ 米、两腰 45°、长 4 米）以每秒 1 立方米注水。水深半米时水面上升速度是每秒多少米？（写成分数）", ["1/6"], r"$V = 4(h^2 + h/2)$，$1 = (8h + 2)h' = 6h'$。"),
    text("2f1", P + "2F-1。\n\n" + r"$\cos x = x$ 的根精确到小数点后 3 位是多少？", ["0.739", ".739"], "牛顿法从 1 开始，两步就准确到三位小数。"),
]

PRACTICE["ses34"] = [
    choice("mvt", S + "中值定理说：如果 $f$ 在 $[a, b]$ 上连续、在 $(a, b)$ 上可导，那么？", [r"存在 $c \in (a, b)$ 使 $f'(c) = \dfrac{f(b) - f(a)}{b - a}$", r"$f'(a) = f'(b)$", r"存在 $c$ 使 $f(c) = 0$", r"$f$ 在 $(a, b)$ 上单调"], 0, "割线斜率等于某处的切线斜率。"),
    text("trip", S + "6 小时飞了 3000 千米，中值定理保证某一时刻的速度恰好是每小时多少千米？", ["500"], "平均速度 3000/6。"),
    choice("abs", S + r"为什么中值定理不能用在 $[-1, 2]$ 上的 $f(x) = |x|$？", [r"$f$ 在 $x = 0$ 处不可导", r"$f$ 不连续", r"$f(-1) \ne f(2)$", "区间太长"], 0, "定理要求在整个开区间上可导。"),
    text("taylor-err", X + r"$f(x) = x^3 + 2x + 1$ 在 $x = 1$ 处的二次近似为 $P(x) = 4 + 5(x - 1) + 3(x - 1)^2$。$f(3) - P(3)$ 等于多少？", ["8"], r"$34 - 26$；也等于 $\frac{f'''(c)}{3!} \cdot 2^3 = 8$。"),
]

PRACTICE["ses35"] = [
    choice("bound", S + r"中值定理在解题中常用的形式是？", [r"$\min f' \le \dfrac{f(b) - f(a)}{b - a} \le \max f'$", r"$f(b) = f(a)$", r"$f'(a) \le f'(b)$", r"$f(b) - f(a) = f'(a)(b - a)$"], 0, "平均速度介于最低速度和最高速度之间。"),
    choice("ex", S + r"$x > 0$ 时，下面哪个不等式成立？", [r"$e^x > 1 + x + \dfrac{x^2}{2}$", r"$e^x < 1 + x$", r"$e^x < 1 + x + \dfrac{x^2}{2}$", r"$e^x = 1 + x$"], 0, r"令 $g = e^x - (1 + x + \frac{x^2}{2})$，$g(0) = 0$，$g' > 0$。"),
    choice("sin", X + r"对任意 $a$、$b$，$|\sin b - \sin a|$ 与 $|b - a|$ 的关系是？", [r"$|\sin b - \sin a| \le |b - a|$", r"$|\sin b - \sin a| \ge |b - a|$", "两者相等", "无法比较"], 0, r"$|\cos x| \le 1$。"),
]

PRACTICE["ses36"] = [
    choice("diff", S + r"$y = f(x)$ 的微分 $dy$ 是？", [r"$f'(x)\,dx$", r"$f(x)\,dx$", r"$f'(x)$", r"$\dfrac{f(x)}{dx}$"], 0, r"$\dfrac{dy}{dx} = f'(x)$ 可以看作两个微分之商。"),
    text("cuberoot", S + r"用微分估计 $(64.1)^{1/3}$。（保留三位小数）", ["4.002"], r"$dy = \frac{1}{48}dx = \frac{1}{480}$。"),
    choice("attract", X + r"$P(x) = ax(b - x)$，$1 < ab < 3$ 时，不动点 $\dfrac{ab - 1}{a}$ 是？", ["吸引的，因为 $|P'| = |2 - ab| < 1$", "不吸引的", "不是不动点", "无法判断"], 0, r"$P'(x) = ab - 2ax$。"),
]

PRACTICE["ses37"] = [
    choice("intsin", S + r"$\displaystyle\int \sin x\,dx$ 等于？", [r"$-\cos x + c$", r"$\cos x + c$", r"$-\sin x + c$", r"$\sin x + c$"], 0, r"$(-\cos x)' = \sin x$。"),
    choice("int1x", S + r"$\displaystyle\int \frac{dx}{x}$ 等于？", [r"$\ln|x| + c$", r"$\dfrac{x^0}{0} + c$", r"$-\dfrac{1}{x^2} + c$", r"$\ln x$（只在 $x > 0$ 时有定义，没有 $c$）"], 0, r"$x < 0$ 时 $\frac{d}{dx}\ln(-x) = \frac1x$。"),
    choice("arcsin", S + r"$\displaystyle\int \frac{dx}{\sqrt{1 - x^2}}$ 等于？", [r"$\sin^{-1}x + c$", r"$\tan^{-1}x + c$", r"$\sqrt{1 - x^2} + c$", r"$\ln(1 - x^2) + c$"], 0, "把 $\\frac{d}{dx}\\sin^{-1}x$ 的公式倒过来读。"),
    text("x3", S + r"$\displaystyle\int x^3\,dx = kx^4 + c$，$k$ 等于多少？（写成分数）", ["1/4", "0.25"], r"$\frac{x^{a+1}}{a + 1}$。"),
]

PRACTICE["ses38"] = [
    choice("sub", S + r"$\displaystyle\int x^3(x^4 + 2)^5\,dx$ 等于？", [r"$\dfrac{(x^4 + 2)^6}{24} + c$", r"$\dfrac{(x^4 + 2)^6}{6} + c$", r"$x^4(x^4 + 2)^6 + c$", r"$\dfrac{(x^4 + 2)^6}{4} + c$"], 0, r"$u = x^4 + 2$，$x^3\,dx = \frac14du$。"),
    choice("e6x", S + r"$\displaystyle\int e^{6x}\,dx$ 等于？", [r"$\dfrac16e^{6x} + c$", r"$6e^{6x} + c$", r"$e^{6x} + c$", r"$\dfrac{e^{6x+1}}{6x + 1} + c$"], 0, "猜 $e^{6x}$，求导多出因子 6，再除掉。"),
    choice("xex2", S + r"$\displaystyle\int xe^{-x^2}\,dx$ 等于？", [r"$-\dfrac12e^{-x^2} + c$", r"$\dfrac12e^{-x^2} + c$", r"$-2e^{-x^2} + c$", r"$\dfrac{x^2}{2}e^{-x^2} + c$"], 0, r"$(e^{-x^2})' = -2xe^{-x^2}$。"),
    choice("xlnx", S + r"$\displaystyle\int \frac{dx}{x\ln x}$（$x > 1$）等于？", [r"$\ln(\ln x) + c$", r"$\dfrac{1}{\ln x} + c$", r"$\ln x + c$", r"$\dfrac{(\ln x)^2}{2} + c$"], 0, r"$u = \ln x$，$du = dx/x$。"),
    choice("tansec", X + r"$\dfrac12\tan^2 x$ 和 $\dfrac12\sec^2 x$ 都是 $\tan x\sec^2 x$ 的原函数，它们相差？", [r"常数 $\dfrac12$", "它们相等", r"$\tan x$", "其中一个算错了"], 0, r"$\tan^2 x = \sec^2 x - 1$。"),
]

PRACTICE["ses39"] = [
    choice("sep", S + r"$\dfrac{dy}{dx} = -xy$ 的通解是？", [r"$y = ae^{-x^2/2}$", r"$y = -\dfrac{x^2}{2}y$", r"$y = ae^{-x}$", r"$y = a - \dfrac{x^2}{2}$"], 0, r"分离变量：$\frac{dy}{y} = -x\,dx$。"),
    text("ic", S + r"$\dfrac{dy}{dx} = -xy$，$y(0) = 3$。$y(0)$ 处的常数 $a$ 是多少？", ["3"], r"$y = ae^{-x^2/2}$，$y(0) = a$。"),
    choice("lost", S + r"用分离变量法解 $\dfrac{dy}{dx} = -xy$ 时，容易漏掉哪个解？为什么？", [r"$y = 0$，因为分离变量时除以了 $y$", r"$y = e^{-x^2/2}$，因为常数取错了", r"$y = x$，因为积分常数", "不会漏掉任何解"], 0, "除以可能为零的量后，要单独检查它为零的情形。"),
    text("check", X + r"$y = ke^x$ 是 $4y'' - y = e^x$ 的解，$k$ 等于多少？（写成分数）", ["1/3"], r"$4k - k = 1$。"),
]

PRACTICE["ses40"] = [
    choice("parab", S + r"每点切线斜率是原点到该点射线斜率两倍的曲线族是？", [r"$y = ax^2$", r"$y = ax$", r"$y = ae^{2x}$", r"$y^2 + \dfrac{x^2}{2} = c$"], 0, r"$\frac{dy}{dx} = \frac{2y}{x}$，分离变量得 $\ln|y| = 2\ln|x| + c$。"),
    choice("ortho", S + r"与抛物线族 $y = ax^2$ 处处垂直的曲线族是？", [r"椭圆 $y^2 + \dfrac{x^2}{2} = c$", "双曲线", "直线", "圆"], 0, r"$\frac{dy}{dx} = -\frac{x}{2y}$。"),
    choice("logistic", X + r"$\dfrac{dy}{dx} = ry(s - y)$ 的解在 $x \to \infty$ 时趋于？", [r"$s$", r"$0$", r"$\infty$", r"$r$"], 0, r"$y = \frac{sae^{srx}}{1 + ae^{srx}} \to s$。"),
]

P = "改编自习题课 5 的官方练习题 "
PRACTICE["ps5"] = [
    choice("2g1", P + "2G-1。\n\n" + r"对 $\ln x$ 在 $[1, 2]$ 上，中值定理中的 $c$ 是？", [r"$\dfrac{1}{\ln 2}$", r"$\ln 2$", r"$\dfrac32$", r"$\sqrt2$"], 0, r"$\frac1c = \ln 2$。"),
    choice("3a2c", P + "3A-2。\n\n" + r"$\displaystyle\int \sqrt{8 + 9x}\,dx$ 等于？", [r"$\dfrac{2}{27}(8 + 9x)^{3/2} + c$", r"$\dfrac23(8 + 9x)^{3/2} + c$", r"$\dfrac{27}{2}(8 + 9x)^{3/2} + c$", r"$\dfrac{1}{9}(8 + 9x)^{1/2} + c$"], 0, "猜 $(8 + 9x)^{3/2}$，再修正系数。"),
    choice("3a2k", P + "3A-2。\n\n" + r"$\displaystyle\int \frac{x}{x + 5}\,dx$ 等于？", [r"$x - 5\ln(x + 5) + c$", r"$\ln(x + 5) + c$", r"$x + 5\ln(x + 5) + c$", r"$\dfrac{x^2}{2(x + 5)} + c$"], 0, r"$\frac{x}{x + 5} = 1 - \frac{5}{x + 5}$。"),
    choice("3a3g", P + "3A-3。\n\n" + r"$\displaystyle\int \sec^9 x\tan x\,dx$ 等于？", [r"$\dfrac19\sec^9 x + c$", r"$\dfrac{1}{10}\sec^{10} x + c$", r"$\sec^8 x + c$", r"$9\sec^9 x + c$"], 0, r"$u = \sec x$，$du = \sec x\tan x\,dx$。"),
    choice("3f2a", P + "3F-2。\n\n" + r"$\dfrac{dy}{dx} = 4xy$，$y(1) = 3$。$y(3)$ 等于？", [r"$3e^{16}$", r"$3e^{18}$", r"$e^{16}$", r"$3e^{8}$"], 0, r"$\ln y = 2x^2 + \ln 3 - 2$。"),
    text("3f4d", P + "3F-4。\n\n" + r"金属锭从 680 °C 放进 40 °C 的房间，8 小时冷却到 200 °C。冷却到 50 °C 需要多少小时？", ["24"], r"温差从 640 降到 160 是 $\frac14$，降到 10 是 $\frac{1}{64} = (\frac14)^3$，要 3 个 8 小时。"),
]

PRACTICE["ses41"] = [
    choice("theme", S + "「导数的应用」这个单元的主题是什么？", ["关于函数导数的信息，告诉我们关于函数本身的信息", "求导公式越多越好", "积分比求导重要", "所有函数都可以线性近似"], 0, "作图、最值、近似、中值定理都是这个思路。"),
]

E = "改编自考试 2 "
PRACTICE["exam2"] = [
    text("q1", E + "第 1 题。\n\n" + r"用 $\ln x$ 在 $x = 1$ 处的二次近似估计 $\ln(1.2)$。", ["0.18", ".18"], r"$0.2 - \frac12(0.2)^2$。"),
    choice("q2", E + "第 2 题。\n\n" + r"盐以每分钟 30 立方英尺堆成高等于底面直径的圆锥。高 10 英尺时高的增长速度是？", [r"$\dfrac{6}{5\pi}$ 英尺/分钟", r"$\dfrac{3}{10\pi}$ 英尺/分钟", r"$\dfrac{12}{\pi}$ 英尺/分钟", "3 英尺/分钟"], 0, r"$V = \frac{\pi}{12}h^3$，$h' = \frac{4V'}{\pi h^2} = \frac{120}{100\pi}$。"),
    choice("q3", E + "第 3 题。\n\n" + r"$f(x) = x - 3x^{1/3}$ 的局部极小值点是？", [r"$(1, -2)$", r"$(-1, 2)$", r"$(0, 0)$", r"$(3\sqrt3, 0)$"], 0, r"$f'(x) = 1 - x^{-2/3}$，在 $x = 1$ 处由负变正。"),
    choice("q4", E + "第 4 题。\n\n" + r"圆柱加半球顶的储罐（有底），体积固定、表面积最小时，圆柱部分的高 $h$ 和半径 $r$ 的关系是？", [r"$h = r$", r"$h = 2r$", r"$h = 0$", r"$h = \frac12r$"], 0, r"$SA = \frac53\pi r^2 + \frac{2V}{r}$，临界点处 $h = r$。"),
    choice("q5", E + "第 5 题。\n\n" + r"对 $f(x) = x^3 - 3x + 7$ 从 $x_1 = 2$ 用牛顿法，为什么会失败？", [r"$x_2 = 1$ 处 $f'(1) = 0$，切线水平", "收敛到另一个根", "在两个值之间循环", r"$f$ 没有实根"], 0, r"$x_2 = 2 - 9/9 = 1$，$x_3$ 要除以 $f'(1) = 0$。"),
]

PRACTICE["ses43"] = [
    choice("def", S + r"定积分 $\displaystyle\int_a^b f(x)\,dx$ 的几何意义是？", [r"$f(x)$ 的图像在 $a$ 到 $b$ 之间、$x$ 轴上方的面积（按符号计）", r"$f(b) - f(a)$", r"$f$ 在 $[a, b]$ 上的最大值", r"$f$ 的图像在 $a$ 到 $b$ 之间的长度"], 0, "把区域分成矩形，求面积之和的极限。"),
    choice("steps", S + "用矩形定义定积分的三个步骤依次是？", ["分成矩形、求面积之和、取矩形无穷细时的极限", "求导、代入、取极限", "求原函数、代入上下限、相减", "画图、量长度、相乘"], 0, "矩形越细，面积之和越接近曲线下方的面积。"),
]

PRACTICE["ses44"] = [
    text("x2", S + r"$\displaystyle\int_0^3 x^2\,dx$ 等于多少？", ["9"], r"$\frac{b^3}{3} = \frac{27}{3}$。"),
    text("sumsq", S + r"$\displaystyle\lim_{n \to \infty} \frac{1}{n^3}\sum_{i=1}^n i^2$ 等于多少？（写成分数）", ["1/3"], "阶梯金字塔夹在两个普通金字塔之间。"),
    text("sum1", X + r"$\displaystyle\sum_{k=1}^5 k^2$ 等于多少？", ["55"], "$1 + 4 + 9 + 16 + 25$。"),
    text("sum2", X + r"$\displaystyle\sum_{k=0}^5 2^k$ 等于多少？", ["63"], "$1 + 2 + 4 + 8 + 16 + 32$。"),
]

PRACTICE["ses45"] = [
    text("int-x", S + r"$\displaystyle\int_0^4 x\,dx$ 等于多少？", ["8"], r"三角形面积 $\frac12 \cdot 4 \cdot 4$。"),
    choice("pattern", S + r"按规律，$\displaystyle\int_0^b x^3\,dx$ 等于？", [r"$\dfrac{b^4}{4}$", r"$\dfrac{b^3}{3}$", r"$3b^2$", r"$b^4$"], 0, r"$x^n \to \frac{b^{n+1}}{n + 1}$。"),
    text("abs", X + r"$\displaystyle\int_{-1}^2 |x|\,dx$ 等于多少？（写成分数或小数）", ["5/2", "2.5"], r"两个三角形：$\frac12 + 2$。"),
]

PRACTICE["ses46"] = [
    choice("riemann", S + "黎曼和的极限 $\\displaystyle\\lim_{n \\to \\infty}\\sum_{i=1}^n f(c_i)\\Delta x$ 等于？", [r"$\displaystyle\int_a^b f(x)\,dx$", r"$f(b) - f(a)$", r"$f'(c)$", r"$\dfrac{b - a}{n}$"], 0, "$c_i$ 可以取小区间里的任何一点。"),
    choice("debt", S + r"按连续复利 $r$，第 $t$ 年借的一笔钱到年底（$t = 1$）会增长为原来的多少倍？", [r"$e^{r(1 - t)}$", r"$e^{rt}$", r"$1 + r$", r"$e^r$"], 0, "剩下的时间是 $1 - t$ 年。"),
    text("left", X + r"用 $n = 6$ 的左黎曼和估计 $\displaystyle\int_0^2 (3x + 2)\,dx$，结果是多少？", ["9"], r"$(2 + 3 + 4 + 5 + 6 + 7) \cdot \frac13$；精确值是 10。"),
]

PRACTICE["ses47"] = [
    choice("ftc", S + r"微积分基本定理说：如果 $f$ 连续且 $F' = f$，那么 $\displaystyle\int_a^b f(x)\,dx$ 等于？", [r"$F(b) - F(a)$", r"$F(a) - F(b)$", r"$f(b) - f(a)$", r"$F'(b) - F'(a)$"], 0, "它把定积分和原函数联系起来。"),
    text("sinhump", S + r"$\displaystyle\int_0^\pi \sin x\,dx$ 等于多少？", ["2"], r"$-\cos\pi + \cos 0 = 1 + 1$。"),
    text("x100", S + r"$\displaystyle\int_0^1 x^{100}\,dx$ 等于多少？（写成分数）", ["1/101"], r"$\frac{x^{101}}{101}\big|_0^1$。"),
    text("int1x", X + r"$\displaystyle\int_1^e \frac{dx}{x}$ 等于多少？", ["1"], r"$\ln e - \ln 1$。"),
]

PRACTICE["ses48"] = [
    text("sin2pi", S + r"$\displaystyle\int_0^{2\pi} \sin x\,dx$ 等于多少？", ["0"], "$x$ 轴上方和下方的面积相互抵消。"),
    choice("net", S + r"如果 $v(t)$ 是速度，$\displaystyle\int_a^b v(t)\,dt$ 表示？", ["$a$ 到 $b$ 之间的净位移", "$a$ 到 $b$ 之间走过的总路程", "平均速度", "最大速度"], 0, "总路程要对 $|v(t)|$ 积分。"),
    choice("swap", S + r"$\displaystyle\int_3^1 f(x)\,dx$ 等于？", [r"$-\displaystyle\int_1^3 f(x)\,dx$", r"$\displaystyle\int_1^3 f(x)\,dx$", "0", r"$f(1) - f(3)$"], 0, r"$F(1) - F(3) = -(F(3) - F(1))$。"),
    text("sincos", X + r"$\displaystyle\int_0^\pi (\sin x + \cos x)\,dx$ 等于多少？", ["2"], r"$\int_0^\pi \cos x\,dx = 0$。"),
]

PRACTICE["ses49"] = [
    choice("ebound", S + r"由 $x \ge 0$ 时 $e^x \ge 1 + x$ 两边从 0 到 $b$ 积分，得到？", [r"$e^b \ge 1 + b + \dfrac{b^2}{2}$（$b \ge 0$）", r"$e^b \le 1 + b$", r"$e^b \ge 2b$", r"$e^b \ge b^2$"], 0, "积分保持不等式（下限小于上限时）。"),
    choice("limits", S + r"用 $u = x^3 + 2$ 计算 $\displaystyle\int_1^2 (x^3 + 2)^5x^2\,dx$，新的积分上下限是？", [r"从 3 到 10", "从 1 到 2", "从 1 到 8", "从 0 到 10"], 0, r"$u(1) = 3$，$u(2) = 10$。"),
    choice("signchange", S + r"用 $u = x^2$ 计算 $\displaystyle\int_{-1}^1 x^2\,dx$ 会得到 0，错在哪里？", [r"$u' = 2x$ 在区间里变号，必须拆开积分", "$x^2$ 的原函数求错了", "上下限应该是 0 到 1", "没有错，积分就是 0"], 0, r"正确值是 $\frac23$。"),
    text("sub", X + r"$\displaystyle\int_0^{\pi/2} \sin^5 x\cos x\,dx$ 等于多少？（写成分数）", ["1/6"], r"$u = \sin x$，从 0 到 1 积 $u^5$。"),
]

PRACTICE["ses50"] = [
    choice("avg", S + r"$\dfrac{1}{b - a}\displaystyle\int_a^b f(x)\,dx$ 是？", [r"$f$ 在 $[a, b]$ 上的平均值", r"$f$ 在 $[a, b]$ 上的最大值", r"$f'$ 的平均值", r"$f(b) - f(a)$"], 0, "黎曼和除以区间长度的极限。"),
    text("bound", S + r"$F'(x) = \dfrac{1}{1 + x}$，$F(0) = 1$。由估计可知 $F(4) < B$，最好的 $B$（用常数矩形估计）是多少？", ["5"], r"$F(4) - F(0) < 4 \cdot 1$。"),
    text("ln5", X + r"用中值定理估计 $\displaystyle\int_1^5 \frac{dx}{x}$，下界是多少？（写成小数）", ["0.8", ".8", "4/5"], r"$\frac4c$，$c < 5$。"),
]

P = "改编自习题课 6 的官方练习题 "
PRACTICE["ps6"] = [
    text("3b3", P + "3B-3。\n\n" + r"用 4 个小区间，$\displaystyle\int_{-1}^3 x^2\,dx$ 的右黎曼和是多少？", ["14"], r"$0 + 1 + 4 + 9$。"),
    choice("3b5", P + "3B-5。\n\n" + r"$\displaystyle\lim_{n \to \infty} \frac1n\sum_{i=1}^n \sin\frac{ib}{n}$ 等于？", [r"$\dfrac{1 - \cos b}{b}$", r"$\dfrac{\cos b - 1}{b}$", r"$\sin b$", r"$1 - \cos b$"], 0, r"它是 $\int_0^1 \sin(bx)\,dx$ 的右黎曼和。"),
    text("3c1", P + "3C-1。\n\n" + r"$y = \dfrac{1}{\sqrt{x - 2}}$ 在 $3 \le x \le 6$ 上下方的面积是多少？", ["2"], r"$2\sqrt{x - 2}\big|_3^6 = 4 - 2$。"),
    choice("3e6", P + "3E-6。\n\n" + r"为什么 $\displaystyle\int_0^\pi \sin^2 x\,dx < 2$？", [r"在 $(0, \pi)$ 上 $\sin^2 x < \sin x$，而 $\int_0^\pi \sin x\,dx = 2$", r"$\sin^2 x$ 的最大值小于 2", r"$\pi < 2$", r"$\sin^2 x$ 是负的"], 0, r"$0 < \sin x < 1$。"),
    choice("4j2", P + "4J-2。\n\n" + r"$x_0e^{-kt}$ 克物质每克每分钟产生 $r$ 单位辐射，一小时产生的辐射是？", [r"$\dfrac{rx_0}{k}(1 - e^{-60k})$", r"$60rx_0$", r"$rx_0e^{-60k}$", r"$\dfrac{rx_0}{k}e^{-60k}$"], 0, r"$\int_0^{60} rx_0e^{-kt}\,dt$。"),
]

PRACTICE["ses51"] = [
    choice("ftc2", S + r"$\dfrac{d}{dx}\displaystyle\int_1^x \frac{dt}{t^2}$ 等于？", [r"$\dfrac{1}{x^2}$", r"$1 - \dfrac1x$", r"$-\dfrac{2}{x^3}$", "0"], 0, "第二基本定理：照抄被积函数，把 $t$ 换成 $x$。"),
    choice("dummy", S + r"在 $G(x) = \displaystyle\int_a^x f(t)\,dt$ 中，$t$ 是？", ["积分变量（哑变量），可以换成任何别的字母", "和 $x$ 相同的变量", "一个常数", "$G$ 的自变量"], 0, "不要把 $t$ 和 $x$ 搞混。"),
    text("ftc2b", S + r"$G(x) = \displaystyle\int_0^x \sqrt{1 + t^3}\,dt$，$G'(2)$ 等于多少？", ["3"], r"$G'(x) = \sqrt{1 + x^3}$，$G'(2) = \sqrt9$。"),
]

PRACTICE["ses52"] = [
    choice("proof", S + r"证明 $F(x) = \displaystyle\int_a^x f(t)\,dt$ 满足 $F' = f$ 时，$\Delta F$ 近似为？", [r"底为 $\Delta x$、高为 $f(x)$ 的矩形面积 $f(x)\Delta x$", r"$F(x)\Delta x$", r"$f'(x)\Delta x$", r"$\dfrac{f(x)}{\Delta x}$"], 0, "细长条区域近似为矩形。"),
    choice("key", S + "微积分第一基本定理的证明中，关键的一步是？", ["导数相同的两个函数只相差一个常数", "所有函数都连续", "定积分总是正的", "黎曼和总能精确计算"], 0, "由中值定理推出。"),
]

PRACTICE["ses53"] = [
    choice("ln", S + r"$\displaystyle\int_1^x \frac{dt}{t}$ 等于？", [r"$\ln x$", r"$\dfrac{1}{x}$", r"$x - 1$", r"$-\dfrac{1}{x^2}$"], 0, r"它是 $L' = \frac1x$、$L(1) = 0$ 的解。"),
    choice("bell", S + r"$F(x) = \displaystyle\int_0^x e^{-t^2}\,dt$ 能用初等函数（多项式、指数、对数、三角函数的组合）表示吗？", ["不能，它是一个全新的函数", "能，等于 $e^{-x^2}$", r"能，等于 $-\dfrac{1}{2x}e^{-x^2}$", r"能，等于 $\ln(1 + x^2)$"], 0, "用定积分可以定义新的函数。"),
]

PRACTICE["ses54"] = [
    choice("lprod", S + r"用 $L(x) = \displaystyle\int_1^x \frac{dt}{t}$ 证明 $L(ab) = L(a) + L(b)$ 的关键一步是？", [r"在 $\int_a^{ab} \frac{dt}{t}$ 中代换 $t = au$", "对 $L$ 求两次导", r"利用 $e^{a+b} = e^ae^b$", "画图"], 0, r"代换后变成 $\int_1^b \frac{du}{u} = L(b)$。"),
    choice("lneg", S + r"$0 < x < 1$ 时 $L(x) = \displaystyle\int_1^x \frac{dt}{t}$ 的符号是？", ["负", "正", "零", "不确定"], 0, r"$L(x) = -\int_x^1 \frac{dt}{t}$，而后者是正的面积。"),
    choice("area01", X + r"$\dfrac1x$ 的图像与 $x$ 轴在 $(0, 1]$ 上围成的面积是？", ["无穷大", "1", r"$\ln 2$", "0"], 0, r"$\int_{(1/x)^a}^1 \frac{dt}{t} = a\ln x$ 随 $a$ 无限增大。"),
]

PRACTICE["ses55"] = [
    choice("odd", S + r"$F(x) = \displaystyle\int_0^x e^{-t^2}\,dt$ 是？", ["奇函数", "偶函数", "既不奇也不偶", "常数"], 0, r"被积函数是偶函数，从 0 开始积分得到奇函数。"),
    choice("limit", S + r"$\displaystyle\lim_{x \to \infty}\int_0^x e^{-t^2}\,dt$ 等于？", [r"$\dfrac{\sqrt\pi}{2}$", r"$\infty$", "1", r"$\sqrt\pi$"], 0, r"所以 $\operatorname{erf}(x) = \frac{2}{\sqrt\pi}F(x)$ 趋于 1。"),
    choice("poisson", X + r"$f(x) = \lambda e^{-\lambda x}$（$x \ge 0$），事件在 $[0, b]$ 中发生的概率是？", [r"$1 - e^{-\lambda b}$", r"$e^{-\lambda b}$", r"$\lambda b$", r"$\lambda e^{-\lambda b}$"], 0, r"$-e^{-\lambda x}\big|_0^b$。"),
]

PRACTICE["ses56"] = [
    choice("between", S + r"$y = f(x)$ 在上、$y = g(x)$ 在下，$a$ 到 $b$ 之间的面积是？", [r"$\displaystyle\int_a^b (f(x) - g(x))\,dx$", r"$\displaystyle\int_a^b f(x)g(x)\,dx$", r"$\displaystyle\int_a^b (g(x) - f(x))\,dx$", r"$\displaystyle\int_a^b f(x)\,dx \cdot \int_a^b g(x)\,dx$"], 0, "高乘以宽 $dx$ 的矩形加起来。"),
    text("parab-line", S + r"$x = y^2$ 和 $y = x - 2$ 之间的面积是多少？（写成分数或小数）", ["9/2", "4.5"], r"横着切：$\int_{-1}^2 (y + 2 - y^2)\,dy$。"),
    text("smile", X + r"$y = \frac12x^2 - \frac12$ 和 $y = x^4 - 1$ 之间的「笑脸」面积是多少？（写成分数）", ["14/15"], r"$\int_{-1}^1 (-x^4 + \frac12x^2 + \frac12)\,dx$。"),
]

PRACTICE["ses57"] = [
    choice("disk", S + r"$y = f(x)$ 下方区域绕 $x$ 轴旋转，用圆盘法时体积元 $dV$ 是？", [r"$\pi y^2\,dx$", r"$2\pi y\,dx$", r"$y^2\,dx$", r"$\pi y\,dx$"], 0, "每片是半径为 $y$、厚 $dx$ 的圆盘。"),
    choice("rev", X + r"$y = 3x - x^2$ 与 $x$ 轴之间的区域绕 $x$ 轴旋转，体积是？", [r"$\dfrac{81\pi}{10}$", r"$\dfrac{9\pi}{2}$", r"$81\pi$", r"$\dfrac{27\pi}{2}$"], 0, r"$\pi\int_0^3 (3x - x^2)^2\,dx$。"),
]

PRACTICE["ses58"] = [
    choice("sphere", S + r"用圆盘法求半径为 $a$ 的球的体积，$\displaystyle\int_0^{2a} \pi(2ax - x^2)\,dx$ 等于？", [r"$\dfrac43\pi a^3$", r"$\pi a^3$", r"$2\pi a^3$", r"$\dfrac23\pi a^3$"], 0, r"$\pi(4a^3 - \frac83a^3)$。"),
    choice("cap", S + r"从半径为 $a$ 的球上切下宽为 $x$ 的一块，体积是？", [r"$\pi\left(ax^2 - \dfrac{x^3}{3}\right)$", r"$\pi x^2a$", r"$\dfrac43\pi x^3$", r"$\pi(2ax - x^2)$"], 0, r"$\int_0^x \pi(2at - t^2)\,dt$；$x = a$ 时是半球。"),
    choice("spheroid", X + r"$x^2 + 4y^2 = 4$ 绕 $y$ 轴旋转得到的扁椭球体积是？", [r"$\dfrac{16\pi}{3}$", r"$\dfrac{8\pi}{3}$", r"$8\pi$", r"$\dfrac{4\pi}{3}$"], 0, r"圆盘法：$\int_{-1}^1 \pi \cdot 4(1 - y^2)\,dy$。"),
]

PRACTICE["ses59"] = [
    choice("shell", S + r"柱壳法中，半径 $x$、高 $h(x)$、厚 $dx$ 的柱壳体积是？", [r"$2\pi x\,h(x)\,dx$", r"$\pi x^2h(x)\,dx$", r"$\pi h(x)^2\,dx$", r"$x\,h(x)\,dx$"], 0, "把柱壳摊开成周长 × 高 × 厚的薄板。"),
    choice("cauldron", S + r"$y = x^2$ 绕 $y$ 轴旋转、高到 $y = a$ 的「大锅」体积是？", [r"$\dfrac\pi2a^2$", r"$\pi a^2$", r"$\dfrac\pi3a^3$", r"$2\pi a$"], 0, r"$2\pi\int_0^{\sqrt a} (ax - x^3)\,dx$。"),
    choice("washer", X + r"垫圈法中，外半径 $R$、内半径 $r$、厚 $dy$ 的垫圈体积是？", [r"$\pi(R^2 - r^2)\,dy$", r"$\pi(R - r)^2\,dy$", r"$2\pi(R - r)\,dy$", r"$\pi R^2\,dy$"], 0, "大圆盘减去中间的小圆盘。"),
]

P = "改编自习题课 7 的官方练习题 "
PRACTICE["ps7"] = [
    choice("4b5", P + "4B-5。\n\n" + r"边长为 $a$ 的等边三角形绕一条边旋转，体积是？", [r"$\dfrac{\pi a^3}{4}$", r"$\dfrac{\pi a^3}{3}$", r"$\dfrac{\pi a^3}{2}$", r"$\dfrac{\sqrt3\pi a^3}{4}$"], 0, "两个圆锥：半径 $\\frac{\\sqrt3}{2}a$，高 $\\frac a2$。"),
    choice("4c2", P + "4C-2。\n\n" + r"区域 $0 \le y \le x^2$，$0 \le x \le 1$ 绕 $y$ 轴旋转，体积是？", [r"$\dfrac\pi2$", r"$\dfrac\pi5$", r"$\dfrac\pi3$", r"$\pi$"], 0, r"柱壳：$\int_0^1 2\pi x \cdot x^2\,dx$。"),
    choice("4c3", P + "4C-3。\n\n" + r"区域 $\sqrt x \le y \le 1$，$x \ge 0$ 绕 $y$ 轴旋转，体积是？", [r"$\dfrac\pi5$", r"$\dfrac\pi2$", r"$\dfrac{2\pi}{5}$", r"$\dfrac\pi3$"], 0, r"圆盘：$\int_0^1 \pi y^4\,dy$。"),
    choice("4j3", P + "4J-3。\n\n" + r"深 $D$、半径 $R$ 的圆池中浓度为 $\dfrac{k}{1 + r^2}$，消毒剂总量是？", [r"$\pi kD\ln(1 + R^2)$", r"$\pi kDR^2$", r"$\dfrac{\pi kD}{1 + R^2}$", r"$2\pi kD\arctan R$"], 0, r"柱壳：$\int_0^R 2\pi rD\frac{k}{1 + r^2}\,dr$。"),
]

PRACTICE["ses60"] = [
    choice("avgdef", S + r"$f$ 在 $[a, b]$ 上的平均值是？", [r"$\dfrac{1}{b - a}\displaystyle\int_a^b f(x)\,dx$", r"$\displaystyle\int_a^b f(x)\,dx$", r"$\dfrac{f(a) + f(b)}{2}$", r"$\dfrac{f(b) - f(a)}{b - a}$"], 0, "积分除以区间长度。"),
    choice("semicircle", S + r"单位半圆上一点关于水平距离 $x$ 的平均高度是？", [r"$\dfrac\pi4$", r"$\dfrac2\pi$", r"$\dfrac12$", r"$\dfrac\pi2$"], 0, r"$\frac12 \cdot$ 半圆面积 $\frac\pi2$。"),
    choice("arclen", S + r"单位半圆上一点关于弧长 $\theta$ 的平均高度是？", [r"$\dfrac2\pi$", r"$\dfrac\pi4$", r"$\dfrac12$", "1"], 0, r"$\frac1\pi\int_0^\pi \sin\theta\,d\theta$；比 $\frac\pi4$ 小。"),
    choice("bank", X + r"$A(t) = A_0e^{rt}$ 在 $[0, T]$ 上的平均值是？", [r"$\dfrac{A_0}{rT}(e^{rT} - 1)$", r"$\dfrac{A_0}{2}(1 + e^{rT})$", r"$A_0e^{rT/2}$", r"$A_0rT$"], 0, "积分除以 $T$。"),
]

PRACTICE["ses61"] = [
    choice("weighted", S + r"$f$ 关于权函数 $w$ 的加权平均是？", [r"$\dfrac{\int_a^b f(x)w(x)\,dx}{\int_a^b w(x)\,dx}$", r"$\dfrac{\int_a^b f(x)\,dx}{\int_a^b w(x)\,dx}$", r"$\int_a^b f(x)w(x)\,dx$", r"$\dfrac{1}{b - a}\int_a^b f(x)w(x)\,dx$"], 0, "常数的加权平均应该是常数本身。"),
    text("cauldron-avg", S + r"大锅里水温 $T = 100 - 30y$，每层水的体积权重 $w(y) = \pi y$（$0 \le y \le 1$）。加权平均温度是多少度？", ["80"], r"$\frac{40\pi}{\pi/2}$；比简单平均 85 度低。"),
    text("centroid", X + r"$y = (x - 1)^2$ 与 $y = 4$ 之间区域的形心纵坐标 $\bar y$ 是多少？", ["2.4", "12/5"], r"$\frac{128/5}{32/3}$。"),
]

PRACTICE["ses62"] = [
    text("parab-prob", S + r"在 $y = 0$ 和 $y = 1 - x^2$ 之间的区域里随机选点，$x > \frac12$ 的概率是多少？（写成分数）", ["5/32"], r"$\frac{5/24}{4/3}$。"),
    choice("ring", S + r"命中密度为 $ce^{-r^2}$ 时，落在半径 $r_1$ 和 $r_2$ 之间圆环的概率是？", [r"$e^{-r_1^2} - e^{-r_2^2}$", r"$e^{-r_2^2} - e^{-r_1^2}$", r"$r_2 - r_1$", r"$\pi(r_2^2 - r_1^2)$"], 0, r"柱壳：$\int_{r_1}^{r_2} 2\pi re^{-r^2}\,dr$，再除以整体 $\pi$。"),
    text("brother", S + r"$e^{-a^2} = \frac12$，打中 $2a$ 到 $3a$ 圆环的概率约为 $\frac{1}{k}$，$k$ 是多少？（只看主要项）", ["16"], r"$(\frac12)^4 - (\frac12)^9 \approx \frac{1}{16}$。"),
]

PRACTICE["ses63"] = [
    choice("trap", S + "梯形法则的结果等于？", ["左黎曼和与右黎曼和的平均", "左黎曼和的两倍", "辛普森法则", "中点法则"], 0, r"$\Delta x(\frac{y_0}{2} + y_1 + \cdots + \frac{y_n}{2})$。"),
    choice("simpson", S + "辛普森法则的系数模式是？", [r"$\dfrac{\Delta x}{3}(1, 4, 2, 4, 2, \ldots, 4, 1)$", r"$\dfrac{\Delta x}{2}(1, 2, 2, \ldots, 2, 1)$", r"$\Delta x(1, 1, \ldots, 1)$", r"$\dfrac{\Delta x}{6}(1, 4, 1)$"], 0, "每两个小区间用一条抛物线吻合。"),
    choice("even", S + "使用辛普森法则时，小区间的个数 $n$ 必须是？", ["偶数", "奇数", "质数", "大于 100"], 0, "每块宽 $2\\Delta x$。"),
    text("exact", X + r"$\displaystyle\int_{-1}^2 (x^3 - 2x)\,dx$ 的精确值是多少？（写成小数）", ["0.75", ".75", "3/4"], r"$(4 - 4) - (\frac14 - 1)$。"),
]

PRACTICE["ses64"] = [
    text("trap2", S + r"用 2 个小区间的梯形法则估计 $\displaystyle\int_1^2 \frac{dx}{x}$，结果是多少？（写成分数）", ["17/24"], r"$\frac12(\frac12 + \frac23 + \frac14)$，约 0.708。"),
    text("simp2", S + r"用 2 个小区间的辛普森法则估计 $\displaystyle\int_1^2 \frac{dx}{x}$，结果是多少？（写成分数）", ["25/36"], r"$\frac16(1 + \frac83 + \frac12)$，约 0.6944，接近 $\ln 2 \approx 0.6931$。"),
    choice("exact", S + "辛普森法则对下面哪类函数给出精确的积分值？", ["次数不超过 3 的多项式", "只有直线", "所有函数", "只有常数"], 0, "它用抛物线吻合，而且碰巧对三次函数也精确。"),
]

PRACTICE["ses65"] = [
    choice("gauss", S + r"$\displaystyle\int_{-\infty}^\infty e^{-x^2}\,dx$ 等于？", [r"$\sqrt\pi$", r"$\pi$", r"$\dfrac{\sqrt\pi}{2}$", "1"], 0, r"$Q^2 = V = \pi$。"),
    choice("trick", S + r"证明 $\int_{-\infty}^\infty e^{-x^2}\,dx = \sqrt\pi$ 的技巧是？", [r"把 $e^{-r^2}$ 旋转体的体积用柱壳法和切片法各算一次，得到 $V = \pi$ 且 $V = Q^2$", "找出 $e^{-x^2}$ 的原函数", "用辛普森法则", "用中值定理"], 0, r"切片面积 $A(b) = e^{-b^2}Q$。"),
]

P = "改编自习题课 8 的官方练习题 "
PRACTICE["ps8"] = [
    choice("4d2", P + "4D-2。\n\n" + r"$\dfrac1x$ 在 $[a, 2a]$（$a > 0$）上的平均值是？", [r"$\dfrac{\ln 2}{a}$", r"$\dfrac{1}{2a}$", r"$\dfrac{3}{4a}$", r"$\ln 2$"], 0, r"$\frac1a(\ln 2a - \ln a)$。"),
    choice("4d3", P + "4D-3。\n\n" + r"速度 $v(t) = s'(t)$ 在 $[a, b]$ 上的平均值等于？", [r"$\dfrac{s(b) - s(a)}{b - a}$", r"$\dfrac{v(a) + v(b)}{2}$", r"$s(b) - s(a)$", r"$v\left(\dfrac{a + b}{2}\right)$"], 0, "微积分基本定理：就是平均速度。"),
    choice("4d5", P + "4D-5。\n\n" + r"$f$ 在 $[0, x]$ 上的平均值是 $g(x)$，那么 $f(x)$ 等于？", [r"$g(x) + xg'(x)$", r"$g'(x)$", r"$xg(x)$", r"$g(x) - xg'(x)$"], 0, r"$\int_0^x f = xg(x)$，两边求导。"),
    text("4d5b", P + "4D-5。\n\n" + r"若 $f$ 在 $[0, x]$ 上的平均值是 $g(x) = x^2$，则 $f(1)$ 等于多少？", ["3"], r"$f(x) = x^2 + x \cdot 2x = 3x^2$。"),
]

PRACTICE["ses66"] = [
    choice("lowersum", S + r"对一直递减的函数（例如 $\frac1x$，$x > 0$），下和等于？", ["右和", "左和", "梯形法则", "上和"], 0, "递减函数在每个小区间的右端点取最小值。"),
    choice("shellchoice", S + r"区域 $0 < y < x - x^3$（$0 \le x \le 1$）绕 $y$ 轴旋转，应该用哪种方法？", ["柱壳法，对 $x$ 积分", "垫圈法，对 $y$ 积分", "两种一样容易", "只能用数值积分"], 0, "垫圈法要从三次方程里解出 $x$。"),
    text("shellval", S + r"上一题的体积 $\displaystyle\int_0^1 2\pi x(x - x^3)\,dx$ 等于 $k\pi$，$k$ 是多少？（写成分数）", ["4/15"], r"$2\pi(\frac13 - \frac15)$。"),
]

E = "改编自考试 3 第 "
PRACTICE["exam3"] = [
    text("area", E + "1 题。\n\n" + r"曲线 $x = y^2 - 4y$ 和 $x = 2y - y^2$ 之间的面积是多少？", ["9"], r"交于 $y = 0, 3$；$\int_0^3 (6y - 2y^2)\,dy$。"),
    choice("washer", E + "2 题。\n\n" + r"$y = e^x$、$y = 2$、$x = 0$ 围成的区域绕 $y = -1$ 旋转，体积的垫圈法积分是？", [r"$\displaystyle\int_0^{\ln 2} \pi\left(9 - (1 + e^x)^2\right)dx$", r"$\displaystyle\int_0^{\ln 2} \pi\left(4 - e^{2x}\right)dx$", r"$\displaystyle\int_0^{\ln 2} \pi\left(3 - (1 + e^x)\right)^2dx$", r"$\displaystyle\int_1^2 \pi(y + 1)^2\,dy$"], 0, "外半径 3，内半径 $1 + e^x$。"),
    text("riemann", E + "3 题 (a)。\n\n" + r"$\displaystyle\lim_{n \to \infty}\sum_{i=1}^n \left(1 + \frac{3i}{n}\right)^2\frac3n$ 等于多少？", ["21"], r"$\int_0^3 (1 + x)^2\,dx$。"),
    choice("ftc", E + "3 题 (b)。\n\n" + r"$x\sin\pi x = \displaystyle\int_0^{x^2} f(t)\,dt$，$f(4)$ 等于？", [r"$\dfrac\pi2$", r"$\pi$", "0", r"$2\pi$"], 0, r"两边求导：$\sin\pi x + \pi x\cos\pi x = 2xf(x^2)$，代入 $x = 2$。"),
    choice("pappus", E + "4 题 (b)。\n\n" + "帕普斯定理：旋转体体积等于？", ["区域面积乘以形心经过的距离", "区域面积乘以 $2\\pi$", "形心到轴的距离的平方乘以 $\\pi$", "区域周长乘以形心经过的距离"], 0, r"例如三角形 $\frac12rh \cdot 2\pi\frac r3 = \frac13\pi r^2h$。"),
    choice("simpson", E + "5 题。\n\n" + r"$T_n$ 是梯形近似，$M_n$ 是中点近似，那么 $S_{2n}$（辛普森法则，$2n$ 个小区间）等于？", [r"$\dfrac13T_n + \dfrac23M_n$", r"$\dfrac12T_n + \dfrac12M_n$", r"$\dfrac23T_n + \dfrac13M_n$", r"$T_n + M_n$"], 0, "把两式展开比较系数。"),
    text("brine", E + "6 题。\n\n" + r"盐的量满足 $s(t) = 15e^{-t/100}$（$t$ 以分钟计）。盐减少一半大约要多少分钟？（保留一位小数）", ["69.3"], r"$t = 100\ln 2$。"),
]

PRACTICE["ses68"] = [
    choice("halfangle", S + r"$\cos^2\theta$ 的半角公式是？", [r"$\dfrac{1 + \cos 2\theta}{2}$", r"$\dfrac{1 - \cos 2\theta}{2}$", r"$2\cos\theta - 1$", r"$\dfrac{\sin 2\theta}{2}$"], 0, r"由 $\cos 2\theta = 2\cos^2\theta - 1$。"),
    choice("m1", S + r"$\displaystyle\int \sin^nx\cos x\,dx$ 等于？", [r"$\dfrac{\sin^{n+1}x}{n + 1} + c$", r"$\dfrac{\cos^{n+1}x}{n + 1} + c$", r"$n\sin^{n-1}x + c$", r"$-\dfrac{\sin^{n+1}x}{n + 1} + c$"], 0, r"$u = \sin x$。"),
    choice("s3c2", S + r"$\displaystyle\int \sin^3x\cos^2x\,dx$ 等于？", [r"$-\dfrac{\cos^3x}{3} + \dfrac{\cos^5x}{5} + c$", r"$\dfrac{\cos^3x}{3} - \dfrac{\cos^5x}{5} + c$", r"$\dfrac{\sin^4x\cos^3x}{12} + c$", r"$-\dfrac{\sin^3x}{3} + \dfrac{\sin^5x}{5} + c$"], 0, r"$\sin^2x = 1 - \cos^2x$，再令 $u = \cos x$。"),
    choice("s3", S + r"$\displaystyle\int \sin^3x\,dx$ 等于？", [r"$-\cos x + \dfrac{\cos^3x}{3} + c$", r"$\dfrac{\sin^4x}{4} + c$", r"$-\dfrac{\cos^4x}{4} + c$", r"$\cos x - \dfrac{\cos^3x}{3} + c$"], 0, r"$(1 - \cos^2x)\sin x$。"),
    choice("c32x", X + r"$\displaystyle\int \cos^3(2x)\,dx$ 等于？", [r"$\dfrac12\sin 2x - \dfrac16\sin^3 2x + C$", r"$\sin 2x - \dfrac13\sin^3 2x + C$", r"$\dfrac{\cos^4 2x}{8} + C$", r"$\dfrac12\sin 2x - \dfrac13\sin^3 2x + C$"], 0, r"$u = 2x$，再用 $\cos^2 = 1 - \sin^2$。"),
]

PRACTICE["ses69"] = [
    choice("c2", S + r"$\displaystyle\int \cos^2x\,dx$ 等于？", [r"$\dfrac x2 + \dfrac{\sin 2x}{4} + c$", r"$\dfrac{\cos^3x}{3} + c$", r"$\dfrac x2 - \dfrac{\sin 2x}{4} + c$", r"$\sin^2x + c$"], 0, "半角公式。"),
    choice("s2c2", S + r"$\displaystyle\int \sin^2x\cos^2x\,dx$ 等于？", [r"$\dfrac x8 - \dfrac{\sin 4x}{32} + c$", r"$\dfrac x4 - \dfrac{\sin 4x}{16} + c$", r"$\dfrac{\sin^3x\cos^3x}{9} + c$", r"$\dfrac x8 + \dfrac{\sin 4x}{32} + c$"], 0, r"$\sin^2x\cos^2x = \frac18 - \frac{\cos 4x}{8}$。"),
    choice("even", S + r"$\displaystyle\int \sin^nx\cos^mx\,dx$ 中 $m$、$n$ 都是偶数时，主要用什么？", ["半角公式降次", r"代换 $u = \sin x$", "分部积分", r"代换 $u = \tan x$"], 0, "两个指数都是偶数时，没有可以单独拿出来配 $du$ 的奇数次因子。"),
    choice("s4c2", X + r"$\displaystyle\int \sin^4x\cos^2x\,dx$ 等于？", [r"$\dfrac{x}{16} - \dfrac{\sin 4x}{64} - \dfrac{\sin^3 2x}{48} + C$", r"$\dfrac{x}{16} - \dfrac{\sin 2x}{32} - \dfrac{\sin^3 2x}{48} + C$", r"$\dfrac{\sin^5x\cos^3x}{15} + C$", r"$\dfrac{x}{8} - \dfrac{\sin 4x}{32} + C$"], 0, r"注意 $\int \cos^2 2x\,dx = \frac x2 + \frac{\sin 4x}{8}$。"),
]

PRACTICE["ses70"] = [
    choice("sub", S + r"积分 $\displaystyle\int \sqrt{a^2 - y^2}\,dy$ 应该用什么代换？", [r"$y = a\sin\theta$", r"$y = a\tan\theta$", r"$y = a\sec\theta$", r"$u = a^2 - y^2$"], 0, r"$\sqrt{a^2 - a^2\sin^2\theta} = a\cos\theta$。"),
    choice("antider", S + r"$\displaystyle\int \sqrt{a^2 - y^2}\,dy$ 等于？", [r"$\dfrac{a^2}{2}\arcsin\dfrac ya + \dfrac y2\sqrt{a^2 - y^2} + c$", r"$\dfrac{a^2}{2}\arccos\dfrac ya + c$", r"$-\dfrac13(a^2 - y^2)^{3/2} + c$", r"$a^2\arcsin\dfrac ya + c$"], 0, "扇形面积加三角形面积。"),
    choice("geom", S + r"$\displaystyle\int_0^b \sqrt{a^2 - y^2}\,dy = \frac{a^2\theta_0}{2} + \frac{b\sqrt{a^2 - b^2}}{2}$ 中第一项的几何意义是？", [r"角 $\theta_0$ 扫过的扇形面积", "整个圆的面积", "直角三角形的面积", "弓形的面积"], 0, "第二项才是三角形。"),
]

PRACTICE["ses71"] = [
    choice("tan", S + r"$\displaystyle\int \tan x\,dx$ 等于？", [r"$-\ln|\cos x| + c$", r"$\ln|\cos x| + c$", r"$\sec^2x + c$", r"$\ln|\sin x| + c$"], 0, r"$u = \cos x$。"),
    choice("sec", S + r"$\displaystyle\int \sec x\,dx$ 等于？", [r"$\ln|\sec x + \tan x| + c$", r"$\sec x\tan x + c$", r"$\ln|\cos x| + c$", r"$\tan x + c$"], 0, r"$(\sec x + \tan x)' = \sec x(\sec x + \tan x)$。"),
    choice("sec4", S + r"$\displaystyle\int \sec^4x\,dx$ 等于？", [r"$\tan x + \dfrac{\tan^3x}{3} + c$", r"$\dfrac{\sec^5x}{5} + c$", r"$\dfrac{\tan^3x}{3} + c$", r"$\sec^2x\tan x + c$"], 0, r"$\sec^2x = 1 + \tan^2x$，$u = \tan x$。"),
    choice("tan3", X + r"$\displaystyle\int \tan^3x\,dx$ 等于？", [r"$\dfrac12\tan^2x + \ln|\cos x| + c$", r"$\dfrac14\tan^4x + c$", r"$\dfrac12\tan^2x - \ln|\cos x| + c$", r"$\dfrac13\sec^3x + c$"], 0, r"$\tan^3x = \tan x(\sec^2x - 1)$。"),
]

PRACTICE["ses72"] = [
    choice("table1", S + r"被积函数含有 $\sqrt{a^2 + x^2}$ 时，应该代换？", [r"$x = a\tan\theta$", r"$x = a\sin\theta$", r"$x = a\sec\theta$", r"$x = a\cos\theta$"], 0, r"$\sqrt{a^2 + a^2\tan^2\theta} = a\sec\theta$。"),
    choice("table2", S + r"被积函数含有 $\sqrt{x^2 - a^2}$ 时，应该代换？", [r"$x = a\sec\theta$", r"$x = a\tan\theta$", r"$x = a\sin\theta$", r"$u = x^2 - a^2$"], 0, r"$\sqrt{a^2\sec^2\theta - a^2} = a\tan\theta$。"),
    choice("undo", S + r"$\tan(\operatorname{arccsc}x)$ 化简后是？", [r"$\dfrac{1}{\sqrt{x^2 - 1}}$", r"$\sqrt{x^2 - 1}$", r"$\dfrac{x}{\sqrt{x^2 - 1}}$", r"$\dfrac{\sqrt{x^2 - 1}}{x}$"], 0, "斜边 $x$，对边 1，邻边 $\\sqrt{x^2 - 1}$。"),
    choice("x2sqrt", S + r"$\displaystyle\int \frac{dx}{x^2\sqrt{1 + x^2}}$ 等于？", [r"$-\dfrac{\sqrt{1 + x^2}}{x} + c$", r"$\dfrac{\sqrt{1 + x^2}}{x} + c$", r"$-\dfrac{x}{\sqrt{1 + x^2}} + c$", r"$\ln\left|x + \sqrt{1 + x^2}\right| + c$"], 0, r"$x = \tan\theta$，得 $-\csc\theta$。"),
    choice("x9", X + r"$\displaystyle\int x\sqrt{x^2 - 9}\,dx$ 等于？", [r"$\dfrac13(x^2 - 9)^{3/2} + c$", r"$\dfrac23(x^2 - 9)^{3/2} + c$", r"$9\tan^3x + c$", r"$\dfrac12(x^2 - 9)^{1/2} + c$"], 0, r"$u = x^2 - 9$ 最快。"),
]

PRACTICE["ses73"] = [
    choice("cts", S + r"把 $x^2 + 4x$ 配方得到？", [r"$(x + 2)^2 - 4$", r"$(x + 4)^2 - 16$", r"$(x + 2)^2 + 4$", r"$(x - 2)^2 - 4$"], 0, r"$a = 2$，$c = -a^2$。"),
    choice("cts2", X + r"把 $2x - x^2$ 配方得到？", [r"$1 - (x - 1)^2$", r"$(x - 1)^2 - 1$", r"$1 - (x + 1)^2$", r"$4 - (x - 2)^2$"], 0, r"$-(x^2 - 2x + 1) + 1$。"),
    choice("arcsin", X + r"$\displaystyle\int \frac{dx}{\sqrt{2x - x^2}}$ 等于？", [r"$\arcsin(x - 1) + c$", r"$\arcsin x + c$", r"$\ln\left|x - 1 + \sqrt{2x - x^2}\right| + c$", r"$-\sqrt{2x - x^2} + c$"], 0, r"$x - 1 = \sin\theta$。"),
]

P = "改编自习题课 9 的官方练习题 "
PRACTICE["ps9"] = [
    choice("5b9", P + "5B-9。\n\n" + r"$\displaystyle\int e^x(1 + e^x)^{-1/3}\,dx$ 等于？", [r"$\dfrac32(1 + e^x)^{2/3} + c$", r"$\dfrac23(1 + e^x)^{2/3} + c$", r"$-\dfrac13(1 + e^x)^{-4/3} + c$", r"$\dfrac32e^x(1 + e^x)^{2/3} + c$"], 0, r"$u = 1 + e^x$。"),
    choice("5b13", P + "5B-13。\n\n" + r"$\displaystyle\int \frac{x^2\,dx}{1 + x^6}$ 等于？", [r"$\dfrac13\tan^{-1}(x^3) + c$", r"$\tan^{-1}(x^3) + c$", r"$\dfrac13\ln(1 + x^6) + c$", r"$\dfrac16\tan^{-1}(x^6) + c$"], 0, r"$u = x^3$。"),
    text("5b16", P + "5B-16。\n\n" + r"$\displaystyle\int_{-1}^1 \frac{\tan^{-1}x}{1 + x^2}\,dx$ 等于多少？", ["0"], "奇函数在对称区间上积分为 0。"),
    choice("5c9", P + "5C-9。\n\n" + r"$\displaystyle\int \sin^3x\sec^2x\,dx$ 等于？", [r"$\cos x + \sec x + c$", r"$\cos x - \sec x + c$", r"$\dfrac{\sin^4x}{4}\tan x + c$", r"$-\cos x + \sec x + c$"], 0, r"$u = \cos x$。"),
    choice("5c11", P + "5C-11。\n\n" + r"$\displaystyle\int \sin x\cos 2x\,dx$ 等于？", [r"$\cos x - \dfrac23\cos^3x + c$", r"$-\cos x + \dfrac23\cos^3x + c$", r"$\dfrac12\sin x\sin 2x + c$", r"$\cos x - \dfrac13\cos^3x + c$"], 0, r"$\cos 2x = 2\cos^2x - 1$，$u = \cos x$。"),
    choice("5d1", P + "5D-1。\n\n" + r"$\displaystyle\int \frac{dx}{(a^2 - x^2)^{3/2}}$ 等于？", [r"$\dfrac{x}{a^2\sqrt{a^2 - x^2}} + c$", r"$\dfrac{1}{\sqrt{a^2 - x^2}} + c$", r"$\dfrac{x}{\sqrt{a^2 - x^2}} + c$", r"$\dfrac{1}{a^2}\arcsin\dfrac xa + c$"], 0, r"$x = a\sin\theta$，得 $\frac{1}{a^2}\tan\theta$。"),
    choice("5d10", P + "5D-10。\n\n" + r"求 $\displaystyle\int \frac{dx}{(x^2 + 4x + 13)^{3/2}}$ 时，应该作什么代换？", [r"$x + 2 = 3\tan\theta$", r"$x + 4 = 13\sin\theta$", r"$x = 3\sec\theta$", r"$x + 2 = 3\sin\theta$"], 0, r"配方：$(x + 2)^2 + 9$。"),
]

PRACTICE["ses74"] = [
    text("cover-a", S + r"$\dfrac{4x - 1}{(x - 1)(x + 2)} = \dfrac{A}{x - 1} + \dfrac{B}{x + 2}$，用遮盖法求 $A$。", ["1"], r"遮住 $x - 1$，代入 $x = 1$：$\frac{3}{3}$。"),
    text("cover-b", S + r"同上，求 $B$。", ["3"], r"遮住 $x + 2$，代入 $x = -2$：$\frac{-9}{-3}$。"),
    text("cover3", S + r"$\dfrac{x^2 + 3x + 8}{(x - 1)(x - 2)(x + 5)}$ 中 $\dfrac{A}{x - 1}$ 的系数 $A$ 是多少？", ["-2"], r"$\frac{1 + 3 + 8}{(1 - 2)(1 + 5)}$。"),
    choice("when", S + "遮盖法能直接求出所有系数的条件是？", ["分母是互不相同的一次因式之积，且分子次数小于分母次数", "分母有重因式", "分母有不可约的二次因式", "分子次数大于分母次数"], 0, "重因式和二次因式要另想办法。"),
    choice("ex", X + r"$\dfrac{x^2 + 2x + 3}{(x + 1)(x + 2)(x + 3)}$ 的部分分式分解是？", [r"$\dfrac{1}{x + 1} - \dfrac{3}{x + 2} + \dfrac{3}{x + 3}$", r"$\dfrac{1}{x + 1} + \dfrac{3}{x + 2} - \dfrac{3}{x + 3}$", r"$\dfrac{2}{x + 1} - \dfrac{3}{x + 2} + \dfrac{2}{x + 3}$", r"$\dfrac{1}{x + 1} - \dfrac{1}{x + 2} + \dfrac{1}{x + 3}$"], 0, "代入 $x = 0$ 检验：$\\frac12 = 1 - \\frac32 + 1$。"),
]

PRACTICE["ses75"] = [
    choice("repeated", S + r"$\dfrac{x^2 + 2}{(x - 1)^2(x + 2)}$ 的部分分式设定是？", [r"$\dfrac{A}{x - 1} + \dfrac{B}{(x - 1)^2} + \dfrac{C}{x + 2}$", r"$\dfrac{A}{(x - 1)^2} + \dfrac{C}{x + 2}$", r"$\dfrac{A}{(x - 1)^2} + \dfrac{B}{(x - 1)^2} + \dfrac{C}{x + 2}$", r"$\dfrac{A}{x - 1} + \dfrac{C}{x + 2}$"], 0, "重因式的每个幂各对应一项。"),
    text("rep-a", S + r"上题中 $A$ 是多少？（写成分数）", ["1/3"], r"$B = 1$，$C = \frac23$，再代入 $x = 0$。"),
    choice("quad", S + r"$\dfrac{x^2}{(x - 1)(x^2 + 1)}$ 中，$x^2 + 1$ 对应的分子应设为？", [r"$Bx + C$", r"$B$", r"$Bx^2 + Cx + D$", r"$B(x - 1)$"], 0, "比因式低一次。"),
    choice("longdiv", S + r"$\dfrac{x^3}{x^2 + x - 2}$ 做长除法，商和余式是？", [r"商 $x - 1$，余式 $3x - 2$", r"商 $x + 1$，余式 $x - 2$", r"商 $x$，余式 $-x^2 + 2x$", r"商 $x - 1$，余式 $x + 2$"], 0, r"$x^3 = (x - 1)(x^2 + x - 2) + 3x - 2$。"),
    text("count", S + r"$\dfrac{R(x)}{(x + 2)^4(x^2 + 2x + 3)(x^2 + 4)^3}$ 的部分分式分解一共有多少个未知系数？", ["12"], "等于分母的次数。"),
]

PRACTICE["ses76"] = [
    choice("formula", S + "分部积分公式是？", [r"$\displaystyle\int uv'\,dx = uv - \int u'v\,dx$", r"$\displaystyle\int uv'\,dx = uv + \int u'v\,dx$", r"$\displaystyle\int uv\,dx = \int u\,dx \int v\,dx$", r"$\displaystyle\int uv'\,dx = u'v - \int uv\,dx$"], 0, "乘积法则的逆运算。"),
    choice("lnx", S + r"$\displaystyle\int \ln x\,dx$ 等于？", [r"$x\ln x - x + c$", r"$\dfrac1x + c$", r"$x\ln x + c$", r"$\dfrac{(\ln x)^2}{2} + c$"], 0, r"$u = \ln x$，$v = x$。"),
    choice("reduce", S + r"$F_n(x) = \displaystyle\int (\ln x)^n\,dx$ 的递推公式是？", [r"$F_n = x(\ln x)^n - nF_{n-1}$", r"$F_n = x(\ln x)^n + nF_{n-1}$", r"$F_n = \dfrac{(\ln x)^{n+1}}{n + 1}$", r"$F_n = nF_{n-1}$"], 0, "分部积分一次。"),
    choice("xex", S + r"$\displaystyle\int xe^x\,dx$ 等于？", [r"$xe^x - e^x + c$", r"$xe^x + e^x + c$", r"$\dfrac{x^2}{2}e^x + c$", r"$e^x + c$"], 0, r"$u = x$，$v' = e^x$。"),
    choice("choose", S + r"对 $\displaystyle\int x^ne^x\,dx$ 分部积分时，应该选？", [r"$u = x^n$，$v' = e^x$", r"$u = e^x$，$v' = x^n$", "两种都一样", "不能用分部积分"], 0, "$u$ 求导后要变简单，$v$ 积分后不能变复杂。"),
    text("x4cos", X + r"$\displaystyle\int x^4\cos x\,dx = x^4\sin x + 4x^3\cos x - 12x^2\sin x - 24x\cos x + k\sin x + c$，$k$ 是多少？", ["24"], "连续分部积分四次。"),
]

PRACTICE["ses77"] = [
    choice("disk", S + r"把 $y = e^x$（$0 \le x \le 1$）绕 $y$ 轴旋转得到的酒杯，用水平切片求容积的积分是？", [r"$\displaystyle\int_1^e \pi(\ln y)^2\,dy$", r"$\displaystyle\int_0^1 \pi e^{2x}\,dx$", r"$\displaystyle\int_1^e 2\pi y\ln y\,dy$", r"$\displaystyle\int_0^1 \pi(\ln y)^2\,dy$"], 0, r"圆盘半径 $x = \ln y$。"),
    choice("vol", S + "这只酒杯的容积是？", [r"$\pi(e - 2)$", r"$\pi(e - 1)$", r"$\pi e$", r"$2\pi(e - 2)$"], 0, "两种切片方法结果相同。"),
]

PRACTICE["ses78"] = [
    choice("ds", S + r"$y = f(x)$ 的弧长微元 $ds$ 等于？", [r"$\sqrt{1 + f'(x)^2}\,dx$", r"$\sqrt{1 + f''(x)}\,dx$", r"$(1 + f'(x))\,dx$", r"$\sqrt{1 + f(x)^2}\,dx$"], 0, r"$ds^2 = dx^2 + dy^2$。"),
    choice("line", S + r"$y = mx$ 在 $0 \le x \le 10$ 上的长度是？", [r"$10\sqrt{1 + m^2}$", r"$10(1 + m)$", r"$10m$", r"$\sqrt{100 + m^2}$"], 0, "就是斜边长。"),
    choice("circle", S + r"$y = \sqrt{1 - x^2}$ 在 $0 \le x \le a$ 上的弧长是？", [r"$\sin^{-1}a$", r"$\cos^{-1}a$", r"$\sqrt{1 - a^2}$", r"$a$"], 0, r"$\int_0^a \frac{dx}{\sqrt{1 - x^2}}$。"),
    choice("parab", S + r"$y = x^2$ 在 $0 \le x \le a$ 上的弧长积分是？", [r"$\displaystyle\int_0^a \sqrt{1 + 4x^2}\,dx$", r"$\displaystyle\int_0^a \sqrt{1 + x^4}\,dx$", r"$\displaystyle\int_0^a \sqrt{1 + 2x}\,dx$", r"$\displaystyle\int_0^a (1 + 2x)\,dx$"], 0, "$y' = 2x$。"),
    choice("lnx", X + r"$y = \ln x$ 在 $\frac{1}{10} \le x \le 1$ 上的弧长是？", [r"$\displaystyle\int_{1/10}^1 \frac{\sqrt{x^2 + 1}}{x}\,dx$", r"$\displaystyle\int_{1/10}^1 \sqrt{1 + \ln^2x}\,dx$", r"$\ln 10$", r"$\displaystyle\int_{1/10}^1 \frac{x}{\sqrt{x^2 + 1}}\,dx$"], 0, r"$y' = \frac1x$。"),
]

PRACTICE["ses79"] = [
    choice("da", S + r"$y = f(x)$ 绕 $x$ 轴旋转时，曲面面积微元是？", [r"$2\pi y\,ds$", r"$2\pi y\,dx$", r"$\pi y^2\,ds$", r"$2\pi x\,ds$"], 0, "周长乘以弧长微元，不是 $dx$。"),
    choice("zone", S + r"半径为 $a$ 的球面上，夹在平面 $x = x_1$ 和 $x = x_2$ 之间的那一带的面积是？", [r"$2\pi a(x_2 - x_1)$", r"$\pi a^2(x_2 - x_1)$", r"$4\pi a(x_2 - x_1)$", r"$2\pi(x_2^2 - x_1^2)$"], 0, r"$y\,ds = a\,dx$，被积函数是常数。"),
    choice("sphere", S + "半径为 $a$ 的球面面积是？", [r"$4\pi a^2$", r"$2\pi a^2$", r"$\dfrac43\pi a^3$", r"$\pi a^2$"], 0, r"$x_1 = -a$，$x_2 = a$。"),
    choice("glass", X + r"$y = e^x$（$0 \le x \le 1$）绕 $y$ 轴旋转，曲面面积的积分是？", [r"$\displaystyle\int_0^1 2\pi x\sqrt{1 + e^{2x}}\,dx$", r"$\displaystyle\int_0^1 2\pi e^x\sqrt{1 + e^{2x}}\,dx$", r"$\displaystyle\int_0^1 2\pi x\,dx$", r"$\displaystyle\int_1^e 2\pi y\sqrt{1 + y^2}\,dy$"], 0, "绕 $y$ 轴转，半径是 $x$。"),
]

P = "改编自习题课 10 的官方练习题 "
PRACTICE["ps10"] = [
    choice("5e2", P + "5E-2。\n\n" + r"$\dfrac{x}{(x - 2)(x + 3)}$ 的部分分式分解是？", [r"$\dfrac{2/5}{x - 2} + \dfrac{3/5}{x + 3}$", r"$\dfrac{3/5}{x - 2} + \dfrac{2/5}{x + 3}$", r"$\dfrac{1/5}{x - 2} - \dfrac{1/5}{x + 3}$", r"$\dfrac{2}{x - 2} - \dfrac{3}{x + 3}$"], 0, r"遮盖法：$x = 2$ 得 $\frac25$，$x = -3$ 得 $\frac{-3}{-5}$。"),
    text("5e5", P + "5E-5。\n\n" + r"$\dfrac{3x + 2}{x(x + 1)^2} = \dfrac2x + \dfrac{B}{x + 1} + \dfrac{1}{(x + 1)^2}$，$B$ 是多少？", ["-2"], r"代入 $x = 1$：$\frac54 = 2 + \frac B2 + \frac14$。"),
    choice("5e6", P + "5E-6。\n\n" + r"$\displaystyle\int \frac{(2x - 9)\,dx}{(x^2 + 9)(x + 2)}$ 等于？", [r"$\dfrac12\ln(x^2 + 9) - \ln|x + 2| + c$", r"$\ln(x^2 + 9) - \ln|x + 2| + c$", r"$\dfrac12\ln(x^2 + 9) + \ln|x + 2| + c$", r"$\dfrac13\tan^{-1}\dfrac x3 - \ln|x + 2| + c$"], 0, r"$A = 1$，$B = 0$，$C = -1$。"),
    choice("5e10h", P + "5E-10h。\n\n" + r"$\displaystyle\int \frac{(x^2 + 1)\,dx}{x^2 + 2x + 2}$ 等于？", [r"$x - \ln(x^2 + 2x + 2) + \tan^{-1}(x + 1) + c$", r"$x + \ln(x^2 + 2x + 2) - \tan^{-1}(x + 1) + c$", r"$x - \tan^{-1}(x + 1) + c$", r"$\ln(x^2 + 2x + 2) + c$"], 0, r"先除得 $1 - \frac{2x + 1}{x^2 + 2x + 2}$，再配方。"),
    choice("5f1a", P + "5F-1a。\n\n" + r"$\displaystyle\int x^a\ln x\,dx$（$a \ne -1$）等于？", [r"$\dfrac{x^{a+1}\ln x}{a + 1} - \dfrac{x^{a+1}}{(a + 1)^2} + c$", r"$\dfrac{x^{a+1}\ln x}{a + 1} + c$", r"$ax^{a-1}\ln x + c$", r"$\dfrac{x^{a+1}\ln x}{a + 1} + \dfrac{x^{a+1}}{(a + 1)^2} + c$"], 0, r"$u = \ln x$，$dv = x^a\,dx$。"),
    choice("5f2b", P + "5F-2b。\n\n" + r"$\displaystyle\int x^2e^x\,dx$ 等于？", [r"$(x^2 - 2x + 2)e^x + c$", r"$(x^2 + 2x + 2)e^x + c$", r"$x^2e^x - 2xe^x + c$", r"$\dfrac{x^3}{3}e^x + c$"], 0, "分部积分两次。"),
    choice("5f3", P + "5F-3。\n\n" + r"$\displaystyle\int \sin^{-1}(4x)\,dx$ 等于？", [r"$x\sin^{-1}(4x) + \dfrac14\sqrt{1 - 16x^2} + c$", r"$x\sin^{-1}(4x) - \dfrac14\sqrt{1 - 16x^2} + c$", r"$\dfrac{4}{\sqrt{1 - 16x^2}} + c$", r"$x\sin^{-1}(4x) + 4\sqrt{1 - 16x^2} + c$"], 0, r"$v = x$，再令 $u = 1 - 16x^2$。"),
]

PRACTICE["ses80"] = [
    choice("circle", S + r"参数曲线 $x = a\cos t$，$y = a\sin t$ 是？", ["半径为 $a$ 的圆，逆时针运动", "半径为 $a$ 的圆，顺时针运动", "椭圆", "抛物线"], 0, "$t = 0$ 在 $(a, 0)$，$t = \\frac\\pi2$ 在 $(0, a)$。"),
    choice("ds", S + "参数曲线的弧长微元 $ds$ 等于？", [r"$\sqrt{\left(\dfrac{dx}{dt}\right)^2 + \left(\dfrac{dy}{dt}\right)^2}\,dt$", r"$\left(\dfrac{dx}{dt} + \dfrac{dy}{dt}\right)dt$", r"$\sqrt{1 + \left(\dfrac{dy}{dt}\right)^2}\,dt$", r"$\sqrt{\dfrac{d^2x}{dt^2} + \dfrac{d^2y}{dt^2}}\,dt$"], 0, r"$ds^2 = dx^2 + dy^2$ 两边除以 $dt^2$。"),
    choice("speed", S + r"$x = a\cos kt$，$y = a\sin kt$（$a, k > 0$）的速率是？", [r"$ak$", r"$a$", r"$k$", r"$a^2k$"], 0, r"$\sqrt{(ak\sin kt)^2 + (ak\cos kt)^2}$。"),
    choice("spiral", X + r"$x = t\cos t$，$y = t\sin t$ 的 $\dfrac{ds}{dt}$ 是？", [r"$\sqrt{t^2 + 1}$", r"$t$", r"$\sqrt{t^2 - 1}$", "1"], 0, r"交叉项相消，剩 $t^2 + 1$。"),
]

PRACTICE["ses81"] = [
    choice("ellipse", S + r"$x = 2\sin t$，$y = \cos t$ 的直角坐标方程是？", [r"$\dfrac{x^2}{4} + y^2 = 1$", r"$x^2 + \dfrac{y^2}{4} = 1$", r"$x^2 + y^2 = 4$", r"$4x^2 + y^2 = 1$"], 0, r"$\frac x2 = \sin t$。"),
    choice("dir", S + r"$x = 2\sin t$，$y = \cos t$ 随 $t$ 增大是怎样运动的？", ["从 $(0, 1)$ 出发，顺时针", "从 $(2, 0)$ 出发，逆时针", "从 $(0, 1)$ 出发，逆时针", "从 $(2, 0)$ 出发，顺时针"], 0, "$t = \\frac\\pi2$ 时到 $(2, 0)$。"),
    choice("limits", S + "把这个椭圆绕 $y$ 轴旋转求曲面面积时，$t$ 的积分范围是？", [r"$0$ 到 $\pi$", r"$0$ 到 $2\pi$", r"$0$ 到 $\dfrac\pi2$", r"$-\pi$ 到 $\pi$"], 0, "只需要右半边。"),
    choice("ball", X + r"$y'' = -9.8$，$y'(0) = 0$，$y(0) = 5$，则 $y(t)$ 是？", [r"$5 - 4.9t^2$", r"$5 + 4.9t^2$", r"$5 - 9.8t^2$", r"$5 - 9.8t$"], 0, "积分两次，注意负号。"),
]

PRACTICE["ses82"] = [
    choice("def", S + "极坐标的（没有歧义的）定义是？", [r"$x = r\cos\theta$，$y = r\sin\theta$", r"$r = \sqrt{x^2 + y^2}$，$\theta = \tan^{-1}\frac yx$", r"$x = r\sin\theta$，$y = r\cos\theta$", r"$x = \theta\cos r$，$y = \theta\sin r$"], 0, "反过来的公式有歧义。"),
    choice("point", S + r"下面哪一组极坐标**不**表示点 $(1, -1)$？", [r"$r = \sqrt2$，$\theta = \frac{3\pi}{4}$", r"$r = \sqrt2$，$\theta = -\frac\pi4$", r"$r = \sqrt2$，$\theta = \frac{7\pi}{4}$", r"$r = -\sqrt2$，$\theta = \frac{3\pi}{4}$"], 0, r"$r = \sqrt2$、$\theta = \frac{3\pi}{4}$ 是 $(-1, 1)$。"),
    choice("line", S + r"直线 $y = 1$ 的极坐标方程是？", [r"$r = \dfrac{1}{\sin\theta}$，$0 < \theta < \pi$", r"$r = \sin\theta$", r"$r = \dfrac{1}{\cos\theta}$，$-\frac\pi2 < \theta < \frac\pi2$", r"$\theta = 1$"], 0, r"$r\sin\theta = 1$。"),
    choice("offcircle", S + r"圆心为 $(a, 0)$、半径为 $a$ 的圆的极坐标方程是？", [r"$r = 2a\cos\theta$", r"$r = a\cos\theta$", r"$r = 2a\sin\theta$", r"$r = a$"], 0, r"$x^2 + y^2 = 2ax$ 即 $r^2 = 2ar\cos\theta$。"),
]

PRACTICE["ses83"] = [
    choice("da", S + "极坐标中的面积微元是？", [r"$\dfrac12r^2\,d\theta$", r"$r\,d\theta$", r"$r^2\,d\theta$", r"$\pi r^2\,d\theta$"], 0, "扇形占整圆面积的比例等于它占的弧长比例。"),
    choice("area", S + r"$r = 2a\cos\theta$ 围成的面积用哪个积分算？", [r"$\displaystyle\int_{-\pi/2}^{\pi/2} \frac12(2a\cos\theta)^2\,d\theta$", r"$\displaystyle\int_0^{2\pi} \frac12(2a\cos\theta)^2\,d\theta$", r"$\displaystyle\int_{-\pi/2}^{\pi/2} 2a\cos\theta\,d\theta$", r"$\displaystyle\int_0^\pi (2a\cos\theta)^2\,d\theta$"], 0, r"$\theta$ 走 $-\frac\pi2$ 到 $\frac\pi2$ 恰好画一圈。"),
]

PRACTICE["ses84"] = [
    choice("neg", S + r"在 $r = 2a\cos\theta$ 上，$\theta = \frac{3\pi}{4}$ 对应的点的直角坐标是？", [r"$(a, -a)$", r"$(-a, a)$", r"$(a, a)$", r"$(-a, -a)$"], 0, r"$r = -a\sqrt2$，沿反方向走。"),
    choice("rose", S + r"$r = \sin 2\theta$ 的图像是？", ["四叶玫瑰线", "圆", "两叶玫瑰线", "心形线"], 0, "每个象限一片花瓣。"),
    choice("conic", S + r"$r = \dfrac{1}{1 + 2\cos\theta}$ 的直角坐标方程表示？", ["双曲线", "椭圆", "抛物线", "圆"], 0, r"$-3x^2 + y^2 + 4x - 1 = 0$，$x^2$ 和 $y^2$ 的系数异号。"),
    choice("kepler", S + "开普勒第二定律用极坐标写出来是？", [r"$\dfrac12r^2\dfrac{d\theta}{dt} = \text{常数}$", r"$r\dfrac{d\theta}{dt} = \text{常数}$", r"$\dfrac{dr}{dt} = \text{常数}$", r"$r^2\theta = \text{常数}$"], 0, r"$\frac{dA}{dt}$ 是常数，$dA = \frac12r^2\,d\theta$。"),
    choice("lemn", X + r"双纽线 $r^2 = \cos 2\theta$ 在 $0 \le \theta < \pi$ 内，哪个区间上没有点？", [r"$\frac\pi4 < \theta < \frac{3\pi}{4}$", r"$0 < \theta < \frac\pi4$", r"$\frac{3\pi}{4} < \theta < \pi$", "没有这样的区间"], 0, r"那里 $\cos 2\theta < 0$。"),
]

P = "改编自习题课 11 的官方练习题 "
PRACTICE["ps11"] = [
    choice("4e2", P + "4E-2。\n\n" + r"$x = t + \frac1t$，$y = t - \frac1t$ 的直角坐标方程是？", [r"$x^2 - y^2 = 4$", r"$x^2 + y^2 = 4$", r"$xy = 1$", r"$x^2 - y^2 = 2$"], 0, "分别平方后相减。"),
    choice("4e3", P + "4E-3。\n\n" + r"$x = 1 + \sin t$，$y = 4 + \cos t$ 描述的是？", [r"圆心 $(1, 4)$、半径 1 的圆", r"圆心 $(4, 1)$、半径 1 的圆", "椭圆", "直线"], 0, r"$(x - 1)^2 + (y - 4)^2 = 1$。"),
    text("4f1d", P + "4F-1d。\n\n" + r"$y = \frac13(2 + x^2)^{3/2}$ 在 $1 \le x \le 2$ 上的弧长是多少？（写成分数）", ["10/3"], r"$1 + y'^2 = (1 + x^2)^2$。"),
    choice("4f8", P + "4F-8。\n\n" + r"$x = e^t\cos t$，$y = e^t\sin t$（$0 \le t \le 10$）的长度是？", [r"$\sqrt2(e^{10} - 1)$", r"$e^{10} - 1$", r"$2(e^{10} - 1)$", r"$\sqrt2e^{10}$"], 0, r"$ds = \sqrt2e^t\,dt$。"),
    choice("4g2", P + "4G-2。\n\n" + r"$y = 1 - 2x$ 在第一象限的一段绕 $x$ 轴旋转，曲面面积是？", [r"$\dfrac{\sqrt5\pi}{2}$", r"$\dfrac{\sqrt5\pi}{4}$", r"$\sqrt5\pi$", r"$\dfrac\pi2$"], 0, r"$2\pi\sqrt5\int_0^{1/2}(1 - 2x)\,dx$。"),
    choice("4g5", P + "4G-5。\n\n" + r"$y = x^2$，$0 \le x \le 4$ 绕 $y$ 轴旋转，曲面面积的积分是？", [r"$\displaystyle\int_0^4 2\pi x\sqrt{1 + 4x^2}\,dx$", r"$\displaystyle\int_0^4 2\pi x^2\sqrt{1 + 4x^2}\,dx$", r"$\displaystyle\int_0^2 2\pi\sqrt{y + \frac14}\,dy$", r"$\displaystyle\int_0^4 \pi x^2\,dx$"], 0, "绕 $y$ 轴，半径是 $x$；对 $y$ 积分时上限是 16。"),
]

PRACTICE["ses85"] = [
    choice("setup", S + r"$\dfrac{x^2 + 21}{(x + 2)^2x(x + 1)}$ 的部分分式设定一共有几个未知数？", ["4", "3", "5", "2"], 0, r"$\frac{A}{x + 2} + \frac{B}{(x + 2)^2} + \frac Cx + \frac{D}{x + 1}$。"),
    choice("quadsetup", S + r"分母中的 $(x^2 + 2)^2$ 在设定中对应？", [r"$\dfrac{A_1x + B_1}{x^2 + 2} + \dfrac{A_2x + B_2}{(x^2 + 2)^2}$", r"$\dfrac{A}{(x^2 + 2)^2}$", r"$\dfrac{A}{x^2 + 2} + \dfrac{B}{(x^2 + 2)^2}$", r"$\dfrac{Ax + B}{(x^2 + 2)^2}$"], 0, "重复的二次因式：每个幂一项，分子是一次式。"),
    choice("xatan", S + r"$\displaystyle\int x\tan^{-1}x\,dx$ 等于？", [r"$\dfrac{x^2}{2}\tan^{-1}x - \dfrac x2 + \dfrac12\tan^{-1}x + c$", r"$\dfrac{x^2}{2}\tan^{-1}x + c$", r"$\dfrac{x^2}{2}\tan^{-1}x - \dfrac12\ln(1 + x^2) + c$", r"$x\tan^{-1}x - \dfrac12\ln(1 + x^2) + c$"], 0, r"分部积分，再用 $\frac{x^2}{1 + x^2} = 1 - \frac{1}{1 + x^2}$。"),
]

E = "改编自考试 4 第 "
PRACTICE["exam4"] = [
    choice("parts", E + "1 题。\n\n" + r"$\displaystyle\int_1^4 \sqrt t\ln t\,dt$ 等于？", [r"$\dfrac{16}{3}\ln 4 - \dfrac{28}{9}$", r"$\dfrac{16}{3}\ln 4$", r"$\dfrac{16}{3}\ln 4 - \dfrac{32}{9}$", r"$\dfrac23\ln 4 - \dfrac{28}{9}$"], 0, r"$u = \ln t$，$dv = \sqrt t\,dt$。"),
    text("tansec", E + "2 题。\n\n" + r"$\displaystyle\int_0^{\pi/4} \tan^4\theta\sec^6\theta\,d\theta$ 等于多少？（写成分数）", ["188/315"], r"$u = \tan\theta$，$\int_0^1 u^4(1 + u^2)^2\,du$。"),
    choice("pf", E + "3 题。\n\n" + r"$\dfrac{10}{(x - 1)(x^2 + 9)}$ 的部分分式分解是？", [r"$\dfrac{1}{x - 1} - \dfrac{x + 1}{x^2 + 9}$", r"$\dfrac{1}{x - 1} + \dfrac{x + 1}{x^2 + 9}$", r"$\dfrac{10}{x - 1} - \dfrac{10}{x^2 + 9}$", r"$\dfrac{1}{x - 1} - \dfrac{1}{x^2 + 9}$"], 0, "代入 $x = 0$ 检验：$-\\frac{10}{9} = -1 - \\frac19$。"),
    choice("trigsub", E + "4 题。\n\n" + r"求 $\displaystyle\int \frac{dx}{(5 - 4x - x^2)^{5/2}}$ 时应作什么代换？", [r"$x + 2 = 3\sin\theta$", r"$x - 2 = 3\sin\theta$", r"$x + 2 = 3\tan\theta$", r"$x = \sqrt5\sin\theta$"], 0, r"$5 - 4x - x^2 = 9 - (x + 2)^2$。"),
    choice("astroid", E + "5 题 (b)。\n\n" + r"$x = a\cos^3t$，$y = a\sin^3t$（$0 \le t \le \frac\pi2$）绕 $x$ 轴旋转，曲面面积是？", [r"$\dfrac65\pi a^2$", r"$\dfrac{12}{5}\pi a^2$", r"$6\pi a^2$", r"$\dfrac35\pi a^2$"], 0, r"$6a^2\pi\int_0^{\pi/2}\sin^4t\cos t\,dt$。"),
]

PRACTICE["ses87"] = [
    text("x10", S + r"$\displaystyle\lim_{x \to 1} \frac{x^{10} - 1}{x^2 - 1}$ 等于多少？", ["5"], r"$\frac{10x^9}{2x}$ 在 $x = 1$ 处。"),
    choice("rule", S + r"洛必达法则（第 1 版）的前提是？", [r"$f(a) = g(a) = 0$，且 $\lim_{x \to a}\frac{f'(x)}{g'(x)}$ 存在", r"$g'(a) \ne 0$", r"$f$ 和 $g$ 都是多项式", r"$f(a) = g(a) = 1$"], 0, "第 1 版去掉了 $g'(a) \\ne 0$ 的限制。"),
    choice("quot", S + "用洛必达法则时，对分式怎样求导？", ["分子、分母分别求导", "对整个分式用商法则", "只对分子求导", "只对分母求导"], 0, "千万不要用商法则。"),
    choice("blowup", X + r"$\displaystyle\lim_{x \to 0^+} \frac{\sin x}{1 - \cos x}$ 是？", [r"$+\infty$", "0", "1", "2"], 0, r"约等于 $\frac2x$。"),
]

PRACTICE["ses88"] = [
    choice("sin5", S + r"$\displaystyle\lim_{x \to 0} \frac{\sin 5x}{\sin 2x}$ 等于？", [r"$\dfrac52$", r"$\dfrac25$", "1", "0"], 0, r"$\frac{5\cos 5x}{2\cos 2x}$。"),
    text("cos", S + r"$\displaystyle\lim_{x \to 0} \frac{\cos x - 1}{x^2}$ 等于多少？（写成分数）", ["-1/2"], "用两次洛必达法则，或用 $\\cos x \\approx 1 - \\frac{x^2}{2}$。"),
    choice("ext", S + "洛必达法则还适用于下面哪种形式？", [r"$\dfrac\infty\infty$", r"$\dfrac10$", r"$\dfrac{1}{\infty}$", r"$\dfrac{2}{3}$"], 0, r"$\frac00$ 和 $\frac\infty\infty$。"),
    choice("xex", X + r"$\displaystyle\lim_{x \to +\infty} \frac{x}{e^x}$ 等于？", ["0", "1", r"$\infty$", "不存在"], 0, r"洛必达：$\frac{1}{e^x} \to 0$。"),
]

PRACTICE["ses89"] = [
    choice("xlnx", S + r"$\displaystyle\lim_{x \to 0^+} x\ln x$ 等于？", ["0", r"$-\infty$", "1", "$-1$"], 0, r"写成 $\frac{\ln x}{1/x}$ 再用洛必达。"),
    choice("expoly", S + r"$p > 0$ 时，$\displaystyle\lim_{x \to \infty} \frac{e^{px}}{x^{100}}$ 等于？", [r"$\infty$", "0", "1", r"$p^{100}$"], 0, "指数函数比任何多项式都增长得快。"),
    choice("lnpow", S + r"$\displaystyle\lim_{x \to \infty} \frac{\ln x}{x^{1/3}}$ 等于？", ["0", r"$\infty$", "3", r"$\dfrac13$"], 0, r"$\ln x$ 比 $x$ 的任何正数次幂增长得慢。"),
]

PRACTICE["ses90"] = [
    choice("xx", S + r"$\displaystyle\lim_{x \to 0^+} x^x$ 等于？", ["1", "0", r"$e$", r"$\infty$"], 0, r"$x^x = e^{x\ln x}$，$x\ln x \to 0$。"),
    choice("look", S + r"有人算 $\displaystyle\lim_{x \to 0} \frac{\sin x}{x^2}$：洛必达得 $\frac{\cos x}{2x}$，再洛必达得 $\frac{-\sin x}{2} \to 0$。错在哪里？", [r"$\frac{\cos x}{2x}$ 是 $\frac10$ 型，不能再用洛必达", "第一次就不能用洛必达", r"$\sin x$ 的导数算错了", "没有错"], 0, "先看清楚，再用洛必达。"),
    choice("order", S + r"$x \to \infty$ 时，下面哪个顺序是对的（$p > 0$）？", [r"$\ln x \ll x^p \ll e^x \ll e^{x^2}$", r"$x^p \ll \ln x \ll e^x \ll e^{x^2}$", r"$\ln x \ll e^x \ll x^p \ll e^{x^2}$", r"$e^x \ll e^{x^2} \ll \ln x \ll x^p$"], 0, "对数 < 幂 < 指数。"),
    choice("nroot", X + r"$\displaystyle\lim_{x \to \infty} x^{1/x}$ 等于？", ["1", "0", r"$e$", r"$\infty$"], 0, r"$e^{\ln x/x}$，$\frac{\ln x}{x} \to 0$。"),
]

PRACTICE["ses91"] = [
    choice("ekx", S + r"$k > 0$ 时，$\displaystyle\int_0^\infty e^{-kx}\,dx$ 等于？", [r"$\dfrac1k$", "$k$", r"$\infty$", "1"], 0, r"$-\frac1ke^{-kx}\big|_0^\infty$。"),
    choice("p", S + r"$\displaystyle\int_1^\infty \frac{dx}{x^p}$ 什么时候收敛？", [r"$p > 1$", r"$p \ge 1$", r"$p < 1$", r"$p > 0$"], 0, r"$p = 1$ 时是 $\ln x$，发散。"),
    text("p2", S + r"$\displaystyle\int_1^\infty \frac{dx}{x^3}$ 等于多少？（写成分数）", ["1/2"], r"$\frac{1}{p - 1}$。"),
    text("ex", X + r"$\displaystyle\int_1^\infty \frac{dx}{(5x + 2)^2}$ 等于多少？（写成分数）", ["1/35"], r"$u = 5x + 2$，$\frac15 \cdot \frac17$。"),
]

PRACTICE["ses92"] = [
    choice("lc1", S + r"$\displaystyle\int_1^\infty \frac{dx}{\sqrt{x^2 + 10}}$ 收敛吗？", ["发散，因为它 $\\sim \\int_1^\\infty \\frac{dx}{x}$", "收敛，因为被积函数趋于 0", "收敛到 $\\frac{1}{\\sqrt{10}}$", "无法判断"], 0, "被积函数趋于 0 不足以保证收敛。"),
    choice("lc2", S + r"$\displaystyle\int_{10}^\infty \frac{dx}{\sqrt{x^3 + 3}}$ 收敛吗？", ["收敛，因为它 $\\sim \\int \\frac{dx}{x^{3/2}}$", "发散", "收敛到 0", "无法判断"], 0, r"$\frac32 > 1$。"),
    choice("gauss", S + r"证明 $\displaystyle\int_1^\infty e^{-x^2}\,dx$ 收敛，用哪个比较最方便？", [r"$x \ge 1$ 时 $e^{-x^2} \le e^{-x}$", r"$e^{-x^2} \sim e^{-x}$", r"$e^{-x^2} \sim \frac{1}{x}$", r"$e^{-x^2} \ge e^{-x}$"], 0, "普通比较，不是极限比较。"),
    choice("which", X + r"判断 $\displaystyle\int_1^\infty \frac{dx}{(5x + 2)^2}$ 时，和它 $\sim$ 的函数是？", [r"$\dfrac{1}{25x^2}$", r"$\dfrac{1}{x^2}$", r"$\dfrac{1}{5x}$", r"$\dfrac{1}{x}$"], 0, "比值要趋于 1。"),
]

PRACTICE["ses93"] = [
    choice("sqrt", S + r"$\displaystyle\int_0^1 \frac{dx}{\sqrt x}$ 等于？", ["2", r"$\infty$", "1", r"$\dfrac12$"], 0, r"$2\sqrt x\big|_0^1$。"),
    choice("p0", S + r"$\displaystyle\int_0^1 \frac{dx}{x^p}$ 什么时候收敛？", [r"$p < 1$", r"$p > 1$", r"$p \le 1$", "任何 $p$"], 0, "和 $\\int_1^\\infty$ 的情形正好相反。"),
    choice("trap", S + r"$\displaystyle\int_{-1}^1 \frac{dx}{x^2}$ 等于？", [r"发散（$\infty$）", "$-2$", "2", "0"], 0, "$x = 0$ 处有奇点，不能直接代上下限。"),
    choice("x3", S + r"$\displaystyle\int_0^\infty \frac{dx}{(x - 3)^2}$ 是？", ["发散", r"$\dfrac13$", r"$-\dfrac13$", "收敛到 1"], 0, "$x = 3$ 附近像 $\\frac{1}{x^2}$ 在 0 附近。"),
]

PRACTICE["ses94"] = [
    choice("geo", S + r"$|a| < 1$ 时，$1 + a + a^2 + \cdots$ 等于？", [r"$\dfrac{1}{1 - a}$", r"$\dfrac{a}{1 - a}$", r"$\dfrac{1}{1 + a}$", r"$\infty$"], 0, "几何级数。"),
    choice("alt", S + r"级数 $1 - 1 + 1 - 1 + \cdots$ 是？", ["发散", r"收敛到 $\dfrac12$", "收敛到 0", "收敛到 1"], 0, "部分和在 0 和 1 之间交替。"),
    choice("basel", S + r"$\displaystyle\sum_{n=1}^\infty \frac{1}{n^2}$ 等于？", [r"$\dfrac{\pi^2}{6}$", "1", "2", r"$\infty$"], 0, "欧拉的结果。"),
    text("partial", X + r"$S_N = \displaystyle\sum_{n=0}^N \frac{1}{2^n}$，$S_3$ 等于多少？（写成分数）", ["15/8"], r"$\frac{2^4 - 1}{2^3}$。"),
]

PRACTICE["ses95"] = [
    choice("harm", S + r"调和级数 $\displaystyle\sum_{n=1}^\infty \frac1n$ 是？", ["发散", r"收敛到 $\ln 2$", "收敛到 1", r"收敛到 $\dfrac{\pi^2}{6}$"], 0, r"$S_N > \ln N$。"),
    choice("bound", S + r"$S_N = \displaystyle\sum_{n=1}^N \frac1n$ 满足？", [r"$\ln N < S_N < \ln N + 1$", r"$S_N < \ln N$", r"$S_N = \ln N$", r"$S_N > N$"], 0, "上、下黎曼和各给一边。"),
    choice("lc", S + r"$\displaystyle\sum_{n=2}^\infty \frac{1}{\sqrt{n^5 - n^2}}$ 是？", [r"收敛（$\sim \sum \frac{1}{n^{5/2}}$）", "发散", r"收敛（$\sim \sum \frac1n$）", "无法判断"], 0, r"$\frac52 > 1$。"),
    choice("ratio", X + r"对 $\displaystyle\sum \frac{(n!)^2}{(2n)!}$ 用比值判别法，$L$ 等于？", [r"$\dfrac14$", r"$\dfrac12$", "1", "0"], 0, r"$\frac{n + 1}{2(2n + 1)} \to \frac14$。"),
]

PRACTICE["ses96"] = [
    choice("rec", S + r"堆积木时，上面 $N + 1$ 块的质心 $C_{N+1}$ 和 $C_N$ 的关系是？", [r"$C_{N+1} = C_N + \dfrac{1}{N + 1}$", r"$C_{N+1} = C_N + 1$", r"$C_{N+1} = \dfrac{C_N}{2}$", r"$C_{N+1} = C_N + \dfrac{1}{2^N}$"], 0, "加权平均。"),
    text("five", S + "（每块积木长 2 个单位）至少要几块积木，最上面那块才能完全伸出最下面那块？", ["5"], r"$C_5 = 1 + \frac12 + \frac13 + \frac14 + \frac15 > 2$。"),
    choice("far", S + "只要积木足够多，积木堆能伸多远？", ["想多远就多远，因为调和级数发散", "最多 2 块积木长", "最多 1 块积木长", r"最多 $\ln 2$"], 0, "但伸出量只像 $\\ln N$ 那样增长，非常慢。"),
]

PRACTICE["ses97"] = [
    choice("geo", S + r"$1 + x + x^2 + \cdots = \dfrac{1}{1 - x}$ 对哪些 $x$ 成立？", [r"$|x| < 1$", r"$|x| \le 1$", "所有 $x$", r"$x > 0$"], 0, "推导要求和 $S$ 存在。"),
    choice("radius", S + "幂级数在收敛半径 $R$ 以内时，$|a_nx^n|$ 怎样变化？", ["以指数速度趋于 0", "保持不变", "趋于无穷大", "趋于 1"], 0, "在 $|x| > R$ 时根本不趋于 0。"),
    text("ratio", X + r"$\displaystyle\sum_{n=1}^\infty \frac{x^n}{n}$ 的收敛半径是多少？", ["1"], r"$L = |x|$。"),
]

PRACTICE["ses98"] = [
    choice("taylor", S + r"泰勒公式中 $x^n$ 的系数 $a_n$ 是？", [r"$\dfrac{f^{(n)}(0)}{n!}$", r"$f^{(n)}(0)$", r"$\dfrac{f(0)}{n!}$", r"$n!f^{(n)}(0)$"], 0, r"$f^{(n)}(0) = n!a_n$。"),
    choice("ex", S + r"$e^x$ 的泰勒级数是？", [r"$\displaystyle\sum_{n=0}^\infty \frac{x^n}{n!}$", r"$\displaystyle\sum_{n=0}^\infty x^n$", r"$\displaystyle\sum_{n=1}^\infty \frac{x^n}{n}$", r"$\displaystyle\sum_{n=0}^\infty \frac{(-1)^nx^n}{n!}$"], 0, "所有导数在 0 处都是 1。"),
    choice("sin", S + r"$\sin x$ 的泰勒级数是？", [r"$x - \dfrac{x^3}{3!} + \dfrac{x^5}{5!} - \cdots$", r"$1 - \dfrac{x^2}{2!} + \dfrac{x^4}{4!} - \cdots$", r"$x + \dfrac{x^3}{3!} + \dfrac{x^5}{5!} + \cdots$", r"$x - \dfrac{x^3}{3} + \dfrac{x^5}{5} - \cdots$"], 0, "奇数次幂，符号交替。"),
    choice("e", X + r"$e$ 等于？", [r"$1 + 1 + \dfrac{1}{2!} + \dfrac{1}{3!} + \cdots$", r"$1 + \dfrac{1}{2!} + \dfrac{1}{3!} + \cdots$", r"$1 + \dfrac12 + \dfrac13 + \cdots$", r"$1 + \dfrac12 + \dfrac14 + \cdots$"], 0, r"在 $e^x$ 的级数中代入 $x = 1$。"),
]

PRACTICE["ses99"] = [
    choice("geo", S + r"$\dfrac{1}{1 + x}$ 的泰勒级数及收敛半径是？", [r"$1 - x + x^2 - x^3 + \cdots$，$R = 1$", r"$1 + x + x^2 + \cdots$，$R = 1$", r"$1 - x + x^2 - \cdots$，$R = \infty$", r"$x - \dfrac{x^2}{2} + \dfrac{x^3}{3} - \cdots$，$R = 1$"], 0, r"在几何级数中把 $x$ 换成 $-x$。"),
    choice("at1", S + r"在 $1 - x + x^2 - x^3 + \cdots$ 中代入 $x = 1$，结果是？", ["发散（部分和在 1 和 0 之间交替）", r"收敛到 $\dfrac12$", "收敛到 0", "收敛到 1"], 0, "在收敛半径的边界上。"),
    choice("sin-r", S + r"$\sin x$ 的泰勒级数的收敛半径是？", [r"$\infty$", "1", r"$\pi$", r"$2\pi$"], 0, r"$\frac{x^{2n+1}}{(2n + 1)!}$ 对任何固定的 $x$ 都趋于 0。"),
]

PRACTICE["ses100"] = [
    choice("mult", S + r"$x\sin x$ 的幂级数是？", [r"$x^2 - \dfrac{x^4}{3!} + \dfrac{x^6}{5!} - \cdots$", r"$x^2 - \dfrac{x^4}{2!} + \dfrac{x^6}{4!} - \cdots$", r"$1 - \dfrac{x^2}{3!} + \cdots$", r"$x - \dfrac{x^3}{3!} + \cdots$"], 0, "逐项乘以 $x$。"),
    choice("ln", S + r"$\ln(1 + x)$ 的幂级数是？", [r"$x - \dfrac{x^2}{2} + \dfrac{x^3}{3} - \cdots$", r"$1 - x + x^2 - \cdots$", r"$x + \dfrac{x^2}{2} + \dfrac{x^3}{3} + \cdots$", r"$x - \dfrac{x^3}{3!} + \cdots$"], 0, r"对 $\frac{1}{1 + t}$ 的级数逐项积分。"),
    choice("gauss", S + r"$e^{-t^2}$ 的幂级数是？", [r"$1 - t^2 + \dfrac{t^4}{2!} - \dfrac{t^6}{3!} + \cdots$", r"$1 - t + \dfrac{t^2}{2!} - \cdots$", r"$1 + t^2 + \dfrac{t^4}{2!} + \cdots$", r"$1 - \dfrac{t^2}{2!} + \dfrac{t^4}{4!} - \cdots$"], 0, r"在 $e^x$ 中代入 $x = -t^2$。"),
    text("sinx2", X + r"用前两个非零项近似 $\displaystyle\int_0^1 \sin(x^2)\,dx$，结果是多少？（写成分数）", ["13/42"], r"$\frac13 - \frac{1}{7 \cdot 3!}$。"),
]

PRACTICE["ses101"] = [
    choice("sinh", X + r"$\dfrac{d}{dx}\sinh^{-1}x$ 等于？", [r"$\dfrac{1}{\sqrt{1 + x^2}}$", r"$\dfrac{1}{\sqrt{1 - x^2}}$", r"$\dfrac{1}{1 + x^2}$", r"$\cosh x$"], 0, r"隐函数求导，再用 $\cosh^2 - \sinh^2 = 1$。"),
    choice("int", X + r"$\displaystyle\int \frac{dx}{\sqrt{a^2 + x^2}}$ 等于？", [r"$\sinh^{-1}\dfrac xa + c$", r"$\sin^{-1}\dfrac xa + c$", r"$\dfrac1a\tan^{-1}\dfrac xa + c$", r"$\cosh^{-1}\dfrac xa + c$"], 0, r"代换 $x = au$。"),
    choice("odd", X + r"$\sinh x$ 是？", ["奇函数，没有临界点，拐点在 $x = 0$", "偶函数，最小值在 $x = 0$", "奇函数，在 $x = 0$ 处有极大值", "周期函数"], 0, r"$\sinh' = \cosh > 0$，$\sinh'' = \sinh$。"),
]

E = "改编自期末考试第 "
PRACTICE["final"] = [
    choice("d7", E + "1 题 (b)。\n\n" + r"$f(x) = \sin(2x)$ 的七阶导数是？", [r"$-128\cos(2x)$", r"$128\cos(2x)$", r"$-128\sin(2x)$", r"$64\cos(2x)$"], 0, r"每求一次导数乘 2，余弦正弦按周期 4 循环。"),
    choice("tangent", E + "2 题 (a)。\n\n" + r"$y = 3x^2 - 5x + 2$ 在 $x = 2$ 处的切线是？", [r"$y = 7x - 10$", r"$y = 7x + 4$", r"$y = 6x - 8$", r"$y = 7x - 14$"], 0, r"斜率 7，过 $(2, 4)$。"),
    text("lhop", E + "3 题 (b)。\n\n" + r"$\displaystyle\lim_{x \to \sqrt3} \frac{\tan^{-1}x - \pi/3}{x - \sqrt3}$ 等于多少？（写成分数）", ["1/4"], r"$\frac{1}{1 + x^2}$ 在 $\sqrt3$ 处。"),
    choice("poster", E + "5 题。\n\n" + "印刷面积 50 平方英寸，上下边距 4 英寸、左右边距 2 英寸，用纸最少的海报尺寸是？", ["宽 9 英寸，高 18 英寸", "宽 10 英寸，高 13 英寸", "宽 7 英寸，高 25 英寸", "宽 12 英寸，高 15 英寸"], 0, r"$x = 5$，$y = 10$。"),
    choice("riemann", E + "7 题 (a)。\n\n" + r"$\displaystyle\lim_{n \to \infty}\sum_{i=1}^n \sqrt{1 + \frac{2i}{n}}\,\frac2n$ 等于？", [r"$2\sqrt3 - \dfrac23$", r"$2\sqrt3$", r"$\sqrt3 - 1$", r"$\dfrac23(3\sqrt3 + 1)$"], 0, r"$\int_0^2 \sqrt{1 + x}\,dx$。"),
    choice("xlnx", E + "8 题 (b)。\n\n" + r"$\displaystyle\int_1^2 x\ln x\,dx$ 等于？", [r"$2\ln 2 - \dfrac34$", r"$2\ln 2$", r"$\ln 2 - \dfrac34$", r"$2\ln 2 - \dfrac32$"], 0, "分部积分。"),
    choice("cored", E + "10 题。\n\n" + r"半径 $a$ 的球沿轴钻一个直径 $a$ 的孔，剩下的体积是？", [r"$\dfrac{\sqrt3\pi a^3}{2}$", r"$\dfrac43\pi a^3$", r"$\dfrac{\pi a^3}{2}$", r"$\sqrt3\pi a^3$"], 0, r"柱壳：$2\pi\int_{a/2}^a 2x\sqrt{a^2 - x^2}\,dx$。"),
    text("trap", E + "11 题。\n\n" + r"用两个梯形估计 $\displaystyle\int_1^5 \frac{e^x}{x}\,dx$（$x = 1, 3, 5$ 处的值为 2.7、6.7、29.7），结果是多少？", ["45.8"], r"$\frac22(2.7 + 2 \cdot 6.7 + 29.7)$。"),
    text("radium", E + "12 题 (b)。\n\n" + r"镭的半衰期 1600 年，100 毫克 1000 年后约剩多少毫克？（用 $2^{-10/16} \approx 0.65$）", ["65"], r"$100 \cdot 2^{-1000/1600}$。"),
    choice("cornu", E + "13 题。\n\n" + r"考纽螺线 $x = \int_0^t \cos(\pi u^2/2)\,du$，$y = \int_0^t \sin(\pi u^2/2)\,du$ 从 $t = 0$ 到 $t_0$ 的弧长是？", [r"$t_0$", r"$\dfrac{\pi t_0^2}{2}$", r"$\sqrt{t_0}$", "1"], 0, r"$x'^2 + y'^2 = 1$。"),
    text("ln32", E + "14 题 (c)。\n\n" + r"用 $\ln(1 + x)$ 的级数前两个非零项近似 $\ln\frac32$，结果是多少？（写成分数）", ["3/8"], r"$\frac12 - \frac18$。"),
]
