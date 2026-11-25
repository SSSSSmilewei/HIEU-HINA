# 例题：|sin b − sin a| 与 |b − a| 的比较

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

用我们学过的中值定理的知识，比较 $|\sin b - \sin a|$ 和 $|b - a|$ 的大小。

<details>
<summary>解答</summary>

可以从中值定理出发解这道题，但如果记得讲座中的

$$
\min_{a \le x \le b} f'(x) \le \frac{f(b) - f(a)}{b - a} = f'(c) \le \max_{a \le x \le b} f'(x),
$$

可以省些时间。

如果 $f(x) = \sin x$，那么 $f'(x) = \cos x$，这个不等式变成

$$
\min_{a \le x \le b} \cos x \le \frac{\sin b - \sin a}{b - a} \le \max_{a \le x \le b} \cos x.
$$

我们不知道 $a$ 和 $b$ 的值，但知道余弦函数的取值范围是 $-1$ 到 1。把未知的上下界换成这两个已知的界，得到

$$
-1 \le \frac{\sin b - \sin a}{b - a} \le 1,
$$

即（设 $b > a$）

$$
-(b - a) \le \sin b - \sin a \le b - a.
$$

我们得出 $|\sin b - \sin a| \le |b - a|$。仅仅从「正弦曲线的斜率从不大于 1、也从不小于 $-1$」这一事实，就得到了一个意外有用的结果。

</details>
