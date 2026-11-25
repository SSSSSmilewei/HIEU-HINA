# 正弦和余弦的导数

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：sin x 的导数（代数证明）

具体的求导公式告诉我们怎样给一个具体的函数求导：如果 $f(x) = x^n$，那么 $f'(x) = nx^{n-1}$。现在我们来算函数 $\sin x$ 导数的具体公式。

和以前一样，从导数的定义开始：

$$
\frac{d}{dx}\sin x = \lim_{\Delta x \to 0} \frac{\sin(x + \Delta x) - \sin x}{\Delta x}.
$$

你可能还记得高中学过的和角公式：

$$
\sin(a + b) = \sin a \cos b + \sin b \cos a.
$$

用它可以把 $x$ 和 $\Delta x$ 拆开：

$$
\frac{d}{dx}\sin x = \lim_{\Delta x \to 0} \frac{\sin x \cos \Delta x + \cos x \sin \Delta x - \sin x}{\Delta x}.
$$

用一些基本的代数事实化简这个式子：

$$
\begin{aligned}
\frac{d}{dx}\sin x &= \lim_{\Delta x \to 0} \left[\frac{\sin x \cos \Delta x - \sin x}{\Delta x} + \frac{\cos x \sin \Delta x}{\Delta x}\right] \\
&= \lim_{\Delta x \to 0} \left[\frac{\sin x(\cos \Delta x - 1)}{\Delta x} + \frac{\cos x \sin \Delta x}{\Delta x}\right] \\
&= \lim_{\Delta x \to 0} \left[\sin x\left(\frac{\cos \Delta x - 1}{\Delta x}\right) + \cos x\left(\frac{\sin \Delta x}{\Delta x}\right)\right] \\
&= \lim_{\Delta x \to 0} \sin x\left(\frac{\cos \Delta x - 1}{\Delta x}\right) + \lim_{\Delta x \to 0} \cos x\left(\frac{\sin \Delta x}{\Delta x}\right).
\end{aligned}
$$

现在我们有两个熟悉的函数——$\sin x$ 和 $\cos x$——以及两个难看的分式要处理。讨论可去间断时，你可能已经见过这两个分式：

$$
\lim_{\Delta x \to 0} \frac{\cos \Delta x - 1}{\Delta x} = 0, \qquad \lim_{\Delta x \to 0} \frac{\sin \Delta x}{\Delta x} = 1.
$$

利用这两个（尚未证明的）事实，上式化简为 $\sin x \cdot 0 + \cos x \cdot 1 = \cos x$。结论是

$$
\frac{d}{dx}\sin x = \cos x.
$$

## 片段 2：cos x 的导数

函数 $\cos x$ 的导数的具体公式是什么？

这个计算和 $\sin x$ 的导数非常相似。如果某一步卡住了，回头看看那边对应的步骤可能会有帮助。

和计算 $\dfrac{d}{dx}\sin x$ 时一样，从导数的定义开始：

$$
\frac{d}{dx}\cos x = \lim_{\Delta x \to 0} \frac{\cos(x + \Delta x) - \cos x}{\Delta x}.
$$

用和角公式 $\cos(a + b) = \cos a \cos b - \sin a \sin b$，再化简：

$$
\begin{aligned}
\frac{d}{dx}\cos x &= \lim_{\Delta x \to 0} \frac{\cos x \cos \Delta x - \sin x \sin \Delta x - \cos x}{\Delta x} \\
&= \lim_{\Delta x \to 0} \left[\frac{\cos x(\cos \Delta x - 1)}{\Delta x} - \frac{\sin x \sin \Delta x}{\Delta x}\right] \\
&= \lim_{\Delta x \to 0} \cos x\left(\frac{\cos \Delta x - 1}{\Delta x}\right) + \lim_{\Delta x \to 0} (-\sin x)\left(\frac{\sin \Delta x}{\Delta x}\right).
\end{aligned}
$$

再次使用下面两个（尚未证明的）事实：

$$
\text{(A)}\quad \lim_{\Delta x \to 0} \frac{\cos \Delta x - 1}{\Delta x} = 0, \qquad \text{(B)}\quad \lim_{\Delta x \to 0} \frac{\sin \Delta x}{\Delta x} = 1.
$$

于是得到

$$
\frac{d}{dx}\cos x = \cos x \cdot 0 + (-\sin x) \cdot 1 = -\sin x.
$$
