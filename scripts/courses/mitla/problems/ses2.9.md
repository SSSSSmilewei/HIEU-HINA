# 习题：对角化与 A 的幂

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 22.1

（教材第 6.2 节第 6 题）描述所有能把下面的矩阵 $A$ 对角化的矩阵 $S$（求出所有特征向量）：

$$
A = \begin{bmatrix} 4 & 0 \\ 1 & 2 \end{bmatrix}.
$$

再描述所有能把 $A^{-1}$ 对角化的矩阵。

<details>
<summary>解答</summary>

要求 $A$ 的特征向量，先求特征值：

$$
\det \begin{bmatrix} 4 - \lambda & 0 \\ 1 & 2 - \lambda \end{bmatrix} = 0 \;\Longrightarrow\; (4 - \lambda)(2 - \lambda) = 0.
$$

所以特征值是 $\lambda_1 = 4$、$\lambda_2 = 2$。用这两个值，解 $(A - \lambda I)x = 0$ 求特征向量：

$$
(A - \lambda_1 I)x = \begin{bmatrix} 0 & 0 \\ 1 & -2 \end{bmatrix} \begin{bmatrix} y \\ z \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \;\Longrightarrow\; y = 2z,
$$

所以 $(2, 1)$ 的任何（非零）倍数都是 $\lambda_1$ 的特征向量。

$$
(A - \lambda_2 I)x = \begin{bmatrix} 2 & 0 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} y \\ z \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \;\Longrightarrow\; y = 0,\ z \text{ 是自由变量},
$$

所以 $(0, 1)$ 的任何（非零）倍数都是 $\lambda_2$ 的特征向量。因此，能把 $A$ 对角化的矩阵 $S$，各列是 $(2, 1)$ 和 $(0, 1)$ 的非零倍数，顺序可以任意。

最后，因为 $A^{-1} = S\Lambda^{-1}S^{-1}$，同样的这些矩阵 $S$ 也能把 $A^{-1}$ 对角化。

（译注：原文结论处把第二个特征向量写作 $(1, 0)$，与前面算出的 $(0, 1)$ 不符，译文已更正。）

</details>

## 习题 22.2

（教材第 6.2 节第 16 题）求出把 $A$ 对角化的 $\Lambda$ 和 $S$：

$$
A = \begin{bmatrix} .6 & .9 \\ .4 & .1 \end{bmatrix}.
$$

当 $k \to \infty$ 时 $\Lambda^k$ 的极限是什么？$S\Lambda^k S^{-1}$ 的极限矩阵是什么？在这个矩阵的各列中，你看到的是 ______。

<details>
<summary>解答</summary>

由于 $A$ 的每一列之和都是 1，$A$ 是马尔可夫矩阵，一定有特征值 $\lambda_1 = 1$。$A$ 的迹是 0.7，所以另一个特征值是 $\lambda_2 = 0.7 - 1 = -0.3$。要求 $S$，需要求出对应的特征向量：

$$
(A - \lambda_1 I)x_1 = \begin{bmatrix} -.4 & .9 \\ .4 & -.9 \end{bmatrix} \begin{bmatrix} y \\ z \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \;\Longrightarrow\; x_1 = (9, 4).
$$

$$
(A - \lambda_2 I)x_2 = \begin{bmatrix} .9 & .9 \\ .4 & .4 \end{bmatrix} \begin{bmatrix} y \\ z \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \;\Longrightarrow\; y = -z \;\Longrightarrow\; x_2 = (1, -1).
$$

合起来，

$$
S = \begin{bmatrix} 9 & 1 \\ 4 & -1 \end{bmatrix}, \qquad \Lambda = \begin{bmatrix} 1 & \\ & -.3 \end{bmatrix}. \qquad k \to \infty \text{ 时}, \ \Lambda^k \to \begin{bmatrix} 1 & \\ & 0 \end{bmatrix}.
$$

所以

$$
S\Lambda^\infty S^{-1} \to \begin{bmatrix} 9 & 1 \\ 4 & -1 \end{bmatrix} \begin{bmatrix} 1 & \\ & 0 \end{bmatrix} \frac{1}{13} \begin{bmatrix} 1 & 1 \\ 4 & -9 \end{bmatrix} = \frac{1}{13} \begin{bmatrix} 9 & 9 \\ 4 & 4 \end{bmatrix}.
$$

在这个矩阵的各列中，你看到的是**稳态向量**。

</details>
