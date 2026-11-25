# 期末复习

> 本页是 MIT 开放式课程 18.06SC 官方讲座摘要（lecture summary）的中文翻译，原文见页面下方的「讲座摘要原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

最后一次，我们复习一份往年试卷上的题目，为即将到来的考试做准备。

## 1. 由解的情况推断矩阵

已知 $A$ 是秩为 $r$ 的 $m \times n$ 矩阵，$Ax = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$ 无解，而 $Ax = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$ 恰好有一个解。

**a) 关于 $m$、$n$、$r$ 能说些什么？**

乘积 $Ax$ 是三维向量，所以 $m = 3$。

$Ax = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$ 无解，说明列空间不是整个 $\mathbb{R}^3$。另外，我们知道列空间包含 $\begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$，所以 $r$ 不为零：$1 \le r < 3$。

$Ax = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$ 恰好有一个解，说明 $A$ 的零空间只含零向量，所以 $n = r$。因此 $1 \le n < 3$。

**b) 写出一个符合这些描述的矩阵 $A$。**

向量 $\begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$ 必须在列空间里，所以把它作为 $A$ 的一列。回答这个问题最简单的办法就是到此为止：

$$
A = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}.
$$

这个答案中 $n = r = 1$，$m = 3$。

要找一个 $n = r = 2$ 的答案，就再加一列，注意不要让 $\begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$ 落进列空间：

$$
A = \begin{bmatrix} 0 & 0 \\ 1 & 0 \\ 0 & 1 \end{bmatrix}.
$$

这道题还有很多别的正确答案。

**c) 划掉所有对具有上述性质（$1 \le r = n$，$m = 3$）的某个矩阵不成立的说法。**

1. $\det A^TA = \det AA^T$
2. $A^TA$ 可逆
3. $AA^T$ 正定

一个好办法是用我们的示例矩阵检验每一个说法。

1. 把这一条留到最后，就能用回答后两条时学到的东西很快作答（错）。
2. 当 $r = n$，即 $A$ 的各列线性无关时，$A^TA$ 可逆。我们的 $A$ 的零空间只含零向量，所以这个说法成立。对我们的每个示例矩阵，$A^TA$ 都等于单位矩阵，因此可逆。注意这意味着 $\det A^TA \ne 0$。
3. 已知 $m = 3$、$r < 3$，所以 $AA^T$ 是秩小于 3 的 3 × 3 矩阵，不可能正定。（不过对任何实矩阵 $A$，$AA^T$ 都是半正定的。）对我们的示例矩阵，$AA^T$ 至少有一行全为零，所以 0 是它的特征值（而 0 不是正数）。还要注意 $\det AA^T = 0$，所以说法 1 一定是错的。（但如果 $A$ 和 $B$ 都是方阵，那么 $\det BA = \det AB = \det A\det B$。）

**d) 证明对每个右端 $c$，$A^Ty = c$ 至少有一个解，而且事实上有无穷多个解。**

$A^T$ 是 $n \times m$ 矩阵，$m = 3$，秩 $r = n < m$。

如果 $A^T$ 行满秩，方程 $A^Ty = c$ 总有解。$A^T$ 有 $n$ 行、秩为 $r = n$，所以 $A^T$ 行满秩。因此对每个向量 $c$，$A^Ty = c$ 都有解。

如果 $A^T$ 的零空间维数为正，有解的方程组 $A^Ty = c$ 就有无穷多个解。已知 $\dim N(A^T) = m - r > 0$，所以对每个 $c$，$A^Ty = c$ 都有无穷多个解。

## 2. 列向量

设 $A$ 的各列为 $v_1$、$v_2$、$v_3$。

**a) 解 $Ax = v_1 - v_2 + v_3$。**

这就是第一讲里讲的矩阵乘法的「列方法」。取 $x = \begin{bmatrix} 1 \\ -1 \\ 1 \end{bmatrix}$。

