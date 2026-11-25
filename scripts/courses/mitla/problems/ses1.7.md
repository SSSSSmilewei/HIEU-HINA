# 习题：求解 Ax = 0

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 7.1

a) 求下面矩阵的行最简形：

$$
A = \begin{bmatrix} 1 & 5 & 7 & 9 \\ 0 & 4 & 1 & 7 \\ 2 & -2 & 11 & -3 \end{bmatrix}.
$$

b) 这个矩阵的秩是多少？

c) 求方程 $Ax = 0$ 的特解。

<details>
<summary>解答</summary>

a) 要把 $A$ 化成行最简形，我们做一系列行变换。可以有不同的做法（答案相同！）。首先，把第一行乘以 2，从第三行中减去：

$$
\begin{bmatrix} 1 & 5 & 7 & 9 \\ 0 & 4 & 1 & 7 \\ 2 & -2 & 11 & -3 \end{bmatrix} \longrightarrow \begin{bmatrix} 1 & 5 & 7 & 9 \\ 0 & 4 & 1 & 7 \\ 0 & -12 & -3 & -21 \end{bmatrix}.
$$

然后把第二行乘以 $\tfrac14$，使第二个主元等于 1：

$$
\longrightarrow \begin{bmatrix} 1 & 5 & 7 & 9 \\ 0 & 1 & 1/4 & 7/4 \\ 0 & -12 & -3 & -21 \end{bmatrix}.
$$

把第二行乘以 12，加到第三行上：

$$
\longrightarrow \begin{bmatrix} 1 & 5 & 7 & 9 \\ 0 & 1 & 1/4 & 7/4 \\ 0 & 0 & 0 & 0 \end{bmatrix}.
$$

最后，把第二行乘以 5，从第一行中减去：

$$
\longrightarrow \begin{bmatrix} 1 & 0 & 23/4 & 1/4 \\ 0 & 1 & 1/4 & 7/4 \\ 0 & 0 & 0 & 0 \end{bmatrix}.
$$

b) 这个矩阵有 2 个主元，所以秩是 **2**。

c) $Ax = 0$ 的特解是

$$
\begin{bmatrix} -23/4 \\ -1/4 \\ 1 \\ 0 \end{bmatrix} \quad\text{和}\quad \begin{bmatrix} -1/4 \\ -7/4 \\ 0 \\ 1 \end{bmatrix}.
$$

</details>

## 习题 7.2

（教材第 3.3 节第 17 题 b）对 $B = \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}$，找出 $A_1$ 和 $A_2$，使 $\operatorname{rank}(A_1 B) = 1$、$\operatorname{rank}(A_2 B) = 0$。

<details>
<summary>解答</summary>

取 $A_1 = I_2$，$A_2 = 0_2$（2 × 2 零矩阵）即可。

一个不那么平凡的例子是 $A_2 = \begin{bmatrix} 1 & -1 \\ 1 & -1 \end{bmatrix}$。

</details>
