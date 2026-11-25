# 例题：sinc 函数

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

（非归一化的）**sinc 函数**定义为

$$
\operatorname{sinc}(x) = \frac{\sin x}{x}.
$$

这个函数用于信号处理，这个领域包括录音和无线电传输。

利用你对 $\sin x$ 和 $\dfrac1x$ 的图像的了解，以及这一讲学到的知识，画出 $\operatorname{sinc}(x) = \sin x \cdot \dfrac1x$ 的草图。

<details>
<summary>解答</summary>

因为 $\displaystyle\lim_{x \to 0} \frac{\sin x}{x} = 1$，我们规定（补上可去间断）$\operatorname{sinc}(0) = 1$。

因为 $\sin x$ 在正值和负值之间振荡，$\operatorname{sinc}(x)$ 也会振荡。除了 $x = 0$ 以外，$\operatorname{sinc}(x)$ 图像的 $x$ 截距和 $\sin x$ 的相同。

已知 $-1 \le \sin x \le 1$，所以（$x > 0$ 时）一定有

$$
-\frac1x \le \frac{\sin x}{x} \le \frac1x.
$$

$\operatorname{sinc}(x)$ 的图像在 $\dfrac1x$ 和 $-\dfrac1x$ 的图像之间上下摆动。

> 图 1：$\sin x$（绿色）、$\dfrac1x$（蓝色）和 $-\dfrac1x$（红色）的图像。

画 $\operatorname{sinc}(x)$ 的图像时，先把 $\sin x$、$\dfrac1x$ 和 $-\dfrac1x$ 的图像叠在一起（见图 1）。

因为 $\sin(-x) = -\sin x$，所以 $\dfrac{\sin(-x)}{-x} = \dfrac{\sin x}{x}$：$\operatorname{sinc}(x)$ 是偶函数。（例如在 $-\pi < x < 0$ 上，$\dfrac1x$ 和 $\sin x$ 都是负的，它们的商是正的。）知道了这一点，我们很快就能猜出 $\operatorname{sinc}(x)$ 的图像：在 $x = 0$ 处取最大值 1，向两边振荡，振幅随 $|x|$ 增大而按 $\dfrac{1}{|x|}$ 衰减，在 $x = \pm\pi, \pm2\pi, \ldots$ 处穿过 $x$ 轴（图 2）。（很难看出图像在 $x = 0$ 附近是什么样子。可以用计算器描几个点，也可以多学一些微积分再回来做这道题。）

（译注：两边的不等式 $-\dfrac1x \le \dfrac{\sin x}{x} \le \dfrac1x$ 在 $x < 0$ 时要反过来，写成 $-\dfrac{1}{|x|} \le \operatorname{sinc}(x) \le \dfrac{1}{|x|}$ 就对所有 $x \ne 0$ 都成立。）

> 图 2：$\operatorname{sinc}(x)$ 的图像。

</details>
