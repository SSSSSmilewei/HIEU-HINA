# 习题：微分方程与 exp(At)

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 23.1

（教材第 6.3 节第 14 题 a）这道题里的矩阵是反对称的（$A^T = -A$）：

$$
\frac{du}{dt} = \begin{bmatrix} 0 & c & -b \\ -c & 0 & a \\ b & -a & 0 \end{bmatrix} u, \qquad \text{即} \qquad \begin{aligned} u_1' &= cu_2 - bu_3 \\ u_2' &= au_3 - cu_1 \\ u_3' &= bu_1 - au_2. \end{aligned}
$$

利用定义 $\|u(t)\|^2 = u_1^2 + u_2^2 + u_3^2$，求 $\|u(t)\|^2$ 的导数。这说明 $u$ 的长度的变化率是多少？这又说明 $u(t)$ 的取值范围是什么？

<details>
<summary>解答</summary>

$$
\begin{aligned}
\frac{d\|u(t)\|^2}{dt} &= \frac{d(u_1^2 + u_2^2 + u_3^2)}{dt} \\
&= 2u_1u_1' + 2u_2u_2' + 2u_3u_3' \\
&= 2u_1(cu_2 - bu_3) + 2u_2(au_3 - cu_1) + 2u_3(bu_1 - au_2) \\
&= 0.
\end{aligned}
$$

这说明 $\|u(t)\|^2$ 始终等于 $\|u(0)\|^2$。因为 $u(t)$ 的长度从不改变，它始终在以 $\|u(0)\|$ 为半径的球面上（原文说「圆周上」）。

</details>

## 习题 23.2

（教材第 6.3 节第 24 题）把 $A = \begin{bmatrix} 1 & 1 \\ 0 & 3 \end{bmatrix}$ 写成 $S\Lambda S^{-1}$。计算 $Se^{\Lambda t}S^{-1}$，求出矩阵指数 $e^{At}$。在 $t = 0$ 处计算 $e^{At}$ 和 $e^{At}$ 的导数，检验你的结果。

<details>
<summary>解答</summary>

$A$ 的特征值是 $\lambda_1 = 1$ 和 $\lambda_2 = 3$，对应的特征向量是 $x_1 = (1, 0)$ 和 $x_2 = (1, 2)$。由此得到

$$
S = \begin{bmatrix} 1 & 1 \\ 0 & 2 \end{bmatrix}, \quad \Lambda = \begin{bmatrix} 1 & 0 \\ 0 & 3 \end{bmatrix}, \quad S^{-1} = \begin{bmatrix} 1 & -1/2 \\ 0 & 1/2 \end{bmatrix}.
$$

用它们求 $e^{At}$：

$$
Se^{\Lambda t}S^{-1} = \begin{bmatrix} 1 & 1 \\ 0 & 2 \end{bmatrix} \begin{bmatrix} e^t & 0 \\ 0 & e^{3t} \end{bmatrix} \begin{bmatrix} 1 & -1/2 \\ 0 & 1/2 \end{bmatrix} = \begin{bmatrix} e^t & 0.5e^{3t} - 0.5e^t \\ 0 & e^{3t} \end{bmatrix} = e^{At}.
$$

检验：$t = 0$ 时 $e^{At} = \begin{bmatrix} e^t & 0.5e^{3t} - 0.5e^t \\ 0 & e^{3t} \end{bmatrix}$ 等于 $I$。✓

$$
\frac{de^{At}}{dt} = \begin{bmatrix} e^t & 1.5e^{3t} - 0.5e^t \\ 0 & 3e^{3t} \end{bmatrix}, \qquad \left.\frac{de^{At}}{dt}\right|_{t=0} = \begin{bmatrix} 1 & 1 \\ 0 & 3 \end{bmatrix} = A. \;\checkmark
$$

</details>
