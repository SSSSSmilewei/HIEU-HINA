# 求解 Ax = b：行最简形 R

> 本页是 MIT 开放式课程 18.06SC 官方讲座摘要（lecture summary）的中文翻译，原文见页面下方的「讲座摘要原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

$Ax = b$ 什么时候有解 $x$？怎样描述这些解？

## 对 b 的可解条件

我们仍然使用这个例子：

$$
A = \begin{bmatrix} 1 & 2 & 2 & 2 \\ 2 & 4 & 6 & 8 \\ 3 & 6 & 8 & 10 \end{bmatrix}.
$$

$A$ 的第三行是第一行与第二行之和，所以如果 $Ax = b$，那么 $b$ 的第三个分量就等于第一个与第二个分量之和。如果 $b$ 不满足 $b_3 = b_1 + b_2$，方程组就无解。**如果 $A$ 的某些行的一个组合得到零行，那么 $b$ 的各个分量的同一个组合也必须等于零。**

判断 $Ax = b$ 是否有解的一种方法，是对增广矩阵做消元。如果 $A$ 的某一行被完全消去了，$b$ 中对应的分量也会被「消去」成一个表达式。在我们的例子里，$A$ 的第 3 行被完全消去：

$$
\left[\begin{array}{cccc|c} 1 & 2 & 2 & 2 & b_1 \\ 2 & 4 & 6 & 8 & b_2 \\ 3 & 6 & 8 & 10 & b_3 \end{array}\right] \to \cdots \to \left[\begin{array}{cccc|c} 1 & 2 & 2 & 2 & b_1 \\ 0 & 0 & 2 & 4 & b_2 - 2b_1 \\ 0 & 0 & 0 & 0 & b_3 - b_2 - b_1 \end{array}\right].
$$

如果 $Ax = b$ 有解，那么 $b_3 - b_2 - b_1 = 0$。例如可以取 $b = \begin{bmatrix} 1 \\ 5 \\ 6 \end{bmatrix}$。

从前面的课我们知道，$Ax = b$ 有解当且仅当 $b$ 在列空间 $C(A)$ 中。我们现在得到了关于 $b$ 的这两个条件；事实上它们是等价的。

## 完全解

要求出 $Ax = b$ 的所有解，我们先检查方程是否有解，再求出一个**特解**（particular solution）。把这个特解加上零空间中的所有向量，就得到方程的**完全解**（complete solution）。

### 求一个特解

求 $Ax = b$ 的一个特解的一种方法是：令所有自由变量等于零，再解出主变量。

对我们的例子，令 $x_2 = x_4 = 0$，得到方程组

$$
\begin{aligned} x_1 + 2x_3 &= 1 \\ 2x_3 &= 3 \end{aligned}
$$

它的解是 $x_3 = 3/2$、$x_1 = -2$。我们的特解是

$$
x_p = \begin{bmatrix} -2 \\ 0 \\ 3/2 \\ 0 \end{bmatrix}.
$$

### 加上零空间

$Ax = b$ 的通解由 $x_{\text{complete}} = x_p + x_n$ 给出，其中 $x_n$ 是零空间中的任意向量。要看出这一点，把 $Ax_p = b$ 与 $Ax_n = 0$ 相加，就得到对零空间中的每个向量 $x_n$，都有 $A(x_p + x_n) = b$。

上一讲我们知道，$A$ 的零空间是特解 $\begin{bmatrix} -2 \\ 1 \\ 0 \\ 0 \end{bmatrix}$ 和 $\begin{bmatrix} 2 \\ 0 \\ -2 \\ 1 \end{bmatrix}$ 的所有组合。所以方程 $Ax = \begin{bmatrix} 1 \\ 5 \\ 6 \end{bmatrix}$ 的完全解是

$$
x_{\text{complete}} = \begin{bmatrix} -2 \\ 0 \\ 3/2 \\ 0 \end{bmatrix} + c_1 \begin{bmatrix} -2 \\ 1 \\ 0 \\ 0 \end{bmatrix} + c_2 \begin{bmatrix} 2 \\ 0 \\ -2 \\ 1 \end{bmatrix},
$$

其中 $c_1$、$c_2$ 是实数。

$A$ 的零空间是 $\mathbb{R}^4$ 的一个二维子空间，而方程 $Ax = b$ 的解构成一个与它平行、并经过 $x_p = \begin{bmatrix} -2 \\ 0 \\ 3/2 \\ 0 \end{bmatrix}$ 的平面。

## 秩

矩阵的秩等于它的主元个数。如果 $A$ 是秩为 $r$ 的 $m \times n$ 矩阵，那么 $r \le m$ 并且 $r \le n$。

### 列满秩

如果 $r = n$，由上一讲可知，零空间的维数是 $n - r = 0$，只含零向量。没有自由变量，也没有特解。

如果 $Ax = b$ 有解，这个解是唯一的：要么无解，要么只有 1 个解。像这样各列线性无关的例子，在应用中很常见。

由于 $r \le m$，当 $r = n$ 时矩阵的列数不多于行数。这个矩阵的行最简形是 $R = \begin{bmatrix} I \\ 0 \end{bmatrix}$ 的样子。对于 $\mathbb{R}^m$ 中任何不是 $A$ 的各列的线性组合的向量 $b$，$Ax = b$ 都无解。

### 行满秩

如果 $r = m$，那么行最简形 $R = \begin{bmatrix} I & F \end{bmatrix}$ 没有全零的行，因此对 $b$ 的各个分量没有任何要求。方程 $Ax = b$ 对每个 $b$ 都有解。共有 $n - r = n - m$ 个自由变量，所以 $Ax = 0$ 有 $n - m$ 个特解。

### 行满秩且列满秩

如果 $A$ 的主元个数 $r = m = n$，那么 $A$ 是可逆方阵，$R$ 是单位矩阵。零空间的维数是零，并且对 $\mathbb{R}^m$ 中的每个 $b$，$Ax = b$ 都有唯一解。

## 小结

设 $R$ 是主列排在最前面的行最简形，下表总结了我们的结论。

| | $r = m = n$ | $r = n < m$ | $r = m < n$ | $r < m,\ r < n$ |
|---|---|---|---|---|
| $R$ | $I$ | $\begin{bmatrix} I \\ 0 \end{bmatrix}$ | $\begin{bmatrix} I & F \end{bmatrix}$ | $\begin{bmatrix} I & F \\ 0 & 0 \end{bmatrix}$ |
| $Ax = b$ 的解的个数 | 1 | 0 或 1 | 无穷多 | 0 或无穷多 |
