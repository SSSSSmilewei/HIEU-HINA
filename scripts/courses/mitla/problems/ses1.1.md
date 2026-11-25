# 习题：线性方程组的几何解释

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 1.1

（教材 Introduction to Linear Algebra 第 1.3 节第 4 题）找出一个组合 $x_1 w_1 + x_2 w_2 + x_3 w_3$，使它等于零向量：

$$
w_1 = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}, \quad w_2 = \begin{bmatrix} 4 \\ 5 \\ 6 \end{bmatrix}, \quad w_3 = \begin{bmatrix} 7 \\ 8 \\ 9 \end{bmatrix}.
$$

这些向量是（线性无关的）（线性相关的）。这三个向量位于同一个 ______ 中。以它们为列的矩阵 $W$ 不可逆。

<details>
<summary>解答</summary>

可以直接观察到 $w_1 + w_3 - 2w_2 = 0$；也可以联立求解方程组：

$$
\begin{aligned} 1x_1 + 4x_2 + 7x_3 &= 0 \\ 2x_1 + 5x_2 + 8x_3 &= 0 \\ 3x_1 + 6x_2 + 9x_3 &= 0 \end{aligned}
$$

用第 2 个方程减去第 1 个方程的 2 倍，得到 $-3x_2 - 6x_3 = 0$。用第 3 个方程减去第 1 个方程的 3 倍，得到 $-6x_2 - 12x_3 = 0$。它与前一个方程等价，这让我们猜想这些向量是线性相关的。这时可以试着取 $x_2 = -2$、$x_3 = 1$，就得到上面观察到的答案：

$$
x_1 = 1,\ x_2 = -2,\ x_3 = 1, \qquad w_1 - 2w_2 + w_3 = 0.
$$

这些向量是**线性相关**的，因为它们有一个组合等于零向量。

这三个向量位于同一个**平面**中。

</details>

## 习题 1.2

计算乘积：

$$
\begin{bmatrix} 1 & 2 & 0 \\ 2 & 0 & 3 \\ 4 & 1 & 1 \end{bmatrix} \begin{bmatrix} 3 \\ -2 \\ 1 \end{bmatrix}.
$$

<details>
<summary>解答</summary>

$$
\begin{bmatrix} 1 \cdot 3 + 2 \cdot (-2) + 0 \cdot 1 \\ 6 + 0 + 3 \\ 12 - 2 + 1 \end{bmatrix} = \begin{bmatrix} -1 \\ 9 \\ 11 \end{bmatrix}.
$$

</details>

## 习题 1.3

判断对错：一个 3 × 2 矩阵 $A$ 乘以一个 2 × 3 矩阵 $B$，得到一个 3 × 3 矩阵 $AB$。如果是错的，写出一句类似的、正确的话。

<details>
<summary>解答</summary>

这句话是**对的**。两个矩阵相乘时，$A$ 的列数必须等于 $B$ 的行数。乘积 $AB$ 的行数与第一个矩阵相同，列数与第二个矩阵相同：

$$
A\,(m \times n) \text{ 乘以 } B\,(n \times p) \text{ 等于 } AB\,(m \times p).
$$

</details>
