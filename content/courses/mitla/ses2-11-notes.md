# 马尔可夫矩阵与傅里叶级数

> 本页是 MIT 开放式课程 18.06SC 官方讲座摘要（lecture summary）的中文翻译，原文见页面下方的「讲座摘要原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

这一讲研究马尔可夫矩阵和傅里叶级数——特征值和投影的两个应用。

## Aᵀ 的特征值

$A$ 的特征值与 $A^T$ 的特征值相同：

$$
(A - \lambda I)^T = A^T - \lambda I,
$$

所以由行列式的性质 10 得 $\det(A - \lambda I) = \det(A^T - \lambda I)$。如果 $\lambda$ 是 $A$ 的特征值，那么 $\det(A^T - \lambda I) = 0$，$\lambda$ 也是 $A^T$ 的特征值。

## 马尔可夫矩阵

像

$$
A = \begin{bmatrix} .1 & .01 & .3 \\ .2 & .99 & .3 \\ .7 & 0 & .4 \end{bmatrix}
$$

这样所有元素都非负、每一列之和都是 1 的矩阵，称为**马尔可夫矩阵**（Markov matrix）。这些要求来自马尔可夫矩阵在概率中的用途。把马尔可夫矩阵平方或者取任意次幂，得到的仍然是马尔可夫矩阵。

处理微分方程组时，特征值为 0 的特征向量代表稳态。这里我们处理的是矩阵的幂，当 $\lambda = 1$ 是特征值时就得到稳态。

「每列之和为 1」这个约束保证了 1 是一个特征值，所有其他特征值的绝对值都不超过 1。记得（如果 $A$ 有 $n$ 个线性无关的特征向量）$u_k = A^k u_0$ 的解是 $u_k = c_1\lambda_1^k x_1 + c_2\lambda_2^k x_2 + \cdots + c_n\lambda_n^k x_n$。如果 $\lambda_1 = 1$，而所有其他特征值的绝对值都小于 1，系统就趋于稳态 $c_1 x_1$，也就是 $u_0$ 在 $x_1$ 方向上的分量。

为什么「每列之和为 1」能保证 1 是特征值？如果 1 是 $A$ 的特征值，那么

$$
A - 1I = \begin{bmatrix} -.9 & .01 & .3 \\ .2 & -.01 & .3 \\ .7 & 0 & -.6 \end{bmatrix}
$$

应该是奇异的。由于我们从每个对角元减去了 1，$A - I$ 每一列的元素之和都是零。于是 $A - I$ 的各行之和是零行，所以 $A - I$ 是奇异的。特征向量 $x_1$ 在 $A - I$ 的零空间中，特征值为 1。不难求出 $x_1 = \begin{bmatrix} .6 \\ 33 \\ .7 \end{bmatrix}$。

我们研究的是方程 $u_{k+1} = Au_k$，其中 $A$ 是马尔可夫矩阵。例如 $u_1$ 可以是马萨诸塞州的人口（人数），$u_2$ 可以是加利福尼亚州的人口。$A$ 可以描述有多少比例的人口从一个州迁到另一个州，或者某个人迁移的概率。人数不能是负数，所以 $A$ 的元素总是非负的。我们要把模型中的所有人都算进去，所以 $A$ 的各列之和是 $1 = 100\%$。

例如

$$
\begin{bmatrix} u_{\text{Cal}} \\ u_{\text{Mass}} \end{bmatrix}_{t=k+1} = \begin{bmatrix} .9 & .2 \\ .1 & .8 \end{bmatrix} \begin{bmatrix} u_{\text{Cal}} \\ u_{\text{Mass}} \end{bmatrix}_{t=k}
$$

假设加州的人有 90% 的概率留在加州、只有 10% 的概率迁走，而马萨诸塞州的居民有 20% 的概率迁往加州。如果初始条件是 $\begin{bmatrix} u_{\text{Cal}} \\ u_{\text{Mass}} \end{bmatrix}_0 = \begin{bmatrix} 0 \\ 1000 \end{bmatrix}$，那么一次迁移之后 $u_1 = Au_0$ 是

$$
\begin{bmatrix} u_{\text{Cal}} \\ u_{\text{Mass}} \end{bmatrix}_1 = \begin{bmatrix} .9 & .2 \\ .1 & .8 \end{bmatrix} \begin{bmatrix} 0 \\ 1000 \end{bmatrix} = \begin{bmatrix} 200 \\ 800 \end{bmatrix}.
$$

在接下来的几步里，马萨诸塞州的人口会减少、加州的人口会增加，而总人口保持为 1000。

要理解这个系统的长期行为，需要 $\begin{bmatrix} .9 & .2 \\ .1 & .8 \end{bmatrix}$ 的特征向量和特征值。我们知道有一个特征值是 $\lambda_1 = 1$。由于迹 $.9 + .8 = 1.7$ 是特征值之和，所以 $\lambda_2 = .7$。

接着计算特征向量：

