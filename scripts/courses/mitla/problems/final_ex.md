# 期末考试：试卷与解答

> 本页是 MIT 开放式课程 18.06SC 期末考试及官方解答的中文翻译，原文见页面下方的「试卷原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

**建议的做法**：找一段完整的 3 小时，不看讲义，像真正考试一样做完九道题，再展开解答对照、给自己打分（满分 100 分）。

## 第 1 题（4 + 7 = 11 分）

设 $A$ 是 3 × 4 矩阵，$Ax = 0$ 恰好有 2 个特解：

$$
x_1 = \begin{bmatrix} 1 \\ 1 \\ 1 \\ 0 \end{bmatrix}, \qquad x_2 = \begin{bmatrix} -2 \\ -1 \\ 0 \\ 1 \end{bmatrix}.
$$

(a) 记住 $A$ 是 3 × 4 矩阵，求它的行最简形 $R$。

(b) 求四个基本子空间 $C(A)$、$N(A)$、$C(A^T)$、$N(A^T)$ 的维数。

你有足够的信息求出其中一个或几个子空间的基——把它们求出来。

<details>
<summary>解答</summary>

(a) 每个特解给出的是：令一个自由变量为 1、其余自由变量为 0 时 $Rx = 0$ 的解。这里第三、第四个变量一定是两个自由变量，另外两个是主变量：

$$
R = \begin{bmatrix} 1 & 0 & * & * \\ 0 & 1 & * & * \\ 0 & 0 & 0 & 0 \end{bmatrix}.
$$

再算出 $Rx_1 = 0$ 和 $Rx_2 = 0$，就求出各个 $*$：

$$
R = \begin{bmatrix} 1 & 0 & -1 & 2 \\ 0 & 1 & -1 & 1 \\ 0 & 0 & 0 & 0 \end{bmatrix}.
$$

（*各个 $*$ 正好是特解中主变量分量的相反数。*）

(b) 零空间 $N(A)$ 的维数是 $n - r = 4 - 2 = 2$：特解 $x_1$、$x_2$ 构成一组基。

行空间 $C(A^T)$ 的维数是 $r = 2$。它与 $N(A)$ 正交，所以只要选两个与 $x_1$、$x_2$ 都正交的线性无关向量作为基即可，例如

$$
x_3 = \begin{bmatrix} 1 \\ 0 \\ -1 \\ 2 \end{bmatrix}, \qquad x_4 = \begin{bmatrix} 0 \\ 1 \\ -1 \\ 1 \end{bmatrix}.
$$

（*或者：$C(A^T) = C(R^T)$ 就是 $R$ 的行空间，所以 $R$ 的前两行就是一组基。结果一样！*）

列空间 $C(A)$ 的维数是 $r = 2$（与 $C(A^T)$ 相同）。我们不知道 $A$ 是什么，所以写不出一组基，但可以说 $A$ 的前两列是一组基。

左零空间 $N(A^T)$ 的维数是 $m - r = 1$；它与 $C(A)$ 正交，所以任何与 $A$ 的前两列（不管它们是什么）都正交的非零向量都是一组基。

</details>

## 第 2 题（6 + 3 + 2 = 11 分）

(a) 求一个元素 $a, b, c, d, e, f$ 都**非零**的 3 × 3 上三角矩阵 $U$ 的逆。可以用余子式和逆矩阵公式，也可以用高斯-若尔当消元。

$$
U = \begin{bmatrix} a & b & c \\ 0 & d & e \\ 0 & 0 & f \end{bmatrix}.
$$

(b) 设 $U$ 的各列是矩阵 $A$ 的特征向量。证明 $A$ 也是上三角矩阵。

(c) 解释为什么这个 $U$ **不可能**是奇异值分解 $A = U\Sigma V^T$ 中的第一个因子。

<details>
<summary>解答</summary>

(a) *用消元*：（一边记录消元矩阵 $E$，另一边记录乘积 $EU$。当 $EU = I$ 时，$E = U^{-1}$。）

$$
\left[\begin{array}{ccc|ccc} a & b & c & 1 & 0 & 0 \\ 0 & d & e & 0 & 1 & 0 \\ 0 & 0 & f & 0 & 0 & 1 \end{array}\right]
\rightsquigarrow
\left[\begin{array}{ccc|ccc} 1 & b/a & c/a & 1/a & 0 & 0 \\ 0 & 1 & e/d & 0 & 1/d & 0 \\ 0 & 0 & 1 & 0 & 0 & 1/f \end{array}\right]
\rightsquigarrow
\left[\begin{array}{ccc|ccc} 1 & 0 & 0 & 1/a & -b/ad & (be - cd)/adf \\ 0 & 1 & 0 & 0 & 1/d & -e/df \\ 0 & 0 & 1 & 0 & 0 & 1/f \end{array}\right]
= \begin{bmatrix} I & U^{-1} \end{bmatrix}.
$$

