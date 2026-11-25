# 习题：行列式公式与代数余子式

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 19.1

计算下面矩阵的行列式：

$$
A = \begin{bmatrix} 0 & 0 & 0 & 1 \\ 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \end{bmatrix}.
$$

对这道题，你更喜欢哪种计算行列式的方法？为什么？

<details>
<summary>解答</summary>

更好的方法是用代数余子式（按第一行展开）。由

$$
\det A = \sum_{P = (\alpha, \beta, \ldots, \omega)} (\det P)\, a_{1\alpha} a_{2\beta} \cdots a_{n\omega}
$$

按第一行展开：

$$
\det A = 0\begin{vmatrix} 0 & 0 & 0 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{vmatrix} - 0\begin{vmatrix} 1 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 1 & 0 \end{vmatrix} + 0\begin{vmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 0 \end{vmatrix} - 1\begin{vmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{vmatrix} = -1.
$$

这比做行交换更快：

$$
\det A = \det \begin{bmatrix} 0 & 0 & 0 & 1 \\ 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \end{bmatrix} = -\det \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & 0 & 1 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \end{bmatrix} = \det \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \\ 0 & 0 & 1 & 0 \end{bmatrix} = -\det \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} = -1.
$$

</details>

## 习题 19.2

（教材第 5.2 节第 33 题）对称的帕斯卡矩阵行列式都是 1。如果把第 $n$ 行第 $n$ 列的元素减去 1，为什么行列式就变成零？（用法则 3 或代数余子式。）

$$
\det \begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & 2 & 3 & 4 \\ 1 & 3 & 6 & 10 \\ 1 & 4 & 10 & 20 \end{bmatrix} = 1 \ (\text{已知}), \qquad \det \begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & 2 & 3 & 4 \\ 1 & 3 & 6 & 10 \\ 1 & 4 & 10 & 19 \end{bmatrix} = 0 \ (\text{要解释}).
$$

<details>
<summary>解答</summary>

第 $n$ 行第 $n$ 列元素的变化量（这个例子里是 19 与 20 之差）乘以它的代数余子式，也就是 $(n-1) \times (n-1)$ 对称帕斯卡矩阵的行列式。在这个例子里，这个矩阵是

$$
\begin{bmatrix} 1 & 1 & 1 \\ 1 & 2 & 3 \\ 1 & 3 & 6 \end{bmatrix}.
$$

已知它的行列式是 1。由于第 $n$ 行第 $n$ 列的元素以正号乘以它的代数余子式，整个行列式减少 1，变成 0。

</details>
