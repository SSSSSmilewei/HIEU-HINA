# 习题：矩阵消元

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 2.1

在下面这个二元线性方程组里，用消元法时应该从第二个方程中减去第一个方程的几倍？把方程组写成矩阵形式，做消元（主元是什么？），再用回代求出解。看答案之前，先自己检验一下结果。

$$
\begin{aligned} 2x + 3y &= 5 \\ 6x + 15y &= 12 \end{aligned}
$$

<details>
<summary>解答</summary>

从第二个方程中减去第一个方程的 **3 倍**，消去 $6x$。

按一般形式 $Ax = b$ 写成矩阵形式：

$$
\begin{bmatrix} 2 & 3 \\ 6 & 15 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 5 \\ 12 \end{bmatrix}.
$$

然后对矩阵 $A$ 做消元。利用第一个主元（$A$ 左上角的 2），从第二行减去第一行的 3 倍：

$$
A = \begin{bmatrix} 2 & 3 \\ 6 & 15 \end{bmatrix} \longrightarrow U = \begin{bmatrix} 2 & 3 \\ 0 & 6 \end{bmatrix},
$$

其中 $U$ 是上三角矩阵，**主元是 2 和 6**。对右边的 $b = (5, 12)$ 做同样的运算，得到形如 $Ux = c$ 的新方程：

$$
\begin{bmatrix} 2 & 3 \\ 0 & 6 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 5 \\ -3 \end{bmatrix}.
$$

用回代求解这个新方程：

$$
6y = -3 \;\Longrightarrow\; y = -\tfrac{1}{2},
$$

$$
2x + 3\left(-\tfrac{1}{2}\right) = 5 \;\Longrightarrow\; 2x = 5 + \tfrac{3}{2} = \tfrac{13}{2} \;\Longrightarrow\; x = \tfrac{13}{4}.
$$

我们的解满足第一个方程；再检查它是否满足第二个方程，作为验算：

$$
6x + 15y = 6\left(\tfrac{13}{4}\right) + 15\left(-\tfrac{1}{2}\right) = \tfrac{78 - 30}{4} = 12. \;\checkmark
$$

</details>

## 习题 2.2

（教材第 2.3 节第 29 题）找出一个三角矩阵 $E$，把「帕斯卡矩阵」化成一个更小的帕斯卡矩阵：

$$
E \begin{bmatrix} 1 & 0 & 0 & 0 \\ 1 & 1 & 0 & 0 \\ 1 & 2 & 1 & 0 \\ 1 & 3 & 3 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 1 & 1 & 0 \\ 0 & 1 & 2 & 1 \end{bmatrix}.
$$

哪个矩阵 $M$（几个 $E$ 的乘积）能把帕斯卡矩阵一直化成 $I$？

<details>
<summary>解答</summary>

这个矩阵是

$$
E = \begin{bmatrix} 1 & 0 & 0 & 0 \\ -1 & 1 & 0 & 0 \\ 0 & -1 & 1 & 0 \\ 0 & 0 & -1 & 1 \end{bmatrix}.
$$

可以用矩阵

$$
\begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & -1 & 1 & 0 \\ 0 & 0 & -1 & 1 \end{bmatrix}
$$

消去第二列，再用矩阵

$$
\begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & -1 & 1 \end{bmatrix}
$$

消去第三列。把它们乘在一起，得到

$$
M = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & -1 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & -1 & 1 & 0 \\ 0 & 0 & -1 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & 0 \\ -1 & 1 & 0 & 0 \\ 0 & -1 & 1 & 0 \\ 0 & 0 & -1 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ -1 & 1 & 0 & 0 \\ 1 & -2 & 1 & 0 \\ -1 & 3 & -3 & 1 \end{bmatrix}.
$$

因为 $M$ 把帕斯卡矩阵化成了 $I$，所以 $M$ 一定就是帕斯卡矩阵的逆矩阵！

</details>
