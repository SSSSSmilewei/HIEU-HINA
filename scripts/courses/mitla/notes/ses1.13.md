# 核心概念概览

> 本页是 MIT 开放式课程 18.06SC 官方讲座摘要（lecture summary）的中文翻译，原文见页面下方的「讲座摘要原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

这是 Strang 教授在一门工程数学课开头讲的线性代数概览。

线性代数的内容，从向量发展到矩阵，再发展到子空间。

## 向量

对向量可以做什么？**取组合**。

我们可以把向量乘以数（标量），也可以把向量相加、相减。给定向量 $u$、$v$、$w$，可以构成线性组合 $x_1u + x_2v + x_3w = b$。

$\mathbb{R}^3$ 中的一个例子是

$$
u = \begin{bmatrix} 1 \\ -1 \\ 0 \end{bmatrix}, \quad v = \begin{bmatrix} 0 \\ 1 \\ -1 \end{bmatrix}, \quad w = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}.
$$

$u$ 的所有倍数构成一条经过原点的直线；$v$ 的所有倍数构成另一条直线；$u$ 和 $v$ 的所有组合构成一个平面。**取一些向量的所有组合，就得到一个子空间。**

可以这样继续下去，也可以用一个矩阵，把 $w$ 的所有倍数也加进来。

## 矩阵

构造一个以 $u$、$v$、$w$ 为列的矩阵 $A$：

$$
A = \begin{bmatrix} 1 & 0 & 0 \\ -1 & 1 & 0 \\ 0 & -1 & 1 \end{bmatrix}.
$$

乘积

$$
Ax = \begin{bmatrix} 1 & 0 & 0 \\ -1 & 1 & 0 \\ 0 & -1 & 1 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix} = \begin{bmatrix} x_1 \\ -x_1 + x_2 \\ -x_2 + x_3 \end{bmatrix}
$$

等于和 $x_1u + x_2v + x_3w = b$。**矩阵与向量的乘积，是矩阵各列的一个组合。**（这个特殊的矩阵 $A$ 是一个**差分矩阵**，因为 $Ax$ 的各个分量是 $x$ 的分量之差。）

说 $x_1u + x_2v + x_3w = b$ 时，我们想的是用数去乘向量；说 $Ax = b$ 时，我们想的是用矩阵（它的各列是 $u$、$v$、$w$）去乘这些数。计算是一样的，但看问题的角度变了。

对任何输入向量 $x$，「乘以 $A$」这个运算的输出是某个向量 $b$：

$$
A \begin{bmatrix} 1 \\ 4 \\ 9 \end{bmatrix} = \begin{bmatrix} 1 \\ 3 \\ 5 \end{bmatrix}.
$$

更深入的问题是：从向量 $b$ 出发，问「哪些向量 $x$ 使 $Ax = b$？」在我们的例子里，这就是求解三个未知数的三个方程。求解

$$
Ax = \begin{bmatrix} 1 & 0 & 0 \\ -1 & 1 & 0 \\ 0 & -1 & 1 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix} = \begin{bmatrix} x_1 \\ x_2 - x_1 \\ x_3 - x_2 \end{bmatrix} = \begin{bmatrix} b_1 \\ b_2 \\ b_3 \end{bmatrix}
$$

等价于求解

$$
\begin{aligned} x_1 &= b_1 \\ x_2 - x_1 &= b_2 \\ x_3 - x_2 &= b_3. \end{aligned}
$$

我们看出 $x_1 = b_1$，于是 $x_2$ 必须等于 $b_1 + b_2$。写成向量形式，解是

$$
\begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix} = \begin{bmatrix} b_1 \\ b_1 + b_2 \\ b_1 + b_2 + b_3 \end{bmatrix}.
$$

而这正是在说

$$
x = \begin{bmatrix} 1 & 0 & 0 \\ 1 & 1 & 0 \\ 1 & 1 & 1 \end{bmatrix} \begin{bmatrix} b_1 \\ b_2 \\ b_3 \end{bmatrix},
$$

