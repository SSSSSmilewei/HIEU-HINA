# 习题：基变换与图像压缩

> 本页是 MIT 开放式课程 18.06SC 官方习题与解答的中文翻译，原文见页面下方的「习题原文（PDF）」和「解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

## 习题 31.1

验证课上给出的哈尔小波基的各个向量互相正交。调整它们的长度，使所得的基向量标准正交。

<details>
<summary>解答</summary>

课上给出的哈尔小波基向量是

$$
\begin{bmatrix} 1 \\ 1 \\ 1 \\ 1 \\ 1 \\ 1 \\ 1 \\ 1 \end{bmatrix}, \
\begin{bmatrix} 1 \\ 1 \\ 1 \\ 1 \\ -1 \\ -1 \\ -1 \\ -1 \end{bmatrix}, \
\begin{bmatrix} 1 \\ 1 \\ -1 \\ -1 \\ 0 \\ 0 \\ 0 \\ 0 \end{bmatrix}, \
\begin{bmatrix} 0 \\ 0 \\ 0 \\ 0 \\ 1 \\ 1 \\ -1 \\ -1 \end{bmatrix}, \
\begin{bmatrix} 1 \\ -1 \\ 0 \\ 0 \\ 0 \\ 0 \\ 0 \\ 0 \end{bmatrix}, \
\begin{bmatrix} 0 \\ 0 \\ 1 \\ -1 \\ 0 \\ 0 \\ 0 \\ 0 \end{bmatrix}, \
\begin{bmatrix} 0 \\ 0 \\ 0 \\ 0 \\ 1 \\ -1 \\ 0 \\ 0 \end{bmatrix}, \
\begin{bmatrix} 0 \\ 0 \\ 0 \\ 0 \\ 0 \\ 0 \\ 1 \\ -1 \end{bmatrix}.
$$

很容易看出第二到第八个向量都与第一个正交：它们的内积是个数相等的 1 和 $-1$ 之和。第三到第八个向量与第二个做点积时，情况也一样。其余的内积要么是个数相等的 1 和 $-1$ 之和，要么干脆是一串 0 之和。既然两两内积都是零，这些向量就互相正交。

要使这组基标准正交，把每个向量除以它的长度：第一、二个向量的长度是 $\sqrt8$，第三、四个是 $2$，后四个是 $\sqrt2$。于是标准正交基是

$$
\frac{1}{\sqrt8}\begin{bmatrix} 1 \\ 1 \\ 1 \\ 1 \\ 1 \\ 1 \\ 1 \\ 1 \end{bmatrix}, \
\frac{1}{\sqrt8}\begin{bmatrix} 1 \\ 1 \\ 1 \\ 1 \\ -1 \\ -1 \\ -1 \\ -1 \end{bmatrix}, \
\frac12\begin{bmatrix} 1 \\ 1 \\ -1 \\ -1 \\ 0 \\ 0 \\ 0 \\ 0 \end{bmatrix}, \
\frac12\begin{bmatrix} 0 \\ 0 \\ 0 \\ 0 \\ 1 \\ 1 \\ -1 \\ -1 \end{bmatrix}, \
\frac{1}{\sqrt2}\begin{bmatrix} 1 \\ -1 \\ 0 \\ 0 \\ 0 \\ 0 \\ 0 \\ 0 \end{bmatrix}, \
\frac{1}{\sqrt2}\begin{bmatrix} 0 \\ 0 \\ 1 \\ -1 \\ 0 \\ 0 \\ 0 \\ 0 \end{bmatrix}, \
\frac{1}{\sqrt2}\begin{bmatrix} 0 \\ 0 \\ 0 \\ 0 \\ 1 \\ -1 \\ 0 \\ 0 \end{bmatrix}, \
\frac{1}{\sqrt2}\begin{bmatrix} 0 \\ 0 \\ 0 \\ 0 \\ 0 \\ 0 \\ 1 \\ -1 \end{bmatrix}.
$$

</details>

## 习题 31.2

可以把所有实 2 × 2 矩阵组成的集合看作一个向量空间。为这个空间描述两组不同的基。描述对角矩阵时，你的其中一组基比另一组更好吗？描述三角矩阵呢？对称矩阵呢？

<details>
<summary>解答</summary>

这道题有很多种正确的答法。

最显然的基是

$$
\begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}, \ \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}, \ \begin{bmatrix} 0 & 0 \\ 1 & 0 \end{bmatrix}, \ \begin{bmatrix} 0 & 0 \\ 0 & 1 \end{bmatrix}.
$$

希望你选的第二组基与它明显不同。下面是几种可能：

$$
\begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}, \ \begin{bmatrix} 1 & 1 \\ -1 & -1 \end{bmatrix}, \ \begin{bmatrix} 1 & -1 \\ 1 & -1 \end{bmatrix}, \ \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}
$$

或者

$$
\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}, \ \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}, \ \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}, \ \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}.
$$

如果你不好判断基中的矩阵是否线性无关，可以把它们看作 $\mathbb{R}^4$ 中的向量，检查这些向量是否线性无关。上面的例子很好检查，因为看作 $\mathbb{R}^4$ 中的向量时，它们互相正交。

这几组基中，第一组描述对角矩阵可能最好；第三组做这件事也相当不错：

$$
\begin{bmatrix} 4 & 0 \\ 0 & 2 \end{bmatrix} = 3\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} + 1\begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}.
$$

描述三角矩阵似乎也是第一组最好——任何三角矩阵都只是四个向量中三个的组合。描述对称矩阵则是第三组最好，因为对称矩阵在 $\begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$ 这个分量上的系数总是零。

</details>
