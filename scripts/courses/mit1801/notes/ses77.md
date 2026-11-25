# 酒杯的体积

> 本页是 MIT 开放式课程 18.01SC 本节各讲座片段配套讲义的中文翻译，每一段对应条目里的一个「讲座片段」视频；原文见页面下方的「讲义原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。原文的插图没有搬过来，用文字说明代替。

## 片段 1：酒杯的体积：水平切片

现在我们已经掌握了人们所知道的全部积分技巧。我们用这些新技巧回答一个有意思的问题，以示庆祝。

一只「指数酒杯」的杯身，是把 $y = e^x$ 的图像中连接 $(0, 1)$ 和 $(1, e)$ 的那一段绕 $y$ 轴旋转形成的。求它的容积。

> 图 1：把 $y = e^x$ 的图像绕 $y$ 轴旋转形成的酒杯。

解这道题有两种方法：水平切片和竖直切片。如果用水平切片计算体积，我们就是把高为 $dy$、半径为 $x = \ln y$ 的圆盘的体积加起来。（见图 2。）

因此体积是

$$
\begin{aligned}
\int_1^e \pi x^2\,dy &= \int_1^e \pi(\ln y)^2\,dy \\
&= \pi F_2(y)\Big|_1^e \qquad (\text{见第 76 节的例子}) \\
&= \pi\left[y(\ln y)^2 - 2(y\ln y - y)\right]_1^e \\
&= \pi\left[\bigl(e(\ln e)^2 - 2(e\ln e - e)\bigr) - \bigl(1(\ln 1)^2 - 2(1\ln 1 - 1)\bigr)\right] \\
&= \pi\left[\bigl(e(1)^2 - 2(e \cdot 1 - e)\bigr) - \bigl(1(0)^2 - 2(1 \cdot 0 - 1)\bigr)\right] \\
&= \pi\left[(e - 2(0)) - (-2(-1))\right] \\
&= \pi(e - 2).
\end{aligned}
$$

> 图 2：把这个水平切片绕 $y$ 轴旋转，形成一个圆盘。

## 片段 2：酒杯的体积：竖直切片

如果用竖直切片计算这只指数酒杯的容积，我们就是把高为 $e - y$、半径为 $x$、厚为 $dx$ 的柱壳的体积加起来。

> 图 1：把厚为 $dx$ 的切片绕 $y$ 轴旋转，得到一个柱壳。

$$
\begin{aligned}
\text{体积} &= \int_0^1 (e - y)2\pi x\,dx \\
&= \int_0^1 (e - e^x)2\pi x\,dx \\
&= \int_0^1 2\pi ex\,dx - \int_0^1 2\pi xe^x\,dx \\
&= \underbrace{\frac{2\pi e}{2}}_{\text{三角形的面积}} - 2\pi G_1(x)\Big|_0^1 \\
&= \pi e - 2\pi\left[xe^x - e^x\right]_0^1 \\
&= \pi e - 2\pi\left[(e - e) - (0 - 1)\right] \\
&= \pi e - 2\pi \\
&= \pi(e - 2).
\end{aligned}
$$

两种方法得到相同的答案。
