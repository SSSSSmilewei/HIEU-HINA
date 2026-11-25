# 例题：tan x sec²x 的原函数

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

用两种不同的方法计算 $\displaystyle\int \tan x\sec^2 x\,dx$：

a) 换元 $u = \tan x$。

b) 换元 $v = \sec x$。

c) 比较两个结果。

<details>
<summary>解答</summary>

**a)** 如果 $u = \tan x$，那么 $du = \sec^2 x\,dx$，于是

$$
\int \tan x\sec^2 x\,dx = \int u\,du = \frac12u^2 + c = \frac12\tan^2 x + c.
$$

**b)** 如果 $v = \sec x$，那么 $dv = \sec x\tan x\,dx$，于是

$$
\int \tan x\sec^2 x\,dx = \int \sec x(\tan x\sec x\,dx) = \int v\,dv = \frac12v^2 + C = \frac12\sec^2 x + C.
$$

**c)** 乍一看你可能以为自己算错了；$\tan^2 x = \sec^2 x$ 并不成立。不过，从图 1 可以看出，两个答案可能只相差一个常数。

> 图 1：$\tan^2 x$（蓝色）和 $\sec^2 x$（红色）的图像：形状相同，上下相差 1。

事实确实如此：

$$
\tan^2 x = \frac{\sin^2 x}{\cos^2 x} = \frac{1 - \cos^2 x}{\cos^2 x} = \sec^2 x - 1.
$$

我们得出 $\frac12\tan^2 x = \frac12\sec^2 x - \frac12$，所以两个结果在相差一个常数的意义下是等价的。两个答案都对。

</details>
