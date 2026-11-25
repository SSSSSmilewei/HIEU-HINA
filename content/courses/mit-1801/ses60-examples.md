# 例题：平均存款余额

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

一笔钱 $A_0$ 以利率 $r$ 连续复利，按规律

$$
A(t) = A_0e^{rt} \qquad (t = \text{时间，单位年})
$$

增长。

a) $T$ 年内银行里的平均存款是多少？

b) 代入 $A_0 = 100$ 美元、$r = 0.05$、$T = 1$ 检验你的结果；结果看起来合理吗？

<details>
<summary>解答</summary>

**a)** 函数 $f(x)$ 在区间 $[a, b]$ 上的平均值是

$$
\frac{1}{b - a}\int_a^b f(x)\,dx.
$$

在我们的例子里，函数是 $A(t) = A_0e^{rt}$，区间是 $[0, T]$。注意到 $e^{rt}$ 的原函数是 $\frac1re^{rt}$，得到

$$
\operatorname{Avg}(A) = \frac{1}{T - 0}\int_0^T A_0e^{rt}\,dt = A_0\frac{1}{rT}e^{rt}\Big|_0^T = \frac{A_0}{rT}\left(e^{rT} - e^0\right) = \frac{A_0}{rT}(e^{rT} - 1).
$$

这是期末余额与期初余额之差，除以利率乘以时间！

**b)** 如果 $r = 0.05$、$T = 1$，那么

$$
\operatorname{Avg}(A) = \frac{100}{0.05}\left(e^{0.05} - 1\right) \approx 102.5 \text{ 美元}.
$$

这看起来是合理的，因为如果是单利（而不是连续复利），期初余额是 100 美元，期末余额是 105 美元。

</details>
