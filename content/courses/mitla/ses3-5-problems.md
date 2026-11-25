# 习题：奇异值分解

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 29.1

（据教材第 6.7 节第 4 题改编）验证：对斐波那契矩阵 $A = \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix}$ 做奇异值分解 $A = U\Sigma V^T$，得到

$$
\Sigma = \begin{bmatrix} \dfrac{1 + \sqrt5}{2} & \\ & \dfrac{\sqrt5 - 1}{2} \end{bmatrix}.
$$

<details>
<summary>解答</summary>

$$
A^T A = AA^T = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}.
$$

这个矩阵的特征值是 $x^2 - 3x + 1$ 的根，即 $\dfrac{3 \pm \sqrt5}{2}$。所以

$$
\sigma_1^2 = \frac{3 + \sqrt5}{2}, \qquad \sigma_2^2 = \frac{3 - \sqrt5}{2}.
$$

要检验 $\Sigma = \begin{bmatrix} \sigma_1 & 0 \\ 0 & \sigma_2 \end{bmatrix}$，把上面给出的 $\Sigma$ 的元素平方：

$$
\left(\frac{1 + \sqrt5}{2}\right)^2 = \frac{1 + 2\sqrt5 + 5}{4} = \frac{3 + \sqrt5}{2}. \;\checkmark
$$

$$
\left(\frac{\sqrt5 - 1}{2}\right)^2 = \frac{5 - 2\sqrt5 + 1}{4} = \frac{3 - \sqrt5}{2}. \;\checkmark
$$

</details>

## 习题 29.2

（教材第 6.7 节第 11 题）设 $A$ 的各列 $w_1, w_2, \ldots, w_n$ 互相正交，长度分别是 $\sigma_1, \sigma_2, \ldots, \sigma_n$。计算 $A^T A$。SVD 中的 $U$、$\Sigma$、$V$ 分别是什么？

<details>
<summary>解答</summary>

由于 $A$ 的各列互相正交，$A^T A$ 是对角矩阵，对角元是 $\sigma_1^2, \ldots, \sigma_n^2$。由 $A^T A = V\Sigma^2 V^T$ 可知，$\Sigma^2$ 是对角元为 $\sigma_1^2, \ldots, \sigma_n^2$ 的矩阵，因此 $\Sigma$ 是对角元为 $\sigma_1, \ldots, \sigma_n$ 的矩阵。

再看等式 $A^T A = V\Sigma^2 V^T$，还可以得出 $V = I$。

于是等式 $A = U\Sigma V^T$ 告诉我们，$U$ 一定是各列为 $\dfrac{w_i}{\sigma_i}$ 的矩阵。

</details>
