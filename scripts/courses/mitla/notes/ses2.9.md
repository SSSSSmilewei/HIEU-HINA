# 对角化与 A 的幂

> 本页是 MIT 开放式课程 18.06SC 官方讲座摘要（lecture summary）的中文翻译，原文见页面下方的「讲座摘要原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

我们已经知道怎样求特征值和特征向量。这一讲学习把任何有 $n$ 个线性无关特征向量的矩阵**对角化**，并看看对角化怎样简化计算。最后用特征值和特征向量求解**差分方程**。

## 把矩阵对角化：S⁻¹AS = Λ

如果 $A$ 有 $n$ 个线性无关的特征向量，就可以把这些向量放进一个（可逆的）方阵 $S$ 的各列。于是

$$
AS = A\begin{bmatrix} x_1 & x_2 & \cdots & x_n \end{bmatrix} = \begin{bmatrix} \lambda_1 x_1 & \lambda_2 x_2 & \cdots & \lambda_n x_n \end{bmatrix} = S \begin{bmatrix} \lambda_1 & 0 & \cdots & 0 \\ 0 & \lambda_2 & & 0 \\ \vdots & & \ddots & \vdots \\ 0 & \cdots & 0 & \lambda_n \end{bmatrix} = S\Lambda.
$$

注意 $\Lambda$ 是对角矩阵，它的非零元素是 $A$ 的特征值。因为 $S$ 的各列线性无关，$S^{-1}$ 存在，可以在 $AS = S\Lambda$ 两边左乘 $S^{-1}$：

$$
S^{-1}AS = \Lambda.
$$

等价地，$A = S\Lambda S^{-1}$。

## A 的幂

$A^2$ 的特征值和特征向量是什么？

$$
\text{如果 } Ax = \lambda x, \quad \text{那么 } A^2 x = \lambda Ax = \lambda^2 x.
$$

$A^2$ 的特征值是 $A$ 的特征值的平方，$A^2$ 的特征向量与 $A$ 的特征向量相同。如果写成 $A = S\Lambda S^{-1}$，那么

$$
A^2 = S\Lambda S^{-1} S\Lambda S^{-1} = S\Lambda^2 S^{-1}.
$$

类似地，$A^k = S\Lambda^k S^{-1}$ 告诉我们：把 $A$ 的特征值取 $k$ 次方，就得到 $A^k$ 的特征值；$A^k$ 的特征向量与 $A$ 的相同。

**定理**：如果 $A$ 有 $n$ 个线性无关的特征向量，特征值是 $\lambda_i$，那么当 $k \to \infty$ 时 $A^k \to 0$，当且仅当所有的 $|\lambda_i| < 1$。

如果 $A$ 的所有特征值都互不相同，那么 $A$ 一定有 $n$ 个线性无关的特征向量（因而可以对角化）。大多数矩阵的特征值确实互不相同。

## 重特征值

如果 $A$ 有重特征值，它可能有、也可能没有 $n$ 个线性无关的特征向量。例如，单位矩阵的特征值全是 1，但它仍然有 $n$ 个线性无关的特征向量。

如果 $A$ 是三角矩阵 $\begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}$，它的特征值是 2 和 2。它的特征向量在 $A - \lambda I = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$ 的零空间中，这个零空间由 $x = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$ 张成。这个 $A$ **没有**两个线性无关的特征向量。

## 差分方程 u_{k+1} = Au_k

从给定的向量 $u_0$ 出发，可以构造一列向量，其中每个新向量都是 $A$ 乘以前一个向量：$u_{k+1} = Au_k$。$u_{k+1} = Au_k$ 是一个一阶**差分方程**，$u_k = A^k u_0$ 是这个系统的解。

如果把 $u_0$ 写成 $A$ 的特征向量的组合，就能得到更令人满意的解：

$$
u_0 = c_1 x_1 + c_2 x_2 + \cdots + c_n x_n = Sc.
$$

于是

$$
Au_0 = c_1 \lambda_1 x_1 + c_2 \lambda_2 x_2 + \cdots + c_n \lambda_n x_n,
$$

