# 特征值与特征向量

> 本页是 MIT 开放式课程 18.06SC 官方讲座摘要（lecture summary）的中文翻译，原文见页面下方的「讲座摘要原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

特征值和特征向量将占据这门课剩下的大部分内容。我们仍然研究方阵。特征值是与矩阵相关的特殊的数，特征向量是特殊的向量。

## 特征向量与特征值

矩阵 $A$ 像函数一样作用于向量 $x$：输入 $x$，输出 $Ax$。**特征向量**是那些使 $Ax$ 与 $x$ 平行的向量。换句话说：

$$
Ax = \lambda x.
$$

在这个方程中，$x$ 是 $A$ 的**特征向量**（eigenvector），$\lambda$ 是 $A$ 的**特征值**（eigenvalue）。

### 特征值 0

如果特征值 $\lambda$ 等于 0，那么 $Ax = 0x = 0$。特征值为 0 的向量构成 $A$ 的零空间；如果 $A$ 是奇异的，那么 $\lambda = 0$ 是 $A$ 的一个特征值。

### 例子

设 $P$ 是投影到一个平面上的矩阵。对平面上的任何 $x$，$Px = x$，所以 $x$ 是特征值为 1 的特征向量。垂直于平面的向量 $x$ 满足 $Px = 0$，所以它是特征值 $\lambda = 0$ 的特征向量。$P$ 的特征向量张成整个空间（但并不是每个矩阵都这样）。

矩阵 $B = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$ 有特征值为 1 的特征向量 $x = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$，以及特征值为 $-1$ 的另一个特征向量 $x = \begin{bmatrix} 1 \\ -1 \end{bmatrix}$。这两个特征向量张成整个空间。它们互相垂直，这是因为 $B = B^T$（我们以后会证明）。

## det(A − λI) = 0

一个 $n \times n$ 矩阵有 $n$ 个特征值，它们的和等于矩阵对角元之和 $a_{11} + a_{22} + \cdots + a_{nn}$。这个和叫做矩阵的**迹**（trace）。对 2 × 2 矩阵，如果知道一个特征值，就可以用这个事实求出另一个。

能不能从 $Ax = \lambda x$ 解出 $A$ 的特征值和特征向量？$\lambda$ 和 $x$ 都是未知的，解这个问题需要一点巧思：

$$
\begin{aligned} Ax &= \lambda x \\ (A - \lambda I)x &= 0. \end{aligned}
$$

要使 $\lambda$ 是特征值，$A - \lambda I$ 必须是奇异的。换句话说，$\det(A - \lambda I) = 0$。解这个**特征方程**（characteristic equation），得到 $\lambda$ 的 $n$ 个解。运气好的话，这些解互不相同；否则就会有一个或多个**重特征值**。

求出一个特征值 $\lambda$ 之后，就可以用消元求 $A - \lambda I$ 的零空间。这个零空间中的向量，就是 $A$ 对应于特征值 $\lambda$ 的特征向量。

（译注：原文这里写作「要使 $\lambda$ 是特征向量」，应为「特征值」，译文已更正。）

## 计算特征值和特征向量

设 $A = \begin{bmatrix} 3 & 1 \\ 1 & 3 \end{bmatrix}$，那么

$$
\det(A - \lambda I) = \begin{vmatrix} 3 - \lambda & 1 \\ 1 & 3 - \lambda \end{vmatrix} = (3 - \lambda)^2 - 1 = \lambda^2 - 6\lambda + 8.
$$

注意系数 6 是 $A$ 的迹（对角元之和），8 是 $A$ 的行列式。一般地，2 × 2 矩阵的特征值是方程

$$
\lambda^2 - \operatorname{trace}(A)\cdot\lambda + \det A = 0
$$

的解。

正如迹是矩阵特征值之和，**任何矩阵的特征值之积都等于它的行列式。**

对 $A = \begin{bmatrix} 3 & 1 \\ 1 & 3 \end{bmatrix}$，特征值是 $\lambda_1 = 4$、$\lambda_2 = 2$。在 $A - \lambda_1 I = \begin{bmatrix} -1 & 1 \\ 1 & -1 \end{bmatrix}$ 的零空间中，找到对应于 $\lambda_1 = 4$ 的特征向量 $x_1 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$。

$x_2$ 在 $A - 2I = \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}$ 的零空间中。这个零空间是一整条直线，$x_2$ 可以是这条直线上的任何向量。自然的选择是 $x_2 = \begin{bmatrix} -1 \\ 1 \end{bmatrix}$。

注意这些特征向量与 $B = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$ 的特征向量相同。给矩阵 $B$ 加上 $3I$，它的每个特征值都加了 3，而特征向量不变，因为 $Ax = (B + 3I)x = \lambda x + 3x = (\lambda + 3)x$。

## 一个提醒

类似地，如果 $Ax = \lambda x$、$Bx = \alpha x$，那么 $(A + B)x = (\lambda + \alpha)x$。如果矩阵之和的特征值总是特征值之和就好了，但这只在 $A$ 和 $B$ 有相同的特征向量时才成立。乘积 $AB$ 的特征值通常也不等于特征值的乘积 $\lambda(A)\lambda(B)$。

## 复特征值

矩阵 $Q = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$ 把平面上的每个向量旋转 90°。它的迹是 $0 = \lambda_1 + \lambda_2$，行列式是 $1 = \lambda_1 \cdot \lambda_2$。它唯一的实特征向量是零向量；其他任何向量乘以 $Q$ 之后方向都会改变。这会怎样影响我们对特征值的计算？

$$
\det(Q - \lambda I) = \begin{vmatrix} -\lambda & -1 \\ 1 & -\lambda \end{vmatrix} = \lambda^2 + 1.
$$

$\det(Q - \lambda I) = 0$ 的解是 $\lambda_1 = i$、$\lambda_2 = -i$。如果一个（实）矩阵有复特征值 $a + bi$，那么它的共轭复数 $a - bi$ 也是这个矩阵的特征值。

**对称矩阵的特征值都是实数。** 像 $Q$ 这样满足 $A^T = -A$ 的**反对称矩阵**，所有特征值都是纯虚数（$\lambda = bi$）。

## 三角矩阵与重特征值

对于三角矩阵，例如 $A = \begin{bmatrix} 3 & 1 \\ 0 & 3 \end{bmatrix}$，特征值正好是对角线上的元素。在这个例子里，特征值是 3 和 3：

$$
\det(A - \lambda I) = \begin{vmatrix} 3 - \lambda & 1 \\ 0 & 3 - \lambda \end{vmatrix} = (3 - \lambda)(3 - \lambda) = 0,
$$

所以 $\lambda_1 = 3$、$\lambda_2 = 3$。要求特征向量，就解

$$
(A - \lambda I)x = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} x = 0,
$$

得到 $x_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$。**没有**与它线性无关的第二个特征向量 $x_2$。
