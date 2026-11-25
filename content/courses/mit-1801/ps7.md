# 习题课 7：体积

> 本页是 MIT 开放式课程 18.01SC 习题课 7 指定练习题及解答的中文翻译。题目和解答出自 David Jerison、Arthur Mattuck 编写的 18.01 习题集（18.01 Exercises）「Applications of Integration」一册，原文见页面下方的「习题原文（PDF）」和「习题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。题号沿用原书，便于对照。建议先自己做完一节，再展开解答对照。

本次习题课覆盖单元 3 的 B 部分（第 51–59 节）。

## 4B. 切片法求体积；旋转体的体积

**4B-2** 把习题 4B-1 中的区域绕 $y$ 轴旋转，求所得旋转体的体积。（习题课只要求做下面两个区域，即 4B-1 的 e 和 g。）

e) $y = 2x - x^2$，$y = 0$　　g) $y = \sqrt{ax}$，$y = 0$，$x = a$

<details>
<summary>解答</summary>

e) $x^2 - 2x + y = 0 \Rightarrow x = 1 \pm \sqrt{1 - y}$。用垫圈法：

$$
\int_0^1 \pi\left[\left(1 + \sqrt{1 - y}\right)^2 - \left(1 - \sqrt{1 - y}\right)^2\right]dy = \int_0^1 4\pi\sqrt{1 - y}\,dy = -\frac83\pi(1 - y)^{3/2}\Big|_0^1 = \frac{8\pi}{3}.
$$

（和 4B-1 的 (e) 与 (a) 不同，绕 $y$ 轴旋转时，2(e) 的立体和 2(a) 的不一样。）

g) 曲线可写成 $x = \dfrac{y^2}{a}$，$y$ 从 0 到 $a$。用垫圈法（外半径 $a$，内半径 $\dfrac{y^2}{a}$）：

$$
\int_0^a \pi\left(a^2 - \left(\frac{y^2}{a}\right)^2\right)dy = \pi\left(a^2y - \frac{y^5}{5a^2}\right)\Big|_0^a = \frac45\pi a^3.
$$

</details>

**4B-5** 求边长为 $a$ 的等边三角形绕它的一条边旋转所得立体的体积。

<details>
<summary>解答</summary>

把旋转用的那条边放在 $x$ 轴上，一个端点在原点。另外两条边中，从原点出发的那条可以描述为 $y = \sqrt3x$，$0 \le x \le a/2$。由对称性（三角形关于 $x = a/2$ 对称），体积是

$$
2\int_0^{a/2} \pi y^2\,dx = 2\int_0^{a/2} \pi(\sqrt3x)^2\,dx = 2\pi \cdot 3 \cdot \frac{(a/2)^3}{3} = \frac{\pi a^3}{4}.
$$

（这正是两个底面半径为 $\frac{\sqrt3}{2}a$、高为 $\frac a2$ 的圆锥的体积之和：$2 \cdot \frac13\pi\left(\frac{3a^2}{4}\right)\frac a2 = \frac{\pi a^3}{4}$。）

</details>

## 4C. 柱壳法求体积

**4C-2** 求区域 $0 \le y \le x^2$、$x \le 1$ 绕 $y$ 轴旋转所得的体积。

<details>
<summary>解答</summary>

用柱壳法：

$$
\int_0^1 2\pi xy\,dx = \int_0^1 2\pi x^3\,dx = \frac\pi2.
$$

</details>

**4C-3** 用柱壳法以及圆盘（垫圈）法两种方法，求区域 $\sqrt x \le y \le 1$、$x \ge 0$ 绕 $y$ 轴旋转所得的体积。

<details>
<summary>解答</summary>

柱壳法：

$$
\int_0^1 2\pi x(1 - y)\,dx = \int_0^1 2\pi x(1 - \sqrt x)\,dx = \frac\pi5.
$$

圆盘法（区域可写成 $0 \le x \le y^2$，$0 \le y \le 1$）：

$$
\int_0^1 \pi x^2\,dy = \int_0^1 \pi y^4\,dy = \frac\pi5.
$$

</details>

## 4J. 其他应用

**4J-3** 一个很浅的圆形倒影池，深度均为 $D$，半径为 $R$（米）。在池中心释放一种消毒剂，几小时后它向四周对称扩散，距中心 $r$ 米处的浓度是 $\dfrac{k}{1 + r^2}$ 克/立方米。

一共向池中释放了多少消毒剂 $A$？（说明理由。）

<details>
<summary>解答</summary>

把水池分成 $n$ 个半径为 $r_i$（$i = 1, \ldots, n$）、厚度为 $\Delta r$ 的同心薄圆柱壳。

第 $i$ 个壳的体积约为 $2\pi r_iD\,\Delta r$。

第 $i$ 个壳里的消毒剂约为 $\dfrac{k}{1 + r_i^2}2\pi r_iD\,\Delta r$。

加起来再取极限：

$$
A = \lim_{n \to \infty} \sum_{i=1}^n \frac{k}{1 + r_i^2}2\pi r_iD\,\Delta r = \int_0^R 2\pi kD\frac{r}{1 + r^2}\,dr = \pi kD\ln(1 + r^2)\Big|_0^R = \pi kD\ln(1 + R^2) \text{ 克}.
$$

</details>