$$
u_k = A^k u_0 = c_1 \lambda_1^k x_1 + c_2 \lambda_2^k x_2 + \cdots + c_n \lambda_n^k x_n = S\Lambda^k c.
$$

（译注：原文最后一式写作 $\Lambda^k Sc$，应为 $S\Lambda^k c$，译文已更正。）

## 斐波那契数列

斐波那契数列是 $0, 1, 1, 2, 3, 5, 8, 13, \ldots$，一般地 $F_{k+2} = F_{k+1} + F_k$。如果能用矩阵来理解它，矩阵的特征值就能告诉我们数列中的数增长得有多快。

$u_{k+1} = Au_k$ 是一阶系统，而 $F_{k+2} = F_{k+1} + F_k$ 是一个二阶的标量方程。用一个巧妙的办法，可以把它变成一阶线性系统。令 $u_k = \begin{bmatrix} F_{k+1} \\ F_k \end{bmatrix}$，那么

$$
\begin{aligned} F_{k+2} &= F_{k+1} + F_k \\ F_{k+1} &= F_{k+1} \end{aligned}
$$

等价于一阶系统 $u_{k+1} = \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix} u_k$。

$A = \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix}$ 的特征值和特征向量是什么？因为 $A$ 是对称的，它的特征值是实数，特征向量互相正交。因为 $A$ 是 2 × 2 矩阵，我们知道它的特征值之和是 1（迹），积是 $-1$（行列式）。

$$
|A - \lambda I| = \begin{vmatrix} 1 - \lambda & 1 \\ 1 & -\lambda \end{vmatrix} = \lambda^2 - \lambda - 1.
$$

令它等于零，得到 $\lambda = \dfrac{1 \pm \sqrt{1 + 4}}{2}$，即 $\lambda_1 = \frac{1}{2}(1 + \sqrt{5}) \approx 1.618$、$\lambda_2 = \frac{1}{2}(1 - \sqrt{5}) \approx -0.618$。$F_k$ 的增长速度由 $\lambda_1$ 控制，它是唯一绝对值大于 1 的特征值。这告诉我们，当 $k$ 很大时，对某个常数 $c_1$ 有 $F_k \approx c_1 \left(\frac{1 + \sqrt{5}}{2}\right)^k$。（记住 $u_k = A^k u_0 = c_1 \lambda_1^k x_1 + c_2 \lambda_2^k x_2$，而由于 $|\lambda_2| < 1$，$\lambda_2^k$ 趋于零。）

要求 $A$ 的特征向量，注意

$$
(A - \lambda I)x = \begin{bmatrix} 1 - \lambda & 1 \\ 1 & -\lambda \end{bmatrix} x
$$

在 $x = \begin{bmatrix} \lambda \\ 1 \end{bmatrix}$ 时等于 0，所以 $x_1 = \begin{bmatrix} \lambda_1 \\ 1 \end{bmatrix}$、$x_2 = \begin{bmatrix} \lambda_2 \\ 1 \end{bmatrix}$。

最后，由 $u_0 = \begin{bmatrix} F_1 \\ F_0 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix} = c_1 x_1 + c_2 x_2$ 得到 $c_1 = -c_2 = \dfrac{1}{\sqrt{5}}$。因为 $\begin{bmatrix} F_{k+1} \\ F_k \end{bmatrix} = u_k = c_1 \lambda_1^k x_1 + c_2 \lambda_2^k x_2$，所以

$$
F_k = \frac{1}{\sqrt{5}}\left(\frac{1 + \sqrt{5}}{2}\right)^k - \frac{1}{\sqrt{5}}\left(\frac{1 - \sqrt{5}}{2}\right)^k.
$$

利用特征值和特征向量，我们求出了斐波那契数的闭式表达式。

**小结**：当一个数列按照一阶系统的规则随时间演化时，这个系统的矩阵的特征值决定了数列的长期行为。要得到数列的精确公式，就求出矩阵的特征向量，再解出系数 $c_1, c_2, \ldots$。
