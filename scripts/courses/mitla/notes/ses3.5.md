# 奇异值分解

> 本页是 MIT 开放式课程 18.06SC 官方讲座摘要（lecture summary）的中文翻译，原文见页面下方的「讲座摘要原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

矩阵的奇异值分解（singular value decomposition）通常简称 **SVD**。这是矩阵最后也是最好的一种分解：

$$
A = U\Sigma V^T,
$$

其中 $U$ 是正交矩阵，$\Sigma$ 是对角矩阵，$V$ 是正交矩阵。

在分解 $A = U\Sigma V^T$ 中，$A$ 可以是**任何**矩阵。我们知道，如果 $A$ 是对称正定矩阵，它的特征向量互相正交，可以写成 $A = Q\Lambda Q^T$。这是 SVD 的一个特例：$U = V = Q$。对更一般的 $A$，SVD 需要两个不同的矩阵 $U$ 和 $V$。

我们也学过怎样写出 $A = S\Lambda S^{-1}$，其中 $S$ 是由 $A$ 的 $n$ 个线性无关的特征向量组成的矩阵。但 $S$ 不一定是正交矩阵；而 SVD 中的矩阵 $U$ 和 $V$ 一定是。

## 原理

可以把 $A$ 看作一个线性变换：它把行空间中的向量 $v_1$ 变成列空间中的向量 $u_1 = Av_1$。SVD 来自这样一个问题：为行空间找一组正交基，使它被变换成列空间的一组正交基：$Av_i = \sigma_i u_i$。

为行空间找一组正交基并不难——Gram-Schmidt 过程马上就能给出一组。但一般来说，没有理由期望 $A$ 会把那组基变成另一组正交基。

你可能会想，$A$ 和 $A^T$ 的零空间中的向量怎么办？它们不是问题——$\Sigma$ 对角线上的零会处理它们。

## 矩阵语言

问题的核心，是为 $A$ 的行空间找一组标准正交基 $v_1, v_2, \ldots, v_r$，使得

$$
A\begin{bmatrix} v_1 & v_2 & \cdots & v_r \end{bmatrix} = \begin{bmatrix} \sigma_1 u_1 & \sigma_2 u_2 & \cdots & \sigma_r u_r \end{bmatrix} = \begin{bmatrix} u_1 & u_2 & \cdots & u_r \end{bmatrix} \begin{bmatrix} \sigma_1 & & & \\ & \sigma_2 & & \\ & & \ddots & \\ & & & \sigma_r \end{bmatrix},
$$

其中 $u_1, u_2, \ldots, u_r$ 是 $A$ 的列空间的一组标准正交基。把零空间也加进来，这个等式就变成 $AV = U\Sigma$。（我们可以随意把标准正交组 $v_1, \ldots, v_r$ 和 $u_1, \ldots, u_r$ 补全成整个空间的标准正交基。由于 $v_{r+1}, \ldots, v_n$ 在 $A$ 的零空间中，对角元 $\sigma_{r+1}, \ldots, \sigma_n$ 都是 0。）

$V$ 的各列和 $U$ 的各列分别是行空间和列空间的基。通常 $U \ne V$；但如果 $A$ 是正定的，行空间和列空间可以用同一组基！

（译注：原文这一句把「行空间」和「列空间」对应的矩阵写反了，译文已更正。）

## 计算

设 $A$ 是可逆矩阵 $\begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix}$。我们想在行空间 $\mathbb{R}^2$ 中找向量 $v_1$、$v_2$，在列空间 $\mathbb{R}^2$ 中找 $u_1$、$u_2$，以及正数 $\sigma_1$、$\sigma_2$，使得各 $v_i$ 标准正交，各 $u_i$ 标准正交，并且 $\sigma_i$ 是满足 $Av_i = \sigma_i u_i$ 的伸缩因子。

这是朝着找到满足下面等式的标准正交矩阵 $V$、$U$ 和对角矩阵 $\Sigma$ 迈出的一大步：

$$
AV = U\Sigma.
$$

由于 $V$ 是正交矩阵，两边右乘 $V^{-1} = V^T$，得到

$$
A = U\Sigma V^T.
$$

我们不同时求 $U$、$V$ 和 $\Sigma$，而是在两边左乘 $A^T = V\Sigma^T U^T$：

$$
A^T A = V\Sigma^T U^T U\Sigma V^T = V\Sigma^2 V^T = V \begin{bmatrix} \sigma_1^2 & & & \\ & \sigma_2^2 & & \\ & & \ddots & \\ & & & \sigma_n^2 \end{bmatrix} V^T.
$$

这正是 $Q\Lambda Q^T$ 的形式；于是可以通过对角化对称正定（或半正定）矩阵 $A^T A$ 来求 $V$。**$V$ 的各列是 $A^T A$ 的特征向量，$A^T A$ 的特征值是 $\sigma_i^2$。**（我们取 $\sigma_i$ 为 $\lambda_i$ 的正平方根。）

要求 $U$，对 $AA^T$ 做同样的事。

## SVD 的例子

回到矩阵 $A = \begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix}$。先计算

$$
A^T A = \begin{bmatrix} 4 & -3 \\ 4 & 3 \end{bmatrix} \begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix} = \begin{bmatrix} 25 & 7 \\ 7 & 25 \end{bmatrix}.
$$

