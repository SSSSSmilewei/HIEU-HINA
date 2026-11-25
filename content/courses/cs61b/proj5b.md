# 设计项目 5B：BYOW 世界生成

> 本页是 UC Berkeley CS61B 2026 春季官方项目说明「Project 5B: BYOW (World Generation)」的中文翻译，原文见页面下方的「项目原文」。命令、代码和程序输出保持原样。

> **本站补充（校外学习者请先看）**：本页的评分提交（在 Gradescope 上交世界截图）只对伯克利在读学生开放。不在伯克利的同学可以这样做：照常完成世界生成，自行选取种子生成世界并截图存档，运行 `git show --summary` 记录对应提交；然后对照下面的「世界要求」和「伪随机要求」逐条自查。

## 截止时间

注意：本项目有 **3 个截止时间**，有的截止时间还要求提交**多份材料**。请务必反复确认每一样都已提交！

| 条目 | 任务 | 提交物 | 分值 | 截止时间 |
| --- | --- | --- | --- | --- |
| 项目 5A | 组队；环境配置；设计文档 | 在 Beacon 上完成组队 | 10 | 4 月 10 日（周五）太平洋时间 23:59 |
| 同上 | | 设计文档 | 50 | 4 月 15 日（周三）太平洋时间 23:59 |
| 项目 5B | 世界生成 | 在 **Gradescope** 上提交世界截图 | 40 | 4 月 21 日（周二）太平洋时间 23:59 |
| 项目 5C | 任务 1：主菜单；任务 2：交互；任务 3：HUD；任务 4：保存与加载；任务 5：寻路；任务 6：进阶功能 | 在 **Gradescope** 上提交代码 | 150 | 4 月 28 日（周二）太平洋时间 23:59 |
| **与助教现场验收**（在 4/27–5/1 期间进行） | | | 170 | |

要在项目 5 上申请延期，**两位搭档**需要在 Beacon 上分别提交各自的延期申请。

## 代码总览

### 起始代码

