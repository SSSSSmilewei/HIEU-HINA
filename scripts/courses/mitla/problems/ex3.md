# 考试 3：试卷与解答

> 本页是 MIT 开放式课程 18.06SC 单元 3 考试及官方解答的中文翻译，原文见页面下方的「试卷原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

**建议的做法**：找一段完整的 50 分钟，不看讲义，像真正考试一样做完三道题，再展开解答对照、给自己打分（满分 100 分）。

## 第 1 题（34 分）

(a) 如果方阵 $A$ 的 SVD 中全部 $n$ 个**奇异值**都等于 1，$A$ 属于哪些基本类型的矩阵？（奇异矩阵、对称矩阵、正交矩阵、正定或半正定矩阵、对角矩阵）

(b) 设 $H$ 的（标准正交的）各列是 $B$ 的特征向量：

$$
H = \frac12\begin{bmatrix} 1 & 1 & -1 & -1 \\ 1 & -1 & -1 & 1 \\ 1 & 1 & 1 & 1 \\ 1 & -1 & 1 & -1 \end{bmatrix}, \qquad H^{-1} = H^T.
$$

$B$ 的特征值是 $\lambda = 0, 1, 2, 3$。把 $B$ 写成 3 个具体矩阵的乘积。把 $C = (B + I)^{-1}$ 写成 3 个矩阵的乘积。

(c) 按 (a) 中的列表，$B$ 和 $C$ 分别属于哪些基本类型的矩阵？（$B$ 和 $C$ 分开回答。）

<details>
<summary>解答</summary>

(a) 如果 $\Sigma = I$，那么 $A = UV^T$ = 正交矩阵的乘积 = 正交矩阵。

第二种证明：所有 $\sigma_i = 1$ 意味着 $A^TA = I$。所以 $A$ 是正交矩阵。

（$A$ **永远**不是奇异的，但也不一定对称——例如取 $U = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$、$V = I$。这个例子也说明它不一定是对角的，也不一定正定或半正定。）

(b) $B = H\Lambda H^{-1}$，其中 $\Lambda = \begin{bmatrix} 0 & & & \\ & 1 & & \\ & & 2 & \\ & & & 3 \end{bmatrix}$。

$(B + I)^{-1} = H(\Lambda + I)^{-1}H^{-1}$（特征向量相同），其中 $(\Lambda + I)^{-1} = \begin{bmatrix} 1 & & & \\ & 1/2 & & \\ & & 1/3 & \\ & & & 1/4 \end{bmatrix}$。

(c) $B$ 是奇异的、对称的、半正定的。

$C$ 是对称正定的。

</details>

## 第 2 题（33 分）

(a) 求 $A$ 的三个特征值，以及一个特征向量矩阵 $S$：

$$
A = \begin{bmatrix} -1 & 2 & 4 \\ 0 & 0 & 5 \\ 0 & 0 & 1 \end{bmatrix}.
$$

(b) 解释为什么 $A^{1001} = A$。$A^{1000} = I$ 吗？求 $e^{At}$ 的三个对角元。

(c) （同一个 $A$ 的）矩阵 $A^TA$ 是

$$
A^TA = \begin{bmatrix} 1 & -2 & -4 \\ -2 & 4 & 8 \\ -4 & 8 & 42 \end{bmatrix}.
$$

$A^TA$ 有几个正特征值？几个零特征值？几个负特征值？（不要算出来，但要说明理由。）$A^TA$ 与 $A$ 的特征向量相同吗？

<details>
<summary>解答</summary>

(a) 因为 $A$ 是三角矩阵，特征值就是 $-1, 0, 1$。

$$
\lambda = -1 \text{ 对应 } x = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \qquad
\lambda = 0 \text{ 对应 } x = \begin{bmatrix} 2 \\ 1 \\ 0 \end{bmatrix}, \qquad
\lambda = 1 \text{ 对应 } x = \begin{bmatrix} 7 \\ 5 \\ 1 \end{bmatrix}.
$$

这些向量 $x$ 就是 $S$ 的各列（$S$ 是上三角矩阵！）。

