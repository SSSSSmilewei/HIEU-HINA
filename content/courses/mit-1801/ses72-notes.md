# 三角代换

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：三角代换的例子：∫dx/(x²√(1+x²))

$$
\int \frac{dx}{x^2\sqrt{1 + x^2}} = ?
$$

这是一个难看的积分。平方根是最难看的部分，所以我们设法把它改写成能去掉平方的样子。如果令 $x = \tan\theta$，恒等式 $\sec^2\theta = 1 + \tan^2\theta$ 就能做到这一点。于是 $dx = \sec^2\theta\,d\theta$：

$$
\int \frac{dx}{x^2\sqrt{1 + x^2}} = \int \frac{\sec^2\theta\,d\theta}{\tan^2\theta\sqrt{1 + \tan^2\theta}} = \int \frac{\sec^2\theta\,d\theta}{\tan^2\theta\sqrt{\sec^2\theta}} = \int \frac{\sec^2\theta\,d\theta}{\tan^2\theta\sec\theta} = \int \frac{\sec\theta\,d\theta}{\tan^2\theta}.
$$

面对像这样各种不同的三角函数，最好把一切都改写成 $\sin\theta$ 和 $\cos\theta$：

$$
\int \frac{dx}{x^2\sqrt{1 + x^2}} = \int \frac{\frac{1}{\cos\theta}\,d\theta}{\frac{\sin^2\theta}{\cos^2\theta}} = \int \frac{\cos^2\theta\,d\theta}{\cos\theta\sin^2\theta} = \int \frac{\cos\theta\,d\theta}{\sin^2\theta}.
$$

这个积分最难看的部分是分母里的 $\sin^2\theta$。因为 $\cos\theta\,d\theta$ 是 $\sin\theta$ 的微分，我们作代换 $u = \sin\theta$，$du = \cos\theta\,d\theta$：

$$
\int \frac{dx}{x^2\sqrt{1 + x^2}} = \int \frac{\cos\theta\,d\theta}{\sin^2\theta} = \int \frac{du}{u^2} = -\frac1u + c.
$$

现在要把代换倒回去：

$$
\int \frac{dx}{x^2\sqrt{1 + x^2}} = -\frac{1}{\sin\theta} + c = -\csc\theta + c.
$$

怎样撤销代换 $x = \tan\theta$ 并不明显。幸运的是，撤销这类代换有一个通用方法，就是回到把三角函数看作直角三角形边长之比的观点。

> 图 1：撤销三角代换：直角三角形，角 $\theta$ 的对边长 $x$，邻边长 1。

我们知道 $x = \tan\theta$，也知道 $\tan\theta$ 等于 $\theta$ 的对边长除以邻边长。图 1 画了一个直角三角形，有一个角 $\theta$，对边长 $x$，邻边长 1。勾股定理告诉我们斜边长必定是 $\sqrt{1 + x^2}$。现在可以推出

$$
\csc\theta = \frac{\text{斜边}}{\text{对边}} = \frac{\sqrt{1 + x^2}}{x}.
$$

因此

$$
\int \frac{dx}{x^2\sqrt{1 + x^2}} = -\frac{\sqrt{1 + x^2}}{x} + c.
$$

在计算这个积分的过程中，我们见到了：三角代换、把三角函数改写成正弦和余弦、直接代换，以及撤销三角代换。

撤销那个三角代换时，我们实际做的是计算 $\csc(\arctan(x))$。换句话说，我们把一个三角函数和另一个三角函数的反函数复合了起来。

## 片段 2：撤销三角代换

Miller 教授玩了一个游戏：学生给他一个三角函数和一个反三角函数，他设法算出它们的复合。正如我们看到的，这有时是用三角代换积分的最后一步。

$$
\underline{\quad}(\operatorname{arc}\underline{\quad}\,x) = ?
$$

**例**：$\tan(\operatorname{arccsc}x) = ?$

**问**：$\tan(\operatorname{arccsc}x)$ 作为最终答案不行吗？

**答**：「行」是什么意思？表达式 $-\csc(\arctan x)$ 是正确的最终答案，但 $-\dfrac{\sqrt{1 + x^2}}{x}$ 是一个更好、更有启发性、大概也更有用的答案。

要化简 $\tan(\operatorname{arccsc}x)$，我们画一个三角形，表示一个余割为 $x$ 的角；见图 1。我们知道

$$
x = \csc\theta = \frac{1}{\sin\theta} = \frac{\text{斜边}}{\text{对边}},
$$

所以选方便的值 $x$ 和 1 作为斜边和对边的长。

> 图 1：$\theta = \operatorname{arccsc}x$，所以 $x = \csc\theta$：直角三角形，斜边长 $x$，$\theta$ 的对边长 1，邻边长 $\sqrt{x^2 - 1}$。

画出三角形之后，可以算出邻边的长必定是 $\sqrt{x^2 - 1}$，所以

$$
\tan\theta = \frac{\text{对边}}{\text{邻边}} = \frac{1}{\sqrt{x^2 - 1}}.
$$

因为 $x = \csc\theta$，有

$$
\tan(\operatorname{arccsc}x) = \tan\theta = \frac{1}{\sqrt{x^2 - 1}}.
$$

只要需要撤销三角代换，这个技巧多半有用。

## 片段 3：三角代换小结

下表列出了不同的三角代换及其用处。

| 被积函数含有 | 作代换 | 得到 |
|---|---|---|
| $\sqrt{a^2 - x^2}$ | $x = a\cos\theta$ 或 $x = a\sin\theta$ | $a\sin\theta$ 或 $a\cos\theta$ |
| $\sqrt{a^2 + x^2}$ | $x = a\tan\theta$ | $a\sec\theta$ |
| $\sqrt{x^2 - a^2}$ | $x = a\sec\theta$ | $a\tan\theta$ |

这是用三角代换积分的三种基本形式。一般地，用三角代换是为了把二次函数的平方根换成一个三角函数。做完代换后积分，再用我们学过的直角三角形和撤销三角代换的方法得到最终答案。