**b) 判断：如果 $v_1 - v_2 + v_3 = 0$，那么 (a) 的解不唯一。说明理由。**

对。$x = \begin{bmatrix} 1 \\ -1 \\ 1 \end{bmatrix}$ 的任何倍数都是解。

另一种回答是注意到 $A$ 有非平凡的零空间，而把零空间中的任何向量加到一个解 $x$ 上，都能得到另一个解。

（译注：原文这里写的是「$A^T$ 有非平凡的零空间」，按上下文应为 $A$，译文已更正。）

**c) 设 $v_1$、$v_2$、$v_3$ 标准正交（忽略 (2b)）。$v_1$ 和 $v_2$ 的什么组合最接近 $v_3$？**

想象由 $av_1 + bv_2$ 和 $v_3$ 从原点出发构成的直角三角形，勾股定理告诉我们：在 $v_1$、$v_2$ 张成的平面中，离 $v_3$ 最近的点是 $0v_1 + 0v_2 = 0$。

## 3. 马尔可夫矩阵

设有马尔可夫矩阵

$$
A = \begin{bmatrix} .2 & .4 & .3 \\ .4 & .2 & .3 \\ .4 & .4 & .4 \end{bmatrix}.
$$

注意 $A$ 前两列之和等于第三列的两倍。

**a) $A$ 的特征值是什么？**

因为 $A$ 的各列线性相关（$A$ 是奇异的），0 是特征值。

因为 $A$ 是马尔可夫矩阵，1 是特征值。

因为 $A$ 的迹是 .8，第三个特征值是 $-.2$。所以 $\lambda = 0, 1, -.2$。

**b) 令 $u_k = A^ku(0)$。如果 $u(0) = \begin{bmatrix} 0 \\ 10 \\ 0 \end{bmatrix}$，$\lim_{k\to\infty} u_k$ 是多少？**

我们先算出 $u_k$，再求稳态。也就是要找到形如

$$
u_k = c_1\lambda_1^kx_1 + c_2\lambda_2^kx_2 + c_3\lambda_3^kx_3
$$

的通式。代入 (3a) 求出的特征值，它变成

$$
u_k = 0 + c_2x_2 + c_3(-.2)^kx_3.
$$

可以看到，当 $k$ 趋于无穷时，只有 $c_2x_2$ 这一项不趋于零。任何马尔可夫过程中的关键特征向量，都是特征值为 1 的那个。

要求 $x_2$，解 $(A - 1I)x_2 = 0$：

$$
\begin{bmatrix} -.8 & .4 & .3 \\ .4 & -.8 & .3 \\ .4 & .4 & -.6 \end{bmatrix} x_2 = 0.
$$

最好的解法也许是消元。不过，因为前两列看起来像 4 的倍数，第三列看起来像 3 的倍数，我们可能运气好，猜出 $x_2 = \begin{bmatrix} 3 \\ 3 \\ 4 \end{bmatrix}$。于是 $u_\infty = c_2\begin{bmatrix} 3 \\ 3 \\ 4 \end{bmatrix}$。在马尔可夫过程中，$u_k$ 各元素之和对所有 $k$ 都相同。$u(0)$ 的元素之和是 10，所以 $c_2 = 1$，$u_\infty = \begin{bmatrix} 3 \\ 3 \\ 4 \end{bmatrix}$。

## 4. 构造 2 × 2 矩阵

找一个 2 × 2 矩阵，使它：

**a) 投影到 $a = \begin{bmatrix} 4 \\ -3 \end{bmatrix}$ 张成的直线上。**

公式是 $P = \dfrac{aa^T}{a^Ta}$。由此得到

$$
P = \begin{bmatrix} 16/25 & -12/25 \\ -12/25 & 9/25 \end{bmatrix}.
$$

（可以很快验证 $\det P = 0$ 来检查答案。）