*用余子式*：（先求各个子式，再按「棋盘」规律加上正负号得到余子式矩阵，然后转置，再除以 $\det U = adf$。）

$$
\begin{bmatrix} df & 0 & 0 \\ bf & af & 0 \\ be - cd & ae & ad \end{bmatrix}
\rightsquigarrow
\begin{bmatrix} df & 0 & 0 \\ -bf & af & 0 \\ be - cd & -ae & ad \end{bmatrix}
\rightsquigarrow
\begin{bmatrix} df & -bf & be - cd \\ 0 & af & -ae \\ 0 & 0 & ad \end{bmatrix}
\rightsquigarrow
\begin{bmatrix} 1/a & -b/ad & (be - cd)/adf \\ 0 & 1/d & -e/df \\ 0 & 0 & 1/f \end{bmatrix} = U^{-1}.
$$

(b) $A$ 有一整组特征向量，所以可以对角化：$A = U\Lambda U^{-1}$。已知 $U$ 是上三角矩阵，对角矩阵 $\Lambda$ 也是，而我们刚刚证明了 $U^{-1}$ 也是上三角矩阵。所以它们的乘积 $A$ 也是上三角矩阵。

(c) 它的各列不互相正交！（例如前两列的乘积 $u_1^Tu_2 = ab + 0d + 0 \cdot 0 = ab$，因为我们假设所有元素都非零，它不为零。）

</details>

## 第 3 题（3 + 3 + 5 = 11 分）

(a) $A$ 和 $B$ 是行数相同的任意矩阵。比较下面两者，你能说些什么？（*并解释为什么成立。*）

$$
A \text{ 的秩} \qquad \text{分块矩阵 } \begin{bmatrix} A & B \end{bmatrix} \text{ 的秩}
$$

(b) 设 $B = A^2$。这两个秩怎样比较？说明你的推理。

(c) 如果 $A$ 是秩为 $r$ 的 $m \times n$ 矩阵，下面两个零空间的维数各是多少？

$$
A \text{ 的零空间} \qquad \begin{bmatrix} A & A \end{bmatrix} \text{ 的零空间}
$$

<details>
<summary>解答</summary>

(a) 只能说 $\operatorname{rank} A \le \operatorname{rank}\begin{bmatrix} A & B \end{bmatrix}$。（$A$ 可以有任意个数 $r$ 的主元列，它们都会是 $\begin{bmatrix} A & B \end{bmatrix}$ 的主元列；但 $B$ 的各列中可能还有更多的主元列。）

(b) 现在 $\operatorname{rank} A = \operatorname{rank}\begin{bmatrix} A & A^2 \end{bmatrix}$。（$A^2$ 的每一列都是 $A$ 的各列的线性组合。例如，如果把 $A$ 的第一列记作 $a_1$，那么 $Aa_1$ 就是 $A^2$ 的第一列。所以 $\begin{bmatrix} A & A^2 \end{bmatrix}$ 中 $A^2$ 那部分不会出现新的主元列。）

（译注：(b) 要求 $A^2$ 有意义，所以这里 $A$ 是方阵。）

(c) 和往常一样，零空间 $N(A)$ 的维数是 $n - r$。因为 $\begin{bmatrix} A & A \end{bmatrix}$ 只有 $r$ 个主元列——新加的 $n$ 列全是重复的——$\begin{bmatrix} A & A \end{bmatrix}$ 是秩为 $r$ 的 $m \times 2n$ 矩阵，它的零空间 $N(\begin{bmatrix} A & A \end{bmatrix})$ 的维数是 $2n - r$。

</details>

## 第 4 题（3 + 4 + 5 = 12 分）

设 $A$ 是 5 × 3 矩阵，并且 $Ax$ 永远不为零（除非 $x$ 是零向量）。

(a) 关于 $A$ 的各列能说些什么？

(b) 证明 $A^TAx$ 也永远不为零（除非 $x = 0$），为此解释这个关键步骤：如果 $A^TAx = 0$，那么显然 $x^TA^TAx = 0$，于是（为什么？）$Ax = 0$。

