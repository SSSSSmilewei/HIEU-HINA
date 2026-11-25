# 复矩阵与快速傅里叶变换

> 本页是 MIT 开放式课程 18.06SC 官方讲座摘要（lecture summary）的中文翻译，原文见页面下方的「讲座摘要原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

元素全是实数的矩阵也可能有复特征值！所以我们无法回避复数。这一讲学习怎样处理复向量和复矩阵。

最重要的复矩阵是傅里叶矩阵 $F_n$，它用于傅里叶变换。通常，乘以 $F_n$ 需要 $n^2$ 次乘法。**快速傅里叶变换**（Fast Fourier Transform，FFT）把它减少到大约 $n\log_2 n$ 次乘法，这是一个革命性的改进。

## 复向量

### 长度

给定一个元素为复数的向量 $z = \begin{bmatrix} z_1 \\ z_2 \\ \vdots \\ z_n \end{bmatrix} \in \mathbb{C}^n$，怎样求它的长度？我们原来的定义

$$
z^T z = \begin{bmatrix} z_1 & z_2 & \cdots & z_n \end{bmatrix} \begin{bmatrix} z_1 \\ z_2 \\ \vdots \\ z_n \end{bmatrix}
$$

不行了：这个量并不总是正的。例如

$$
\begin{bmatrix} 1 & i \end{bmatrix} \begin{bmatrix} 1 \\ i \end{bmatrix} = 0.
$$

我们不希望把 $\begin{bmatrix} 1 \\ i \end{bmatrix}$ 的长度定义成 0。正确的定义是 $|z|^2 = \bar{z}^T z = |z_1|^2 + |z_2|^2 + \cdots + |z_n|^2$。于是

$$
\left(\text{长度}\begin{bmatrix} 1 \\ i \end{bmatrix}\right)^2 = \begin{bmatrix} 1 & -i \end{bmatrix} \begin{bmatrix} 1 \\ i \end{bmatrix} = 2.
$$

为了简化记号，我们写 $|z|^2 = z^H z$，其中 $z^H = \bar{z}^T$。H 来自数学家埃尔米特（Hermite）的名字，$z^H z$ 读作「z 埃尔米特 z」。

### 内积

类似地，两个复向量的内积（点积）也不只是 $y^T x$，还必须对 $y$ 取共轭：

$$
y^H x = \bar{y}^T x = \bar{y}_1 x_1 + \bar{y}_2 x_2 + \cdots + \bar{y}_n x_n.
$$

## 复矩阵

### 埃尔米特矩阵

对称矩阵是满足 $A^T = A$ 的实矩阵。如果 $A$ 是复矩阵，更好的性质是 $\bar{A}^T = A$；这样的矩阵叫做**埃尔米特矩阵**（Hermitian matrix），我们把 $\bar{A}^T$ 简记为 $A^H$。

注意埃尔米特矩阵的对角元必须是实数。例如

$$
\bar{A}^T = A = \begin{bmatrix} 2 & 3 + i \\ 3 - i & 5 \end{bmatrix}.
$$

和对称矩阵一样，埃尔米特矩阵有实特征值和互相垂直的特征向量。

### 酉矩阵

复向量 $q_1, q_2, \ldots, q_n$ 互相垂直（或者标准正交）是什么意思？我们必须用新的内积定义。要使复空间中的一组 $q_j$ 标准正交，我们要求

$$
\bar{q}_j^T q_k = \begin{cases} 0 & j \ne k \\ 1 & j = k \end{cases}.
$$

同样可以定义 $Q = \begin{bmatrix} q_1 & q_2 & \cdots & q_n \end{bmatrix}$，于是 $Q^H Q = I$。正如「埃尔米特」是「对称」在复数中的对应，「酉」（unitary）对应于「正交」。**酉矩阵**是各列互相垂直、长度为 1 的方阵。

## 离散傅里叶变换

傅里叶级数是把一个周期函数或信号写成不同频率的函数之和的方法：

$$
f(x) = a_0 + a_1\cos x + b_1\sin x + a_2\cos 2x + b_2\sin 2x + \cdots.
$$

处理有限的数据集时，**离散傅里叶变换**是实现这种分解的关键。

在电子工程和计算机科学中，矩阵的行和列从 0 开始编号，而不是从 1（到 $n - 1$ 结束，而不是 $n$）。讨论傅里叶矩阵时我们沿用这个约定：

$$
F_n = \begin{bmatrix} 1 & 1 & 1 & \cdots & 1 \\ 1 & w & w^2 & \cdots & w^{n-1} \\ 1 & w^2 & w^4 & \cdots & w^{2(n-1)} \\ \vdots & & & \ddots & \vdots \\ 1 & w^{n-1} & w^{2(n-1)} & \cdots & w^{(n-1)^2} \end{bmatrix}.
$$

注意 $F_n = F_n^T$，$(F_n)_{jk} = w^{jk}$，其中 $j, k = 0, 1, \ldots, n-1$，复数 $w = e^{i \cdot 2\pi/n}$（所以 $w^n = 1$）。这个矩阵的各列互相正交。

$F_n$ 的所有元素都在复平面的单位圆上，每个元素的 $n$ 次方都等于 1。我们也可以写成 $w = \cos(2\pi/n) + i\sin(2\pi/n)$，但那样只会让 $w^{jk}$ 更难算。

