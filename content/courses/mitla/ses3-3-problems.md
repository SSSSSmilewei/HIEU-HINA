# 习题：正定矩阵与极小值

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 27.1

（教材第 6.5 节第 33 题）当 $A$ 和 $B$ 都是对称正定矩阵时，$AB$ 可能连对称都不是，但它的特征值仍然都是正的。从 $ABx = \lambda x$ 出发，与 $Bx$ 做点积，然后证明 $\lambda > 0$。

<details>
<summary>解答</summary>

$$
\begin{aligned}
ABx &= \lambda x \\
(ABx)^T Bx &= (\lambda x)^T Bx \\
(Bx)^T A^T Bx &= \lambda x^T Bx \\
(Bx)^T A (Bx) &= \lambda (x^T Bx),
\end{aligned}
$$

这里用到 $A^T = A$，因为 $A$ 是对称的。由于 $A$ 是正定的，$(Bx)^T A(Bx) > 0$；由于 $B$ 是正定的，$x^T Bx > 0$。所以 $\lambda$ 也一定是正的。

</details>

## 习题 27.2

求与矩阵 $\begin{bmatrix} 1 & 5 \\ 7 & 9 \end{bmatrix}$ 对应的二次型。这个函数 $f(x, y)$ 是总是正的、总是负的，还是有时正有时负？

<details>
<summary>解答</summary>

计算 $x^T Ax$ 得到二次型：

$$
f(x, y) = \begin{bmatrix} x & y \end{bmatrix} \begin{bmatrix} 1 & 5 \\ 7 & 9 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = x(x + 5y) + y(7x + 9y) = x^2 + 12xy + 9y^2.
$$

这个式子可以是正的，例如 $y = 0$、$x \ne 0$ 时。

它有时也是负的，因为 $A$（更准确地说，对应的对称矩阵 $\begin{bmatrix} 1 & 6 \\ 6 & 9 \end{bmatrix}$）不是正定的。例如 $f(2, -2) = -8$。所以与矩阵 $A$ 对应的二次型**有时正、有时负**。得出这个结论的另一种方法是注意到 $\begin{bmatrix} 1 & 6 \\ 6 & 9 \end{bmatrix}$ 的行列式 $9 - 36 = -27$ 是负的，所以它不是正定的。

（译注：原文用 $\det A = -26$ 作论证。二次型只取决于矩阵的对称部分 $\begin{bmatrix} 1 & 6 \\ 6 & 9 \end{bmatrix}$，用它的行列式判断更准确；结论不变。）

</details>
