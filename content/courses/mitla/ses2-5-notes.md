# 行列式的性质

> 本页是 MIT 开放式课程 18.06SC 官方讲座摘要（lecture summary）的中文翻译，原文见页面下方的「讲座摘要原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

## 行列式

课程进行到一半，我们离开长方形矩阵，专注于方阵。接下来的两大主题是**行列式**和**特征值**。

行列式是与每个方阵相关联的一个数，记作 $\det A$ 或 $|A|$。行列式包含了关于矩阵的大量信息：**矩阵可逆，当且仅当它的行列式不为零。**

## 性质

我们不从一个大公式开始，而是列出行列式的性质。我们已经知道 $\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc$；下面这些性质将给出任意大小方阵的行列式公式。

1. $\det I = 1$。

2. 交换矩阵的两行，行列式的符号改变（由正变负，或由负变正）。

3. (a) 把矩阵的某一行乘以 $t$，行列式也乘以 $t$：$\begin{vmatrix} ta & tb \\ c & d \end{vmatrix} = t \begin{vmatrix} a & b \\ c & d \end{vmatrix}$。

   (b) 行列式对矩阵的每一行都是线性函数：

   $$
   \begin{vmatrix} a + a' & b + b' \\ c & d \end{vmatrix} = \begin{vmatrix} a & b \\ c & d \end{vmatrix} + \begin{vmatrix} a' & b' \\ c & d \end{vmatrix}.
   $$

性质 1 告诉我们 $\begin{vmatrix} 1 & 0 \\ 0 & 1 \end{vmatrix} = 1$；性质 2 告诉我们 $\begin{vmatrix} 0 & 1 \\ 1 & 0 \end{vmatrix} = -1$。

置换矩阵 $P$ 的行列式是 $1$ 或 $-1$，取决于 $P$ 交换的行数是偶数还是奇数。

由这三条性质可以推出许多其他性质：

4. **如果矩阵有两行相等，它的行列式为零。**

   这是由性质 2（交换法则）得到的。一方面，交换这两行相同的行，行列式不变；另一方面，交换两行会改变行列式的符号。所以行列式一定是 0。

5. **如果 $i \ne j$，从第 $j$ 行减去第 $i$ 行的 $t$ 倍，行列式不变。**

   在二维的情形，论证是这样的：

   $$
   \begin{aligned}
   \begin{vmatrix} a & b \\ c - ta & d - tb \end{vmatrix} &= \begin{vmatrix} a & b \\ c & d \end{vmatrix} - \begin{vmatrix} a & b \\ ta & tb \end{vmatrix} && \text{性质 3(b)} \\
   &= \begin{vmatrix} a & b \\ c & d \end{vmatrix} - t\begin{vmatrix} a & b \\ a & b \end{vmatrix} && \text{性质 3(a)} \\
   &= \begin{vmatrix} a & b \\ c & d \end{vmatrix} && \text{性质 4}.
   \end{aligned}
   $$

   更高维矩阵的证明是类似的。

6. **如果 $A$ 有一行全是零，那么 $\det A = 0$。**

   在性质 3(a) 中令 $t = 0$ 就得到这一点。

7. **三角矩阵的行列式是对角元（主元）$d_1, d_2, \ldots, d_n$ 的乘积。**

   性质 5 告诉我们，用消元把三角矩阵化成对角线上是 $d_i$ 的对角矩阵，行列式不变。然后性质 3(a) 告诉我们，这个对角矩阵的行列式等于 $d_1 d_2 \cdots d_n$ 乘以单位矩阵的行列式。性质 1 完成了论证。

   注意：如果某个 $d_i$ 是零，就不能用消元得到对角矩阵。这时消元会得到一个全零的行，由性质 6 得出想要的结论。

8. **$\det A = 0$ 当且仅当 $A$ 是奇异矩阵。**

   如果 $A$ 是奇异的，那么用消元可以得到一个全零的行，性质 6 告诉我们行列式为零。

   如果 $A$ 不是奇异的，那么消元会得到完整的一组主元 $d_1, d_2, \ldots, d_n$，行列式是 $d_1 d_2 \cdots d_n \ne 0$（行交换会带来负号）。

   现在我们有了计算非奇异矩阵行列式的一个非常实用的公式。事实上，计算机求大矩阵的行列式，就是先做消元（记录行交换的次数是奇数还是偶数），再把主元乘起来：

   $$
   \begin{bmatrix} a & b \\ c & d \end{bmatrix} \longrightarrow \begin{bmatrix} a & b \\ 0 & d - \frac{c}{a}b \end{bmatrix} \quad (a \ne 0),
   \qquad \text{所以} \qquad \begin{vmatrix} a & b \\ c & d \end{vmatrix} = a\left(d - \frac{c}{a}b\right) = ad - bc.
   $$

9. **$\det AB = (\det A)(\det B)$。**

   这一条非常有用。虽然和的行列式不等于行列式的和，但积的行列式确实等于行列式的积。

   例如

   $$
   \det A^{-1} = \frac{1}{\det A},
   $$

   因为 $A^{-1}A = I$。（注意：如果 $A$ 是奇异的，$A^{-1}$ 不存在，$\det A^{-1}$ 就没有定义。）另外 $\det A^2 = (\det A)^2$，以及 $\det 2A = 2^n \det A$（对矩阵的每一行应用性质 3）。这让我们想起体积：把一个三维盒子的长、宽、高都加倍，体积就变成原来的 $2^3 = 8$ 倍。

10. **$\det A^T = \det A$。**

    $$
    \begin{vmatrix} a & b \\ c & d \end{vmatrix} = \begin{vmatrix} a & c \\ b & d \end{vmatrix} = ad - bc.
    $$

    这一条让我们可以把关于行的性质（2、3、4、5、6）翻译成关于列的说法。例如，如果矩阵有一列全是零，那么它的行列式为零。

    要说明 $|A^T| = |A|$，用消元写出 $A = LU$，要证的式子就变成 $|U^T L^T| = |LU|$。由法则 9 得 $|U^T||L^T| = |L||U|$。矩阵 $L$ 是对角线上都是 1 的下三角矩阵，所以由法则 7 有 $|L| = |L^T| = 1$。$U$ 是上三角矩阵，由法则 7 有 $|U| = |U^T|$。因此 $|U^T||L^T| = |L||U|$，即 $|A^T| = |A|$。

还有一个遗留的问题需要担心。法则 2 告诉我们，交换两行会改变行列式的符号。如果做七次行交换和做十次行交换能得到同一个矩阵，我们就能「证明」行列式等于它自己的相反数。要完整证明行列式由性质 1、2、3 唯一确定，还需要证明：奇数次行交换（奇置换）的结果，永远不可能与偶数次行交换（偶置换）的结果相同。
