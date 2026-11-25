# 习题：矩阵乘法与逆矩阵

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 3.1

把 $AB$ 与 $AC$ 相加，再与 $A(B + C)$ 比较：

$$
A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}, \quad B = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}, \quad C = \begin{bmatrix} 0 & 0 \\ 5 & 6 \end{bmatrix}.
$$

<details>
<summary>解答</summary>

先把 $AB$ 与 $AC$ 相加：

$$
AB = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 3 & 0 \end{bmatrix}, \qquad AC = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} \begin{bmatrix} 0 & 0 \\ 5 & 6 \end{bmatrix} = \begin{bmatrix} 10 & 12 \\ 20 & 24 \end{bmatrix}
$$

$$
\Longrightarrow AB + AC = \begin{bmatrix} 1 & 0 \\ 3 & 0 \end{bmatrix} + \begin{bmatrix} 10 & 12 \\ 20 & 24 \end{bmatrix} = \begin{bmatrix} 11 & 12 \\ 23 & 24 \end{bmatrix}.
$$

再计算 $A(B + C)$：

$$
B + C = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix} + \begin{bmatrix} 0 & 0 \\ 5 & 6 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 5 & 6 \end{bmatrix}
$$

$$
\Longrightarrow A(B + C) = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 5 & 6 \end{bmatrix} = \begin{bmatrix} 11 & 12 \\ 23 & 24 \end{bmatrix} = AB + AC.
$$

所以 $AB + AC = A(B + C)$。

</details>

## 习题 3.2

（教材第 2.5 节第 24 题）对 $[\,U \ I\,]$ 做高斯—若尔当消元，求出上三角矩阵 $U^{-1}$：

$$
UU^{-1} = I: \qquad \begin{bmatrix} 1 & a & b \\ 0 & 1 & c \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} x_1 & x_2 & x_3 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}.
$$

<details>
<summary>解答</summary>

对 $[\,U \ I\,]$ 做行化简，得到 $[\,I \ U^{-1}\,]$，过程如下（$R_i$ 表示第 $i$ 行）：

$$
\left[\begin{array}{ccc|ccc} 1 & a & b & 1 & 0 & 0 \\ 0 & 1 & c & 0 & 1 & 0 \\ 0 & 0 & 1 & 0 & 0 & 1 \end{array}\right]
\xrightarrow[R_2 = R_2 - cR_3]{R_1 = R_1 - aR_2}
\left[\begin{array}{ccc|ccc} 1 & 0 & b - ac & 1 & -a & 0 \\ 0 & 1 & 0 & 0 & 1 & -c \\ 0 & 0 & 1 & 0 & 0 & 1 \end{array}\right]
$$

$$
\xrightarrow{R_1 = R_1 - (b - ac)R_3}
\left[\begin{array}{ccc|ccc} 1 & 0 & 0 & 1 & -a & ac - b \\ 0 & 1 & 0 & 0 & 1 & -c \\ 0 & 0 & 1 & 0 & 0 & 1 \end{array}\right] = [\,I \ U^{-1}\,].
$$

所以

$$
U^{-1} = \begin{bmatrix} 1 & -a & ac - b \\ 0 & 1 & -c \\ 0 & 0 & 1 \end{bmatrix}.
$$

（译注：原文第一步写作 $R_2 = R_2 - cR_2$、最后写作 $[\,I \ L^{-1}\,]$，应为 $R_2 = R_2 - cR_3$ 和 $[\,I \ U^{-1}\,]$，译文已更正。）

</details>
