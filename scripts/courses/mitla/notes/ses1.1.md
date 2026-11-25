# 线性方程组的几何解释

> 本页是 MIT 开放式课程 18.06SC 官方讲座摘要（lecture summary）的中文翻译，原文见页面下方的「讲座摘要原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。图片请对照原文 PDF。

线性代数的基本问题，是求解含有 $n$ 个未知数的 $n$ 个线性方程。例如：

$$
\begin{aligned} 2x - y &= 0 \\ -x + 2y &= 3 \end{aligned}
$$

在线性代数的第一讲里，我们从三个角度来看这个问题。

上面的方程组是二维的（$n = 2$）。再增加一个变量 $z$，就可以把它扩展到三维。

## 行图像

把满足每个方程的点画出来。这些图形的交点（如果存在的话）就是方程组的解。从图 1 可以看出，这个方程组的解是 $x = 1$、$y = 2$。

> 图 1：直线 $2x - y = 0$ 与 $-x + 2y = 3$ 相交于点 $(1, 2)$。

把这个解代回原方程组，检验一下：

$$
\begin{aligned} 2 \cdot 1 - 2 &= 0 \\ -1 + 2 \cdot 2 &= 3 \end{aligned}
$$

三维方程组的解，是三个平面的公共交点（如果存在的话）。

## 列图像

在列图像里，把方程组各列的系数写成向量，于是整个方程组就改写成一个方程：

$$
x \begin{bmatrix} 2 \\ -1 \end{bmatrix} + y \begin{bmatrix} -1 \\ 2 \end{bmatrix} = \begin{bmatrix} 0 \\ 3 \end{bmatrix}.
$$

给定两个向量 $c$、$d$ 和两个数（标量）$x$、$y$，和 $xc + yd$ 称为 $c$ 与 $d$ 的**线性组合**（linear combination）。线性组合在整门课里都非常重要。

从几何上看，我们要找到数 $x$ 和 $y$，使得 $x$ 份向量 $\begin{bmatrix} 2 \\ -1 \end{bmatrix}$ 加上 $y$ 份向量 $\begin{bmatrix} -1 \\ 2 \end{bmatrix}$ 等于向量 $\begin{bmatrix} 0 \\ 3 \end{bmatrix}$。从图 2 可以看出，$x = 1$、$y = 2$，与行图像得到的结果一致。

> 图 2：列向量的一个线性组合等于向量 $b$。

在三维情形，列图像要求我们找到三个三维向量的一个线性组合，使它等于向量 $b$。

## 矩阵图像

利用矩阵和向量，把方程组

$$
\begin{aligned} 2x - y &= 0 \\ -x + 2y &= 3 \end{aligned}
$$

写成一个方程：

$$
\begin{bmatrix} 2 & -1 \\ -1 & 2 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 0 \\ 3 \end{bmatrix}.
$$

矩阵 $A = \begin{bmatrix} 2 & -1 \\ -1 & 2 \end{bmatrix}$ 称为**系数矩阵**（coefficient matrix），向量 $x = \begin{bmatrix} x \\ y \end{bmatrix}$ 是未知数组成的向量，方程右边的值组成向量 $b$：

$$
Ax = b.
$$

三维的矩阵图像和二维的非常相似，只是向量和矩阵变大了。

## 矩阵乘法

矩阵 $A$ 怎样乘以向量 $x$？

$$
\begin{bmatrix} 2 & 5 \\ 1 & 3 \end{bmatrix} \begin{bmatrix} 1 \\ 2 \end{bmatrix} = \, ?
$$

一种方法是把 $x$ 的分量看作矩阵各列的线性组合的系数：

$$
\begin{bmatrix} 2 & 5 \\ 1 & 3 \end{bmatrix} \begin{bmatrix} 1 \\ 2 \end{bmatrix} = 1 \begin{bmatrix} 2 \\ 1 \end{bmatrix} + 2 \begin{bmatrix} 5 \\ 3 \end{bmatrix} = \begin{bmatrix} 12 \\ 7 \end{bmatrix}.
$$

这种算法说明：**$Ax$ 是 $A$ 的各列的线性组合。**

也可以用 $A$ 的每一行与 $x$ 做点积来计算 $Ax$：

$$
\begin{bmatrix} 2 & 5 \\ 1 & 3 \end{bmatrix} \begin{bmatrix} 1 \\ 2 \end{bmatrix} = \begin{bmatrix} 2 \cdot 1 + 5 \cdot 2 \\ 1 \cdot 1 + 3 \cdot 2 \end{bmatrix} = \begin{bmatrix} 12 \\ 7 \end{bmatrix}.
$$

## 线性无关

在列图像和矩阵图像中，方程右边是一个向量 $b$。给定矩阵 $A$，是否对每一个可能的向量 $b$，都能解出

$$
Ax = b
$$

？换句话说，各列向量的线性组合能否填满整个 $xy$ 平面（三维情形下是整个空间）？

如果答案是「不能」，就说 $A$ 是**奇异矩阵**（singular matrix）。在这种奇异的情形下，它的列向量是**线性相关**（linearly dependent）的：这些向量的所有线性组合都落在一个点或一条直线上（二维情形），或者落在一个点、一条直线或一个平面上（三维情形）。它们的线性组合填不满整个空间。
