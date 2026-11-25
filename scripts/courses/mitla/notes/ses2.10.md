# 微分方程与 exp(At)

> 本页是 MIT 开放式课程 18.06SC 官方讲座摘要（lecture summary）的中文翻译，原文见页面下方的「讲座摘要原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。

下面的方程组描述了变量 $u_1$ 和 $u_2$ 的值怎样随时间相互影响：

$$
\begin{aligned} \frac{du_1}{dt} &= -u_1 + 2u_2 \\ \frac{du_2}{dt} &= u_1 - 2u_2. \end{aligned}
$$

正如我们用线性代数求解差分方程，也可以用它来求解这个微分方程。例如，初始条件 $u_1 = 1$、$u_2 = 0$ 可以写成 $u(0) = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$。

## 微分方程 du/dt = Au

看上面的方程，我们可能会猜测 $u_1$ 会随时间减少。通过观察这个系统 $\dfrac{du}{dt} = Au$ 的矩阵 $A = \begin{bmatrix} -1 & 2 \\ 1 & -2 \end{bmatrix}$ 的特征值，可以更可靠地得到同样的信息。因为 $A$ 是奇异的、迹是 $-3$，我们知道它的特征值是 $\lambda_1 = 0$、$\lambda_2 = -3$。解中将会出现 $e^{-3t}$ 和 $e^{0t}$。随着 $t$ 增大，$e^{-3t}$ 趋于零，而 $e^{0t} = 1$ 保持不变。**特征值为零的特征向量就是稳态解。**

$x_1 = \begin{bmatrix} 2 \\ 1 \end{bmatrix}$ 是满足 $Ax_1 = 0x_1$ 的特征向量。要求 $\lambda_2 = -3$ 对应的特征向量，就解 $(A - \lambda_2 I)x_2 = 0$：

$$
\begin{bmatrix} 2 & 2 \\ 1 & 1 \end{bmatrix} x_2 = 0, \quad \text{所以} \quad x_2 = \begin{bmatrix} 1 \\ -1 \end{bmatrix},
$$

可以验证 $Ax_2 = -3x_2$。这个微分方程组的通解是

$$
u(t) = c_1 e^{\lambda_1 t} x_1 + c_2 e^{\lambda_2 t} x_2.
$$

$e^{\lambda_1 t} x_1$ 真的是 $\dfrac{du}{dt} = Au$ 的解吗？代入 $u = e^{\lambda_1 t} x_1$ 检验：

$$
\frac{du}{dt} = \lambda_1 e^{\lambda_1 t} x_1,
$$

这与

$$
Au = e^{\lambda_1 t} Ax_1 = \lambda_1 e^{\lambda_1 t} x_1
$$

一致。两个「纯」的项 $e^{\lambda_1 t}x_1$ 和 $e^{\lambda_2 t}x_2$，类似于差分方程 $u_{k+1} = Au_k$ 的解 $c_1\lambda_1^k x_1 + c_2\lambda_2^k x_2 + \cdots + c_n\lambda_n^k x_n$ 中的项 $\lambda_i^k x_i$。

代入特征向量的值，得到

$$
u(t) = c_1 e^{\lambda_1 t} x_1 + c_2 e^{\lambda_2 t} x_2 = c_1 \begin{bmatrix} 2 \\ 1 \end{bmatrix} + c_2 e^{-3t} \begin{bmatrix} 1 \\ -1 \end{bmatrix}.
$$

我们知道 $u(0) = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$，所以在 $t = 0$ 时

$$
\begin{bmatrix} 1 \\ 0 \end{bmatrix} = c_1 \begin{bmatrix} 2 \\ 1 \end{bmatrix} + c_2 \begin{bmatrix} 1 \\ -1 \end{bmatrix}.
$$

于是 $c_1 = c_2 = 1/3$，$u(t) = \dfrac13 \begin{bmatrix} 2 \\ 1 \end{bmatrix} + \dfrac13 e^{-3t} \begin{bmatrix} 1 \\ -1 \end{bmatrix}$。

这告诉我们：系统从 $u_1 = 1$、$u_2 = 0$ 开始，但随着 $t$ 趋于无穷，$u_1$ 衰减到 $2/3$，$u_2$ 增加到 $1/3$。这可能描述了某种东西从 $u_1$ 流向 $u_2$。

这个系统的稳态是 $u(\infty) = \begin{bmatrix} 2/3 \\ 1/3 \end{bmatrix}$。

## 稳定性

并不是所有系统都有稳态。$A$ 的特征值告诉我们应该期待什么样的解：

1. **稳定**：当 $\operatorname{Re}(\lambda) < 0$ 时 $u(t) \to 0$。
2. **稳态**：有一个特征值是 0，其他所有特征值的实部都是负的。
3. **发散**：只要有一个特征值 $\lambda$ 满足 $\operatorname{Re}(\lambda) > 0$。

