# 矩阵乘法与逆矩阵

> 本页是 MIT 开放式课程 18.06SC 官方讲座摘要（lecture summary）的中文翻译，原文见页面下方的「讲座摘要原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

## 矩阵乘法

我们讨论理解两个矩阵乘积 $AB = C$ 的四种不同方式。如果 $A$ 是 $m \times n$ 矩阵，$B$ 是 $n \times p$ 矩阵，那么 $C$ 是 $m \times p$ 矩阵。用 $c_{ij}$ 表示矩阵 $C$ 第 $i$ 行第 $j$ 列的元素。

### 标准方式（行乘以列）

描述矩阵乘积的标准方式是：$c_{ij}$ 等于矩阵 $A$ 的第 $i$ 行与矩阵 $B$ 的第 $j$ 列的点积。也就是

$$
c_{ij} = \sum_{k=1}^{n} a_{ik} b_{kj}.
$$

### 按列

矩阵 $A$ 乘以矩阵 $B$ 的第 $j$ 列，等于矩阵 $C$ 的第 $j$ 列。这说明 **$C$ 的各列是 $A$ 的各列的线性组合**。

### 按行

矩阵 $A$ 的第 $i$ 行乘以矩阵 $B$，等于矩阵 $C$ 的第 $i$ 行。所以 **$C$ 的各行是 $B$ 的各行的线性组合**。

### 列乘以行

$A$ 的一列是 $m \times 1$ 的向量，$B$ 的一行是 $1 \times p$ 的向量。它们的乘积是一个矩阵：

$$
\begin{bmatrix} 2 \\ 3 \\ 4 \end{bmatrix} \begin{bmatrix} 1 & 6 \end{bmatrix} = \begin{bmatrix} 2 & 12 \\ 3 & 18 \\ 4 & 24 \end{bmatrix}.
$$

这个矩阵的各列都是 $A$ 的那一列的倍数，各行都是 $B$ 的那一行的倍数。如果把这些行看作坐标 $(2, 12)$、$(3, 18)$、$(4, 24)$，这些点都在同一条直线上；两个列向量也是如此。以后会看到，这等于说这个矩阵的行空间是一条直线，列空间也是一条直线。

$A$ 与 $B$ 的乘积，就是这些「列乘以行」的矩阵之和：

$$
AB = \sum_{k=1}^{n} \begin{bmatrix} a_{1k} \\ \vdots \\ a_{mk} \end{bmatrix} \begin{bmatrix} b_{k1} & \cdots & b_{kp} \end{bmatrix}.
$$

### 分块

如果把 $A$ 和 $B$ 划分成大小相配的块，就可以用块的乘积来写 $AB = C$：

$$
\begin{bmatrix} A_1 & A_2 \\ A_3 & A_4 \end{bmatrix} \begin{bmatrix} B_1 & B_2 \\ B_3 & B_4 \end{bmatrix} = \begin{bmatrix} C_1 & C_2 \\ C_3 & C_4 \end{bmatrix}.
$$

这里 $C_1 = A_1 B_1 + A_2 B_3$。

## 逆矩阵

### 方阵

对于方阵 $A$，最重要的问题是它有没有逆矩阵 $A^{-1}$。如果有，那么 $A^{-1}A = I = AA^{-1}$，我们称 $A$ **可逆**（invertible）或**非奇异**（nonsingular）。

如果 $A$ 是奇异的——也就是 $A$ 没有逆矩阵——那么它的行列式为零，并且能找到某个非零向量 $x$ 使 $Ax = 0$。例如：

$$
\begin{bmatrix} 1 & 3 \\ 2 & 6 \end{bmatrix} \begin{bmatrix} 3 \\ -1 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}.
$$

在这个例子里，第一列的 3 倍减去第二列的 1 倍等于零向量；两个列向量在同一条直线上。

求矩阵的逆，与求解线性方程组密切相关：

$$
\underbrace{\begin{bmatrix} 1 & 3 \\ 2 & 7 \end{bmatrix}}_{A} \underbrace{\begin{bmatrix} a & c \\ b & d \end{bmatrix}}_{A^{-1}} = \underbrace{\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}}_{I}
$$

可以读作「$A$ 乘以 $A^{-1}$ 的第 $j$ 列，等于单位矩阵的第 $j$ 列」。这只是方程 $Ax = b$ 的一种特殊形式。

### 高斯—若尔当消元法

可以用消元法同时求解两个或更多的线性方程组：只要把整个单位矩阵 $I$ 接在矩阵后面，构成增广矩阵：

$$
\left[\begin{array}{cc|cc} 1 & 3 & 1 & 0 \\ 2 & 7 & 0 & 1 \end{array}\right] \longrightarrow \left[\begin{array}{cc|cc} 1 & 3 & 1 & 0 \\ 0 & 1 & -2 & 1 \end{array}\right] \longrightarrow \left[\begin{array}{cc|cc} 1 & 0 & 7 & -3 \\ 0 & 1 & -2 & 1 \end{array}\right]
$$

（先用高斯的消元法把原矩阵化成上三角形式，再用若尔当的想法，消去矩阵右上部分的元素。）

$$
A^{-1} = \begin{bmatrix} 7 & -3 \\ -2 & 1 \end{bmatrix}.
$$

和上一讲一样，可以把消元的结果写成若干个消元矩阵 $E_{ij}$ 与矩阵 $A$ 的乘积。令 $E$ 为所有 $E_{ij}$ 的乘积，用分块矩阵把这次高斯—若尔当消元的结果写成 $E[\,A \mid I\,] = [\,I \mid E\,]$。而如果 $EA = I$，那么 $E = A^{-1}$。
