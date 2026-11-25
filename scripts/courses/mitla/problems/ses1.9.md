# 习题：线性无关、基与维数

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 9.1

（教材第 3.5 节第 2 题）在下面这些向量中，最多能找出几个线性无关的向量？

$$
v_1 = \begin{bmatrix} 1 \\ -1 \\ 0 \\ 0 \end{bmatrix},\ v_2 = \begin{bmatrix} 1 \\ 0 \\ -1 \\ 0 \end{bmatrix},\ v_3 = \begin{bmatrix} 1 \\ 0 \\ 0 \\ -1 \end{bmatrix},\ v_4 = \begin{bmatrix} 0 \\ 1 \\ -1 \\ 0 \end{bmatrix},\ v_5 = \begin{bmatrix} 0 \\ 1 \\ 0 \\ -1 \end{bmatrix},\ v_6 = \begin{bmatrix} 0 \\ 0 \\ 1 \\ -1 \end{bmatrix}.
$$

<details>
<summary>解答</summary>

因为 $v_4 = v_2 - v_1$，$v_5 = v_3 - v_1$，$v_6 = v_3 - v_2$，所以 $v_4$、$v_5$、$v_6$ 依赖于 $v_1$、$v_2$、$v_3$。为了确定 $v_1$、$v_2$、$v_3$ 之间的关系，对矩阵 $[\,v_1\ v_2\ v_3\,]$ 做行化简：

$$
\begin{bmatrix} 1 & 1 & 1 \\ -1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{bmatrix} \to \begin{bmatrix} 1 & 1 & 1 \\ 0 & 1 & 1 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{bmatrix} \to \begin{bmatrix} 1 & 1 & 1 \\ 0 & 1 & 1 \\ 0 & 0 & 1 \\ 0 & 0 & -1 \end{bmatrix} \to \begin{bmatrix} 1 & 1 & 1 \\ 0 & 1 & 1 \\ 0 & 0 & 1 \\ 0 & 0 & 0 \end{bmatrix}.
$$

有三个主元，所以 $v_1$、$v_2$、$v_3$ 线性无关。因此这六个向量中最多有 **3** 个线性无关的向量。这也是由这些 $v$ 组成的 4 × 6 矩阵的秩。

</details>

## 习题 9.2

（教材第 3.5 节第 20 题）求 $\mathbb{R}^3$ 中平面 $x - 2y + 3z = 0$ 的一组基。再求这个平面与 $xy$ 平面的交线的一组基。最后求所有垂直于这个平面的向量组成的空间的一组基。

<details>
<summary>解答</summary>

这个平面是矩阵 $\begin{bmatrix} 1 & -2 & 3 \end{bmatrix}$ 的零空间，也是

$$
A = \begin{bmatrix} 1 & -2 & 3 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}
$$

的零空间。$Ax = 0$ 的特解是

$$
v_1 = \begin{bmatrix} 2 \\ 1 \\ 0 \end{bmatrix}, \qquad v_2 = \begin{bmatrix} -3 \\ 0 \\ 1 \end{bmatrix}.
$$

它们构成 $A$ 的零空间的一组基，因而也是这个平面的一组基。

这个平面与 $xy$ 平面的交集包含 $v_1$，不包含 $v_2$；这个交集一定是一条直线。由于 $v_1$ 在这条直线上，它也就是这条直线的一组基。

最后，可以通过观察或者用叉积找到向量

$$
v_3 = \begin{bmatrix} 1 \\ -2 \\ 3 \end{bmatrix},
$$

它同时垂直于 $v_1$ 和 $v_2$，因此垂直于这个平面。由于 $\mathbb{R}^3$ 中垂直于一个平面的向量组成的空间是一维的，$v_3$ 就是这个空间的一组基。

</details>
