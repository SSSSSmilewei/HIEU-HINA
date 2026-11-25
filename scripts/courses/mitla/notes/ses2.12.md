# 考试 2 复习

> 本页是 MIT 开放式课程 18.06SC 官方讲座摘要（lecture summary）的中文翻译，原文见页面下方的「讲座摘要原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

## 考试范围

- **正交矩阵** $Q = \begin{bmatrix} q_1 & \cdots & q_n \end{bmatrix}$，$Q^T Q = I$。
  - 投影——$Ax = b$ 的最小二乘「最佳拟合」解。
  - 从任意一组基得到标准正交基的 Gram-Schmidt 过程。
- **行列式** $\det A$
  - 定义行列式的性质 1–3。
  - 有 $n!$ 项、每项带正号或负号的大公式。
  - 代数余子式公式，由它得到 $A^{-1}$ 的公式。
- **特征值** $Ax = \lambda x$
  - $\det(A - \lambda I) = 0$。
  - 对角化：如果 $A$ 有 $n$ 个线性无关的特征向量，那么 $S^{-1}AS = \Lambda$（这就是把 $n$ 个特征向量的 $Ax = \lambda x$ 同时写出来）。
  - $A$ 的幂：$A^k = (S\Lambda S^{-1})^k = S\Lambda^k S^{-1}$。

## 例题

### 1. 投影到一条直线上

设 $a = \begin{bmatrix} 2 \\ 1 \\ 2 \end{bmatrix}$。

a) 求投影到 $a$ 上的投影矩阵 $P$。

只要套用 $P$ 的公式。一般情况下 $P = A(A^T A)^{-1}A^T$，但这里 $A$ 是一个列向量，所以

$$
P = \frac{aa^T}{a^T a} = \frac{1}{9} \begin{bmatrix} 4 & 2 & 4 \\ 2 & 1 & 2 \\ 4 & 2 & 4 \end{bmatrix}.
$$

b) $P$ 的秩是多少？

$P$ 的秩是 1，因为它的每一列都是第二列的某个倍数；或者说，因为它投影到一个一维子空间上。

c) $P$ 的列空间是什么？

由 $a$ 确定的直线。

d) $P$ 的特征值是什么？

由于 $P$ 的秩是 1，它有二重特征值 0。利用它的迹，或者利用它是投影矩阵，可以知道 $P$ 还有特征值 1。$P$ 的特征值是 0、0、1。

e) 求 $P$ 的一个特征值为 1 的特征向量。

特征向量 $a = \begin{bmatrix} 2 \\ 1 \\ 2 \end{bmatrix}$ 的特征值是 1。因为 $P$ 是投影矩阵，它所投影到的空间中的任何向量，都是特征值为 1 的特征向量。

f) 设 $u_{k+1} = Pu_k$，初始条件 $u_0 = \begin{bmatrix} 9 \\ 9 \\ 0 \end{bmatrix}$。求 $u_k$。

我们是在反复把一个向量投影到同一条直线上：

$$
u_1 = Pu_0 = a\frac{a^T u_0}{a^T a} = \frac{27}{9}a = 3a = \begin{bmatrix} 6 \\ 3 \\ 6 \end{bmatrix}.
$$

$u_2$ 是 $u_1$ 在 $a$ 确定的直线上的投影，而 $u_1$ 已经在这条直线上了。事实上 $u_k = P^k u_0 = Pu_0 = \begin{bmatrix} 6 \\ 3 \\ 6 \end{bmatrix}$。

g) 考试中可能出现差分方程 $u_{k+1} = Au_k$，其中 $A$ 不是满足 $P^k = P$ 的投影矩阵。这时就要求出它的特征值和特征向量，把 $u_0$ 写成 $c_1x_1 + c_2x_2 + c_3x_3$，于是 $u_k = c_1\lambda_1^k x_1 + c_2\lambda_2^k x_2 + c_3\lambda_3^k x_3$。（对上面的投影矩阵 $P$，两个特征值是 0、第三个是 1，所以有两项消失，第三项的 $\lambda^k = 1$。于是 $u_1 = u_2 = u_3 = \cdots$。）

### 2. 最小二乘

给定数据点：

| $t$ | $y$ |
|---|---|
| 1 | 4 |
| 2 | 5 |
| 3 | 8 |

a) 求经过原点、最好地拟合这些点的直线。

这条直线的方程是 $y = Dt$，只有一个未知数 $D$。我们希望下面三个方程有解：

$$
1 \cdot D = 4, \qquad 2 \cdot D = 5, \qquad 3 \cdot D = 8,
$$

写成 $Ax = b$ 的形式就是 $\begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} D = \begin{bmatrix} 4 \\ 5 \\ 8 \end{bmatrix}$。要求 $D$ 的最佳值，就解方程

$$
A^T A\hat{D} = A^T b: \qquad 14\hat{D} = 38, \qquad \hat{D} = \frac{38}{14} = \frac{19}{7}.
$$

