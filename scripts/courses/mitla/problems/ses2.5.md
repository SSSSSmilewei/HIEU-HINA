# 习题：行列式的性质

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 18.1

（教材第 5.1 节第 10 题）如果方阵 $A$ 的每一行元素之和都是零，通过求解 $Ax = 0$ 证明 $\det A = 0$。如果每一行元素之和都是一，证明 $\det(A - I) = 0$。这是否意味着 $\det A = 1$？

<details>
<summary>解答</summary>

如果 $A$ 的每一行元素之和都是零，那么当 $x = (1, \ldots, 1)$ 时 $Ax = 0$，因为 $Ax$ 的每个分量都是 $A$ 某一行的元素之和。由于 $A$ 的零空间非零，$A$ 不可逆，所以 $\det A = 0$。

如果 $A$ 的每一行元素之和都是一，那么 $A - I$ 的每一行元素之和都是零。所以 $A - I$ 的零空间非零，$\det(A - I) = 0$。

$\det(A - I) = 0$ 并不意味着 $\det A = 1$。例如 $A = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$ 的每一行之和都是一，但 $\det A = -1$。

</details>

## 习题 18.2

（教材第 5.1 节第 18 题）用行变换和行列式的性质，计算 3 × 3 的「范德蒙行列式」：

$$
\det \begin{bmatrix} 1 & a & a^2 \\ 1 & b & b^2 \\ 1 & c & c^2 \end{bmatrix} = (b - a)(c - a)(c - b).
$$

<details>
<summary>解答</summary>

利用行变换和行列式的性质：

$$
\begin{aligned}
\det \begin{bmatrix} 1 & a & a^2 \\ 1 & b & b^2 \\ 1 & c & c^2 \end{bmatrix}
&= \det \begin{bmatrix} 1 & a & a^2 \\ 0 & b - a & b^2 - a^2 \\ 0 & c - a & c^2 - a^2 \end{bmatrix} \\
&= (b - a) \det \begin{bmatrix} 1 & a & a^2 \\ 0 & 1 & b + a \\ 0 & c - a & c^2 - a^2 \end{bmatrix} \\
&= (b - a) \det \begin{bmatrix} 1 & a & a^2 \\ 0 & 1 & b + a \\ 0 & 0 & (c - a)(c - b) \end{bmatrix} \\
&= (b - a)(c - a)(c - b) \det \begin{bmatrix} 1 & a & a^2 \\ 0 & 1 & b + a \\ 0 & 0 & 1 \end{bmatrix} \\
&= (b - a)(c - a)(c - b) \det \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \\
&= (b - a)(c - a)(c - b).
\end{aligned}
$$

第三步用到 $(c^2 - a^2) - (c - a)(b + a) = (c - a)(c - b)$。

</details>
