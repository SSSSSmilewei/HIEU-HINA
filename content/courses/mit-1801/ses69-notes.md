# sinⁿx cosᵐx 的积分：偶数次幂

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：例：∫cos²x dx

如果要积分 $\displaystyle\int \sin^nx\cos^mx\,dx$，而两个指数都是偶数，怎么办？这是较难的情形；我们用半角公式来解：

$$
\cos^2\theta = \frac{1 + \cos(2\theta)}{2}, \qquad \sin^2\theta = \frac{1 - \cos(2\theta)}{2}.
$$

这些公式的用处是把 $\sin x$ 和 $\cos x$ 的偶数次幂变成 $\cos(2x)$ 的（更低的）幂。

如果想积分

$$
\int \cos^2x\,dx,
$$

可以把它改写成 $\displaystyle\int (1 - \sin^2x)\,dx$，但新的积分至少和原来的一样难。改用半角公式：

$$
\int \cos^2x\,dx = \int \frac{1 + \cos(2x)}{2}\,dx = \frac x2 + \frac{\sin 2x}{4} + c.
$$

注意答案里出现了 $\dfrac x2$，它不是三角函数！

## 片段 2：例：∫sin²x cos²x dx

要积分 $\sin^2x\cos^2x$，我们再次使用半角公式：

$$
\cos^2\theta = \frac{1 + \cos(2\theta)}{2}, \qquad \sin^2\theta = \frac{1 - \cos(2\theta)}{2}.
$$

最好在纸的一边单独对被积函数做三角和代数变形，这样就不必一直抄（也许会忘掉）积分号和 $dx$。

旁边的演算：

$$
\sin^2x\cos^2x = \left(\frac{1 - \cos(2x)}{2}\right)\left(\frac{1 + \cos(2x)}{2}\right) = \frac{1 - \cos^2(2x)}{4}.
$$

还有一个平方，所以仍然不是容易的情形。但这是一个较容易的「难」情形，尤其是我们刚刚算过 $\displaystyle\int \cos^2x\,dx$。可以直接用那个结果，不过我们还是继续用半角公式，直到化成容易的情形：

$$
\sin^2x\cos^2x = \frac{1 - \cos^2(2x)}{4} = \frac14 - \frac{1 + \cos(4x)}{4 \cdot 2} = \frac18 - \frac{\cos(4x)}{8}.
$$

做完旁边的演算，代回原来的积分，得到

$$
\int \sin^2x\cos^2x\,dx = \int \left(\frac18 - \frac{\cos(4x)}{8}\right)dx = \frac x8 - \frac{\sin(4x)}{8 \cdot 4} + c.
$$

现在我们应该能计算任何形如 $\displaystyle\int \sin^nx\cos^mx\,dx$ 的积分了。

下面是用恒等式

$$
\sin(2\theta) = 2\sin\theta\cos\theta
$$

做旁边演算的另一种方法：

$$
\sin^2x\cos^2x = (\sin x\cos x)^2 = \left(\frac{\sin(2x)}{2}\right)^2 = \frac{\sin^2(2x)}{4} = \frac14\left(\frac{1 - \cos(4x)}{2}\right) = \frac18 - \frac{\cos(4x)}{8}.
$$

用正弦的二倍角公式减少了 $\sin x$ 和 $\cos x$ 的因子个数，但还不够；它留下了因子 $\sin^2(2x)$。接着，正弦的半角公式让我们把它化成常数减去余弦函数的倍数。

注意得到的表达式和前面一样。