结论：经过原点的最佳拟合直线是 $y = \dfrac{19}{7}t$。可以粗略地检验：直线 $y = 3t$ 离这些数据点相当近。

b) 我们刚才是把哪个向量投影到哪条直线上？

看待最小二乘问题有两种方式。第一种是在 $ty$ 平面上看最佳拟合直线。另一种是从投影的角度看——我们把 $b = \begin{bmatrix} 4 \\ 5 \\ 8 \end{bmatrix}$ 投影到 $A$ 的列空间（经过 $(1, 2, 3)$ 的直线）上，以尽可能接近 $Ax = b$ 的一个解。

### 3. 平面上的两个正交向量

向量 $a_1 = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$ 和 $a_2 = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$ 确定一个平面。求这个平面上两个互相正交的向量。

用 Gram-Schmidt 过程。从 $a_1$ 出发，从 $a_2$ 中减去它在 $a_1$ 方向上的分量，得到垂直于 $a_1$ 的第二个向量 $B$：

$$
B = a_2 - \frac{a_1^T a_2}{a_1^T a_1}a_1 = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix} - \frac{6}{14}\begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix} - \begin{bmatrix} 3/7 \\ 6/7 \\ 9/7 \end{bmatrix} = \begin{bmatrix} 4/7 \\ 1/7 \\ -2/7 \end{bmatrix}.
$$

由于 $a_1$ 与 $B$ 的点积为零，我们知道答案是正确的。$a_1$ 和 $B$ 就是所求的两个正交向量。

### 4. 特征值与可逆性

给定一个 4 × 4 矩阵 $A$，特征值是 $\lambda_1, \lambda_2, \lambda_3, \lambda_4$。

a) $\lambda_i$ 满足什么条件时矩阵可逆？

$A$ 可逆当且仅当所有 $\lambda_i$ 都不为 0。如果某个 $\lambda_i$ 是零，那么 $A$ 的零空间中有非零向量，$A$ 不可逆。

b) $\det A^{-1}$ 是多少？

$A^{-1}$ 的特征值是 $A$ 的特征值的倒数，所以 $\det A^{-1} = \dfrac{1}{\lambda_1}\cdot\dfrac{1}{\lambda_2}\cdot\dfrac{1}{\lambda_3}\cdot\dfrac{1}{\lambda_4}$。

c) $\operatorname{trace}(A + I)$ 是多少？

$A$ 的迹是它的特征值之和，所以 $\operatorname{trace}(A + I) = (\lambda_1 + 1) + (\lambda_2 + 1) + (\lambda_3 + 1) + (\lambda_4 + 1) = \lambda_1 + \lambda_2 + \lambda_3 + \lambda_4 + 4$。

### 5. 三对角矩阵的行列式

回忆三对角矩阵族，例如

$$
A_4 = \begin{bmatrix} 1 & 1 & 0 & 0 \\ 1 & 1 & 1 & 0 \\ 0 & 1 & 1 & 1 \\ 0 & 0 & 1 & 1 \end{bmatrix}.
$$

令 $D_n = \det A_n$。

a) 用代数余子式证明 $D_n = aD_{n-1} + bD_{n-2}$，并求出 $a$ 和 $b$。

用代数余子式公式求 $A_4$ 的行列式：

$$
D_4 = 1\begin{vmatrix} 1 & 1 & 0 \\ 1 & 1 & 1 \\ 0 & 1 & 1 \end{vmatrix} - 1\begin{vmatrix} 1 & 1 & 0 \\ 0 & 1 & 1 \\ 0 & 1 & 1 \end{vmatrix} + 0 - 0 = 1 \cdot D_3 - 1 \cdot 1 \cdot D_2 = D_3 - D_2.
$$

一般地 $D_n = D_{n-1} - D_{n-2}$。答案是 $a = 1$、$b = -1$。

b) a) 中你得到了递推关系 $D_n = aD_{n-1} + bD_{n-2}$。找到一种方法，预测任意 $n$ 时 $D_n$ 的值。提示：如果计算都正确，应该有 $\lambda_1^6 = \lambda_2^6 = 1$。

很快可以算出 $D_1 = 1$、$D_2 = \begin{vmatrix} 1 & 1 \\ 1 & 1 \end{vmatrix} = 0$。为 $D_n = D_{n-1} - D_{n-2}$ 建立方程组：

$$
\begin{bmatrix} D_n \\ D_{n-1} \end{bmatrix} = \begin{bmatrix} 1 & -1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} D_{n-1} \\ D_{n-2} \end{bmatrix},
$$

得到形如 $u_k = Au_{k-1}$ 的方程。

解 $\det(A - \lambda I) = 0$ 求特征值 $\lambda_i$：