因为 $w^4 = 1$、$w = e^{2\pi i/4} = i$，傅里叶矩阵最好的例子是

$$
F_4 = \begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & i & i^2 & i^3 \\ 1 & i^2 & i^4 & i^6 \\ 1 & i^3 & i^6 & i^9 \end{bmatrix} = \begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & i & -1 & -i \\ 1 & -1 & 1 & -1 \\ 1 & -i & -1 & i \end{bmatrix}.
$$

要求一个有四个分量（四个数据点）的向量的傅里叶变换，就乘以 $F_4$。

只要记得计算内积时取共轭，很容易验证 $F_4$ 的各列是正交的。不过 $F_4$ 还不完全是酉矩阵，因为每一列的长度是 2。把每个元素除以 2，就得到各列标准正交的矩阵：

$$
\frac{1}{4} F_4^H F_4 = I.
$$

### 一个例子

在零时刻的一个单位脉冲所对应的信号（大致）可以用 $\begin{bmatrix} 1 \\ 0 \\ 0 \\ 0 \end{bmatrix}$ 来描述。要求这个信号的傅里叶变换，就计算

$$
\begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & i & -1 & -i \\ 1 & -1 & 1 & -1 \\ 1 & -i & -1 & i \end{bmatrix} \begin{bmatrix} 1 \\ 0 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 1 \\ 1 \\ 1 \end{bmatrix}.
$$

单个脉冲包含了等量的所有频率。

如果再乘以一次 $F_4$，几乎回到了 $(1, 0, 0, 0)$：

$$
\begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & i & -1 & -i \\ 1 & -1 & 1 & -1 \\ 1 & -i & -1 & i \end{bmatrix} \begin{bmatrix} 1 \\ 1 \\ 1 \\ 1 \end{bmatrix} = \begin{bmatrix} 4 \\ 0 \\ 0 \\ 0 \end{bmatrix} = 4\begin{bmatrix} 1 \\ 0 \\ 0 \\ 0 \end{bmatrix}.
$$

因为 $\frac{1}{\sqrt{n}}F_n$ 是酉矩阵，乘以 $F_n$（准确地说是 $F_n^H$）再除以数 $n$，就能把变换逆转回来。（这个例子里的向量都是实的，所以乘 $F_n$ 和乘 $F_n^H$ 结果相同。）

## 快速傅里叶变换

傅里叶矩阵可以拆成一块块含有大量零元素的矩阵；傅里叶本人大概没注意到这一点。高斯注意到了，但没有意识到这个发现有多么重要。

$F_n$ 与 $F_{2n}$ 之间有一个漂亮的关系，它与 $w_{2n}^2 = w_n$ 这一事实有关：

$$
F_{2n} = \begin{bmatrix} I & D \\ I & -D \end{bmatrix} \begin{bmatrix} F_n & 0 \\ 0 & F_n \end{bmatrix} P,
$$

其中 $D$ 是一个对角矩阵，$P$ 是一个 $2n \times 2n$ 的置换矩阵：

$$
P = \begin{bmatrix} 1 & 0 & 0 & 0 & \cdots & 0 & 0 \\ 0 & 0 & 1 & 0 & \cdots & 0 & 0 \\ & & & \ddots & & & \\ 0 & 0 & 0 & 0 & \cdots & 1 & 0 \\ 0 & 1 & 0 & 0 & \cdots & 0 & 0 \\ 0 & 0 & 0 & 1 & \cdots & 0 & 0 \\ & & & \ddots & & & \\ 0 & 0 & 0 & 0 & \cdots & 0 & 1 \end{bmatrix}.
$$

所以，规模为 $2n$ 的傅里叶变换 $F$ 乘以 $x$，看起来需要 $(2n)^2 = 4n^2$ 次运算，实际上可以用两个规模为 $n$ 的傅里叶变换（$2n^2$ 次运算）加上两次非常简单的矩阵乘法（大约 $n$ 次乘法）完成。矩阵 $P$ 先挑出向量的偶数分量 $x_0, x_2, x_4, \ldots$，再挑出奇数分量——这一步可以做得非常快。

于是，对一个向量做规模为 64 的傅里叶变换，可以把向量分成奇数分量和偶数分量两半，对每一半做规模为 32 的傅里叶变换，再通过乘以对角矩阵 $D$ 的过程把两半重新组合起来：

$$
D = \begin{bmatrix} 1 & & & \\ & w & & \\ & & w^2 & \\ & & & \ddots \\ & & & & w^{n-1} \end{bmatrix}.
$$

当然，每个 $F_{32}$ 又可以拆成两个 $F_{16}$，依此类推。最终，乘以 $F_n$ 不再需要 $n^2$ 次运算，而只需要大约 $\frac12 n\log_2 n$ 次运算就能得到同样的结果。

典型的情形是 $n = 1024 = 2^{10}$。直接乘以 $F_n$ 需要一百多万次计算，而快速傅里叶变换只需要 $\frac12 n\log_2 n = 5 \cdot 1024$ 次计算。快了 200 倍！

这之所以可能，只是因为傅里叶矩阵是各列互相正交的特殊矩阵。下一讲我们将回到只处理实数的情形，学习正定矩阵——它们是应用中最常见的矩阵。
