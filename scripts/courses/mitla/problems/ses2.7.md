# 习题：克拉默法则、逆矩阵与体积

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 20.1

（教材第 5.3 节第 8 题）设

$$
A = \begin{bmatrix} 1 & 1 & 4 \\ 1 & 2 & 2 \\ 1 & 2 & 5 \end{bmatrix}.
$$

求它的代数余子式矩阵 $C$，再计算 $AC^T$ 求出 $\det A$：

$$
C = \begin{bmatrix} 6 & -3 & 0 \\ \cdot & \cdot & \cdot \\ \cdot & \cdot & \cdot \end{bmatrix}, \qquad AC^T = \ ?
$$

如果把 $a_{13} = 4$ 改成 100，为什么 $\det A$ 不变？

<details>
<summary>解答</summary>

填出代数余子式矩阵 $C$，再相乘得到 $AC^T$：

$$
C = \begin{bmatrix} 6 & -3 & 0 \\ 3 & 1 & -1 \\ -6 & 2 & 1 \end{bmatrix},
$$

$$
AC^T = \begin{bmatrix} 1 & 1 & 4 \\ 1 & 2 & 2 \\ 1 & 2 & 5 \end{bmatrix} \begin{bmatrix} 6 & 3 & -6 \\ -3 & 1 & 2 \\ 0 & -1 & 1 \end{bmatrix} = \begin{bmatrix} 3 & 0 & 0 \\ 0 & 3 & 0 \\ 0 & 0 & 3 \end{bmatrix} = 3I.
$$

由于 $AC^T = (\det A)I$，所以 $\det A = 3$。把 4 改成 100，$\det A$ 不变，因为这个元素的代数余子式是 0，它的值对行列式没有贡献。

</details>

## 习题 20.2

（教材第 5.3 节第 28 题）球坐标 $\rho, \phi, \theta$ 满足

$$
x = \rho \sin\phi \cos\theta, \quad y = \rho \sin\phi \sin\theta, \quad z = \rho \cos\phi.
$$

求偏导数组成的 3 × 3 矩阵

$$
\begin{bmatrix} \partial x/\partial\rho & \partial x/\partial\phi & \partial x/\partial\theta \\ \partial y/\partial\rho & \partial y/\partial\phi & \partial y/\partial\theta \\ \partial z/\partial\rho & \partial z/\partial\phi & \partial z/\partial\theta \end{bmatrix},
$$

并把它的行列式化简为 $J = \rho^2 \sin\phi$。在球坐标中，

$$
dV = \rho^2 \sin\phi \, d\rho \, d\phi \, d\theta
$$

是一个无穷小「坐标盒子」的体积。

<details>
<summary>解答</summary>

各行由 $x$、$y$、$z$ 分别对 $\rho$、$\phi$、$\theta$ 的偏导数构成：

$$
\begin{bmatrix} \sin\phi\cos\theta & \rho\cos\phi\cos\theta & -\rho\sin\phi\sin\theta \\ \sin\phi\sin\theta & \rho\cos\phi\sin\theta & \rho\sin\phi\cos\theta \\ \cos\phi & -\rho\sin\phi & 0 \end{bmatrix}.
$$

按最后一行展开它的行列式 $J$：

$$
\begin{aligned}
J &= \cos\phi \begin{vmatrix} \rho\cos\phi\cos\theta & -\rho\sin\phi\sin\theta \\ \rho\cos\phi\sin\theta & \rho\sin\phi\cos\theta \end{vmatrix} - (-\rho\sin\phi) \begin{vmatrix} \sin\phi\cos\theta & -\rho\sin\phi\sin\theta \\ \sin\phi\sin\theta & \rho\sin\phi\cos\theta \end{vmatrix} + 0 \\
&= \cos\phi\,(\rho^2\cos\phi\sin\phi\cos^2\theta + \rho^2\cos\phi\sin\phi\sin^2\theta) + \rho\sin\phi\,(\rho\sin^2\phi\cos^2\theta + \rho\sin^2\phi\sin^2\theta) \\
&= \cos\phi\,(\rho^2\cos\phi\sin\phi) + \rho^2\sin^3\phi \\
&= \rho^2\sin\phi\,(\cos^2\phi + \sin^2\phi) \\
&= \rho^2\sin\phi.
\end{aligned}
$$

</details>
