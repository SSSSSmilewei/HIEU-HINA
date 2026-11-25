# 对称矩阵与正定性

> 本页是 MIT 开放式课程 18.06SC 官方讲座摘要（lecture summary）的中文翻译，原文见页面下方的「讲座摘要原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

对称矩阵很好：它们的特征值是实数，并且各自有一整组标准正交的特征向量。正定矩阵更好。

## 对称矩阵

**对称矩阵**是满足 $A = A^T$ 的矩阵。如果一个矩阵具有某种特殊性质（例如它是马尔可夫矩阵），它的特征值和特征向量很可能也有特殊的性质。对于元素为实数的对称矩阵，特征值都是实数，并且可以选出一整组互相垂直（甚至标准正交）的特征向量。

如果 $A$ 有 $n$ 个线性无关的特征向量，可以写成 $A = S\Lambda S^{-1}$。如果 $A$ 是对称的，可以写成

$$
A = Q\Lambda Q^{-1} = Q\Lambda Q^T,
$$

其中 $Q$ 是正交矩阵。数学家把这叫做**谱定理**（spectral theorem），把特征值看作矩阵的「谱」。在力学中它叫做**主轴定理**（principal axis theorem）。

此外，任何形如 $Q\Lambda Q^T$ 的矩阵都是对称的。

## 实特征值

为什么对称矩阵的特征值是实数？设 $A$ 是对称矩阵，$Ax = \lambda x$。取共轭，得到 $\bar{A}\bar{x} = \bar{\lambda}\bar{x}$。如果 $A$ 的元素都是实数，这就变成 $A\bar{x} = \bar{\lambda}\bar{x}$。（这证明了实矩阵的复特征值成对出现，互为共轭。）

再取转置，得到 $\bar{x}^T A^T = \bar{x}^T \bar{\lambda}$。因为 $A$ 是对称的，就有 $\bar{x}^T A = \bar{x}^T \bar{\lambda}$。在这个等式两边右乘 $x$：

$$
\bar{x}^T A x = \bar{x}^T \bar{\lambda} x.
$$

另一方面，在 $Ax = \lambda x$ 两边左乘 $\bar{x}^T$，得到

$$
\bar{x}^T A x = \bar{x}^T \lambda x.
$$

比较这两个等式，可以看出 $\bar{x}^T \bar{\lambda} x = \bar{x}^T \lambda x$；只要 $\bar{x}^T x$ 不为零，就能得出 $\lambda = \bar{\lambda}$ 是实数。

怎么知道 $\bar{x}^T x \ne 0$？

$$
\bar{x}^T x = \begin{bmatrix} \bar{x}_1 & \bar{x}_2 & \cdots & \bar{x}_n \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ \vdots \\ x_n \end{bmatrix} = |x_1|^2 + |x_2|^2 + \cdots + |x_n|^2.
$$

如果 $x \ne 0$，那么 $\bar{x}^T x \ne 0$。

和复数一样，处理复向量时，乘以共轭常常很有帮助。

元素为实数的对称矩阵满足 $A = A^T$，有实特征值和互相垂直的特征向量。如果 $A$ 的元素是复数，那么它有实特征值和互相垂直的特征向量，当且仅当 $A = \bar{A}^T$。（证明的思路相同。）

## 投影到特征向量上

如果 $A = A^T$，可以写成

$$
A = Q\Lambda Q^T = \begin{bmatrix} q_1 & q_2 & \cdots & q_n \end{bmatrix} \begin{bmatrix} \lambda_1 & & & \\ & \lambda_2 & & \\ & & \ddots & \\ & & & \lambda_n \end{bmatrix} \begin{bmatrix} q_1^T \\ q_2^T \\ \vdots \\ q_n^T \end{bmatrix} = \lambda_1 q_1 q_1^T + \lambda_2 q_2 q_2^T + \cdots + \lambda_n q_n q_n^T.
$$

矩阵 $q_k q_k^T$ 是投影到 $q_k$ 上的投影矩阵，所以**每个对称矩阵都是一些互相垂直的投影矩阵的组合**。

## 关于特征值的信息

知道了特征值是实数，就可以问它们是正的还是负的。（记得在求解微分方程组时，特征值的正负号很重要。）

对于非常大的矩阵 $A$，通过解 $|A - \lambda I| = 0$ 来计算特征值是不现实的。但计算主元并不难，而**对称矩阵主元的正负号与特征值的正负号相同**：

$$
\text{正主元的个数} = \text{正特征值的个数}.
$$

因为 $A + bI$ 的特征值正好比 $A$ 的特征值大 $b$，我们可以用这个事实找出对称矩阵有哪些特征值比任意实数 $b$ 大或小。即使不能直接算出特征值，这也告诉了我们很多关于 $A$ 的特征值的信息。

## 正定矩阵

**正定矩阵**（positive definite matrix）是所有特征值都为正的对称矩阵。判断矩阵是否正定的一个好方法，是检查它的所有主元是否都为正。

设 $A = \begin{bmatrix} 5 & 2 \\ 2 & 3 \end{bmatrix}$。这个矩阵的主元是 5 和 $(\det A)/5 = 11/5$。这个矩阵是对称的，主元（因而特征值）都是正的，所以 $A$ 是正定矩阵。它的特征值是方程

$$
|A - \lambda I| = \lambda^2 - 8\lambda + 11 = 0
$$

的解，即 $4 \pm \sqrt{5}$。

正定矩阵的行列式总是正的；但 $\begin{bmatrix} -1 & 0 \\ 0 & -3 \end{bmatrix}$ 的行列式也是正的，而它不是正定矩阵。如果 $A$ 的所有**顺序主子式**（$A$ 左上角 $k \times k$ 矩阵的行列式，$1 \le k \le n$）都是正的，那么 $A$ 是正定的。

正定矩阵这个主题，把我们学过的关于方阵的主元、行列式和特征值的知识汇集在了一起。很快我们就会有机会把这门课学到的东西综合起来，用到非方阵上。
