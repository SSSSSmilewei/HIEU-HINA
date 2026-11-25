# 习题：线性变换及其矩阵

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 30.1

考虑变换 $T$：它把每个点到原点的距离加倍，但不改变从原点指向该点的方向。用极坐标描述就是

$$
T(r, \theta) = (2r, \theta).
$$

a) 判断：$T$ 是线性变换吗？

b) 用直角（$xy$）坐标描述 $T$。验证这个变换确实把向量的长度加倍，以此检查你的结果。

c) 如果 (a) 的答案是「是」，求 $T$ 的矩阵；如果是「否」，解释 $T$ 为什么不是线性的。

<details>
<summary>解答</summary>

a) 是。用向量来说，$T(v) = 2v$，所以 $T(v_1 + v_2) = 2v_1 + 2v_2 = T(v_1) + T(v_2)$，并且 $T(cv) = 2cv = cT(v)$。

b) $T(x, y) = (2x, 2y)$。已知 $\left\|\begin{bmatrix} x \\ y \end{bmatrix}\right\| = \sqrt{x^2 + y^2}$，可以算出

$$
\left\|T\begin{bmatrix} x \\ y \end{bmatrix}\right\| = \left\|\begin{bmatrix} 2x \\ 2y \end{bmatrix}\right\| = \sqrt{4(x^2 + y^2)} = 2\left\|\begin{bmatrix} x \\ y \end{bmatrix}\right\|.
$$

这证实了 $T$ 把向量的长度加倍。

c) 由 (b) 的结果可知 $T$ 的矩阵是 $\begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$。

</details>

## 习题 30.2

描述一个保持零向量不动、但不是线性变换的变换。

<details>
<summary>解答</summary>

如果只考虑「简单」的变换，这并不容易！

一种做法是找一个在平面不同部分作用不同的变换。如果 $T\begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} x \\ |y| \end{bmatrix}$，那么

$$
T\left(\begin{bmatrix} 1 \\ 1 \end{bmatrix} + \begin{bmatrix} 1 \\ -1 \end{bmatrix}\right) = \begin{bmatrix} 2 \\ 0 \end{bmatrix}
$$

不等于

$$
T\begin{bmatrix} 1 \\ 1 \end{bmatrix} + T\begin{bmatrix} 1 \\ -1 \end{bmatrix} = \begin{bmatrix} 2 \\ 2 \end{bmatrix}.
$$

另一种做法是用非线性函数来定义变换：如果 $T\begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} x \\ y^2 \end{bmatrix}$，那么 $T\left(c\begin{bmatrix} x \\ y \end{bmatrix}\right) = \begin{bmatrix} cx \\ c^2y^2 \end{bmatrix}$ 不等于 $cT\begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} cx \\ cy^2 \end{bmatrix}$。

</details>
