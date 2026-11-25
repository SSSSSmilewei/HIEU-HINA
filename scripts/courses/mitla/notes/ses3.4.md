# 相似矩阵与若尔当标准形

> 本页是 MIT 开放式课程 18.06SC 官方讲座摘要（lecture summary）的中文翻译，原文见页面下方的「讲座摘要原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

线性代数的核心内容我们差不多已经全部讲完了——学完奇异值分解之后，最核心的主题就都见过了。

## AᵀA 是正定的

如果对所有 $x \ne 0$ 都有 $x^T Ax > 0$，矩阵就是正定的。这是非常重要的一类矩阵：计算最小二乘解时，正定矩阵以 $A^T A$ 的形式出现。在很多情况下，一个长方形矩阵乘以它的转置，得到一个方阵。

给定一个对称正定矩阵 $A$，它的逆也是对称正定的吗？是的：如果 $A$ 的（正的）特征值是 $\lambda_1, \lambda_2, \ldots, \lambda_d$，那么 $A^{-1}$ 的特征值 $1/\lambda_1, 1/\lambda_2, \ldots, 1/\lambda_d$ 也都是正的。

如果 $A$ 和 $B$ 都正定，$A + B$ 正定吗？我们对 $A + B$ 的特征值所知不多，但可以利用性质 $x^T Ax > 0$ 和 $x^T Bx > 0$，证明对 $x \ne 0$ 有 $x^T(A + B)x > 0$，所以 $A + B$ 也是正定的。

现在设 $A$ 是长方形（$m \times n$）矩阵。$A$ 几乎肯定不是对称的，但 $A^T A$ 是对称方阵。$A^T A$ 正定吗？我们不想求这个矩阵的特征值或主元，所以问：$x^T A^T Ax$ 什么时候是正的？

化简 $x^T A^T Ax$ 只需要移动一下括号：

$$
x^T(A^T A)x = (Ax)^T(Ax) = |Ax|^2 \ge 0.
$$

剩下的唯一问题是 $Ax$ 会不会等于 0。如果 $A$ 的秩是 $n$（各列线性无关），那么只有 $x = 0$ 时才有 $x^T(A^T A)x = 0$，所以 $A^T A$ 是正定的。

正定矩阵的另一个好处是：做行化简时永远不需要行交换——主元位置上永远不会出现 0 或者小得不合适的数。

## 相似矩阵 A 与 B = M⁻¹AM

如果对某个矩阵 $M$ 有 $B = M^{-1}AM$，就称两个方阵 $A$ 和 $B$ **相似**（similar）。这让我们可以把矩阵分成一个个「家族」，同一个家族里的矩阵彼此相似。于是每个家族都可以用一个对角（或接近对角）的矩阵来代表。

### 特征值互不相同

如果 $A$ 有一整组特征向量，就可以构造它的特征向量矩阵 $S$，写成 $S^{-1}AS = \Lambda$。所以 $A$ 与 $\Lambda$ 相似（取 $M$ 为这个 $S$）。

如果 $A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$，那么 $\Lambda = \begin{bmatrix} 3 & 0 \\ 0 & 1 \end{bmatrix}$，所以 $A$ 与 $\begin{bmatrix} 3 & 0 \\ 0 & 1 \end{bmatrix}$ 相似。但 $A$ 也与下面这个矩阵相似：

$$
\underbrace{\begin{bmatrix} 1 & -4 \\ 0 & 1 \end{bmatrix}}_{M^{-1}} \underbrace{\begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}}_{A} \underbrace{\begin{bmatrix} 1 & 4 \\ 0 & 1 \end{bmatrix}}_{M} = \begin{bmatrix} 1 & -4 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 2 & 9 \\ 1 & 6 \end{bmatrix} = \underbrace{\begin{bmatrix} -2 & -15 \\ 1 & 6 \end{bmatrix}}_{B}.
$$

此外，$B$ 也与 $\Lambda$ 相似。所有这些相似矩阵的特征值都相同，都是 3 和 1；可以通过计算 $A$ 和 $B$ 的迹和行列式来验证。

**相似矩阵有相同的特征值！**

事实上，与 $A$ 相似的矩阵，正是所有特征值为 3 和 1 的 2 × 2 矩阵。这个家族的其他成员还有 $\begin{bmatrix} 3 & 7 \\ 0 & 1 \end{bmatrix}$ 和 $\begin{bmatrix} 1 & 7 \\ 0 & 3 \end{bmatrix}$。

要证明相似矩阵有相同的特征值，设 $Ax = \lambda x$。把这个等式改写成含有 $B = M^{-1}AM$ 的形式：

$$
\begin{aligned}
AMM^{-1}x &= \lambda x \\
M^{-1}AMM^{-1}x &= \lambda M^{-1}x \\
BM^{-1}x &= \lambda M^{-1}x.
\end{aligned}
$$

矩阵 $B$ 有同一个特征值 $\lambda$，对应的特征向量是 $M^{-1}x$。

如果两个矩阵相似，它们就有相同的特征值，以及相同个数的线性无关特征向量（但特征向量本身很可能不同）。

对角化 $A$，就是找一个与 $A$ 相似的对角矩阵 $\Lambda$。如果两个矩阵有相同的 $n$ 个互不相同的特征值，它们就与同一个对角矩阵相似。

### 重特征值