**b) 特征值为 $\lambda_1 = 0$、$\lambda_2 = 3$，特征向量为 $x_1 = \begin{bmatrix} 1 \\ 2 \end{bmatrix}$、$x_2 = \begin{bmatrix} 2 \\ 1 \end{bmatrix}$。**

这里要用的公式是 $A = S\Lambda S^{-1}$：

$$
A = \begin{bmatrix} 1 & 2 \\ 2 & 1 \end{bmatrix} \begin{bmatrix} 0 & 0 \\ 0 & 3 \end{bmatrix} \begin{bmatrix} 1 & 2 \\ 2 & 1 \end{bmatrix}^{-1} = \begin{bmatrix} 1 & 2 \\ 2 & 1 \end{bmatrix} \begin{bmatrix} 0 & 0 \\ 0 & 3 \end{bmatrix} \begin{bmatrix} -1/3 & 2/3 \\ 2/3 & -1/3 \end{bmatrix} = \begin{bmatrix} 4 & -2 \\ 2 & -1 \end{bmatrix}.
$$

时间允许的话，可以计算各个 $Ax_i$ 来检验。

**c) 元素都是实数，并且不能对任何 $B$ 分解成 $B^TB$。**

$B^TB$ 总是对称的，所以任何不对称的矩阵都具有这个性质。例如可以选 $\begin{bmatrix} 0 & 0 \\ 1 & 0 \end{bmatrix}$。

**d) 不对称，但有互相正交的特征向量。**

我们知道对称矩阵有互相正交的特征向量；但允许复特征向量时，其他类型的矩阵（如反对称矩阵和正交矩阵）也有。两个可能的答案是

$$
\begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}\ (\text{反对称}), \qquad \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}\ (\text{正交}).
$$

## 5. 最小二乘

对方程组

$$
\begin{bmatrix} 1 & 0 \\ 1 & 1 \\ 1 & 2 \end{bmatrix} \begin{bmatrix} c \\ d \end{bmatrix} = \begin{bmatrix} 3 \\ 4 \\ 1 \end{bmatrix} = b
$$

用最小二乘法，得到最佳拟合向量 $\begin{bmatrix} \hat c \\ \hat d \end{bmatrix} = \begin{bmatrix} 11/3 \\ -1 \end{bmatrix}$。

**a) $b = \begin{bmatrix} 3 \\ 4 \\ 1 \end{bmatrix}$ 在 $A = \begin{bmatrix} 1 & 0 \\ 1 & 1 \\ 1 & 2 \end{bmatrix}$ 的列空间上的投影 $p$ 是什么？**

我们知道，第一列的 11/3 倍减去第二列的 1 倍，就是列空间中离 $\begin{bmatrix} 3 \\ 4 \\ 1 \end{bmatrix}$ 最近的点，所以答案是

$$
A\begin{bmatrix} \hat c \\ \hat d \end{bmatrix} = \frac{11}{3}\begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix} - \begin{bmatrix} 0 \\ 1 \\ 2 \end{bmatrix} = \begin{bmatrix} 11/3 \\ 8/3 \\ 5/3 \end{bmatrix}.
$$

**b) 画出这个方程组对应的直线拟合问题。**

以 $A$ 的第二列的元素为横坐标、$b$ 的元素为纵坐标，得到三个点 $(0, 3)$、$(1, 4)$、$(2, 1)$（原文图 1）。最佳拟合直线是 $\hat c + \hat dt = \dfrac{11}{3} - t$。

**c) 另找一个向量 $b \ne 0 \in \mathbb{R}^3$，使最小二乘解为 $\begin{bmatrix} \hat c \\ \hat d \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$。**

$A\begin{bmatrix} \hat c \\ \hat d \end{bmatrix}$ 是 $b$ 在列空间上的投影，所以要让投影为零，就要找一个与各列都正交的向量。观察就能得到答案 $b = \begin{bmatrix} 1 \\ -2 \\ 1 \end{bmatrix}$，也可以用两列的叉积求出 $b$。

感谢你学完这门课！
