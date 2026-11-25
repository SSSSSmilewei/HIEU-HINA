# 习题：特征值与特征向量

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 21.1

（教材第 6.1 节第 19 题）已知 3 × 3 矩阵 $B$ 的特征值是 0、1、2。这些信息足以求出下面四项中的三项（能求的请给出答案）：

a) $B$ 的秩；

b) $B^T B$ 的行列式；

c) $B^T B$ 的特征值；

d) $(B^2 + I)^{-1}$ 的特征值。

<details>
<summary>解答</summary>

a) $B$ 有特征值 0，所以是奇异的（不可逆）。$B$ 是 3 × 3 矩阵，所以它的秩至多是 2。由于 $B$ 有两个不同的非零特征值，它的秩恰好是 **2**。

b) 因为 $B$ 是奇异的，$\det B = 0$。所以 $\det(B^T B) = \det(B^T)\det(B) = \mathbf{0}$。

c) 信息**不足以**求出 $B^T B$ 的特征值。例如：

$$
B = \begin{bmatrix} 0 & & \\ & 1 & \\ & & 2 \end{bmatrix} \text{ 时 } B^T B = \begin{bmatrix} 0 & & \\ & 1 & \\ & & 4 \end{bmatrix}; \qquad B = \begin{bmatrix} 0 & 1 & \\ & 1 & \\ & & 2 \end{bmatrix} \text{ 时 } B^T B = \begin{bmatrix} 0 & & \\ & 2 & \\ & & 4 \end{bmatrix}.
$$

d) 如果 $p(t)$ 是一个多项式，$x$ 是 $A$ 的特征值为 $\lambda$ 的特征向量，那么

$$
p(A)x = p(\lambda)x.
$$

我们还知道，如果 $\lambda$ 是 $A$ 的特征值，那么 $1/\lambda$ 是 $A^{-1}$ 的特征值。所以 $(B^2 + I)^{-1}$ 的特征值是 $\dfrac{1}{0^2 + 1}$、$\dfrac{1}{1^2 + 1}$、$\dfrac{1}{2^2 + 1}$，即 **1、1/2、1/5**。

</details>

## 习题 21.2

（教材第 6.1 节第 29 题）求下面三个矩阵的特征值：

$$
A = \begin{bmatrix} 1 & 2 & 3 \\ 0 & 4 & 5 \\ 0 & 0 & 6 \end{bmatrix}, \quad B = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 2 & 0 \\ 3 & 0 & 0 \end{bmatrix}, \quad C = \begin{bmatrix} 2 & 2 & 2 \\ 2 & 2 & 2 \\ 2 & 2 & 2 \end{bmatrix}.
$$

<details>
<summary>解答</summary>

三角矩阵的特征值就是它的对角元，所以 $A$ 的特征值是 **1、4、6**。对 $B$：

$$
\det(B - \lambda I) = (-\lambda)(2 - \lambda)(-\lambda) - 3(2 - \lambda) = (\lambda^2 - 3)(2 - \lambda).
$$

所以 $B$ 的特征值是 $\pm\sqrt{3}$ 和 **2**。最后，对 $C$：

$$
\begin{aligned}
\det(C - \lambda I) &= (2 - \lambda)[(2 - \lambda)^2 - 4] - 2[2(2 - \lambda) - 4] + 2[4 - 2(2 - \lambda)] \\
&= -\lambda^3 + 6\lambda^2 = -\lambda^2(\lambda - 6).
\end{aligned}
$$

$C$ 的特征值是 **6、0、0**。

可以快速检验答案：计算 $A$ 和 $B$ 的行列式（等于特征值之积），并注意 $C$ 是奇异的。

（译注：原文把 $\det(C - \lambda I)$ 写作 $\lambda^3 - 6\lambda^2$，展开后应为 $-\lambda^3 + 6\lambda^2$，差一个符号，不影响特征值，译文已更正。）

</details>
