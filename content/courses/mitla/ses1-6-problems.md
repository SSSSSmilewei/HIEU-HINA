# 习题：列空间与零空间

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 6.1

（教材第 3.1 节第 30 题）设 $S$ 和 $T$ 是向量空间 $V$ 的两个子空间。

a) 定义：和 $S + T$ 包含所有形如 $s + t$ 的向量，其中 $s$ 属于 $S$，$t$ 属于 $T$。证明 $S + T$ 满足向量空间的要求（对加法和数乘封闭）。

b) 如果 $S$ 和 $T$ 是 $\mathbb{R}^m$ 中的直线，$S + T$ 与 $S \cup T$ 有什么区别？这个并集包含属于 $S$ 或 $T$（或两者）的所有向量。解释这句话：$S \cup T$ 张成的空间就是 $S + T$。

<details>
<summary>解答</summary>

a) 设 $s$、$s'$ 是 $S$ 中的向量，$t$、$t'$ 是 $T$ 中的向量，$c$ 是一个数。那么

$$
(s + t) + (s' + t') = (s + s') + (t + t'), \qquad c(s + t) = cs + ct.
$$

所以 $S + T$ 对加法和数乘都封闭；也就是说，它满足向量空间的两条要求。

b) 如果 $S$ 和 $T$ 是两条不同的直线，那么 $S + T$ 是一个平面，而 $S \cup T$ 只是两条直线。$S \cup T$ 张成的空间，是这两条直线上的向量的所有组合。特别地，它包含所有的和 $s + t$（$s$ 属于 $S$，$t$ 属于 $T$），而这些和构成 $S + T$。

由于 $S + T$ 既包含 $S$ 又包含 $T$，它包含 $S \cup T$。而且 $S + T$ 是向量空间，所以它包含自身中向量的所有组合，特别地，它包含 $S \cup T$ 张成的空间。因此 $S \cup T$ 张成的空间就是 $S + T$。

</details>

## 习题 6.2

（教材第 3.2 节第 18 题）平面 $x - 3y - z = 12$ 与平面 $x - 3y - z = 0$ 平行。这个平面上有一个特殊的点 $(12, 0, 0)$。平面上所有的点都具有下面的形式（填出第一个分量）：

$$
\begin{bmatrix} x \\ y \\ z \end{bmatrix} = \begin{bmatrix} \ \ \\ 0 \\ 0 \end{bmatrix} + y \begin{bmatrix} \ \ \\ 1 \\ 0 \end{bmatrix} + z \begin{bmatrix} \ \ \\ 0 \\ 1 \end{bmatrix}.
$$

<details>
<summary>解答</summary>

方程 $x = 12 + 3y + z$ 说明了一切：

$$
\begin{bmatrix} x \\ y \\ z \end{bmatrix} = \begin{bmatrix} 12 + 3y + z \\ y \\ z \end{bmatrix} = \begin{bmatrix} 12 \\ 0 \\ 0 \end{bmatrix} + y \begin{bmatrix} 3 \\ 1 \\ 0 \end{bmatrix} + z \begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix}.
$$

（译注：原文题目把第二个平面写成 $x - 3y - x = 0$，应为 $x - 3y - z = 0$，译文已更正。）

</details>

## 习题 6.3

（教材第 3.2 节第 36 题）如果 $C = \begin{bmatrix} A \\ B \end{bmatrix}$，零空间 $N(C)$ 与 $N(A)$、$N(B)$ 有什么关系？

<details>
<summary>解答</summary>

$N(C) = N(A) \cap N(B)$，它包含同时属于两个零空间的所有向量：

$$
Cx = \begin{bmatrix} Ax \\ Bx \end{bmatrix} = 0
$$

当且仅当 $Ax = 0$ 并且 $Bx = 0$。

</details>
