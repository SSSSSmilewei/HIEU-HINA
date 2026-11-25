# 考试 1：试卷与解答

> 本页是 MIT 开放式课程 18.06SC 单元 1 考试及官方解答的中文翻译，原文见页面下方的「试卷原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

**建议的做法**：找一段完整的 50 分钟，不看讲义，像真正考试一样做完四道题，再展开解答对照、给自己打分（满分 100 分）。

## 第 1 题（24 分）

这道题是关于一个 $m \times n$ 矩阵 $A$，它满足：$Ax = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$ **无解**，而 $Ax = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$ **恰好有一个解**。

(a) 给出关于 $m$、$n$ 以及 $A$ 的秩 $r$ 的一切可能信息。

(b) 求 $Ax = 0$ 的全部解，并**说明理由**。

(c) 写出一个符合 (a) 中描述的矩阵 $A$ 的例子。

<details>
<summary>解答</summary>

(a) $Ax = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$ 有**唯一**解 $\Longrightarrow N(A) = \{0\}$，所以 $r = n$。（另外，因为 $Ax \in \mathbb{R}^3$，所以 $m = 3$。）

$Ax = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$ 无解 $\Longrightarrow C(A) \ne \mathbb{R}^3$，所以 $r < m$。

有两种可能：$m = 3$、$r = n = 1$，以及 $m = 3$、$r = n = 2$。

(b) 因为 $N(A) = \{0\}$（因为 $Ax = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$ 只有 1 个解），$Ax = 0$ 有唯一解，显然就是 $x = 0$。（根据 $n = 1$ 还是 $n = 2$，它是 $x = \begin{bmatrix} 0 \end{bmatrix}$ 或 $x = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$。）

(c) $A$ 可以是 $\begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$ 或 $\begin{bmatrix} 1 & 0 \\ 0 & 1 \\ 0 & 0 \end{bmatrix}$（还有很多别的可能）。

</details>

## 第 2 题（24 分）

3 × 3 矩阵 $A$ 经过下面三步行变换（按顺序）化成单位矩阵 $I$：

- $E_{21}$：第 2 行减去第 1 行的 4 倍。
- $E_{31}$：第 3 行减去第 1 行的 3 倍。
- $E_{23}$：第 2 行减去第 3 行。

(a) 用这几个 $E$ 写出逆矩阵 $A^{-1}$。**然后算出 $A^{-1}$。**

(b) 原来的矩阵 $A$ 是什么？

(c) $A = LU$ 中的下三角因子 $L$ 是什么？

<details>
<summary>解答</summary>

(a) 对 $I$ 依次施行这三步变换，即 $A^{-1} = E_{23}E_{31}E_{21}$：

$$
\begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \to
\begin{bmatrix} 1 & 0 & 0 \\ -4 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \to
\begin{bmatrix} 1 & 0 & 0 \\ -4 & 1 & 0 \\ -3 & 0 & 1 \end{bmatrix} \to
\begin{bmatrix} 1 & 0 & 0 \\ -1 & 1 & -1 \\ -3 & 0 & 1 \end{bmatrix} = A^{-1}.
$$

(b) 对 $I$ 按相反的顺序施行逆变换，即 $A = E_{21}^{-1}E_{31}^{-1}E_{23}^{-1}$：

$$
\begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \to
\begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 1 \\ 0 & 0 & 1 \end{bmatrix} \to
\begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 1 \\ 3 & 0 & 1 \end{bmatrix} \to
\begin{bmatrix} 1 & 0 & 0 \\ 4 & 1 & 1 \\ 3 & 0 & 1 \end{bmatrix} = A.
$$

验算：

$$
\begin{bmatrix} 1 & 0 & 0 \\ 4 & 1 & 1 \\ 3 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 \\ -1 & 1 & -1 \\ -3 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}.
$$

(c)

$$
L = E_{21}^{-1}E_{31}^{-1} = \begin{bmatrix} 1 & & \\ 4 & 1 & \\ & & 1 \end{bmatrix} \begin{bmatrix} 1 & & \\ & 1 & \\ 3 & & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 4 & 1 & 0 \\ 3 & 0 & 1 \end{bmatrix}.
$$

（对应的 $U = L^{-1}A = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 1 \\ 0 & 0 & 1 \end{bmatrix}$，已经是上三角矩阵；最后一步 $E_{23}$ 是把 $U$ 继续化成 $I$ 的向上消元。）

</details>

## 第 3 题（28 分）

这个 3 × 4 矩阵依赖于 $c$：

$$
A = \begin{bmatrix} 1 & 1 & 2 & 4 \\ 3 & c & 2 & 8 \\ 0 & 0 & 2 & 2 \end{bmatrix}.
$$

(a) **对每个 $c$**，求 $A$ 的列空间的一组基。

(b) **对每个 $c$**，求 $A$ 的零空间的一组基。

(c) **对每个 $c$**，求 $Ax = \begin{bmatrix} 1 \\ c \\ 0 \end{bmatrix}$ 的完全解 $x$。