这个矩阵的特征向量给出向量 $v_i$，特征值给出数 $\sigma_i$。

$A^T A$ 的两个正交的特征向量是 $\begin{bmatrix} 1 \\ 1 \end{bmatrix}$ 和 $\begin{bmatrix} 1 \\ -1 \end{bmatrix}$。为了得到标准正交基，令 $v_1 = \begin{bmatrix} 1/\sqrt2 \\ 1/\sqrt2 \end{bmatrix}$、$v_2 = \begin{bmatrix} 1/\sqrt2 \\ -1/\sqrt2 \end{bmatrix}$。它们的特征值是 $\sigma_1^2 = 32$、$\sigma_2^2 = 18$。现在我们有

$$
\underbrace{\begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix}}_{A} = \underbrace{\begin{bmatrix} \ & \ \\ \ & \ \end{bmatrix}}_{U} \underbrace{\begin{bmatrix} 4\sqrt2 & 0 \\ 0 & 3\sqrt2 \end{bmatrix}}_{\Sigma} \underbrace{\begin{bmatrix} 1/\sqrt2 & 1/\sqrt2 \\ 1/\sqrt2 & -1/\sqrt2 \end{bmatrix}}_{V^T}.
$$

我们可以从这个等式解出 $U$，但为了练习，我们通过求 $AA^T = U\Sigma^2 U^T$ 的标准正交特征向量 $u_1$、$u_2$ 来求 $U$：

$$
AA^T = \begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix} \begin{bmatrix} 4 & -3 \\ 4 & 3 \end{bmatrix} = \begin{bmatrix} 32 & 0 \\ 0 & 18 \end{bmatrix}.
$$

幸运的是 $AA^T$ 恰好是对角矩阵。很容易想取 $u_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$、$u_2 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$——Strang 教授在课上就是这么做的；但因为 $Av_2 = \begin{bmatrix} 0 \\ -3\sqrt2 \end{bmatrix}$，我们应该取 $u_2 = \begin{bmatrix} 0 \\ -1 \end{bmatrix}$，$U = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}$。注意这也给了我们再次检验 $\sigma_1$、$\sigma_2$ 的机会。

所以 $A$ 的 SVD 是

$$
\underbrace{\begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix}}_{A} = \underbrace{\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}}_{U} \underbrace{\begin{bmatrix} 4\sqrt2 & 0 \\ 0 & 3\sqrt2 \end{bmatrix}}_{\Sigma} \underbrace{\begin{bmatrix} 1/\sqrt2 & 1/\sqrt2 \\ 1/\sqrt2 & -1/\sqrt2 \end{bmatrix}}_{V^T}.
$$

## 有零空间的例子

现在令 $A = \begin{bmatrix} 4 & 3 \\ 8 & 6 \end{bmatrix}$。它有一维的零空间，行空间和列空间也都是一维的。

$A$ 的行空间由 $\begin{bmatrix} 4 \\ 3 \end{bmatrix}$ 的倍数组成，列空间由 $\begin{bmatrix} 1 \\ 2 \end{bmatrix}$ 的倍数组成。零空间和左零空间分别垂直于行空间和列空间。

行空间和列空间的单位基向量是 $v_1 = \begin{bmatrix} .8 \\ .6 \end{bmatrix}$ 和 $u_1 = \begin{bmatrix} 1/\sqrt5 \\ 2/\sqrt5 \end{bmatrix}$。要计算 $\sigma_1$，就求 $A^T A$ 的非零特征值：

$$
A^T A = \begin{bmatrix} 4 & 8 \\ 3 & 6 \end{bmatrix} \begin{bmatrix} 4 & 3 \\ 8 & 6 \end{bmatrix} = \begin{bmatrix} 80 & 60 \\ 60 & 45 \end{bmatrix}.
$$

因为这是一个秩为 1 的矩阵，它的一个特征值一定是 0，另一个一定等于迹，所以 $\sigma_1^2 = 125$。再找出分别垂直于 $u_1$ 和 $v_1$ 的单位向量（它们是左零空间和零空间的基向量），就得到 $A$ 的 SVD：

$$
\underbrace{\begin{bmatrix} 4 & 3 \\ 8 & 6 \end{bmatrix}}_{A} = \underbrace{\frac{1}{\sqrt5}\begin{bmatrix} 1 & 2 \\ 2 & -1 \end{bmatrix}}_{U} \underbrace{\begin{bmatrix} \sqrt{125} & 0 \\ 0 & 0 \end{bmatrix}}_{\Sigma} \underbrace{\begin{bmatrix} .8 & .6 \\ .6 & -.8 \end{bmatrix}}_{V^T}.
$$

奇异值分解把线性代数中从正定矩阵到四个基本子空间的各个主题结合在了一起：

| 向量 | 是哪个空间的标准正交基 |
|---|---|
| $v_1, v_2, \ldots, v_r$ | 行空间 |
| $u_1, u_2, \ldots, u_r$ | 列空间 |
| $v_{r+1}, \ldots, v_n$ | 零空间 |
| $u_{r+1}, \ldots, u_m$ | 左零空间 |

这些就是「对」的基，因为 $Av_i = \sigma_i u_i$。