$$
\begin{vmatrix} 1 - \lambda & -1 \\ 1 & -\lambda \end{vmatrix} = \lambda^2 - \lambda + 1 = 0.
$$

由求根公式 $\lambda = \dfrac{1 \pm \sqrt{1 - 4}}{2}$，得

$$
\lambda_1 = \frac{1 + \sqrt{3}i}{2} = e^{i\pi/3}, \qquad \lambda_2 = \frac{1 - \sqrt{3}i}{2} = e^{-i\pi/3}.
$$

这两个复数的模都是 1，这告诉我们系统是稳定的。$\lambda_1^6 = \lambda_2^6 = 1$ 说明 $A^6 = I$，所以向量序列 $u_k = Au_{k-1}$ 每 6 步重复一次。

为了完整回答这个问题，可以从 $D_1 = 1$、$D_2 = 0$ 出发，用递推关系 $D_n = D_{n-1} - D_{n-2}$ 求出 $D_3 = -1$、$D_4 = -1$、$D_5 = 0$、$D_6 = 1$。之后数列重复：$D_7 = D_1 = 1$，$D_8 = D_2 = 0$，依此类推。如果 $n = 6j + k$（$j$、$k$ 为正整数），那么 $D_n = D_k$。

### 6. 一族对称矩阵

考虑下面这一族对称矩阵：

$$
A_2 = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}, \quad A_3 = \begin{bmatrix} 0 & 1 & 0 \\ 1 & 0 & 2 \\ 0 & 2 & 0 \end{bmatrix}, \quad A_4 = \begin{bmatrix} 0 & 1 & 0 & 0 \\ 1 & 0 & 2 & 0 \\ 0 & 2 & 0 & 3 \\ 0 & 0 & 3 & 0 \end{bmatrix}, \quad \ldots
$$

a) 求投影到 $A_3$ 的列空间上的投影矩阵 $P$。

$A_3$ 是奇异的，因为第 3 列是第 1 列的倍数，所以 $P$ 是投影到一个平面上的矩阵。第 1、2 列构成 $A_3$ 的列空间的一组基，所以可以用公式 $P = A(A^T A)^{-1}A^T$，取 $A = \begin{bmatrix} 0 & 1 \\ 1 & 0 \\ 0 & 2 \end{bmatrix}$，得到

$$
P = \begin{bmatrix} 1/5 & 0 & 2/5 \\ 0 & 1 & 0 \\ 2/5 & 0 & 4/5 \end{bmatrix}.
$$

不过也许有更快的方法。可以用 $P$ 乘以 $A$ 的各列，看 $PA = A$ 是否成立，来检验结果。

b) $A_3$ 的特征值和特征向量是什么？

$$
|A_3 - \lambda I| = \begin{vmatrix} -\lambda & 1 & 0 \\ 1 & -\lambda & 2 \\ 0 & 2 & -\lambda \end{vmatrix} = -\lambda^3 + 5\lambda.
$$

令 $|A_3 - \lambda I| = 0$ 得 $\lambda(-\lambda^2 + 5) = 0$，所以 $\lambda_1 = 0$、$\lambda_2 = \sqrt{5}$、$\lambda_3 = -\sqrt{5}$。检验一下：$A_3$ 的迹等于特征值之和。

接着解 $(A_3 - \lambda I)x = 0$ 求特征向量。一个好办法是先让 $x$ 的某个分量等于 1，再确定其他分量应取什么值才能使乘积为零向量。

$(A_3 - 0I)x = 0$ 的解是 $x_1 = \begin{bmatrix} -2 \\ 0 \\ 1 \end{bmatrix}$。

$(A_3 - \sqrt{5}I)x = 0$ 的解是 $x_2 = \begin{bmatrix} 1 \\ \sqrt{5} \\ 2 \end{bmatrix}$。

$(A_3 + \sqrt{5}I)x = 0$ 的解是 $x_3 = \begin{bmatrix} 1 \\ -\sqrt{5} \\ 2 \end{bmatrix}$。

如果有时间，可以用 $A_3$ 乘以每个特征向量来检验答案。

c) （这一问不难。）投影到 $A_4$ 的列空间上的投影矩阵是什么？

这怎么会不难呢？如果 $A_4$ 可逆，那么它的列空间是 $\mathbb{R}^4$，答案就是 $P = I$。

要确认 $A_4$ 可逆，可以检验它的行列式不为零。用代数余子式来算并不难：

$$
\det A_4 = (-1)\left(1 \cdot \begin{vmatrix} 0 & 3 \\ 3 & 0 \end{vmatrix} + 2 \cdot \begin{vmatrix} 0 & 3 \\ 0 & 0 \end{vmatrix}\right) = 9.
$$

因为 $A_4$ 可逆，投影到它的列空间上的投影矩阵就是 $I$。

d) 附加题：证明或否定：$n$ 为奇数时 $A_n$ 是奇异的，$n$ 为偶数时 $A_n$ 是可逆的。