如果 2 × 2 矩阵 $A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$ 的两个特征值实部都是负的，那么它的迹 $a + d$ 是负的。反过来不成立：$\begin{bmatrix} -2 & 0 \\ 0 & 1 \end{bmatrix}$ 的迹是负的，但它有一个特征值是 1，$e^{1t}$ 会发散。**如果 $A$ 的行列式为正、迹为负，那么对应的解一定是稳定的。**

## 用上 S

我们求解 $\dfrac{du}{dt} = Au$ 的最后一步，是解

$$
c_1 \begin{bmatrix} 2 \\ 1 \end{bmatrix} + c_2 \begin{bmatrix} 1 \\ -1 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}.
$$

写成矩阵形式：

$$
\begin{bmatrix} 2 & 1 \\ 1 & -1 \end{bmatrix} \begin{bmatrix} c_1 \\ c_2 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix},
$$

即 $Sc = u(0)$，其中 $S$ 是特征向量矩阵。$c$ 的各个分量，根据系统的初始条件，决定了每个纯指数解所占的份量。

在方程 $\dfrac{du}{dt} = Au$ 中，矩阵 $A$ 把各个纯解**耦合**在一起。令 $u = Sv$，其中 $S$ 是 $A$ 的特征向量矩阵，得到

$$
S\frac{dv}{dt} = ASv,
$$

即

$$
\frac{dv}{dt} = S^{-1}ASv = \Lambda v.
$$

这就把系统对角化了：$\dfrac{dv_i}{dt} = \lambda_i v_i$。于是通解是

$$
v(t) = e^{\Lambda t} v(0), \qquad u(t) = Se^{\Lambda t}S^{-1} u(0) = e^{At} u(0).
$$

## 矩阵指数 e^{At}

如果 $A$ 是矩阵，$e^{At}$ 是什么意思？我们知道对实数 $x$，

$$
e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2} + \frac{x^3}{6} + \cdots.
$$

可以用同样的公式定义 $e^{At}$：

$$
e^{At} = I + At + \frac{(At)^2}{2} + \frac{(At)^3}{6} + \cdots.
$$

类似地，如果 $At$ 的特征值很小，可以用几何级数 $\dfrac{1}{1 - x} = \sum_{n=0}^{\infty} x^n$ 来估计

$$
(I - At)^{-1} = I + At + (At)^2 + (At)^3 + \cdots.
$$

我们说过 $e^{At} = Se^{\Lambda t}S^{-1}$。如果 $A$ 有 $n$ 个线性无关的特征向量，可以用 $A = S\Lambda S^{-1}$ 从 $e^{At}$ 的定义证明这一点：

$$
\begin{aligned}
e^{At} &= I + At + \frac{(At)^2}{2} + \frac{(At)^3}{6} + \cdots \\
&= SS^{-1} + S\Lambda S^{-1}t + \frac{S\Lambda^2 S^{-1}}{2}t^2 + \frac{S\Lambda^3 S^{-1}}{6}t^3 + \cdots \\
&= Se^{\Lambda t}S^{-1}.
\end{aligned}
$$

把无穷多个矩阵加起来是不现实的。幸好有更简单的方法计算 $e^{\Lambda t}$。记得

$$
\Lambda = \begin{bmatrix} \lambda_1 & 0 & \cdots & 0 \\ 0 & \lambda_2 & & 0 \\ \vdots & & \ddots & \vdots \\ 0 & \cdots & 0 & \lambda_n \end{bmatrix}.
$$

把它代入 $e^{At}$ 的公式，就得到

$$
e^{\Lambda t} = \begin{bmatrix} e^{\lambda_1 t} & 0 & \cdots & 0 \\ 0 & e^{\lambda_2 t} & & 0 \\ \vdots & & \ddots & \vdots \\ 0 & \cdots & 0 & e^{\lambda_n t} \end{bmatrix}.
$$

这是看清 $u(t) = Se^{\Lambda t}S^{-1}u(0)$ 的稳定性与 $A$ 的特征值之间关系的另一种方式。

## 二阶方程

可以把二阶方程 $y'' + by' + ky = 0$ 变成一个 2 × 2 的一阶系统，方法类似于我们求斐波那契数公式时用的那种。令 $u = \begin{bmatrix} y' \\ y \end{bmatrix}$，那么

$$
u' = \begin{bmatrix} y'' \\ y' \end{bmatrix} = \begin{bmatrix} -b & -k \\ 1 & 0 \end{bmatrix} \begin{bmatrix} y' \\ y \end{bmatrix}.
$$

可以用刚学到的方法求解这个系统，这就给出了我们最初那个二阶标量方程的解。

如果从一个 $k$ 阶方程出发，就会得到一个 $k \times k$ 矩阵：第一行是方程的系数，第一行下方的那条对角线上是 1，其余元素都是 0。
