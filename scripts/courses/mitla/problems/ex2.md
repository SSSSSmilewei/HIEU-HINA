# 考试 2：试卷与解答

> 本页是 MIT 开放式课程 18.06SC 单元 2 考试及官方解答的中文翻译，原文见页面下方的「试卷原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

**建议的做法**：找一段完整的 50 分钟，不看讲义，像真正考试一样做完四道题，再展开解答对照、给自己打分（满分 100 分）。

## 第 1 题（24 分）

设 $q_1, q_2, q_3$ 是 $\mathbb{R}^3$ 中的标准正交向量。求下列 3 × 3 行列式的**所有可能值**，每题用一句话说明你的思路。

(a) $\det\begin{bmatrix} q_1 & q_2 & q_3 \end{bmatrix} = $

(b) $\det\begin{bmatrix} q_1 + q_2 & q_2 + q_3 & q_3 + q_1 \end{bmatrix} = $

(c) $\det\begin{bmatrix} q_1 & q_2 & q_3 \end{bmatrix}$ 乘以 $\det\begin{bmatrix} q_2 & q_3 & q_1 \end{bmatrix} = $

<details>
<summary>解答</summary>

(a) 各列标准正交的方阵（「正交矩阵」）的行列式都是 $\pm 1$。

(b) 有两种做法：

（1）行列式**对每一列都是线性的**：

$$
\begin{aligned}
\det\begin{bmatrix} q_1 + q_2 & q_2 + q_3 & q_3 + q_1 \end{bmatrix}
&= \det\begin{bmatrix} q_1 & q_2 + q_3 & q_3 + q_1 \end{bmatrix} + \det\begin{bmatrix} q_2 & q_2 + q_3 & q_3 + q_1 \end{bmatrix} \\
&= \det\begin{bmatrix} q_1 & q_2 + q_3 & q_3 \end{bmatrix} + \det\begin{bmatrix} q_2 & q_3 & q_3 + q_1 \end{bmatrix} \\
&= \det\begin{bmatrix} q_1 & q_2 & q_3 \end{bmatrix} + \det\begin{bmatrix} q_2 & q_3 & q_1 \end{bmatrix}.
\end{aligned}
$$

这两个行列式相等（见 (c)），所以总的行列式是 $\pm 2$。

（2）也可以**用列变换化简**（列变换和行变换对行列式的作用相同）：

$$
\begin{aligned}
\det\begin{bmatrix} q_1 + q_2 & q_2 + q_3 & q_3 + q_1 \end{bmatrix}
&= \det\begin{bmatrix} q_1 + q_2 & -q_1 + q_3 & q_3 + q_1 \end{bmatrix} \\
&= \det\begin{bmatrix} q_1 + q_2 & -q_1 + q_3 & 2q_3 \end{bmatrix} \\
&= 2\det\begin{bmatrix} q_1 + q_2 & -q_1 + q_3 & q_3 \end{bmatrix} \\
&= 2\det\begin{bmatrix} q_1 + q_2 & -q_1 & q_3 \end{bmatrix} \\
&= 2\det\begin{bmatrix} q_2 & -q_1 & q_3 \end{bmatrix} \\
&= 2\det\begin{bmatrix} q_1 & q_2 & q_3 \end{bmatrix}.
\end{aligned}
$$

同样，无论 $\det\begin{bmatrix} q_1 & q_2 & q_3 \end{bmatrix}$ 是多少，这个行列式都是它的两倍，即 $\pm 2$。

(c) 第二个矩阵的各列是第一个矩阵各列的一个**偶**置换（先交换 $q_1$、$q_2$，再交换 $q_2$、$q_3$），所以它的行列式与第一个矩阵**相同**。无论第一个矩阵的行列式是 $+1$ 还是 $-1$，乘积都是 $+1$。

</details>

## 第 2 题（24 分）

设我们在 21 个等间隔的时刻 $t = -10, -9, \ldots, 9, 10$ 做测量。除了中间时刻 $t = 0$ 的 $b_{11} = 1$ 以外，所有测量值都是 $b_i = 0$。

(a) 用最小二乘法，用直线 $C + Dt$ 拟合这 21 个点，最好的 $\widehat{C}$ 和 $\widehat{D}$ 是什么？

(b) 你是把向量 $b$ 投影到哪个子空间上？（*给出一组基。*）求一个与这个子空间垂直的非零向量。

<details>
<summary>解答</summary>

(a) 如果直线正好经过这 21 个点，那么 21 个方程

$$
\begin{bmatrix} 1 & -10 \\ 1 & -9 \\ \vdots & \vdots \\ 1 & 0 \\ \vdots & \vdots \\ 1 & 10 \end{bmatrix} \begin{bmatrix} C \\ D \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ \vdots \\ 1 \\ \vdots \\ 0 \end{bmatrix}
$$

就能精确求解。既然不能精确解出 $Ax = b$，我们就求最小二乘解 $A^TA\hat{x} = A^Tb$：

$$
\begin{bmatrix} 21 & 0 \\ 0 & 770 \end{bmatrix} \begin{bmatrix} \widehat{C} \\ \widehat{D} \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}.
$$

