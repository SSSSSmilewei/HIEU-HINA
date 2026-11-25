# 习题：转置、置换与向量空间

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 5.1

（教材第 2.7 节第 13 题）

a) 找一个 3 × 3 的置换矩阵 $P$，使 $P^3 = I$（但 $P \ne I$）。

b) 找一个 4 × 4 的置换矩阵 $\hat{P}$，使 $\hat{P}^4 \ne I$。

<details>
<summary>解答</summary>

a) 让 $P$ 把各行循环移动：第一行移到第二行，第二行移到第三行，第三行移到第一行。于是

$$
P = \begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}, \quad P^2 = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{bmatrix}, \quad P^3 = I.
$$

b) 令 $\hat{P}$ 为对角线上依次是 1 和 $P$ 的分块对角矩阵：$\hat{P} = \begin{bmatrix} 1 & 0 \\ 0 & P \end{bmatrix}$。因为 $P^3 = I$，所以 $\hat{P}^3 = I$，于是 $\hat{P}^4 = \hat{P} \ne I$。

</details>

## 习题 5.2

设 $A$ 是 4 × 4 矩阵。在下面两种情况下，$A$ 有多少个元素可以独立选取？

a) $A$ 是对称矩阵；

b) $A$ 是反对称矩阵（$A^T = -A$）。

<details>
<summary>解答</summary>

a) 4 × 4 对称矩阵最一般的形式是

$$
A = \begin{bmatrix} a & e & f & g \\ e & b & h & i \\ f & h & c & j \\ g & i & j & d \end{bmatrix},
$$

所以有 **10** 个元素可以独立选取。

b) 4 × 4 反对称矩阵最一般的形式是

$$
A = \begin{bmatrix} 0 & -a & -b & -c \\ a & 0 & -d & -e \\ b & d & 0 & -f \\ c & e & f & 0 \end{bmatrix},
$$

所以有 **6** 个元素可以独立选取。

</details>

## 习题 5.3

（教材第 3.1 节第 18 题）判断对错（检验加法，或者举出反例）。设 $M$ 是所有 2 × 2 矩阵组成的空间：

a) $M$ 中的对称矩阵（$A^T = A$）构成一个子空间。

b) $M$ 中的反对称矩阵（$A^T = -A$）构成一个子空间。

c) $M$ 中的非对称矩阵（$A^T \ne A$）构成一个子空间。

<details>
<summary>解答</summary>

a) **对**。由 $A^T = A$、$B^T = B$ 可得 $(A + B)^T = A^T + B^T = A + B$，并且 $(cA)^T = cA$。

b) **对**。由 $A^T = -A$、$B^T = -B$ 可得 $(A + B)^T = A^T + B^T = -A - B = -(A + B)$，并且 $(cA)^T = -cA$。

c) **错**。两个非对称矩阵的和可以是对称的：

$$
\begin{bmatrix} 1 & 1 \\ 0 & 0 \end{bmatrix} + \begin{bmatrix} 0 & 0 \\ 1 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}.
$$

</details>
