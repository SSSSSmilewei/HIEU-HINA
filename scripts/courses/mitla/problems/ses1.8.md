# 习题：求解 Ax = b

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 8.1

（教材第 3.4 节第 13 题 a、b、d）解释为什么下面的说法都是错的：

a) 完全解是 $x_p$ 与 $x_n$ 的任意线性组合。

b) 方程组 $Ax = b$ 至多有一个特解。

c) 如果 $A$ 可逆，零空间中没有解 $x_n$。

<details>
<summary>解答</summary>

a) $x_p$ 的系数必须是 1。

b) 如果 $x_n \in N(A)$ 在 $A$ 的零空间中，$x_p$ 是一个特解，那么 $x_p + x_n$ 也是一个特解。

c) 零空间里总有 $x_n = 0$。

</details>

## 习题 8.2

（教材第 3.4 节第 28 题）设

$$
U = \begin{bmatrix} 1 & 2 & 3 \\ 0 & 0 & 4 \end{bmatrix}, \qquad c = \begin{bmatrix} 5 \\ 8 \end{bmatrix}.
$$

用高斯—若尔当消元法把矩阵 $[\,U \ 0\,]$ 和 $[\,U \ c\,]$ 化成 $[\,R \ 0\,]$ 和 $[\,R \ d\,]$。求解 $Rx = 0$ 和 $Rx = d$。

把求出的值代回方程 $Ux = 0$ 和 $Ux = c$，检查结果。

<details>
<summary>解答</summary>

先把 $[\,U \ 0\,]$ 化成 $[\,R \ 0\,]$：

$$
[\,U \ 0\,] = \left[\begin{array}{ccc|c} 1 & 2 & 3 & 0 \\ 0 & 0 & 4 & 0 \end{array}\right] \longrightarrow \left[\begin{array}{ccc|c} 1 & 2 & 3 & 0 \\ 0 & 0 & 1 & 0 \end{array}\right] \longrightarrow \left[\begin{array}{ccc|c} 1 & 2 & 0 & 0 \\ 0 & 0 & 1 & 0 \end{array}\right] = [\,R \ 0\,].
$$

再用回代求解 $Rx = 0$：

$$
\begin{bmatrix} 1 & 2 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \;\Longrightarrow\; \begin{aligned} x_1 + 2x_2 &= 0 \\ x_3 &= 0 \end{aligned} \;\Longrightarrow\; x = \begin{bmatrix} 2 \\ -1 \\ 0 \end{bmatrix},
$$

这里取了自由变量 $x_2 = -1$。（对所有 $c$，$cx$ 都是解。）

把它代入 $Ux = 0$，验证解是正确的：

$$
\begin{bmatrix} 1 & 2 & 3 \\ 0 & 0 & 4 \end{bmatrix} \begin{bmatrix} 2 \\ -1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}. \;\checkmark
$$

接着把 $[\,U \ c\,]$ 化成 $[\,R \ d\,]$：

$$
[\,U \ c\,] = \left[\begin{array}{ccc|c} 1 & 2 & 3 & 5 \\ 0 & 0 & 4 & 8 \end{array}\right] \longrightarrow \left[\begin{array}{ccc|c} 1 & 2 & 3 & 5 \\ 0 & 0 & 1 & 2 \end{array}\right] \longrightarrow \left[\begin{array}{ccc|c} 1 & 2 & 0 & -1 \\ 0 & 0 & 1 & 2 \end{array}\right] = [\,R \ d\,].
$$

用回代求解 $Rx = d$：

$$
\begin{bmatrix} 1 & 2 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix} = \begin{bmatrix} -1 \\ 2 \end{bmatrix} \;\Longrightarrow\; \begin{aligned} x_1 + 2x_2 &= -1 \\ x_3 &= 2 \end{aligned} \;\Longrightarrow\; x = \begin{bmatrix} -3 \\ 1 \\ 2 \end{bmatrix},
$$

这里取了自由变量 $x_2 = 1$。

最后把它代入方程 $Ux = c$，验证解是正确的：

$$
\begin{bmatrix} 1 & 2 & 3 \\ 0 & 0 & 4 \end{bmatrix} \begin{bmatrix} -3 \\ 1 \\ 2 \end{bmatrix} = \begin{bmatrix} 5 \\ 8 \end{bmatrix}. \;\checkmark
$$

</details>

## 习题 8.3

（教材第 3.4 节第 36 题）如果对每个 $b$，$Ax = b$ 与 $Cx = b$ 的（完全）解都相同，那么 $A = C$ 一定成立吗？

<details>
<summary>解答</summary>

**成立。** 要验证矩阵 $A = C$，只需验证对所有大小合适的向量 $y$ 都有 $Ay = Cy$（或者只对标准基向量验证，因为乘以它们正好「取出」矩阵的各列）。设 $y$ 是任意一个大小合适的向量，令 $b = Ay$。那么 $y$ 显然是 $Ax = b$ 的解，按假设它也必须是 $Cx = b$ 的解；也就是说 $Cy = b = Ay$。

</details>
