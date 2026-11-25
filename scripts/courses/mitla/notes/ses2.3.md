# 投影矩阵与最小二乘

> 本页是 MIT 开放式课程 18.06SC 官方讲座摘要（lecture summary）的中文翻译，原文见页面下方的「讲座摘要原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。图片请对照原文 PDF。

## 投影

上一讲我们学到，$P = A(A^T A)^{-1} A^T$ 是把向量 $b$ 投影到 $A$ 的各列张成的空间上的矩阵。如果 $b$ 垂直于列空间，它就在 $A$ 的左零空间 $N(A^T)$ 中，$Pb = 0$。如果 $b$ 在列空间中，那么对某个 $x$ 有 $b = Ax$，$Pb = b$。

一个一般的向量，有一个在列空间中的分量 $p$，以及一个垂直于列空间（在左零空间中）的分量 $e$；它的投影就是它在列空间中的那个分量。

把 $b$ 投影到 $N(A^T)$ 上的矩阵是 $I - P$：

$$
e = b - p, \qquad e = (I - P)b.
$$

自然，$I - P$ 具有投影矩阵的所有性质。

## 最小二乘

> 图 1：三个点和一条靠近它们的直线。

我们想找到离点 $(1, 1)$、$(2, 2)$、$(3, 2)$ 最近的直线 $b = C + Dt$。我们要用的方法叫做**线性回归**（linear regression）；当数据中没有离群点时，这种方法最有用。

所谓「最近」的直线，是指使各点到直线的距离所代表的误差最小的直线。我们把这些距离的平方加起来作为误差的度量。换句话说，我们要使 $\|Ax - b\|^2 = \|e\|^2$ 最小。

如果直线经过全部三个点，就会有

$$
\begin{aligned} C + D &= 1 \\ C + 2D &= 2 \\ C + 3D &= 2, \end{aligned}
$$

但这个方程组无解。它等价于 $Ax = b$，其中

$$
A = \begin{bmatrix} 1 & 1 \\ 1 & 2 \\ 1 & 3 \end{bmatrix}, \quad x = \begin{bmatrix} C \\ D \end{bmatrix}, \quad b = \begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix}.
$$

有两种看待这个问题的方式。在我们要找的直线所在的平面里，$e_1$、$e_2$、$e_3$ 是各个数据点到直线的竖直距离，$p_1$、$p_2$、$p_3$ 是直线在各个数据点处的值 $C + Dt$，$p \approx b$。

另一种看法是：$\mathbb{R}^3$ 中有一个向量 $b$，它在 $A$ 的列空间上的投影是 $p$，在 $N(A^T)$ 上的投影是 $e$。

现在来求 $\hat{x} = \begin{bmatrix} \hat{C} \\ \hat{D} \end{bmatrix}$ 和 $p$。我们知道

$$
A^T A \hat{x} = A^T b: \qquad \begin{bmatrix} 3 & 6 \\ 6 & 14 \end{bmatrix} \begin{bmatrix} \hat{C} \\ \hat{D} \end{bmatrix} = \begin{bmatrix} 5 \\ 11 \end{bmatrix}.
$$

由此得到**正规方程**（normal equations）：

$$
\begin{aligned} 3\hat{C} + 6\hat{D} &= 5 \\ 6\hat{C} + 14\hat{D} &= 11. \end{aligned}
$$

解得 $\hat{D} = 1/2$、$\hat{C} = 2/3$。

也可以用微积分求下面这个二元函数的最小值：

$$
e_1^2 + e_2^2 + e_3^2 = (C + D - 1)^2 + (C + 2D - 2)^2 + (C + 3D - 2)^2.
$$

无论哪种方法，最后都是解一个线性方程组，得到离这些点最近的直线是 $b = \dfrac{2}{3} + \dfrac{1}{2}t$。

由此得到：

| $i$ | $p_i$ | $e_i$ |
|---|---|---|
| 1 | $7/6$ | $-1/6$ |
| 2 | $5/3$ | $1/3$ |
| 3 | $13/6$ | $-1/6$ |

也就是 $p = \begin{bmatrix} 7/6 \\ 5/3 \\ 13/6 \end{bmatrix}$，$e = \begin{bmatrix} -1/6 \\ 2/6 \\ -1/6 \end{bmatrix}$。注意 $p$ 与 $e$ 正交，而且 $e$ 垂直于 $A$ 的各列。

## 矩阵 AᵀA

我们一直假定矩阵 $A^T A$ 可逆。这样做有道理吗？

**如果 $A$ 的各列线性无关，那么 $A^T A$ 可逆。**

为了证明这一点，我们假设 $A^T A x = 0$，然后证明一定有 $x = 0$：

$$
\begin{aligned} A^T A x &= 0 \\ x^T A^T A x &= x^T 0 \\ (Ax)^T (Ax) &= 0 \\ Ax &= 0. \end{aligned}
$$

由于 $A$ 的各列线性无关，只有 $x = 0$ 时才有 $Ax = 0$。

只要 $A$ 的各列线性无关，我们就能用线性回归求出无解的线性方程组的近似解。如果 $A$ 的各列是**标准正交**的——也就是互相垂直的单位向量，比如 $\begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$、$\begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$、$\begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$，或者 $\begin{bmatrix} \cos\theta \\ \sin\theta \end{bmatrix}$ 和 $\begin{bmatrix} -\sin\theta \\ \cos\theta \end{bmatrix}$——那么它们一定线性无关。