(b) $A = S\Lambda S^{-1}$，$A^{1001} = S\Lambda^{1001}S^{-1}$。注意 $\Lambda^{1001} = \Lambda$，而 $A^{1000} \ne I$（$A$ 是奇异的）（$0^{1000} = 0 \ne 1$）。

$e^{At}$ 的对角元是 $e^{-1t}$、$e^{0t} = 1$、$e^t$。*用级数证明*：$\sum_0^\infty (At)^n/n!$ 中都是三角矩阵，所以对角线上是 $\sum(-t)^n/n! = e^{-t}$、$\sum 0^n/n! = 1$、$\sum t^n/n! = e^t$。

*用 $S\Lambda S^{-1}$ 证明*：

$$
e^{At} = Se^{\Lambda t}S^{-1} = \begin{bmatrix} 1 & \times & \times \\ 0 & 1 & \times \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} e^{-t} & & \\ & 1 & \\ & & e^t \end{bmatrix} \begin{bmatrix} 1 & \times & \times \\ 0 & 1 & \times \\ 0 & 0 & 1 \end{bmatrix}.
$$

（这里 $\times$ 表示不关心的元素；两个三角矩阵的对角元都是 1。）

(c) $A^TA$ 有 2 个正特征值（它的秩是 2，而它的特征值永远不会是负的）。

有一个特征值是零，因为 $A^TA$ 是奇异的。而 $3 - 2 = 1$。

（或者：$A^TA$ 是对称矩阵，所以特征值的正负号与主元相同。做消元：主元是 1、0 和 $42 - 16 = 26$。）

（译注：原文解答没有回答最后一问。答案是**不相同**：$A^TA$ 是对称矩阵，它的特征向量可以取成两两正交的；而 $A$ 的特征向量 $(1, 0, 0)$、$(2, 1, 0)$、$(7, 5, 1)$ 并不互相正交。例如 $A^TA(1, 0, 0) = (1, -2, -4)$，不是 $(1, 0, 0)$ 的倍数。）

</details>

## 第 3 题（33 分）

设 $n \times n$ 矩阵 $A$ 有 $n$ 个标准正交的特征向量 $q_1, \ldots, q_n$ 和 $n$ 个正特征值 $\lambda_1, \ldots, \lambda_n$。于是 $Aq_j = \lambda_jq_j$。

(a) $A^{-1}$ 的特征值和特征向量是什么？*证明你的答案是对的。*

(b) 任何向量 $b$ 都是这些特征向量的组合：

$$
b = c_1q_1 + c_2q_2 + \cdots + c_nq_n.
$$

利用各个 $q$ 的正交性，$c_1$ 的简便公式是什么？

(c) $Ax = b$ 的解也是这些特征向量的组合：

$$
A^{-1}b = d_1q_1 + d_2q_2 + \cdots + d_nq_n.
$$

$d_1$ 的简便公式是什么？即使你没做出 (b)，也可以用其中的各个 $c$。

<details>
<summary>解答</summary>

(a) $A^{-1}$ 的特征值是 $\dfrac{1}{\lambda_j}$，特征向量不变：

$$
Aq_j = \lambda_jq_j \longrightarrow q_j = \lambda_jA^{-1}q_j \longrightarrow A^{-1}q_j = \frac{1}{\lambda_j}q_j.
$$

(b) 用 $q_1^T$ 乘 $b = c_1q_1 + \cdots + c_nq_n$。由正交性得 $q_1^Tb = c_1q_1^Tq_1$，所以

$$
c_1 = \frac{q_1^Tb}{q_1^Tq_1} = q_1^Tb.
$$

(c) 用 $A^{-1}$ 乘 $b$，会把每个 $q_i$ 乘以 $\dfrac{1}{\lambda_i}$（见 (a)）。所以 $c_i$ 变成

$$
d_1 = \frac{c_1}{\lambda_1} \quad \left( = \frac{q_1^Tb}{\lambda_1q_1^Tq_1} \text{ 或 } \frac{q_1^Tb}{\lambda_1} \right).
$$

</details>
