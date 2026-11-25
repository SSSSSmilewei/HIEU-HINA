# 例题：双纽线

> 本页是 MIT 开放式课程 18.01SC 本节例题（Worked Example）及其解答的中文翻译，原文见页面下方的「例题原文（PDF）」和「例题解答原文（PDF）」，© MIT OpenCourseWare，CC BY-NC-SA 4.0。建议先自己做，再展开解答。

极坐标中由 $r^2 = \cos(2\theta)$ 描述的曲线叫作**双纽线**。

a) 对哪些 $\theta$ 值存在这样的点 $(r, \theta)$？

b) 对哪些 $\theta$ 值 $r$ 的长度最小？

c) 对哪些 $\theta$ 值 $r$ 的长度最大？

d) 用你收集到的信息画出这条曲线的草图。

<details>
<summary>解答</summary>

做这道题时，最好对照着 $\cos(2\theta)$ 的图像。

**a)** （在这门课里）不能对负数开平方，所以凡是 $\cos(2\theta)$ 为负的地方，$r$ 都没有定义。函数 $f(\theta) = \cos\theta$ 在区间 $\pi/2 < \theta < 3\pi/2$ 上取负值，一般地，在所有以 $\pi$ 的奇数倍为中心、宽为 $\pi$ 的区间上取负值。函数 $g(\theta) = \cos(2\theta)$ 的图像是 $f(\theta)$ 的图像在水平方向压缩一半，所以 $\cos(2\theta)$ 在以 $\pi/2$ 的奇数倍为中心、宽为 $\pi/2$ 的区间上为负；即在区间 $\pi/4 < \theta < 3\pi/4$、$5\pi/4 < \theta < 7\pi/4$ 等上为负。

对其他所有 $\theta$ 值，点 $\left(\sqrt{\cos(2\theta)}, \theta\right)$ 和 $\left(-\sqrt{\cos(2\theta)}, \theta\right)$ 都是双纽线上的点。

（译注：原文这里说 $\cos(2\theta)$ 在这些区间上「为零」，按上下文应为「为负」，译文已更正。）

**b)** $\cos(2\theta) = 0$ 时 $r(\theta) = 0$。这是 $r$ 能取到的最小值（因为 $r$ 是用平方根定义的）。看 $\cos(2\theta)$ 的图像可知，当 $2\theta$ 是 $\pi/2$ 的奇数倍，即 $\theta$ 是 $\pi/4$ 的奇数倍时，$\cos(2\theta) = 0$。

当 $\theta = \ldots, -3\pi/4, -\pi/4, \pi/4, 3\pi/4, \ldots$ 时，半径 $r$ 的长度为 0。

**c)** $\cos(2\theta) = 1$ 时，$r = \pm1$。$\cos(2\theta)$ 的值永远不超过 1，所以 $r = \pm\sqrt{\cos(2\theta)}$ 的长度永远不超过 1 个单位。

回到 $\cos(2\theta)$ 的图像，可以看到当 $\theta$ 是 $\pi$ 的倍数时半径 $r$ 最长：$\theta = \ldots, -2\pi, -\pi, 0, \pi, 2\pi, \ldots$

**d)** 我们知道，曲线 $(r, \theta)$ 在区间 $k\pi - \pi/4 < \theta < k\pi + \pi/4$ 上画出一段路径，在这些区间之外不存在。在每个这样的区间上，$r$ 从最小值 0 开始，增大到最大值 1，再减小。可以求出 $\theta = k\pi \pm \pi/8$ 时点 $(r, \theta)$ 的坐标，也可以猜一猜曲线在两个极端之间走的路径。最终结果大致像一个横放的「8」字（∞ 形）：两个圈分别在原点的左右两边，在原点相交，最远点是 $(\pm1, 0)$。

</details>
