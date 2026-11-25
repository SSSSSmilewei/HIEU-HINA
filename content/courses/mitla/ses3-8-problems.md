# 习题：左逆、右逆与伪逆

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 32.1

求 $A = \begin{bmatrix} 1 & 0 & 1 \\ 0 & 1 & 0 \end{bmatrix}$ 的一个右逆。

<details>
<summary>解答</summary>

用公式 $A^{-1}_{\text{right}} = A^T(AA^T)^{-1}$：

$$
A^T = \begin{bmatrix} 1 & 0 \\ 0 & 1 \\ 1 & 0 \end{bmatrix}, \qquad
AA^T = \begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}, \qquad
(AA^T)^{-1} = \begin{bmatrix} 1/2 & 0 \\ 0 & 1 \end{bmatrix},
$$

$$
A^T(AA^T)^{-1} = \begin{bmatrix} 1/2 & 0 \\ 0 & 1 \\ 1/2 & 0 \end{bmatrix}.
$$

所以 $A^{-1}_{\text{right}} = \begin{bmatrix} 1/2 & 0 \\ 0 & 1 \\ 1/2 & 0 \end{bmatrix}$ 是 $A$ 的一个右逆。很快就能验证 $AA^{-1}_{\text{right}} = I$。

</details>

## 习题 32.2

矩阵 $A = \begin{bmatrix} 4 & 3 \\ 8 & 6 \end{bmatrix}$ 有左逆吗？有右逆吗？有伪逆吗？如果其中某个问题的答案是「有」，求出相应的逆。

<details>
<summary>解答</summary>

$A$ 的第二行是第一行的倍数，所以 $A$ 的秩是 1，$\det A = 0$。因为 $A$ 是方阵，它的行列式有定义，可以利用 $\det C \cdot \det D = \det(CD)$ 证明 $A$ 不可能有左逆或右逆。（如果 $AB = I$，那么 $\det A \det B = \det I$ 意味着 $0 = 1$。）

我们可以为 $A$ 求一个伪逆 $A^+ = V\Sigma^+U^T$。先求 $A$ 的奇异值分解 $U\Sigma V^T$。

$A$ 的 SVD 在奇异值分解那一讲已经算过，所以

$$
\underbrace{\begin{bmatrix} 4 & 3 \\ 8 & 6 \end{bmatrix}}_{A} = \underbrace{\frac{1}{\sqrt5}\begin{bmatrix} 1 & 2 \\ 2 & -1 \end{bmatrix}}_{U} \underbrace{\begin{bmatrix} \sqrt{125} & 0 \\ 0 & 0 \end{bmatrix}}_{\Sigma} \underbrace{\begin{bmatrix} .8 & .6 \\ .6 & -.8 \end{bmatrix}}_{V^T}.
$$

因此 $\Sigma^+ = \begin{bmatrix} 1/\sqrt{125} & 0 \\ 0 & 0 \end{bmatrix}$，并且

$$
\begin{aligned}
A^+ = V\Sigma^+U^T &= \begin{bmatrix} .8 & .6 \\ .6 & -.8 \end{bmatrix} \begin{bmatrix} 1/\sqrt{125} & 0 \\ 0 & 0 \end{bmatrix} \frac{1}{\sqrt5}\begin{bmatrix} 1 & 2 \\ 2 & -1 \end{bmatrix} \\
&= \begin{bmatrix} .8 & .6 \\ .6 & -.8 \end{bmatrix} \begin{bmatrix} 1/25 & 0 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} 1 & 2 \\ 2 & -1 \end{bmatrix} \\
&= \frac{1}{125}\begin{bmatrix} 4 & 8 \\ 3 & 6 \end{bmatrix}.
\end{aligned}
$$

为了检验，我们用计算 SVD 时得到的基，确认 $A^+$ 在 $A$ 的行空间上把 $A$ 的作用反转回来。回顾

$$
Av_j = \begin{cases} \sigma_ju_j & j \le r \\ 0 & j > r. \end{cases}
$$

这里 $u_1 = \begin{bmatrix} 1/\sqrt5 \\ 2/\sqrt5 \end{bmatrix}$，$A^+u_1 = \dfrac{1}{5\sqrt{125}}\begin{bmatrix} 4 \\ 3 \end{bmatrix} = \dfrac{1}{\sqrt{125}}\begin{bmatrix} .8 \\ .6 \end{bmatrix} = \dfrac{1}{\sigma_1}v_1$。还可以验证 $A^+u_2 = \dfrac{1}{125}\begin{bmatrix} 4 & 8 \\ 3 & 6 \end{bmatrix}\begin{bmatrix} 2 \\ -1 \end{bmatrix} = 0$。

（译注：原文把中间一步写成 $\dfrac{1}{\sqrt{125}}\begin{bmatrix} 4 \\ 3 \end{bmatrix}$，少了因子 $\tfrac15$；验算：$\tfrac{1}{125}\begin{bmatrix} 4 & 8 \\ 3 & 6 \end{bmatrix}\begin{bmatrix} 1/\sqrt5 \\ 2/\sqrt5 \end{bmatrix} = \tfrac{1}{125\sqrt5}\begin{bmatrix} 20 \\ 15 \end{bmatrix} = \tfrac{1}{5\sqrt{125}}\begin{bmatrix} 4 \\ 3 \end{bmatrix}$。最后的结论 $\tfrac{1}{\sigma_1}v_1$ 是对的，译文已更正中间一步。）

</details>