> [起始代码和演示的讲解视频在这里。](https://youtu.be/2VMoC4eMj7Y)（英文）

我们还强烈建议在开始这个项目之前观看[第 31 讲](https://youtu.be/BRsuHSQ800U)（英文）。

在 `TileEngine` 包里，你会找到下面这些有用的文件：

- `TERenderer.java` 包含渲染相关的方法。
- `TETile.java` 表示一个瓦片。
- `Tileset.java` 提供了一些现成的瓦片设计，可以直接使用。

在 `Utils` 包里，你会找到下面这个有用的文件：

- `RandomUtils.java` 提供了为你的世界生成随机性的方法。

在 `Core` 包里，你要写你游戏的代码。我们建议把你所有的代码都放在这个包里（不过这不是硬性要求）。

- `Main.java` 是用户启动整个系统的地方。
- `World.java` 表示你的世界！
- 你也可以自己添加其他类！

这个项目大量使用 `StdDraw`，一个具备基本图形渲染能力的库，同时它还支持键盘和鼠标点击形式的用户交互。在项目过程中，你很可能需要查阅 `StdDraw` 的 API 说明。[API 说明见这里。](https://introcs.cs.princeton.edu/java/stdlib/javadoc/StdDraw.html)（英文）

### 导入

你的项目只能使用标准 Java 库，或者我们随你的仓库和 `library-sp26` 提供的库。

下面是一份不完全的允许导入清单：

- `java.util.List`、`java.util.ArrayList`、`java.util.Collections`、`java.awt.*`、`java.io.*`，以及其他任何以 `java.` 开头的都可以。
- `javax.sound`、`javax.imageio`、`javax.swing.JOptionPane`，以及其他任何以 `javax.` 开头的都可以。
- `edu.princeton.cs.algs4.StdDraw`、`edu.princeton.cs.algs4.StdAudio`，以及其他任何以 `edu.princeton.cs.algs4.` 开头的都可以，因为它们在 `library-sp26` 里。
- `tileengine.TETile`、`utils.RandomUtils`，以及其他任何以 `tileengine.` 或 `utils.` 开头的都可以，因为它们是起始代码。

## 入门

### TETile 数组

宏观上，你的目标是创建一个 `TETile` 对象的二维数组，在数组里填入不同的瓦片，做出一个好看的世界；然后调用我们的一个库函数，把这个世界显示给用户。

把 tileengine 文件夹里的几个文件过一遍：`TETile.java`、`Tileset.java` 和 `TERenderer.java`。总体上你不需要深入理解它们的实现，但它们提供了有用的背景。

关于方向的几点重要说明：

- `world[0][0]` 对应世界的**左下角**瓦片。
- 第一个坐标是 x 坐标。例如 `world[8][0]` 是左下角瓦片向右 8 格的位置。
- 第二个坐标是 y 坐标。例如 `world[0][3]` 是左下角瓦片向上 3 格的位置。

![2D grid with coordinates (0,0) at bottom-left, (8,0) at bottom-right, and (0,3) at top-right.](https://sp26.datastructur.es/assets/projects/proj5b/coords.webp)

### 瓦片渲染

打开起始代码，看看 `demo` 文件夹里的 `BoringWorldDemo` 文件，试着运行它。

这段代码做三件事：

- 初始化瓦片渲染引擎。
- 生成一个二维 `TETile[][]` 数组。
- 用瓦片渲染引擎显示这个 `TETile[][]` 数组。

> 对没有用到的格子，务必用 `Tileset.NOTHING`（纯黑瓦片）初始化。如果不初始化没用到的格子，画世界时就会得到 NullPointerException。

渲染引擎会替你调用大部分 `StdDraw` 方法。我们建议不要使用 `setXScale`、`setYScale` 这类 `StdDraw` 命令，除非你非常清楚自己在做什么，否则你可能会明显改变甚至破坏整个系统的观感。

### 伪随机性

要在 Java 里生成随机数，可以创建一个 `Random` 对象，也就是一个随机数生成器：

```
Random r = new Random(); // Totally random. Don't do this in Project 5.
System.out.println(r.nextInt());
System.out.println(r.nextInt());
System.out.println(r.nextInt());
```

每次运行这段程序，你都会得到 3 个完全随机的整数。

如果我们想控制随机数生成器的输出（例如为了调试），该怎么办？这种情况下，我们可以在构造函数里提供一个**种子（seed）**。

这时 `r` 就是一个**伪随机**（pseudorandom）数生成器，因为它会根据你提供的种子，生成一串看起来随机、但完全确定的数列。

提供同一个种子，就会得到同一串值。例如，每次运行这段程序，**你都会得到同样的 3 个整数**。

再看一个例子：

```
Random r = new Random(82731);
System.out.println(r.nextInt());
System.out.println(r.nextInt());
r = new Random(82731);
System.out.println(r.nextInt());
```

这段代码总会打印两次同一个数。多次运行这段程序，你仍然会得到两次同一个数。

在项目 5 里，你应该总是给 `Random` 对象设置种子，这样你的世界看起来是随机的，但为了调试和评分，你又可以稳定地重现它们。`RandomUtils` 类提供了一些有用的方法，可以从一个 `Random` 对象得到其他类型的随机结果，例如：

- `int uniform(Random random, int a, int b)`：返回区间 `[a, b)` 内的一个整数。
- `T randomChoice(Random random, List<T> items)`：从 items 中随机返回一项。
- `void shuffle(Random random, Object[] a)`：打乱给定的数组。
- `double gaussian(Random random, double mu, double sigma)`：返回一个服从高斯分布（Gaussian distribution）的样本。

注意：大多数同学不会用到 `RandomUtils` 里的这些高级功能。

### 伪随机与世界生成演示

打开起始代码，看看 `demo` 文件夹里的 `RandomWorldDemo.java` 文件，试着运行它。

你应该会看到类似这样的东西：

![random world](https://sp26.datastructur.es/assets/projects/proj5b/randomWorld.webp)

这个世界一片混乱——到处都是墙和花！如果你看看 `RandomWorldDemo.java` 文件，会发现我们做了一些新的事情：

- 我们创建并使用了一个 `Random` 类型的对象，也就是「[伪随机数生成器](https://docs.oracle.com/javase/8/docs/api/java/util/Random.html)」（英文）。
- 我们用了一种新的条件语句，叫 `switch` [语句](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html)（英文）。
- 我们把工作分派给了多个函数，而不是把所有事情都写在 `main` 里。

## 世界要求

你在项目 5B 里的目标是写一个世界生成器，能生成带房间和走廊的伪随机世界。

下面是一些合法世界的例子，其中 `#` 是墙，点号 / 引号是地板，空白方格是空地（世界之外的空间）。

![A valid 2D world with hallways and rooms.](https://sp26.datastructur.es/assets/projects/proj5b/valid-world.webp)

![Another valid 2D world with hallways and rooms.](https://sp26.datastructur.es/assets/projects/proj5b/valid-world-2.webp)

### 有效世界

**合法世界的要求：**

1. 世界必须包含可区分的房间和走廊。对任何一个地板方格，都应该能看出它属于房间还是走廊。

   偶尔生成几个方格难以分辨的世界没关系，但绝大多数（>90%）地板方格都应该能清楚地认出属于房间还是走廊。

   房间可以重叠，只要能看出那些方格属于房间而不是走廊就行。

   <details>
   <summary>（点开查看）不合法世界的例子：分不清哪里是房间、哪里是走廊。</summary>

   ![Invalid world where hallways and rooms are indistinguishable.](https://sp26.datastructur.es/assets/projects/proj5b/invalid-indistinct-hallways.webp) ![Another invalid world where hallways and rooms are indistinguishable.](https://sp26.datastructur.es/assets/projects/proj5b/invalid-indistinct-hallways2.webp)

   </details>

2. 至少应有一部分房间是矩形的。你也可以选择支持其他形状的房间。

3. 走廊的宽度应为 1 格或 2 格。但走廊必须在视觉上与房间有明显区别。绝大多数同学使用宽度 1 的走廊。

   <details>
   <summary>（点开查看）走廊宽度的例子。</summary>

   下面是宽度 1 的走廊（大多数 / 全部走廊应该长这样）：
   ![Width 1 hallway.](https://sp26.datastructur.es/assets/projects/proj5b/width1-hallway.webp)
   下面是宽度 2 的走廊：
   ![Width 2 hallway.](https://sp26.datastructur.es/assets/projects/proj5b/width2-hallway.webp)

   </details>

4. 你的世界生成器必须能生成带拐弯的走廊（等价地说，能生成相交的直走廊）。随机生成的世界应以很高的频率出现拐弯走廊，即大多数世界里都应有一条拐弯的走廊。

5. 世界不应有任何死胡同走廊。走廊必须始终通向房间。

   <details>
   <summary>（点开查看）不合法世界的例子：有一条死胡同走廊。</summary>

   ![Invalid world where there's a dead-end hallway.](https://sp26.datastructur.es/assets/projects/proj5b/invalid-dead-end-hallway.webp)

   </details>

6. 墙、地板和空地必须都能在视觉上区分。

   最简单的办法是使用三种不同的瓦片：墙一种、地板一种、空地一种。

   <details>
   <summary>（点开查看）不合法世界的例子：分不清墙和地板。</summary>

   ![Invalid world where walls and rooms are yellow squares.](https://sp26.datastructur.es/assets/projects/proj5b/invalid-indistinct-walls.webp)

   </details>

7. 房间和走廊拐角处的墙是可选的。

   <details>
   <summary>（点开查看）举例：下面这些房间和走廊都是合法的。</summary>

   举个例子，左边的房间拐角处有墙，右边的房间没有。两种都行。（注意：这个世界本身是不合法的，因为两个房间没有连通。）
   ![Example of rooms with and without corner walls.](https://sp26.datastructur.es/assets/projects/proj5b/room-corners.webp) 举个例子，这条走廊的左上角有墙瓦片，右上角没有墙瓦片。两种都行。（注意：这个世界本身是不合法的，因为没有房间。）
   ![Example of hallways with and without corner walls.](https://sp26.datastructur.es/assets/projects/proj5b/hallway-corners.webp)

   </details>

8. 所有地板瓦片（房间和走廊）应彼此连通。注意：作为进阶功能的一部分，你最终可能做出一些只在特定条件下连通的世界，例如用传送器、上锁的门、可破坏的墙等。

   换句话说，任意两个地板瓦片之间，都应该能沿着地板瓦片走出一条路径。

9. 墙「里面」的所有空间都应是地板瓦片，墙「外面」的所有空间都应是空地瓦片。

   换句话说，一个地板瓦片的相邻瓦片只能是地板瓦片或墙瓦片。

10. 房间不能越出世界的边界。换句话说，世界边缘不应有任何地板瓦片。

    <details>
    <summary>（点开查看）不合法世界的例子：房间越出了世界边界。</summary>

    ![Invalid world where a room clips off the world.](https://sp26.datastructur.es/assets/projects/proj5b/invalid-clipping-world.webp)

    </details>

11. 世界不能有大量闲置的空间。没有硬性要求，但请尽量让房间和走廊稳定地填满世界至少 50% 的面积。

    <details>
    <summary>（点开查看）不合法世界的例子：房间太少。</summary>

    ![Invalid world where there are only three rooms.](https://sp26.datastructur.es/assets/projects/proj5b/invalid-insufficient-rooms.webp)

    </details>

### 伪随机要求

**伪随机世界的要求：**

1. 世界必须是伪随机的。

   如果用户两次选择同一个种子，生成的世界必须完全相同。

   如果用户选择了两个不同的种子，生成的世界应该不同。

2. 不同的世界应有不同数量的房间和走廊。

   数量总是落在某个固定范围内也没关系。例如，所有世界的房间数都在 8 到 12 个之间是可以的，只要不同世界的房间数不同。8 到 12 只是一个例子，多一些少一些都随你。

3. 不同的世界里，房间和走廊应位于不同的位置。

   例如，如果你生成的每个世界都在完全相同的位置有一个房间，那随机性就不够。

4. 不同的房间应有不同的宽度和高度。

5. 不同的走廊应有不同的长度。

6. 世界每次都应有明显的不同，也就是说，你*不应*每次都是同一个基本布局加上轻易可预测的特征。

7. 窗口尺寸可以随你选，只要尺寸合理（例如不要小到 3×3 那种），并且整扇窗口能在你的计算机上完整显示。例如，使用固定、不随机的窗口尺寸完全可以。

### 补充说明

**关于评分**：我们知道上面有些要求带有主观性，只要你的世界遵循了要求的本意，我们会尽量宽容。

助教不会在 Ed 或答疑时间回答「我的世界是否合法」「我的世界够不够好」这类问题。在项目 5B 里，你要提交几个世界供我们评分；如果它们不合法，我们会给你第二次修复的机会，修好同样计满分。

**其他边缘情形问答：**

1. 两个相邻的房间之间可以隔一堵墙，也可以隔两堵墙。都行。

   同理，房间和走廊相邻、或两条走廊相邻时，隔一堵或两堵墙都行。

   <details>
   <summary>（点开查看）房间隔一堵墙或两堵墙的例子。</summary>

   注意，无论你选哪种（一堵墙或两堵墙），两个房间仍必须连通，即必须存在从一间房走到另一间房的路径。下面的世界不合法，因为房间没有连通。隔一堵墙的两个房间：![Two rooms separated by a single wall.](https://sp26.datastructur.es/assets/projects/proj5b/single-wall.webp) 隔两堵墙的两个房间：![Two rooms separated by a double wall.](https://sp26.datastructur.es/assets/projects/proj5b/double-wall.webp)

   </details>

2. 墙不应出现在房间内部，因为这会让人分不清哪些方格属于房间、哪些方格属于走廊。

   偶尔出现一次没关系，但不应经常出现。

   <details>
   <summary>（点开查看）房间内部有墙的例子。</summary>

   如果经常出现，就不合法。![A room with a wall inside it.](https://sp26.datastructur.es/assets/projects/proj5b/wall-inside-room.webp)

   </details>

## 任务：世界生成

生成世界的时候到了！

实现一段代码：接收一个种子，生成一个伪随机的二维世界数组，并把这个世界显示给用户。

对项目 5B 来说，用户运行 `Main.java` 里的 `main` 方法时，应该看到一个世界弹出来。目前你可以把种子硬编码在 `main` 方法里（改代码来查看不同种子的输出）。

除了 `Main.main` 这条要求之外，你的世界生成代码可以放在仓库里的任何地方（我们建议在 `Core` 包里建你自己的文件）。

## 提交物

### 世界截图

1. 打开[这个 Java Visualizer 链接](https://cscircles.cemc.uwaterloo.ca/java_visualize/#code=import+java.util.Random%3B%0A%0Apublic+class+SeedGenerator+%7B%0A+++public+static+void+main(String%5B%5D+args)+%7B%0A++++++%0A++++++//+Replace+1270+with+your+fa25-g***+group+ID.%0A++++++Random+r+%3D+new+Random(1270)%3B%0A++++++%0A++++++System.out.println(%22Your+seeds+are%3A+%22)%3B%0A++++++%0A++++++for+(int+i+%3D+0%3B+i+%3C+5%3B+i+%2B%3D+1)+%7B%0A+++++++++System.out.println(Math.abs(r.nextLong()))%3B%0A++++++%7D%0A++++++%0A++++++%0A+++%7D%0A%7D&mode=edit)生成 5 个种子。记得把 `1270` 换成你们的小组编号。

2. 用你的代码生成这 5 个种子对应的 5 个世界。

   种子后面可能需要加一个「L」，Java 才会把它当作 long 类型的数，例如 `6578897764558030256L`。

3. 给每个世界截一张图。你的截图应该和本说明里其他世界截图的样子类似。

4. 在终端里进入你们的小组仓库，输入 `git show --summary`。确认你看到的最新提交就是生成这些世界所用的代码：

   ![git show output.](https://sp26.datastructur.es/assets/projects/proj5b/git-show.webp)

5. 给 `git show --summary` 的输出截一张图。

   警告：5 个世界必须都是用同一份代码生成的。不要 3 个世界用一个算法、另外 2 个世界用另一个算法。我们会用你的提交记录来检查这一点。

6. 把这 6 张截图（5 张世界 + 1 张 `git show`）上传到 Gradescope。**全部六张截图应作为同一个问题（World Screenshots）一起提交**。

7. 确保只有一位搭档提交，然后在 Gradescope 上[标注另一位搭档](https://guides.gradescope.com/hc/en-us/articles/21863861823373-Adding-Group-Members-to-a-Submission)（英文）。每个小组只能有一份提交。

   警告：不要在代码里硬编码世界。你的世界生成代码应该能对我们提供的任意种子生成伪随机世界，而不只是那 5 个种子。我们同样会用你的提交记录来检查这一点。

**评分：**

我们会在项目 5B 截止之后、项目 5C 截止之前给你的世界评分。评分最多可能需要一周（尤其是如果你申请了延期），请耐心等待。

如果你的世界没有拿到满分，可以在 Gradescope 上提交重新评分申请。

重新评分申请里请附上：

- 一张 `git show --summary` 的截图，对应你用修复后的代码生成世界的那次提交。
- 用修复后的代码生成的 5 个世界。请使用和你最初相同的种子。

回复重新评分申请最多可能需要一周，请耐心等待。

### 代码风格

注意：由于项目 5 没有自动评分器，我们不会在这个项目上强制执行 61B 代码风格指南。但我们仍然强烈建议遵循风格指南，这样你的搭档才读得懂你的代码！