所以最佳拟合直线是水平线 $\widehat{C} = \frac{1}{21}$，$\widehat{D} = 0$。

（$770 = 2(1^2 + 2^2 + \cdots + 10^2)$。）

(b) 我们是把 $b$ 投影到上面 $A$ 的列空间上（一组基：$\begin{bmatrix} 1 & \cdots & 1 \end{bmatrix}^T$ 和 $\begin{bmatrix} -10 & \cdots & 10 \end{bmatrix}^T$）。与这个子空间垂直的向量有很多；其中一个是误差向量

$$
e = b - P_Ab = \frac{1}{21}\begin{bmatrix} (\text{十个 } -1) & 20 & (\text{十个 } -1) \end{bmatrix}^T.
$$

</details>

## 第 3 题（9 + 12 + 9 分）

Gram-Schmidt 方法由 $\mathbb{R}^5$ 中线性无关的向量 $a_1, a_2, a_3$ 得到标准正交向量 $q_1, q_2, q_3$。把这些向量分别放进 5 × 3 矩阵 $Q$ 和 $A$ 的各列。

(a) 用 $Q$ 和 $A$ 写出投影到 $Q$ 和 $A$ 的列空间上的投影矩阵 $P_Q$ 和 $P_A$ 的公式。

(b) ***$P_Q = P_A$ 吗？为什么？$P_Q$ 乘以 $Q$ 等于什么？$\det P_Q$ 等于多少？***

(c) 设 $a_4$ 是一个新向量，$a_1, a_2, a_3, a_4$ 线性无关。下面哪一个（如果有的话）是新的 Gram-Schmidt 向量 $q_4$？（$P_A$ 和 $P_Q$ 同上。）

$$
1.\ \frac{P_Qa_4}{\|P_Qa_4\|} \qquad
2.\ \frac{a_4 - \frac{a_1^Ta_4}{a_1^Ta_1}a_1 - \frac{a_2^Ta_4}{a_2^Ta_2}a_2 - \frac{a_3^Ta_4}{a_3^Ta_3}a_3}{\|\text{该向量的长度}\|} \qquad
3.\ \frac{a_4 - P_Aa_4}{\|a_4 - P_Aa_4\|}
$$

<details>
<summary>解答</summary>

(a) $P_A = A(A^TA)^{-1}A^T$，$P_Q = Q(Q^TQ)^{-1}Q^T = QQ^T$。

(b) $P_A = P_Q$，因为两个投影都投影到同一个子空间上。（*有人用了笨办法：把 $A = QR$ 代入投影公式再化简。那样也行。*）$P_QQ = Q$，因为 $Q$ 的各列本来就在列空间里。行列式是零，因为 $P_Q$ 是奇异的（所有不是单位矩阵的投影矩阵都是奇异的）：所有与 $Q$ 的列空间正交的向量都被投影成 0。

（译注：原文解答没有写出「$P_Q$ 乘以 $Q$」这一问的答案，译文补上了。）

(c) 答案：第 3 个。（第 2 个很有迷惑性，如果把其中的 $a_i$ 换成 $q_i$，它就是对的。但这些 $a_i$ 并不互相正交！）

</details>

## 第 4 题（22 分）

设一个 4 × 4 矩阵的第一行和第一列的元素都是同一个数 $\times$。其余 9 个数可以是任何数，比如 $1, 5, 7, 2, 3, 99, \pi, e, 4$。

$$
A = \begin{bmatrix} \times & \times & \times & \times \\ \times & & & \\ \times & & \text{任意数} & \\ \times & & & \end{bmatrix}
$$

(a) $A$ 的行列式是 $\times$ 的多项式。这个多项式的次数最大可能是多少？**说明理由。**

(b) 如果那 9 个数组成单位矩阵 $I$，$\det A$ 是多少？$\times$ 取哪些值时 $\det A = 0$？

$$
A = \begin{bmatrix} \times & \times & \times & \times \\ \times & 1 & 0 & 0 \\ \times & 0 & 1 & 0 \\ \times & 0 & 0 & 1 \end{bmatrix}
$$

<details>
<summary>解答</summary>

(a) 行列式的大公式中的每一项，都从每一行、每一列各取一个元素，所以最多只能取到两个 $\times$（一个来自第一行，一个来自第一列；左上角那个同时属于两者），行列式的次数是 2。

(b) 可以用余子式展开求出；下面是另一种做法。先从第一列提出因子 $\times$，再用第一列减去后三列：

$$
\det A = \times\det\begin{bmatrix} 1 & \times & \times & \times \\ 1 & 1 & 0 & 0 \\ 1 & 0 & 1 & 0 \\ 1 & 0 & 0 & 1 \end{bmatrix}
= \times\det\begin{bmatrix} 1 - 3\times & \times & \times & \times \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}
= \times(1 - 3\times)\det\begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}
= \times(1 - 3\times).
$$

当 $\times = 0$ 或 $\times = \frac13$ 时它等于零。

</details>
