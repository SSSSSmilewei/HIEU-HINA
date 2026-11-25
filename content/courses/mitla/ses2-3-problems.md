# 习题：投影矩阵与最小二乘

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 16.1

（教材第 4.3 节第 17 题）写出直线 $b = C + Dt$ 经过 $t = -1$ 时 $b = 7$、$t = 1$ 时 $b = 7$、$t = 2$ 时 $b = 21$ 的三个方程。求最小二乘解 $\hat{x} = (C, D)$，并画出最近的直线。

<details>
<summary>解答</summary>

$$
\begin{bmatrix} 1 & -1 \\ 1 & 1 \\ 1 & 2 \end{bmatrix} \begin{bmatrix} C \\ D \end{bmatrix} = \begin{bmatrix} 7 \\ 7 \\ 21 \end{bmatrix}.
$$

解 $\hat{x} = \begin{bmatrix} 9 \\ 4 \end{bmatrix}$ 来自

$$
\begin{bmatrix} 3 & 2 \\ 2 & 6 \end{bmatrix} \begin{bmatrix} C \\ D \end{bmatrix} = \begin{bmatrix} 35 \\ 42 \end{bmatrix}.
$$

最近的直线是 $b = 9 + 4t$。

</details>

## 习题 16.2

（教材第 4.3 节第 18 题）求上一题中的投影 $p = A\hat{x}$，它给出了最近的直线在三个时刻的高度。证明误差向量是 $e = (2, -6, 4)$。为什么 $Pe = 0$？

<details>
<summary>解答</summary>

$p = A\hat{x} = (5, 13, 17)$ 给出最近的直线的高度。误差是 $b - p = (2, -6, 4)$。这个误差满足 $Pe = Pb - Pp = p - p = 0$。

</details>

## 习题 16.3

（教材第 4.3 节第 19 题）假设在 $t = -1, 1, 2$ 时的测量值正好是上一题中的误差 $2, -6, 4$。计算 $\hat{x}$ 和离这些新测量值最近的直线。解释答案：$b = (2, -6, 4)$ 垂直于 ______，所以投影是 $p = 0$。

<details>
<summary>解答</summary>

如果 $b$ 等于误差 $e$，那么 $b$ 垂直于 $A$ 的**列空间**。投影 $p = 0$（于是 $\hat{x} = 0$，最近的直线是 $b = 0$）。

</details>

## 习题 16.4

（教材第 4.3 节第 20 题）假设在 $t = -1, 1, 2$ 时的测量值是 $b = (5, 13, 17)$。计算 $\hat{x}$、最近的直线和 $e$。误差 $e = 0$，因为这个 $b$ ______。

<details>
<summary>解答</summary>

如果 $b = A\hat{x} = (5, 13, 17)$，那么 $\hat{x} = (9, 4)$，并且 $e = 0$，因为 $b$ **在 $A$ 的列空间中**。

</details>

## 习题 16.5

（教材第 4.3 节第 21 题）误差向量 $e$ 在四个子空间中的哪一个里？$p$ 在哪一个里？$\hat{x}$ 在哪一个里？$A$ 的零空间是什么？

<details>
<summary>解答</summary>

$e$ 在 $N(A^T)$ 中；$p$ 在 $C(A)$ 中；$\hat{x}$ 在 $C(A^T)$ 中；$N(A) = \{0\}$，只含零向量。

</details>

## 习题 16.6

（教材第 4.3 节第 22 题）在时刻 $t = -2, -1, 0, 1, 2$ 的测量值是 $b = 4, 2, -1, 0, 0$，求最佳的拟合直线 $C + Dt$。

<details>
<summary>解答</summary>

最小二乘方程是

$$
\begin{bmatrix} 5 & 0 \\ 0 & 10 \end{bmatrix} \begin{bmatrix} C \\ D \end{bmatrix} = \begin{bmatrix} 5 \\ -10 \end{bmatrix}.
$$

解得 $C = 1$、$D = -1$，最佳直线是 $1 - t$。$t$ 的取值关于 0 对称，所以 $A^T A$ 是对角矩阵。

</details>
