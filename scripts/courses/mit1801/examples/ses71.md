# 例题：∫tan³x dx

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

用学过的方法求函数 $\tan^3(x)$ 的积分。

<details>
<summary>解答</summary>

这是一个相对简单的积分；下面的方法用到一次代换，以及性质 $\sec^2x = 1 + \tan^2x$ 和 $\displaystyle\int \tan x\,dx = -\ln|\cos x| + c$。

$$
\begin{aligned}
\int \tan^3x\,dx &= \int \tan x\tan^2x\,dx && (\text{用恒等式降次}) \\
&= \int \tan x(\sec^2x - 1)\,dx \\
&= \int \underbrace{\tan x}_{u}\,\underbrace{\sec^2x\,dx}_{du} - \int \tan x\,dx \\
&= \int u\,du - (-\ln|\cos x| + c) \\
&= \frac12u^2 + \ln|\cos x| + c \\
&= \frac12\tan^2x + \ln|\cos x| + c.
\end{aligned}
$$

</details>
