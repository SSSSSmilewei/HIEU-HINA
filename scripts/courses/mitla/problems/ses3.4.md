# 习题：相似矩阵与若尔当标准形

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 28.1

（教材第 6.6 节第 12 题）下面两个若尔当矩阵的特征值都是 0、0、0、0。它们都有两个特征向量，每个块一个。但它们的块的大小不一样，所以它们不相似：

$$
J = \begin{bmatrix} 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 1 \\ 0 & 0 & 0 & 0 \end{bmatrix}, \qquad K = \begin{bmatrix} 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{bmatrix}.
$$

对一般的矩阵 $M$，证明：如果 $JM = MK$，那么 $M$ 不可逆，因而 $J$ 与 $K$ 不相似。

<details>
<summary>解答</summary>

设 $M = (m_{ij})$。那么

$$
JM = \begin{bmatrix} m_{21} & m_{22} & m_{23} & m_{24} \\ 0 & 0 & 0 & 0 \\ m_{41} & m_{42} & m_{43} & m_{44} \\ 0 & 0 & 0 & 0 \end{bmatrix}, \qquad MK = \begin{bmatrix} 0 & m_{11} & m_{12} & 0 \\ 0 & m_{21} & m_{22} & 0 \\ 0 & m_{31} & m_{32} & 0 \\ 0 & m_{41} & m_{42} & 0 \end{bmatrix}.
$$

如果 $JM = MK$，那么 $m_{11} = m_{22} = 0$，$m_{21} = 0$，$m_{31} = m_{42} = 0$，$m_{41} = 0$。于是 $M$ 的第一列全是零，$M$ 不可逆。

如果 $J$ 与 $K$ 相似，就会存在一个可逆矩阵 $M$ 满足 $K = M^{-1}JM$，从而 $MK = JM$。我们刚刚证明了不存在这样的可逆矩阵 $M$。所以 $J$ 与 $K$ 不相似。

</details>

## 习题 28.2

（教材第 6.6 节第 20 题）为什么下面这些说法都是对的？

a) 如果 $A$ 与 $B$ 相似，那么 $A^2$ 与 $B^2$ 相似。

b) $A$ 与 $B$ 不相似时，$A^2$ 与 $B^2$ 也可能相似（试试 $\lambda = 0, 0$）。

c) $\begin{bmatrix} 3 & 0 \\ 0 & 4 \end{bmatrix}$ 与 $\begin{bmatrix} 3 & 1 \\ 0 & 4 \end{bmatrix}$ 相似。

d) $\begin{bmatrix} 3 & 0 \\ 0 & 3 \end{bmatrix}$ 与 $\begin{bmatrix} 3 & 1 \\ 0 & 3 \end{bmatrix}$ 不相似。

e) 给定矩阵 $A$，交换 $A$ 的第 1、2 行，再交换第 1、2 列，得到矩阵 $B$。证明 $A$ 与 $B$ 相似。

<details>
<summary>解答</summary>

a) 如果 $A$ 与 $B$ 相似，那么

$$
A = M^{-1}BM \;\Longrightarrow\; A^2 = M^{-1}BM(M^{-1}BM) = M^{-1}B^2M.
$$

由于 $A^2 = M^{-1}B^2M$，按定义 $A^2$ 与 $B^2$ 相似。

b) 令

$$
A = \begin{bmatrix} 0 & 0 \\ 0 & 0 \end{bmatrix}, \qquad B = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}.
$$

那么 $A^2 = B^2$，所以 $A^2$ 与 $B^2$ 相似；但 $A$ 与 $B$ 不相似，因为只有零矩阵与零矩阵相似。

c) 验证这两个矩阵相似有好几种方法。一种是直接找出满足相似条件的矩阵 $M$：

$$
\begin{bmatrix} 3 & 0 \\ 0 & 4 \end{bmatrix} = \begin{bmatrix} 1 & -1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 3 & 1 \\ 0 & 4 \end{bmatrix} \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}.
$$

d) 这两个矩阵不相似：对第一个矩阵，平面上的每个向量都是 $\lambda = 3$ 的特征向量；而第二个矩阵对应于 $\lambda = 3$ 的特征向量只有一条直线（$y = 0$）。相似矩阵的线性无关特征向量个数相同，所以这两个矩阵不可能相似。

e) 要交换 $A$ 的前两行，就在 $A$ 的左边乘以

$$
M = \begin{bmatrix} 0 & 1 & 0 & 0 \\ 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}.
$$

要交换 $A$ 的前两列，就在右边乘以同一个矩阵 $M$。于是 $B = MAM$。由于 $M^{-1} = M$，$B$ 与 $A$ 相似。

</details>