如果 $A$ 有两个特征值相同，就可能无法对角化。设 $\lambda_1 = \lambda_2 = 4$。特征值为 4 和 4 的一个矩阵家族只含矩阵 $\begin{bmatrix} 4 & 0 \\ 0 & 4 \end{bmatrix}$。矩阵 $\begin{bmatrix} 4 & 1 \\ 0 & 4 \end{bmatrix}$ 不在这个家族里。

特征值为 4 和 4 的相似矩阵家族有两个。较大的那个家族包含 $\begin{bmatrix} 4 & 1 \\ 0 & 4 \end{bmatrix}$，这个家族里的每个成员都只有一个（线性无关的）特征向量。

矩阵 $\begin{bmatrix} 4 & 0 \\ 0 & 4 \end{bmatrix}$ 是另一个家族的唯一成员，因为对任何可逆矩阵 $M$，

$$
M^{-1} \begin{bmatrix} 4 & 0 \\ 0 & 4 \end{bmatrix} M = 4M^{-1}M = \begin{bmatrix} 4 & 0 \\ 0 & 4 \end{bmatrix}.
$$

## 若尔当标准形

卡米尔·若尔当（Camille Jordan）找到了一种方法，从每个相似矩阵家族中选出一个「最接近对角」的代表；我们说这个代表处于**若尔当标准形**（Jordan normal form）。例如 $\begin{bmatrix} 4 & 1 \\ 0 & 4 \end{bmatrix}$ 和 $\begin{bmatrix} 4 & 0 \\ 0 & 4 \end{bmatrix}$ 都是若尔当形。若尔当形曾经是线性代数的顶峰，但现在不是了：数值应用中很少需要它。

要找到以 $\begin{bmatrix} 4 & 1 \\ 0 & 4 \end{bmatrix}$ 为代表的家族的更多成员，可以先选对角元使迹为 8，再选非对角元使行列式为 16：

$$
\begin{bmatrix} 4 & 1 \\ 0 & 4 \end{bmatrix}, \quad \begin{bmatrix} 5 & 1 \\ -1 & 3 \end{bmatrix}, \quad \begin{bmatrix} 4 & 0 \\ 17 & 4 \end{bmatrix}, \quad \begin{bmatrix} a & b \\ (8a - a^2 - 16)/b & 8 - a \end{bmatrix}.
$$

（它们都不能对角化：如果能，它们就会与 $\begin{bmatrix} 4 & 0 \\ 0 & 4 \end{bmatrix}$ 相似，而那个矩阵只与它自己相似。）

再看这一个：

$$
A = \begin{bmatrix} 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{bmatrix}.
$$

它的特征值是四个 0。它的秩是 2，所以零空间的维数是 $4 - 2 = 2$。它有两个线性无关的特征向量，「缺了」两个特征向量。如果改看

$$
B = \begin{bmatrix} 0 & 1 & 7 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{bmatrix},
$$

它的秩和零空间的维数仍然是 2，但不像 $A$ 那么好看。$B$ 与 $A$ 相似，而 $A$ 是这个家族的若尔当标准形代表。$A$ 每缺一个特征向量，对角线上方就有一个 1，其余元素都是 0。

再考虑

$$
C = \begin{bmatrix} 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 1 \\ 0 & 0 & 0 & 0 \end{bmatrix}.
$$

它的秩同样是 2，零空间的维数同样是 2，四个特征值也都是 0。令人意外的是，它与 $A$ **不**相似。把矩阵分成**若尔当块**就能看出这一点：$A$ 由一个 3 × 3 的块和一个 1 × 1 的块组成，而 $C$ 由两个 2 × 2 的块组成。

若尔当块 $J_i$ 的对角线上是重复的特征值 $\lambda_i$，对角线下方和右上角都是 0，对角线正上方是 1：

$$
J_i = \begin{bmatrix} \lambda_i & 1 & 0 & \cdots & 0 \\ 0 & \lambda_i & 1 & & 0 \\ \vdots & & \ddots & \ddots & \vdots \\ 0 & 0 & & \lambda_i & 1 \\ 0 & 0 & \cdots & 0 & \lambda_i \end{bmatrix}.
$$

两个矩阵可能有相同的特征值和相同个数的特征向量，但如果它们的若尔当块大小不同，这两个矩阵就不可能相似。

**若尔当定理**说：每个方阵 $A$ 都与一个若尔当矩阵 $J$ 相似，$J$ 的对角线上是若尔当块：

$$
J = \begin{bmatrix} J_1 & 0 & \cdots & 0 \\ 0 & J_2 & \cdots & 0 \\ \vdots & & \ddots & \vdots \\ 0 & 0 & \cdots & J_d \end{bmatrix}.
$$

在若尔当矩阵中，特征值在对角线上，对角线上方可能有一些 1，其余元素都是零。块的个数等于特征向量的个数——每个块对应一个特征向量。

总结：

- 如果 $A$ 有 $n$ 个互不相同的特征值，它就可以对角化，它的若尔当矩阵就是对角矩阵 $J = \Lambda$。
- 如果 $A$ 有重特征值，并且「缺」特征向量，那么它的若尔当矩阵在对角线上方有 $n - d$ 个 1（$d$ 是线性无关特征向量的个数）。

我们还没有学怎样计算一个缺特征向量的矩阵的若尔当矩阵，但我们知道怎样对角化有 $n$ 个互不相同特征值的矩阵。
