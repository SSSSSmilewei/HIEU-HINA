# 正交矩阵与 Gram-Schmidt 正交化

> 本页是 MIT 开放式课程 18.06SC 官方讲座摘要（lecture summary）的中文翻译，原文见页面下方的「讲座摘要原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

这一讲结束对正交性的介绍。使用标准正交基，或者各列标准正交的矩阵，会让计算容易得多。**Gram-Schmidt 过程**从任意一组基出发，得到一组与原来的基张成同一个空间的标准正交基。

## 标准正交向量

如果

$$
q_i^T q_j = \begin{cases} 0 & i \ne j \\ 1 & i = j \end{cases},
$$

就称向量 $q_1, q_2, \ldots, q_n$ 是**标准正交**（orthonormal）的。换句话说，它们的长度都是 1（normal），并且两两垂直（ortho）。标准正交的向量总是线性无关的。

## 标准正交矩阵

如果 $Q = \begin{bmatrix} q_1 & \cdots & q_n \end{bmatrix}$ 的各列标准正交，那么 $Q^T Q = I$ 是单位矩阵。

各列标准正交的矩阵，是我们重要矩阵清单上新加入的一类。清单上已经有：三角矩阵、对角矩阵、置换矩阵、对称矩阵、行最简阶梯形矩阵、投影矩阵。我们把这一类叫做「标准正交矩阵」。

标准正交的**方阵** $Q$ 称为**正交矩阵**（orthogonal matrix）。如果 $Q$ 是方阵，$Q^T Q = I$ 就说明 $Q^T = Q^{-1}$。

例如，如果 $Q = \begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}$，那么 $Q^T = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{bmatrix}$。$Q$ 和 $Q^T$ 都是正交矩阵，它们的乘积是单位矩阵。

矩阵 $Q = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$ 是正交矩阵。矩阵 $\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}$ 不是，但我们可以调整它，得到正交矩阵 $Q = \dfrac{1}{\sqrt{2}} \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}$。用同样的办法可以找到一些更大的正交矩阵，称为**阿达马矩阵**（Hadamard matrices）：

$$
Q = \frac{1}{2} \begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & -1 & 1 & -1 \\ 1 & 1 & -1 & -1 \\ 1 & -1 & -1 & 1 \end{bmatrix}.
$$

一个各列标准正交的长方形矩阵的例子是

$$
Q = \frac{1}{3} \begin{bmatrix} 1 & -2 \\ 2 & -1 \\ 2 & 2 \end{bmatrix}.
$$

可以把它扩充成一个（方的）正交矩阵：

$$
\frac{1}{3} \begin{bmatrix} 1 & -2 & 2 \\ 2 & -1 & -2 \\ 2 & 2 & 1 \end{bmatrix}.
$$

这些例子特别好，因为它们不含复杂的平方根。

## 标准正交的列很好用

设 $Q$ 的各列标准正交。投影到 $Q$ 的列空间上的矩阵是

$$
P = Q(Q^T Q)^{-1} Q^T.
$$

如果 $Q$ 的各列标准正交，那么 $Q^T Q = I$，$P = QQ^T$。如果 $Q$ 是方阵，那么 $P = I$，因为 $Q$ 的各列张成整个空间。

使用各列标准正交的矩阵时，很多方程都变得很平凡。如果我们的基是标准正交的，投影的分量 $\hat{x}_i$ 就是 $q_i^T b$，因为 $A^T A\hat{x} = A^T b$ 变成了 $\hat{x} = Q^T b$。

（译注：原文投影矩阵写作 $P = Q^T(Q^TQ)^{-1}Q^T$，应为 $Q(Q^TQ)^{-1}Q^T$，译文已更正。）

## Gram-Schmidt 正交化

消元法的目标是「把矩阵变成三角形」。现在我们的目标是「把矩阵变成标准正交的」。

我们从两个线性无关的向量 $a$、$b$ 出发，想找到张成同一个平面的标准正交向量 $q_1$、$q_2$。先找到与 $a$、$b$ 张成同一空间的**正交**向量 $A$、$B$，然后单位向量 $q_1 = \dfrac{A}{\|A\|}$、$q_2 = \dfrac{B}{\|B\|}$ 就构成所需的标准正交基。

令 $A = a$。把 $b$ 投影到 $a$ 上，再令 $B = b - p$，就得到 $a$、$b$ 张成的空间中一个与 $A$ 正交的向量。（$B$ 就是我们之前叫做 $e$ 的那个向量。）

$$
B = b - \frac{A^T b}{A^T A} A.
$$

在等式两边左乘 $A^T$，就能看出 $A^T B = 0$。

如果从三个线性无关的向量 $a$、$b$、$c$ 出发呢？那么就从 $c$ 中减去它在 $A$ 方向和 $B$ 方向上的分量，得到一个同时与 $A$、$B$ 正交的向量 $C$：

$$
C = c - \frac{A^T c}{A^T A} A - \frac{B^T c}{B^T B} B.
$$

例如，设 $a = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$、$b = \begin{bmatrix} 1 \\ 0 \\ 2 \end{bmatrix}$。那么 $A = a$，并且

$$
B = \begin{bmatrix} 1 \\ 0 \\ 2 \end{bmatrix} - \frac{A^T b}{A^T A} \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \\ 2 \end{bmatrix} - \frac{3}{3} \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\ -1 \\ 1 \end{bmatrix}.
$$

单位化之后得到

$$
Q = \begin{bmatrix} q_1 & q_2 \end{bmatrix} = \begin{bmatrix} 1/\sqrt{3} & 0 \\ 1/\sqrt{3} & -1/\sqrt{2} \\ 1/\sqrt{3} & 1/\sqrt{2} \end{bmatrix}.
$$

$Q$ 的列空间就是 $a$、$b$ 张成的平面。

学习消元时，我们用矩阵写出了这个过程，得到 $A = LU$。一个类似的等式 $A = QR$，把起始矩阵 $A$ 和 Gram-Schmidt 过程的结果 $Q$ 联系起来。$L$ 是下三角矩阵，而 $R$ 是上三角矩阵。

设 $A = \begin{bmatrix} a_1 & a_2 \end{bmatrix}$，那么

$$
\underbrace{\begin{bmatrix} a_1 & a_2 \end{bmatrix}}_{A} = \underbrace{\begin{bmatrix} q_1 & q_2 \end{bmatrix}}_{Q} \underbrace{\begin{bmatrix} a_1^T q_1 & a_2^T q_1 \\ a_1^T q_2 & a_2^T q_2 \end{bmatrix}}_{R}.
$$

如果 $R$ 是上三角矩阵，那么应该有 $a_1^T q_2 = 0$。这一定成立，因为我们选的 $q_1$ 是 $a_1$ 方向上的单位向量，而后面的每个 $q_i$ 都选得与前面的那些垂直。

注意 $R = Q^T A$。这是合理的，因为 $Q^T Q = I$。
