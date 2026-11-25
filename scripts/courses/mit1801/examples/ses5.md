# 例题：极限与间断

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

下面哪些应该用单侧极限？对每一题，求出单侧或双侧极限。

1. $\displaystyle\lim_{x \to 0} \sqrt{x}$
2. $\displaystyle\lim_{x \to -1} \frac{1}{x + 1}$
3. $\displaystyle\lim_{x \to 1} \frac{1}{(x - 1)^4}$
4. $\displaystyle\lim_{x \to 0} |\sin x|$
5. $\displaystyle\lim_{x \to 0} \frac{|x|}{x}$

<details>
<summary>解答</summary>

1. 函数 $f(x) = \sqrt{x}$ 只对非负的 $x$ 有定义，所以这里必须用单侧的右极限。用计算器或图像很快就能看出 $\displaystyle\lim_{x \to 0^+} \sqrt{x} = 0$。

2. 当 $x$ 趋近 $-1$ 时，分母趋于 0，$\dfrac{1}{x + 1}$ 的绝对值无限增大。$x < -1$ 时这个式子取很大的负值，$x > -1$ 时取很大的正值，所以左极限和右极限不同，只能用单侧极限：
   $$
   \lim_{x \to -1^-} \frac{1}{x + 1} = -\infty, \qquad \lim_{x \to -1^+} \frac{1}{x + 1} = \infty.
   $$

3. 这个式子的值同样无限增大，但它总是正的。可以说 $\displaystyle\lim_{x \to 1} \frac{1}{(x - 1)^4} = \infty$。

4. 这里
   $$
   \lim_{x \to 0^+} |\sin x| = \lim_{x \to 0^-} |\sin x| = 0,
   $$
   所以不需要用单侧极限。

5. 必须用单侧极限，因为
   $$
   \lim_{x \to 0^+} \frac{|x|}{x} = 1, \qquad \lim_{x \to 0^-} \frac{|x|}{x} = -1.
   $$

</details>
