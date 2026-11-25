# 含正割、余割、余切的积分

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：复习三角恒等式

我们已经讨论过涉及正弦和余弦函数的三角积分。现在来看正割、正切这样的三角函数。下面快速复习一下它们的定义：

$$
\sec x = \frac{1}{\cos x}, \qquad \tan x = \frac{\sin x}{\cos x}, \qquad \csc x = \frac{1}{\sin x}, \qquad \cot x = \frac{\cos x}{\sin x}.
$$

在函数名前面加上「余」（英文的 co-），就是在这个函数里交换正弦和余弦的角色。

有下面这些恒等式：

$$
\sec^2x = 1 + \tan^2x, \qquad \frac{d}{dx}\tan x = \sec^2x, \qquad \frac{d}{dx}\sec x = \sec x\tan x.
$$

可以用熟悉的关于 $\sin x$ 和 $\cos x$ 的三角恒等式验证它们：

$$
\sec^2x = \frac{1}{\cos^2x} = \frac{\cos^2x + \sin^2x}{\cos^2x} = 1 + \tan^2x.
$$

这是我们今天要做的事情背后的主要三角恒等式。

$$
\frac{d}{dx}\tan x = \frac{d}{dx}\left(\frac{\sin x}{\cos x}\right) = \frac{(\cos x)(\cos x) - (\sin x)(-\sin x)}{\cos^2x} \;(\text{商法则}) = \frac{\cos^2x + \sin^2x}{\cos^2x} = \frac{1}{\cos^2x} = \sec^2x.
$$

由此得到今天的第一个积分：

$$
\int \sec^2x\,dx = \tan x + c.
$$

$$
\frac{d}{dx}\sec x = \frac{d}{dx}\frac{1}{\cos x} = \frac{0 - (-\sin x)}{\cos^2x} = \frac{\sin x}{\cos^2x} = \tan x\sec x.
$$

如果我们需要 $\tan x\sec x$ 的原函数，现在就有一个了。

（译注：原文在 $\tan x$ 的求导那一步注明「链式法则」，实际用的是商法则，译文已改。）

## 片段 2：正切的积分

如果不能从已知的导数倒推，怎样积这些三角函数中的一个？

$$
\int \tan x\,dx = \int \frac{\sin x}{\cos x}\,dx.
$$

如果你在算这样一个积分，看到一个三角函数，最好四处看看能不能也找到这个三角函数的导数。我们作代换

$$
u = \cos x, \qquad du = -\sin x\,dx,
$$

把积分改写成

$$
\int \tan x\,dx = \int \frac{\sin x\,dx}{\cos x} = \int \frac{-du}{u} = -\ln|u| + c,
$$

即

$$
\int \tan x\,dx = -\ln|\cos x| + c.
$$

大多数教材的书后都有这样的公式表。此外，学微积分总要记一些东西；这类公式大概就是你想记住的。

## 片段 3：正割的积分

$$
\int \sec x\,dx = ?
$$

这个计算不像正切那么直接。我们要做的是把正割和正切的导数公式加在一起：

$$
\frac{d}{dx}(\sec x + \tan x) = \sec^2x + \sec x\tan x = (\sec x)(\sec x + \tan x).
$$

注意 $\sec x + \tan x$ 出现在等式两边。令 $u = \sec x + \tan x$ 并代入，等式变成

$$
u' = u \cdot \sec x.
$$

这告诉我们

$$
\sec x = \frac{u'}{u}.
$$

我们以前见过它；它叫作**对数导数**：

$$
\frac{u'}{u} = \frac{d}{dx}\ln(u).
$$

把这些按顺序放在一起，得到

$$
\sec x = \frac{u'}{u} \;(u = \sec x + \tan x) = \frac{d}{dx}\ln u \;\Longrightarrow\; \sec x = \frac{d}{dx}\ln(\sec x + \tan x).
$$

两边积分，得到

$$
\int \sec x\,dx = \ln(\sec x + \tan x) + c.
$$

（一般地写成 $\ln|\sec x + \tan x| + c$，这样在 $\sec x + \tan x < 0$ 的区间上也成立。）

我们对恰好合适的函数求导，再以恰当的方式看待结果，就得到了需要的公式。这门课不要求你自己做出这种推导。

## 片段 4：三角积分小结

关于三角函数和微积分，我们现在知道下面这些事实：

$$
\begin{array}{lll}
\sec x = \dfrac{1}{\cos x} & \tan x = \dfrac{\sin x}{\cos x} & \sin^2x + \cos^2x = 1 \\[2ex]
\csc x = \dfrac{1}{\sin x} & \cot x = \dfrac{\cos x}{\sin x} & \sec^2x = 1 + \tan^2x \\[2ex]
\dfrac{d}{dx}\tan x = \sec^2x & \dfrac{d}{dx}\sec x = \sec x\tan x & \displaystyle\int \tan x\,dx = -\ln|\cos x| + c \\[2ex]
\dfrac{d}{dx}\sin x = \cos x & \dfrac{d}{dx}\cos x = -\sin x & \displaystyle\int \sec x\,dx = \ln(\sec x + \tan x) + c
\end{array}
$$

我们还见过几种有用的积分技巧，包括积任何形如 $\sin^nx\cos^mx$ 的函数的方法。到这里，我们已经有了积大多数三角多项式所需的工具。

**例**：$\displaystyle\int \sec^4x\,dx$。

可以用恒等式 $\sec^2x = 1 + \tan^2x$ 去掉一些 $\sec x$ 的因子。这尤其是个好主意，因为 $\sec^2x$ 是 $\tan x$ 的导数：

$$
\int \sec^4x\,dx = \int (1 + \tan^2x)\sec^2x\,dx.
$$

用代换 $u = \tan x$，$du = \sec^2x\,dx$，得到

$$
\int \sec^4x\,dx = \int (1 + u^2)\,du = u + \frac{u^3}{3} + c = \tan x + \frac{\tan^3x}{3} + c.
$$
