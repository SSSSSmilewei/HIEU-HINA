# 习题：复矩阵与快速傅里叶变换

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 26.1

计算矩阵 $F_2$。

<details>
<summary>解答</summary>

$F_2 = \begin{bmatrix} 1 & 1 \\ 1 & w \end{bmatrix}$，其中 $w = e^{i2\pi/2} = -1$。所以

$$
F_2 = \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}.
$$

</details>

## 习题 26.2

求分解

$$
F_4 = \begin{bmatrix} I & D \\ I & -D \end{bmatrix} \begin{bmatrix} F_2 & \\ & F_2 \end{bmatrix} P
$$

中用到的矩阵 $D$ 和 $P$。提示：$D$ 是用 1 的四次方根（而不是平方根）构造的。用乘法检验你的答案。

<details>
<summary>解答</summary>

上一题已经算出 $F_2 = \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}$。

$D = \begin{bmatrix} 1 & 0 \\ 0 & i \end{bmatrix}$ 包含 1 的前两个四次方根（而 $-D$ 包含另外两个，$-1$ 和 $-i$）。

$P$ 是一个置换矩阵，它重新排列输入向量的分量，让偶数分量排在前面。对 $F_4$ 来说，就是交换第二个和第三个分量（$x_1$ 和 $x_2$）：

$$
P\begin{bmatrix} x_0 \\ x_1 \\ x_2 \\ x_3 \end{bmatrix} = \begin{bmatrix} x_0 \\ x_2 \\ x_1 \\ x_3 \end{bmatrix}, \qquad P = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}.
$$

最后用乘法检验：

$$
\begin{bmatrix} I & D \\ I & -D \end{bmatrix} \begin{bmatrix} F_2 & \\ & F_2 \end{bmatrix} P = \begin{bmatrix} 1 & 0 & 1 & 0 \\ 0 & 1 & 0 & i \\ 1 & 0 & -1 & 0 \\ 0 & 1 & 0 & -i \end{bmatrix} \begin{bmatrix} 1 & 1 & 0 & 0 \\ 1 & -1 & 0 & 0 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 1 & -1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}
$$

$$
= \begin{bmatrix} 1 & 0 & 1 & 0 \\ 0 & 1 & 0 & i \\ 1 & 0 & -1 & 0 \\ 0 & 1 & 0 & -i \end{bmatrix} \begin{bmatrix} 1 & 0 & 1 & 0 \\ 1 & 0 & -1 & 0 \\ 0 & 1 & 0 & 1 \\ 0 & 1 & 0 & -1 \end{bmatrix} = \begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & i & -1 & -i \\ 1 & -1 & 1 & -1 \\ 1 & -i & -1 & i \end{bmatrix} = F_4. \;\checkmark
$$

（译注：原文说「交换第一个和第二个分量」，按从 0 开始的编号，被交换的是 $x_1$ 和 $x_2$，即第二个和第三个分量，译文已更正。）

</details>