(c) 现在我们知道 $A^TA$ 可逆。解释为什么 $B = (A^TA)^{-1}A^T$ 是 $A$ 的单边逆（在 $A$ 的哪一边？）。$B$ **不是** $A$ 的双边逆（*说明为什么不是*）。

<details>
<summary>解答</summary>

(a) $N(A) = \{0\}$，所以 $A$ 列满秩 $r = n = 3$：各列线性无关。

(b) $x^TA^TAx = (Ax)^TAx$ 是 $Ax$ 长度的平方。它为零的唯一可能是 $Ax$ 的长度为零（即 $Ax = 0$）。

(c) $B$ 是 $A$ 的左逆，因为 $BA = (A^TA)^{-1}A^TA = I$ 是（3 × 3）单位矩阵。$B$ 不是 $A$ 的右逆，因为 $AB$ 是 5 × 5 矩阵，而它的秩最多是 3。（事实上，$AB = A(A^TA)^{-1}A^T$ 是投影到 $A$ 的（3 维）列空间上的投影矩阵。）

（译注：原文最后一句写成 $BA = A(A^TA)^{-1}A^T$，按上下文应为 $AB$，译文已更正。）

</details>

## 第 5 题（5 + 5 = 10 分）

如果 $A$ 是 3 × 3 对称正定矩阵，那么 $Aq_i = \lambda_iq_i$，特征值都为正，特征向量 $q_i$ 标准正交。

设 $x = c_1q_1 + c_2q_2 + c_3q_3$。

(a) 用各个 $c$ 和 $\lambda$ 计算 $x^Tx$ 和 $x^TAx$。

(b) 看 (a) 中 $x^TAx$ 与 $x^Tx$ 之比，什么样的 $c$ 能让这个比值尽可能大？可以假设 $\lambda_1 < \lambda_2 < \cdots < \lambda_n$。结论：当 $x$ 是 ______ 时，比值 $x^TAx / x^Tx$ 最大。

<details>
<summary>解答</summary>

(a)

$$
\begin{aligned}
x^Tx &= (c_1q_1^T + c_2q_2^T + c_3q_3^T)(c_1q_1 + c_2q_2 + c_3q_3) \\
&= c_1^2q_1^Tq_1 + c_1c_2q_1^Tq_2 + \cdots + c_3c_2q_3^Tq_2 + c_3^2q_3^Tq_3 \\
&= c_1^2 + c_2^2 + c_3^2.
\end{aligned}
$$

$$
\begin{aligned}
x^TAx &= (c_1q_1^T + c_2q_2^T + c_3q_3^T)(c_1Aq_1 + c_2Aq_2 + c_3Aq_3) \\
&= (c_1q_1^T + c_2q_2^T + c_3q_3^T)(c_1\lambda_1q_1 + c_2\lambda_2q_2 + c_3\lambda_3q_3) \\
&= c_1^2\lambda_1q_1^Tq_1 + c_1c_2\lambda_2q_1^Tq_2 + \cdots + c_3c_2\lambda_2q_3^Tq_2 + c_3^2\lambda_3q_3^Tq_3 \\
&= c_1^2\lambda_1 + c_2^2\lambda_2 + c_3^2\lambda_3.
\end{aligned}
$$

(b) 当 $c_1 = c_2 = 0$ 时，$(c_1^2\lambda_1 + c_2^2\lambda_2 + c_3^2\lambda_3)/(c_1^2 + c_2^2 + c_3^2)$ 取最大值，所以 $x = c_3q_3$ 是对应最大特征值 $\lambda_3$ 的特征向量 $q_3$ 的倍数。

（*还要注意，这个「瑞利商」$x^TAx / x^Tx$ 的最大值就是最大特征值本身。这是求特征向量的另一种方法：用数值方法求 $x^TAx / x^Tx$ 的最大值。*）

</details>

## 第 6 题（4 + 4 + 4 = 12 分）

(a) 求线性无关的向量 $v$ 和 $u$ 的一个线性组合 $w$，使它垂直于 $u$。

(b) 对两列的矩阵 $A = \begin{bmatrix} u & v \end{bmatrix}$，求 $Q$（各列标准正交）和 $R$（2 × 2 上三角矩阵），使 $A = QR$。

(c) 只用 $Q$ 表示，利用 $A = QR$，求投影到 $u$、$v$ 张成的平面上的投影矩阵 $P$。

<details>
<summary>解答</summary>