<details>
<summary>解答</summary>

(a) 消元得到 $\begin{bmatrix} 1 & 1 & 2 & 4 \\ 0 & c - 3 & -4 & -4 \\ 0 & 0 & 2 & 2 \end{bmatrix}$，所以分两种情况：

如果 $c \ne 3$，$c - 3$ 是主元，

$$
U = \begin{bmatrix} \boxed{1} & 1 & 2 & 4 \\ 0 & \boxed{c - 3} & -4 & -4 \\ 0 & 0 & \boxed{2} & 2 \end{bmatrix} \longrightarrow R = \begin{bmatrix} 1 & 0 & 0 & 2 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 1 \end{bmatrix},
$$

所以 $C(A)$ 的一组基是 $A$ 的前三列：$\left\{\begin{bmatrix} 1 \\ 3 \\ 0 \end{bmatrix}, \begin{bmatrix} 1 \\ c \\ 0 \end{bmatrix}, \begin{bmatrix} 2 \\ 2 \\ 2 \end{bmatrix}\right\}$。

如果 $c = 3$，$c - 3 = 0$，

$$
U = \begin{bmatrix} \boxed{1} & 1 & 2 & 4 \\ 0 & 0 & \boxed{-4} & -4 \\ 0 & 0 & 0 & 0 \end{bmatrix} \longrightarrow R = \begin{bmatrix} 1 & 1 & 0 & 2 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 0 \end{bmatrix},
$$

所以取 $A$ 的第一列和第三列作为 $C(A)$ 的一组基：$\left\{\begin{bmatrix} 1 \\ 3 \\ 0 \end{bmatrix}, \begin{bmatrix} 2 \\ 2 \\ 2 \end{bmatrix}\right\}$。

(b) 如果 $c \ne 3$，特解给出 $N(A) = \left\{ x_4\begin{bmatrix} -2 \\ 0 \\ -1 \\ 1 \end{bmatrix} \right\}$。

如果 $c = 3$，特解给出 $N(A) = \left\{ x_2\begin{bmatrix} -1 \\ 1 \\ 0 \\ 0 \end{bmatrix} + x_4\begin{bmatrix} -2 \\ 0 \\ -1 \\ 1 \end{bmatrix} \right\}$。

(c) 观察可知 $x_p = \begin{bmatrix} 0 \\ 1 \\ 0 \\ 0 \end{bmatrix}$ 是一个特解（也有别的正确答案）——右端正好是 $A$ 的第二列。

$c \ne 3$ 时，完全解是 $\begin{bmatrix} 0 \\ 1 \\ 0 \\ 0 \end{bmatrix} + x_4\begin{bmatrix} -2 \\ 0 \\ -1 \\ 1 \end{bmatrix}$。

$c = 3$ 时，完全解是 $\begin{bmatrix} 0 \\ 1 \\ 0 \\ 0 \end{bmatrix} + x_2\begin{bmatrix} -1 \\ 1 \\ 0 \\ 0 \end{bmatrix} + x_4\begin{bmatrix} -2 \\ 0 \\ -1 \\ 1 \end{bmatrix}$。

</details>

## 第 4 题（24 分）

(a) 如果 $A$ 是 3 × 5 矩阵，关于 $A$ 的零空间你知道些什么？

(b) 设对 $A$ 做行变换得到这个矩阵 $R = \operatorname{rref}(A)$：

$$
R = \begin{bmatrix} 1 & 4 & 0 & 0 & 0 \\ 0 & 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 0 & 1 \end{bmatrix}.
$$

写出关于 $A$ 的各列的所有已知信息。

(c) 在所有 3 × 3 矩阵组成的向量空间 $M$（可以叫它矩阵空间）中，所有可能的行最简形 $R$ 张成的子空间 $S$ 是什么？

<details>
<summary>解答</summary>

(a) $N(A)$ 的维数**至少**是 2（至多是 5）。

(b)（7 分）$A$ 的第 1、4、5 列构成 $C(A)$ 的一组基。

（约 1 分）第 2 列是第 1 列的 4 倍；第 3 列是 $\begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$。

(c) $S = \left\{\begin{bmatrix} a & b & c \\ 0 & d & e \\ 0 & 0 & f \end{bmatrix}\right\}$，即所有上三角矩阵组成的集合。

（由六个行最简形组成的一组基是

$$
\begin{bmatrix} 1 & & \\ & 1 & \\ & & 1 \end{bmatrix}, \
\begin{bmatrix} 1 & & \\ & 1 & \\ & & \ \end{bmatrix}, \
\begin{bmatrix} 1 & & \\ & & 1 \\ & & \ \end{bmatrix}, \
\begin{bmatrix} 1 & & \\ & & \\ & & \ \end{bmatrix}, \
\begin{bmatrix} 1 & 1 & \\ & & \\ & & \ \end{bmatrix}, \
\begin{bmatrix} 1 & & 1 \\ & & \\ & & \ \end{bmatrix},
$$

空白处都是 0。）

</details>