也就是 $x = A^{-1}b$。如果矩阵 $A$ 可逆，就可以在等式两边乘以 $A^{-1}$，求出 $Ax = b$ 的唯一解 $x$。可以说 $A$ 代表一个变换 $x \to b$，它有一个逆变换 $b \to x$。

特别地，如果 $b = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$，那么 $x = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$。

第二个例子有同样的两列 $u$ 和 $v$，但把列向量 $w$ 换掉了：

$$
C = \begin{bmatrix} 1 & 0 & -1 \\ -1 & 1 & 0 \\ 0 & -1 & 1 \end{bmatrix}.
$$

于是

$$
Cx = \begin{bmatrix} 1 & 0 & -1 \\ -1 & 1 & 0 \\ 0 & -1 & 1 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix} = \begin{bmatrix} x_1 - x_3 \\ x_2 - x_1 \\ x_3 - x_2 \end{bmatrix},
$$

我们这三个未知数的三个方程变成了「循环」的。

之前由 $Ax = 0$ 可以推出 $x = 0$；现在却存在非零向量 $x$ 使 $Cx = 0$：任何满足 $x_1 = x_2 = x_3$ 的向量 $x$ 都有 $Cx = 0$。这是一个重大的区别：我们不能在 $Cx = 0$ 两边乘以一个逆矩阵来求非零解 $x$。

$Cx = b$ 所表示的方程组是

$$
\begin{aligned} x_1 - x_3 &= b_1 \\ x_2 - x_1 &= b_2 \\ x_3 - x_2 &= b_3. \end{aligned}
$$

把这三个方程加起来，得到

$$
0 = b_1 + b_2 + b_3.
$$

这告诉我们：**只有当 $b$ 的各分量之和为 0 时，$Cx = b$ 才有解 $x$**。在物理系统中，这可能意味着只要受力平衡，系统就是稳定的。

## 子空间

从几何上看，$C$ 的各列位于同一个平面上（它们线性相关；而 $A$ 的各列线性无关）。$\mathbb{R}^3$ 中有很多向量不在这个平面上。这些向量不能写成 $C$ 的各列的线性组合，因此对应于使 $Cx = b$ 无解的那些 $b$。$C$ 的各列的线性组合构成 $\mathbb{R}^3$ 的一个二维子空间。

$u$、$v$ 和（新的）$w$ 的组合构成的这个平面，可以描述成「所有向量 $Cx$」。而我们知道，使 $Cx = b$ 有解的向量 $b$ 满足条件 $b_1 + b_2 + b_3 = 0$。所以 $u$ 和 $v$ 的所有组合构成的平面，由所有分量之和为 0 的向量组成。

如果取

$$
u = \begin{bmatrix} 1 \\ -1 \\ 0 \end{bmatrix}, \quad v = \begin{bmatrix} 0 \\ 1 \\ -1 \end{bmatrix}, \quad w = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}
$$

的所有组合，就得到整个空间 $\mathbb{R}^3$；方程 $Ax = b$ 对 $\mathbb{R}^3$ 中的每个 $b$ 都有解。我们说 $u$、$v$、$w$ 构成 $\mathbb{R}^3$ 的一组**基**。

$\mathbb{R}^n$ 的一组基是 $\mathbb{R}^n$ 中 $n$ 个线性无关的向量。等价地说，基是其组合能覆盖整个空间的 $n$ 个向量。或者说，当以一组向量为列的矩阵可逆时，这组向量就构成一组基。

**向量空间**是对线性组合封闭的向量集合。**子空间**是另一个向量空间内部的向量空间；$\mathbb{R}^3$ 中经过原点的平面就是子空间的一个例子。子空间可以等于包含它的那个空间；最小的子空间只含零向量。

$\mathbb{R}^3$ 的子空间有：

- 原点；
- 经过原点的直线；
- 经过原点的平面；
- 整个 $\mathbb{R}^3$。

## 结语

看到一个矩阵时，试着看出「它在做什么」。

矩阵可以是长方形的：我们可以有三个未知数的七个方程。长方形矩阵不可逆，但研究长方形矩阵时常常出现的对称方阵 $A^T A$ 可能是可逆的。