(a) 你可以直接写 $w = 0u + 0v = 0$——它和一切向量都垂直！但更有用的选择是从 $v$ 中减去恰好够多的 $u$，使 $w = v - cu$ 垂直于 $u$。这意味着 $0 = w^Tu = v^Tu - cu^Tu$，所以 $c = (v^Tu)/(u^Tu)$，

$$
w = v - \left(\frac{v^Tu}{u^Tu}\right)u.
$$

(b) 我们已经知道 $u$ 和 $w$ 正交，只要把它们单位化！取 $q_1 = u/\|u\|$、$q_2 = w/\|w\|$。然后解出 $R$ 的两列 $r_1$、$r_2$：$Qr_1 = u$，所以 $r_1 = \begin{bmatrix} \|u\| \\ 0 \end{bmatrix}$；$Qr_2 = v$，所以 $r_2 = \begin{bmatrix} c\|u\| \\ \|w\| \end{bmatrix}$（其中 $c = (v^Tu)/(u^Tu)$，同上）。

于是 $Q = \begin{bmatrix} q_1 & q_2 \end{bmatrix}$，$R = \begin{bmatrix} r_1 & r_2 \end{bmatrix}$。

(c)

$$
P = A(A^TA)^{-1}A^T = (QR)(R^TQ^TQR)^{-1}(R^TQ^T) = (QR)R^{-1}(R^T)^{-1}(R^TQ^T) = QQ^T.
$$

（译注：原文中间一步省略了 $R^{-1}(R^T)^{-1}$，译文补全了。）

</details>

## 第 7 题（4 + 3 + 4 = 11 分）

(a) 求下面两个矩阵的特征值：

$$
C = \begin{bmatrix} 0 & 0 & 0 & 1 \\ 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \end{bmatrix}, \qquad
C^2 = \begin{bmatrix} 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \\ 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \end{bmatrix}.
$$

(b) 它们都是置换矩阵。它们的逆 $C^{-1}$ 和 $(C^2)^{-1}$ 是什么？

(c) 求 $C$、$C + I$ 和 $C + 2I$ 的行列式。

<details>
<summary>解答</summary>

(a) 求 $C - \lambda I$ 的行列式（我用的是余子式展开）：$\lambda^4 - 1 = 0$。这个「特征方程」的根就是特征值：$+1, -1, i, -i$。

$C^2$ 的特征值就是 $\lambda^2 = \pm 1$（各两个）。

（*这里还有一种「猜」的办法。因为 $C^4 = I$，$C^4$ 的所有特征值 $\lambda^4$ 都是 1：所以 $\lambda = 1, -1, i, -i$ 是仅有的可能。只要检验哪些成立就行。于是 $C^2$ 的特征值一定是 $\pm 1$。*）

(b) 对任何置换矩阵，$C^{-1} = C^T$，所以

$$
C^{-1} = \begin{bmatrix} 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \\ 1 & 0 & 0 & 0 \end{bmatrix},
$$

而 $(C^2)^{-1} = C^2$ 就是它自己。

(c) $C$ 的行列式是它的特征值之积：$1(-1)i(-i) = \underline{-1}$。

每个特征值加 1，就得到 $C + I$ 的特征值（如果 $C = S\Lambda S^{-1}$，那么 $C + I = S(\Lambda + I)S^{-1}$）：$2(0)(1 + i)(1 - i) = \underline{0}$。

（*或者在特征方程 $\det(C - \lambda I)$ 中令 $\lambda = -1$。*）

加 2 就得到 $C + 2I$ 的特征值（或者令 $\lambda = -2$）：$3(1)(2 + i)(2 - i) = \underline{15}$。

</details>

## 第 8 题（4 + 3 + 4 = 11 分）

设长方形矩阵 $A$ 的各列线性无关。

(a) 怎样求 $Ax = b$ 的最佳最小二乘解 $\hat{x}$？按这些步骤，给出 $\hat{x}$ 以及 $p = A\hat{x}$ 的公式（用字母，不用数字）。

(b) 投影 $p$ 在与 $A$ 相关的哪个基本子空间中？误差向量 $e = b - p$ 在哪个基本子空间中？

(c) 用任何方法求投影到下面这个 $A$ 的列空间上的投影矩阵 $P$：

$$
A = \begin{bmatrix} 1 & 0 \\ 3 & 0 \\ 0 & -1 \\ 0 & -3 \end{bmatrix}.
$$

<details>
<summary>解答</summary>

(a)