$$
(A - \lambda_1 I)x_1 = \begin{bmatrix} -.1 & .2 \\ .1 & -.2 \end{bmatrix} x_1 = 0,
$$

所以取 $x_1 = \begin{bmatrix} 2 \\ 1 \end{bmatrix}$。特征值 1 对应稳态解，而 $\lambda_2 = .7 < 1$，所以系统趋于这样的极限：1000 人中 2/3 住在加州，1/3 住在马萨诸塞州。从任何起始向量 $u_0$ 出发，极限都是这样。

要知道有限步之后人口怎样分布，就找 $\lambda_2 = .7$ 对应的特征向量：

$$
(A - \lambda_2 I)x_2 = \begin{bmatrix} .2 & .2 \\ .1 & .1 \end{bmatrix} x_2 = 0,
$$

所以令 $x_2 = \begin{bmatrix} -1 \\ 1 \end{bmatrix}$。

由我们学过的差分方程知识可知

$$
u_k = c_1 1^k \begin{bmatrix} 2 \\ 1 \end{bmatrix} + c_2 (.7)^k \begin{bmatrix} -1 \\ 1 \end{bmatrix}.
$$

$k = 0$ 时

$$
u_0 = \begin{bmatrix} 0 \\ 1000 \end{bmatrix} = c_1 \begin{bmatrix} 2 \\ 1 \end{bmatrix} + c_2 \begin{bmatrix} -1 \\ 1 \end{bmatrix},
$$

所以 $c_1 = \dfrac{1000}{3}$、$c_2 = \dfrac{2000}{3}$。

在有些应用中，马尔可夫矩阵的定义不同——是各**行**之和为 1，而不是各列。这时所有的计算就是我们这里所做的一切的转置。

## 傅里叶级数与投影

### 用标准正交基展开

如果有一组标准正交基 $q_1, q_2, \ldots, q_n$，就可以把任何向量 $v$ 写成 $v = x_1q_1 + x_2q_2 + \cdots + x_nq_n$，其中

$$
q_i^T v = x_1 q_i^T q_1 + x_2 q_i^T q_2 + \cdots + x_n q_i^T q_n = x_i.
$$

因为除非 $i = j$，否则 $q_i^T q_j = 0$，所以这个等式给出 $x_i = q_i^T v$。

用矩阵来表示，$\begin{bmatrix} q_1 & \cdots & q_n \end{bmatrix} \begin{bmatrix} x_1 \\ \vdots \\ x_n \end{bmatrix} = v$，即 $Qx = v$，所以 $x = Q^{-1}v$。由于 $q_i$ 构成标准正交基，$Q^{-1} = Q^T$，$x = Q^T v$。这是看出 $x_i = q_i^T v$ 的另一种方式。

### 傅里叶级数

上面的关键思想是：基向量 $q_i$ 是标准正交的。傅里叶级数就建立在这个思想上。我们可以用三角函数来描述一个函数 $f(x)$：

$$
f(x) = a_0 + a_1\cos x + b_1\sin x + a_2\cos 2x + b_2\sin 2x + \cdots.
$$

这个傅里叶级数是无穷和，而前面的例子是有限和；但两者是相关的，因为傅里叶级数中的余弦和正弦是正交的。

我们现在是在一个无穷维的向量空间里工作。这个空间里的向量是函数，（正交的）基向量是 $1, \cos x, \sin x, \cos 2x, \sin 2x, \ldots$

在这里，「正交」是什么意思？在这个向量空间里怎样计算点积，也就是**内积**？对 $\mathbb{R}^n$ 中的向量，内积是 $v^T w = v_1w_1 + v_2w_2 + \cdots + v_nw_n$。函数是用一个连续的取值 $f(x)$ 来描述的，而不是用一组离散的分量 $v_i$。与向量点积最贴切的类比是

$$
f^T g = \int_0^{2\pi} f(x)g(x)\,dx.
$$

我们从 0 积分到 $2\pi$，因为傅里叶级数是周期的：$f(x) = f(x + 2\pi)$。

两个基向量的内积是零，正合我们的要求。例如

$$
\int_0^{2\pi} \sin x \cos x\,dx = \left.\frac{(\sin x)^2}{2}\right|_0^{2\pi} = 0.
$$

怎样求 $a_0, a_1$ 等，也就是函数在这个空间里的坐标——**傅里叶系数**？常数项 $a_0$ 是函数的平均值。由于我们用的是正交基，可以用内积求出系数 $a_i$：

$$
\begin{aligned}
\int_0^{2\pi} f(x)\cos x\,dx &= \int_0^{2\pi} (a_0 + a_1\cos x + b_1\sin x + a_2\cos 2x + \cdots)\cos x\,dx \\
&= 0 + \int_0^{2\pi} a_1\cos^2 x\,dx + 0 + 0 + \cdots \\
&= a_1\pi.
\end{aligned}
$$

由此得到 $a_1 = \dfrac{1}{\pi}\displaystyle\int_0^{2\pi} f(x)\cos x\,dx$。用同样的方法可以求出任何一个 $a_i$。
