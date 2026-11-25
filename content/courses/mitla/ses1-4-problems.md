# 习题：A = LU 分解

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 4.1

哪个矩阵 $E$ 能把 $A$ 化成三角形式 $EA = U$？再乘以 $E^{-1} = L$，把 $A$ 分解成 $LU$。

$$
A = \begin{bmatrix} 1 & 3 & 0 \\ 2 & 4 & 0 \\ 2 & 0 & 1 \end{bmatrix}
$$

<details>
<summary>解答</summary>

我们做一系列行变换，把 $A$ 化成上三角矩阵。首先，把第一行乘以 2，从第二行中减去，使第二行的第一个元素变成 0：

$$
\begin{bmatrix} 1 & 0 & 0 \\ -2 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 3 & 0 \\ 2 & 4 & 0 \\ 2 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 3 & 0 \\ 0 & -2 & 0 \\ 2 & 0 & 1 \end{bmatrix}.
$$

接着，把第一行（再一次）乘以 2，从第三行中减去，使第三行的第一个元素变成 0：

$$
\begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ -2 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 3 & 0 \\ 0 & -2 & 0 \\ 2 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 3 & 0 \\ 0 & -2 & 0 \\ 0 & -6 & 1 \end{bmatrix}.
$$

然后，把第二行乘以 3，从第三行中减去，使第三行的第二个元素变成 0：

$$
\begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & -3 & 1 \end{bmatrix} \begin{bmatrix} 1 & 3 & 0 \\ 0 & -2 & 0 \\ 0 & -6 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 3 & 0 \\ 0 & -2 & 0 \\ 0 & 0 & 1 \end{bmatrix} = U.
$$

把这三步用到的矩阵乘起来，得到 $E$：

$$
E = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & -3 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ -2 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 \\ -2 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & -3 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 \\ -2 & 1 & 0 \\ -2 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ -2 & 1 & 0 \\ 4 & -3 & 1 \end{bmatrix}.
$$

验算 $EA$：

$$
\begin{bmatrix} 1 & 0 & 0 \\ -2 & 1 & 0 \\ 4 & -3 & 1 \end{bmatrix} \begin{bmatrix} 1 & 3 & 0 \\ 2 & 4 & 0 \\ 2 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 3 & 0 \\ 0 & -2 & 0 \\ 0 & 0 & 1 \end{bmatrix} = U.
$$

求 $E^{-1}$ 可以用高斯—若尔当消元法（或者直接把乘数 2、2、3 填进 $E^{-1}$）：

$$
\left[\begin{array}{ccc|ccc} 1 & 0 & 0 & 1 & 0 & 0 \\ -2 & 1 & 0 & 0 & 1 & 0 \\ 4 & -3 & 1 & 0 & 0 & 1 \end{array}\right] \longrightarrow \left[\begin{array}{ccc|ccc} 1 & 0 & 0 & 1 & 0 & 0 \\ 0 & 1 & 0 & 2 & 1 & 0 \\ 0 & -3 & 1 & -4 & 0 & 1 \end{array}\right] \longrightarrow \left[\begin{array}{ccc|ccc} 1 & 0 & 0 & 1 & 0 & 0 \\ 0 & 1 & 0 & 2 & 1 & 0 \\ 0 & 0 & 1 & 2 & 3 & 1 \end{array}\right]
$$

$$
E^{-1} = \begin{bmatrix} 1 & 0 & 0 \\ 2 & 1 & 0 \\ 2 & 3 & 1 \end{bmatrix}.
$$

可以验证它确实是 $E$ 的逆：

$$
EE^{-1} = \begin{bmatrix} 1 & 0 & 0 \\ -2 & 1 & 0 \\ 4 & -3 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 \\ 2 & 1 & 0 \\ 2 & 3 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} = I.
$$

最后，把 $A$ 分解成 $LU$（其中 $L = E^{-1}$）：

$$
\begin{bmatrix} 1 & 3 & 0 \\ 2 & 4 & 0 \\ 2 & 0 & 1 \end{bmatrix} = A = LU = \begin{bmatrix} 1 & 0 & 0 \\ 2 & 1 & 0 \\ 2 & 3 & 1 \end{bmatrix} \begin{bmatrix} 1 & 3 & 0 \\ 0 & -2 & 0 \\ 0 & 0 & 1 \end{bmatrix}.
$$

</details>

## 习题 4.2

（教材第 2.6 节第 13 题）对下面的对称矩阵求出 $L$ 和 $U$：

$$
A = \begin{bmatrix} a & a & a & a \\ a & b & b & b \\ a & b & c & c \\ a & b & c & d \end{bmatrix}.
$$

为了得到有四个主元的 $A = LU$，$a$、$b$、$c$、$d$ 要满足哪四个条件？

<details>
<summary>解答</summary>

消元时先从第 2–4 行减去第 1 行，再从第 3–4 行减去第 2 行，最后从第 4 行减去第 3 行，结果就是 $U$。所有的乘数 $\ell_{ij}$ 都等于 1，所以 $L$ 是对角线及其下方全是 1 的下三角矩阵。

$$
A \longrightarrow \begin{bmatrix} a & a & a & a \\ 0 & b-a & b-a & b-a \\ 0 & b-a & c-a & c-a \\ 0 & b-a & c-a & d-a \end{bmatrix} \longrightarrow \begin{bmatrix} a & a & a & a \\ 0 & b-a & b-a & b-a \\ 0 & 0 & c-b & c-b \\ 0 & 0 & c-b & d-b \end{bmatrix}
$$

$$
\longrightarrow \begin{bmatrix} a & a & a & a \\ 0 & b-a & b-a & b-a \\ 0 & 0 & c-b & c-b \\ 0 & 0 & 0 & d-c \end{bmatrix} = U, \qquad L = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 1 & 1 & 0 & 0 \\ 1 & 1 & 1 & 0 \\ 1 & 1 & 1 & 1 \end{bmatrix}.
$$

主元是 $U$ 对角线上的非零元素。所以满足下面四个条件时有四个主元：$a \ne 0$，$b \ne a$，$c \ne b$，$d \ne c$。

</details>