$$
\begin{aligned}
Ax &= b \\
\text{最小二乘「解」：}\quad A^TA\hat{x} &= A^Tb \\
A^TA \text{ 可逆：}\quad \hat{x} &= (A^TA)^{-1}A^Tb \\
p = A\hat{x} \text{ 是：}\quad A\hat{x} &= A(A^TA)^{-1}A^Tb
\end{aligned}
$$

(b) $p = A\hat{x}$ 是 $A$ 的各列的线性组合，所以它在列空间 $C(A)$ 中。误差 $e = b - p$ 与这个空间正交，所以它在左零空间 $N(A^T)$ 中。

(c) 我用了 $P = A(A^TA)^{-1}A^T$。因为 $A^TA = \begin{bmatrix} 10 & 0 \\ 0 & 10 \end{bmatrix}$，它的逆是 $\begin{bmatrix} 1/10 & 0 \\ 0 & 1/10 \end{bmatrix} = \frac{1}{10}I$，于是

$$
P = \frac{1}{10}\begin{bmatrix} 1 & 3 & 0 & 0 \\ 3 & 9 & 0 & 0 \\ 0 & 0 & 1 & 3 \\ 0 & 0 & 3 & 9 \end{bmatrix}.
$$

</details>

## 第 9 题（3 + 4 + 4 = 11 分）

这道题是关于主对角线上是 3、上方对角线上是 2、下方对角线上是 1 的矩阵：

$$
A_1 = \begin{bmatrix} 3 \end{bmatrix}, \quad
A_2 = \begin{bmatrix} 3 & 2 \\ 1 & 3 \end{bmatrix}, \quad
A_3 = \begin{bmatrix} 3 & 2 & 0 \\ 1 & 3 & 2 \\ 0 & 1 & 3 \end{bmatrix}, \quad
A_n = \begin{bmatrix} 3 & 2 & 0 & 0 \\ 1 & 3 & 2 & 0 \\ 0 & 1 & 3 & \ddots \\ 0 & 0 & \ddots & \ddots \end{bmatrix}.
$$

(a) $A_2$ 和 $A_3$ 的行列式是多少？

(b) $A_n$ 的行列式记作 $D_n$。用第 1 行和第 1 列的余子式，求 $D_n$ 的递推公式中的数 $a$ 和 $b$：

$$
(*) \qquad D_n = a\,D_{n-1} + b\,D_{n-2}.
$$

(c) 方程 $(*)$ 等价于

$$
\begin{bmatrix} D_n \\ D_{n-1} \end{bmatrix} = \begin{bmatrix} a & b \\ 1 & 0 \end{bmatrix} \begin{bmatrix} D_{n-1} \\ D_{n-2} \end{bmatrix}.
$$

从这个矩阵的特征值看，行列式 $D_n$ 增长得多快？（如果你没求出 $a$ 和 $b$，就说说对任意的 $a$ 和 $b$ 你会怎样回答 (c)。）另加 1 分：求 $D_5$。

<details>
<summary>解答</summary>

(a) $\det(A_2) = 3 \cdot 3 - 1 \cdot 2 = 7$，$\det(A_3) = 3\det(A_2) - 2 \cdot 1 \cdot 3 = 15$。

(b) $D_n = 3D_{n-1} + (-2)D_{n-2}$。（*要写出推导过程。*）

（按第 1 行展开：第一项是 $3D_{n-1}$；第二项是 $-2$ 乘以去掉第 1 行第 2 列后的子式，而这个子式再按第 1 列展开，等于 $1 \cdot D_{n-2}$。所以 $a = 3$，$b = -2$。）

(c) 这个矩阵的迹是 $a = 3$，行列式是 $-b = 2$。所以它的特征方程是 $\lambda^2 - a\lambda - b = 0$，根（矩阵的特征值）是

$$
\lambda_\pm = \frac{a \pm \sqrt{a^2 - 4(-b)}}{2} = \frac{3 \pm 1}{2} = 1 \text{ 或 } 2.
$$

$D_n$ 的增长速度与这个矩阵的 $n$ 次幂的最大特征值 $\lambda_+^n = 2^n$ 相同。

最后那 1 分：$D_4 = 3D_3 - 2D_2 = 45 - 14 = 31$，$D_5 = 3D_4 - 2D_3 = 93 - 30 = 63$。

（译注：原文解答写的是 $D_5 = 3D_4 + 2D_3 = \cdots = 207$，把 (b) 中的 $b = -2$ 错用成了 $+2$。按正确的递推，$D_n = 2^{n+1} - 1$：$D_1 = 3$、$D_2 = 7$、$D_3 = 15$、$D_4 = 31$、$D_5 = 63$，译文已更正。）

</details>
