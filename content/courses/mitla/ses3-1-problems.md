# 习题：对称矩阵与正定性

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 25.1

（教材第 6.4 节第 10 题）下面是一个「证明」所有实矩阵的特征值都是实数的快速论证：

**错误的证明**：由 $Ax = \lambda x$ 得 $x^T Ax = \lambda x^T x$，所以 $\lambda = \dfrac{x^T Ax}{x^T x}$ 是实数。

这个证明里有一个没有根据的隐含假设。用 90° 旋转矩阵

$$
\begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}
$$

以及 $\lambda = i$、$x = (i, 1)$ 逐步检验，找出漏洞。

<details>
<summary>解答</summary>

很容易验证 $Ax = \lambda x = \begin{bmatrix} -1 \\ i \end{bmatrix}$。接着检验对 90° 旋转矩阵，$x^T Ax = \lambda x^T x$ 是否成立：

$$
x^T Ax = \begin{bmatrix} i & 1 \end{bmatrix} \begin{bmatrix} -1 \\ i \end{bmatrix} = 0, \qquad \lambda x^T x = i \begin{bmatrix} i & 1 \end{bmatrix} \begin{bmatrix} i \\ 1 \end{bmatrix} = 0,
$$

所以 $x^T Ax = \lambda x^T x$ 成立。✓

注意 $x^T x = 0$。由于下一步（也是最后一步）要除以这一项，隐含的假设一定是 $x^T x \ne 0$。如果 $x = (a, b)$，那么

$$
x^T x = \begin{bmatrix} a & b \end{bmatrix} \begin{bmatrix} a \\ b \end{bmatrix} = a^2 + b^2.
$$

这个「证明」假设特征向量各分量的平方和不能为零：$a^2 + b^2 \ne 0$。如果分量是复数，这可能不成立。（正确的做法是用 $\bar{x}^T x = |a|^2 + |b|^2$。）

</details>

## 习题 25.2

（教材第 6.5 节第 32 题）一个由非奇异矩阵构成的**群**：如果它包含 $A$ 和 $B$，就一定包含 $AB$ 和 $A^{-1}$。「乘积和逆都留在群里。」下面哪些是群？

a) 正定对称矩阵 $A$；

b) 正交矩阵 $Q$；

c) 某个固定矩阵 $A$ 的所有指数 $e^{tA}$；

d) 行列式为 1 的矩阵 $D$。

<details>
<summary>解答</summary>

a) 正定对称矩阵**不**构成群。举一个反例：两个正定对称矩阵 $A$、$B$，它们的乘积不是正定对称矩阵。

$$
A = \begin{bmatrix} 2 & 1 \\ 1 & 1 \end{bmatrix}, \quad B = \begin{bmatrix} 1 & 1/2 \\ 1/2 & 1 \end{bmatrix} \quad\Longrightarrow\quad AB = \begin{bmatrix} 2.5 & 2 \\ 1.5 & 1.5 \end{bmatrix},
$$

它不是对称矩阵。

b) 正交矩阵**构成**群。如果 $A$、$B$ 是正交矩阵，那么

$$
A^T A = I \Rightarrow A^{-1} = A^T \Rightarrow A^{-1} \text{ 是正交矩阵},
$$

$$
B^T B = I \Rightarrow (AB)^T AB = B^T A^T A B = B^T B = I \Rightarrow AB \text{ 是正交矩阵}.
$$

c) 固定矩阵 $A$ 的指数 $e^{tA}$ **构成**群。对元素 $e^{pA}$ 和 $e^{qA}$：

$$
(e^{pA})^{-1} = e^{-pA} \text{ 具有 } e^{tA} \text{ 的形式}, \qquad e^{pA}e^{qA} = e^{(p+q)A} \text{ 具有 } e^{tA} \text{ 的形式}.
$$

d) 行列式为 1 的矩阵 $D$ **构成**群。如果 $\det A = 1$，那么 $\det A^{-1} = 1$。如果矩阵 $A$、$B$ 的行列式都是 1，它们的乘积的行列式也是 1：

$$
\det(AB) = \det(A)\det(B) = 1.
$$

</details>
