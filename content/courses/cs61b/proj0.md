# 小项目 0：粒子模拟器

> 本页是 UC Berkeley CS61B 2026 春季官方项目说明「Project 0: Particle Simulator」的中文翻译，原文见页面下方的「项目原文」。命令、代码和程序输出保持原样。

> **本站补充（校外学习者请先看）**：本项目在原课程里要提交到 Gradescope 自动评分，助教答疑（办公时间）和 Ed 论坛也只对伯克利在读学生开放。好消息是，本项目自动评分的全部测试都包含在骨架代码里（没有隐藏测试），校外学习者可以完全在本地完成：按「作业 1」页首「本站补充」的办法自建私有仓库、照常从 `skeleton` 远程拉取起始代码，然后逐个任务运行 `tests` 里对应的测试，全部通过就算完成（代码保持私有）。

**截止时间：2 月 3 日（星期二）23:59（太平洋时间）。**（本站补充：截止时间针对伯克利的学期安排，校外学习者可自行规划进度。）

## 概览

这是项目 0 的标准模式（standard mode）。在这一版项目 0 里，我们会提供代码的大部分结构，由你填充细节。

如果你更喜欢本项目的困难模式（hard mode），见 [proj0_hardmode](https://sp26.datastructur.es/projects/proj0_hardmode)。困难模式假定你有非常扎实的编程基本功（例如先修课程拿了 A 或更好的成绩，或者有 Java 使用经验），要求你几乎从零构建一切（不过仍提供大量脚手架）。困难模式可能更有趣，但没有额外分数。

先修要求。开始本项目之前，你应该已完成：

- [作业 1](https://sp26.datastructur.es/homeworks/hw01/)
- [作业 2](https://sp26.datastructur.es/homeworks/hw02/)
- 第 1–3 讲

在这个小项目里，你将通过创建一个物理沙盒（physics sandbox）来练习 Java。我们会提供一大块起始代码（其中不少用到了你还没见过的语法），你来填上其中最有趣的部分。

如果你更想几乎从零构建一切，请看困难模式的说明。

### 使用 Git

频繁地向你的仓库提交工作非常重要。版本控制是一个强大的工具，在你搞砸了什么的时候能救你一命（哪怕你的狗把你的项目吃了），但你必须经常使用它，它才帮得上你。我们建议至少每 15 分钟提交一次；Git 只保存发生变化的内容，尽管它表现得像是给你的整个项目拍了一张快照。

命令 `git status` 会告诉你自上次提交以来修改、删除或可能新增了哪些文件，还会告诉你有多少改动还没有发送到你的 GitHub 仓库。

典型的命令长这样：

```
git status                          # To see what needs to be added or committed.
git add <file or folder path>       # To add, or stage, any modified files.
git commit -m "Commit message"      # To commit changes. Use a descriptive message.
git push origin main                # Reflect your local changes on GitHub so Gradescope can see them.
```

（各行注释的意思依次是：查看有哪些内容需要 add 或 commit；把修改过的文件 add（暂存）进来；提交改动，提交说明要有描述性；把本地改动反映到 GitHub 上，Gradescope 才能看到。）

然后你就可以继续做项目，直到下次准备好提交和推送时，把上面的过程再重复一遍。养成频繁提交、写有信息量的提交说明的习惯，对你自己最有利：万一需要回退到旧版本的代码，不但做得到，还很轻松。我们建议每新增一大段代码，或每到达一个里程碑（例如通过一个新测试）就提交一次。

下面是本项目的一个提交记录示例：

![Project 0 commits](https://sp26.datastructur.es/assets/projects/proj0/commits.webp)

### 学术不端

为了劝阻大家使用大语言模型（LLM），我们会对全部五个项目的提交代码做随机代码审查，并有偏向地抽查那些看起来像 LLM 生成的代码。

如果你已经绝望到觉得作弊开始显得有吸引力，请来办公时间，或在 Ed 上发一个私密帖求助。**我们就是来帮助你的！**

对被抽中代码审查的学生，我们会安排简短的面谈，确认你能够解释自己的代码，并且能在无人协助的情况下写出类似的代码。

（本站补充：随机代码审查和面谈只针对伯克利选课学生，校外学习者不会接受抽查；但也请同样独立完成代码，不要直接用 AI 生成。）

## 准备工作

### 获取骨架文件

按[作业工作流程指南](https://sp26.datastructur.es/resources/assignment-workflow/)获取骨架代码并在 IntelliJ 中打开。本项目我们在 `proj0/` 目录下工作。

> 如果遇到某种报错，停下来，要么仔细阅读 [git WTFs](https://sp26.datastructur.es/troubleshooting/git-wtfs/)，要么去办公时间或 Ed 求助。比起对 git 命令瞎猜乱试，这样能帮你省掉很多麻烦。如果你发现自己在尝试 Google 推荐的命令，比如强制推送，[别这么做](https://twitter.com/heathercmiller/status/526770571728531456)。**哪怕 Stack Overflow 上的帖子让你 `git push -f`，也不要用！**
>
> 如果实在弄不好 Git，可以看[这个视频](https://www.youtube.com/watch?v=Squ8TmG5mX0)，作为提交作业的最后办法。

### 文件结构

```
proj0
├── src
    ├──Direction.java
    ├── ParticleFlavor.java
    ├── Particle.java
    ├── ParticleSimulator.java
├── tests
    ├── TestParticle.java
    ├── TestParticleSimulator.java
```

拉取骨架之后，你应该看到上面这样的文件结构。本项目里你当然可以看其他文件，但只需要修改 `Particle.java` 和 `ParticleSimulator.java`。两个测试文件里装着下面各个任务的测试，所以务必把每个测试都跑一遍，检查你是否正确完成。

对本项目来说，自动评分器（autograder）上的全部测试都会包含在骨架里，但以后的项目不会这样。换句话说，没有隐藏测试。

## 任务 0：启动粒子模拟器

> 为了检验一切正常，打开 `ParticleSimulator.java` 文件并运行 main 方法。你应该看到一个标题为 `StandardDraw` 的窗口弹出来。
>
> 试着在窗口里点击。你应该看到灰色的小方块出现。这些就是粒子（particle）。这个项目的目标，就是造出具有不同行为的不同类型的粒子！

> 如果你没法运行 main 方法，请确认以下几点：
>
> - IntelliJ 已更新到以 2025 开头的最新版本，即 2025.X.X（Windows/Linux 在 Help > Check for Updates，macOS 在 IntelliJ IDEA > Check for Updates 检查更新）
> - 在 Project Structure 里，SDK 和语言级别（language level）都设为 25

## 任务 1：粒子颜色

> 修改 `public Color color()` 方法，使它的行为如下：
>
> - 如果 flavor（粒子种类）是 EMPTY，返回 `Color.BLACK`。
> - 如果 flavor 是 SAND，返回 `Color.YELLOW`。
> - 如果 flavor 是 BARRIER，返回 `Color.GRAY`。
> - 如果 flavor 是 WATER，返回 `Color.BLUE`。
> - 如果 flavor 是 FOUNTAIN，返回 `Color.CYAN`。
> - 如果 flavor 是 PLANT，返回 `new Color(0, 255, 0)`。这是一个红、绿、蓝三个分量分别为 0、255、0 的颜色。
> - 如果 flavor 是 FIRE，返回一个红、绿、蓝分量为 255、0、0 的 `Color`。
> - 如果 flavor 是 FLOWER，返回一个红、绿、蓝分量为 255、141、161 的 `Color`。

## 任务 2：目测颜色函数

我们可以试着用粒子模拟器类来测试颜色函数！

在 `ParticleSimulator.java` 顶部，你应该看到长下面这样的代码：

```
    public static final Map<Character, ParticleFlavor> LETTER_TO_PARTICLE = Map.of(
            's', ParticleFlavor.SAND,
            'b', ParticleFlavor.BARRIER,
            'w', ParticleFlavor.WATER,
            'p', ParticleFlavor.PLANT,
            'f', ParticleFlavor.FIRE,
            '.', ParticleFlavor.EMPTY,
            'n', ParticleFlavor.FOUNTAIN,
            'z', ParticleFlavor.FLOWER
    );
```

这些是你可以按键来创建对应类型粒子的按键。例如，试着按 w 再点击，你应该看到水的小方格出现。

试着创建不同类型的粒子，验证颜色和预期一致！

## 任务 3：自动测试颜色函数

在这门课里，我们会用一个叫 `Google Truth` 的库来编写和运行测试，第 4 讲会讲到它。在这个项目里，你只需要运行测试，不需要写测试。打开 `TestParticle.java`，找到叫 `testColor` 的方法。在那里你可以看到我们为检查你的 `color` 方法准备的代码。这也正是我们在 Gradescope 自动评分器里运行的同一份代码。

> 点击 `testColor` 方法左侧的运行按钮。你应该通过这个测试。如果没有通过，就修改你的 `color` 方法，直到通过为止。

## 任务 4：moveInto

我们希望粒子能够移动。大多数粒子只会下落，但水粒子还要能四处流动。

为了让粒子能移动，我们要实现一个 `moveInto` 函数，它把一个粒子的颜色和寿命（lifespan）转移给另一个粒子。

> 在 `Particle.java` 里填写 `moveInto` 函数。这个函数的行为是：运行之后：
>
> - `other.flavor` 等于当前粒子的 flavor
> - `other.lifespan` 等于当前粒子的 lifespan
> - 当前粒子的 flavor 被设为 EMPTY（因为它挪走了，留下空位）
> - 当前粒子的 lifespan 被设为 -1（因为它挪走了，留下空位）

下面给出一段 Python 伪代码：

```
def move_into(self, other: 'Particle'):
    other.flavor = self.flavor
    other.lifespan = self.lifespan

    self.flavor = ParticleFlavor.EMPTY
    self.lifespan = -1
```

要测试你的 `moveInto` 函数，运行 `TestParticle.java` 里的 `testMoveInto` 函数。

这个函数暂时没法目测。务必通过测试后再继续。

## 任务 5：fall

接下来，填写 `public void fall(Map<Direction, Particle> neighbors)` 方法。

这里，方法会拿到一个 `Map`，从四个可能的方向 `Direction.DOWN`、`Direction.LEFT`、`Direction.RIGHT`、`Direction.UP` 映射到一个 `Particle`。

例如，如果我们调用 `Particle p = neighbors.get(Direction.DOWN)`，那么 `p` 就是指向下方粒子的引用。如果我们接着检查发现 `p.flavor` 是 `SAND`，就知道下面的邻居是一个 `SAND` 粒子。

fall 方法应该：

1. 检查 down 方向上的邻居，例如 `neighbors.get(Direction.DOWN)`。
2. 如果那个邻居的 flavor 等于 `ParticleFlavor.EMPTY`，当前粒子就应该 `moveInto` 那个粒子。这里要用到你前面写的 `moveInto` 函数。

要测试你的 `fall` 函数，调用 `TestParticle.java` 里的 `testFall` 方法。运行测试，验证你的 `fall` 方法工作正确。

你可以假设所有邻居都不是 `null`。我们的起始代码把所有屏幕外的坐标都当作 `BARRIER` 处理。

这个函数暂时没法目测。务必通过测试后再继续。

## 任务 6：启用重力

粒子模拟器的工作方式是对每个粒子调用 `action`。

看 `Particle.java` 里的 `action` 方法。你会发现它目前什么都不做。我们想让粒子服从重力规律，向地面下落。

> 修改 `action` 方法，使逻辑为：
>
> 1. 如果当前粒子的 flavor 是 EMPTY，立即返回。
> 2. 如果当前粒子的 flavor 不是 BARRIER，调用 `fall`。

做完之后，再次运行 `ParticleSimulator.java`。你应该看到，创建除 `BARRIER` 以外的任何类型的粒子，它都会下落；但如果创建 `BARRIER`，它应该悬在半空。

试着按住鼠标拖动。你应该看到大量粒子纷纷下落！

你也可以运行 `TestPaticleSimulator` 里的 `testFallVisual` 和 `testBarrierDoesntFall` 来测试代码。（**译注**：原文此处写作 `TestPaticleSimulator`，是拼写错误，应为文件结构里的 `TestParticleSimulator`。）

## 任务 7：让水流动

> 我们希望水会流动。为此，填写 `public void flow(Map<Direction, Particle> neighbors)` 方法。
>
> 它应该在下面三个选择中选一个：
>
> 1. 有 1/3 的概率，什么都不做。
> 2. 有 1/3 的概率，如果左邻居为空，`moveInto` 它。
> 3. 有 1/3 的概率，如果右邻居为空，`moveInto` 它。
>
> 三个选择只能选一个。如果水被非空的邻居挡住，就什么都不发生。

要得到 [0, 1, 2] 范围内的随机数，用 `StdRandom.uniformInt(3);`。对 `flow` 的每次调用，总共只生成一个随机数，并用这个随机数的结果决定三个选项中发生哪一个。

> 写完 `flow` 之后，修改 `action` 方法，使逻辑为：
>
> 1. 如果当前粒子的 flavor 是 EMPTY，立即返回。
> 2. 如果当前粒子的 flavor 不是 BARRIER，调用 `fall`。
> 3. 如果当前粒子的 flavor 是 WATER，调用 `flow`。
>
> 你的 `action` 方法应该是一串 `if` 语句。不要用 `else`。

一个细节（完全可以无视）：对水粒子调用 `fall` 时，它可能挪进下面的粒子里。发生这种情况时，这个粒子的 flavor 已经变成 `EMPTY`，所以 `flow` 不会被调用。

实现这个函数后，造一些 `BARRIER` 粒子，比如摆成碗的形状。然后投放一些 `WATER` 粒子，你应该看到碗装满之后，`WATER` 粒子开始越过边缘往外流。

要测试你的 `flow` 方法，运行 `TestParticle.java` 里的 `testFlow`，以及 `TestParticleSimulator.java` 里的 `testTickWithFlow` 和 `testFallingWaterDoesNotFlow`。

## 任务 8：让植物（和花）生长

> 修改 `public void grow(Map<Direction, Particle> neighbors)`。它应该在下面四个选择中选一个：
>
> 1. 有 10% 的概率，如果 UP 邻居的 flavor 是 `EMPTY`，把上邻居的 flavor 设成和当前粒子一样。
> 2. 有 10% 的概率，如果 LEFT 邻居的 flavor 是 `EMPTY`，把左邻居的 flavor 设成和当前粒子一样。
> 3. 有 10% 的概率，如果 RIGHT 邻居的 flavor 是 `EMPTY`，把右邻居的 flavor 设成和当前粒子一样。
> 4. 有 70% 的概率，以上都不做。
>
> 记得根据当前粒子的 flavor 设置邻居的 lifespan，例如一个 `PLANT` 长到 UP 位置时，lifespan 应该是 `LIFESPANS` 里给出的 150。

四个选择只能选一个。生长时不要创建任何新的 `Particle` 对象，而是把现有粒子的 flavor 设成和当前粒子一样。

想写出最干净的代码，请用 `LIFESPANS` 映射。

要得到 [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] 里的随机数，用 `StdRandom.uniformInt(10);`。

> 然后修改 `action`，使它有下面的行为：
>
> 1. 如果当前粒子的 flavor 是 EMPTY，立即返回。
> 2. 如果当前粒子的 flavor 不是 BARRIER，调用 `fall`。
> 3. 如果当前粒子的 flavor 是 WATER，调用 `flow`。
> 4. 如果当前粒子的 flavor 是 PLANT 或 FLOWER，调用 `grow`。

运行模拟器时，你应该看到 FLOWER 或 PLANT 一落地就开始生长。

要测试你的 `grow` 方法，运行 `TestParticleSimulator.java` 里的 `testGrow`。

## 任务 9：让寿命开始倒数

> 首先，更新 `Particle.java` 的构造函数，根据粒子的 flavor 设置 lifespan。你会看到默认实现把 lifespan 设成了 `-1`。请改变这一行为：如果 flavor 是 `PLANT`、`FLOWER` 或 `FIRE`，lifespan 按类顶部的变量来设置；否则 lifespan 保持 -1。想写出最干净的代码，请用 `LIFESPANS` 映射。
>
> 接下来，给 `Particle.java` 添加一个叫 `public void decrementLifespan()` 的方法。它应该有下面的行为：
>
> 1. 如果当前粒子的 lifespan 大于 0，把 lifespan 减 1。
> 2. 如果当前粒子的 lifespan 等于 0，把它的 flavor 设为 `EMPTY`，lifespan 设为 -1。
>
> 然后修改 `ParticleSimulator.java` 的 `tick` 方法，使得对每个粒子调用 `action` 之后，紧接着调用 `decrementLifespan`。也就是说，`tick` 方法里应该有这几行：

```
               Map<Direction, Particle> neighbors = getNeighbors(x, y);
               particles[x][y].action(neighbors);
               particles[x][y].decrementLifespan();
```

`particles` 是由 `Particle` 对象的列表组成的列表，所以 `particles[x][y]` 指的是单个 `Particle`。

再运行一次你的代码，你应该看到植物和花不再占领整个屏幕，而是在老去时死去，留下的后代落下接替它们。

要测试你的代码，运行 `TestParticleSimulator.java` 里的 `testLifespan()`。

## 任务 10：让寿命看得见

> 这个任务只是复制粘贴。为了让 `PLANT`、`FLOWER`、`FIRE` 粒子的年龄更清楚，把这三个粒子的 `Color` 换成 `public Color color()` 方法里的这段代码：

```
       if (flavor == ParticleFlavor.FLOWER) {
           double ratio = (double) Math.max(0, Math.min(lifespan, FLOWER_LIFESPAN)) / FLOWER_LIFESPAN;
           int r = 120 + (int) Math.round((255 - 120) * ratio);
           int g = 70 + (int) Math.round((141 - 70) * ratio);
           int b = 80 + (int) Math.round((161 - 80) * ratio);
           return new Color(r, g, b);
       }
       if (flavor == ParticleFlavor.PLANT) {
           double ratio = (double) Math.max(0, Math.min(lifespan, PLANT_LIFESPAN)) / PLANT_LIFESPAN;
           int g = 120 + (int) Math.round((255 - 120) * ratio);
           return new Color(0, g, 0);
       }
       if (flavor == ParticleFlavor.FIRE) {
           double ratio = (double) Math.max(0, Math.min(lifespan, FIRE_LIFESPAN)) / FIRE_LIFESPAN;
           int r = (int) Math.round(255 * ratio);
           return new Color(r, 0, 0);
       }
```

这会让画面好看得多！再运行一次模拟器，配上花和植物看看整体效果。

## 任务 11：让火焰燃烧

> 修改 `public void burn(Map<Direction, Particle> neighbors)`，使它有下面的行为：
>
> 1. 对每个邻居，如果它是 PLANT 或 FLOWER，有 40% 的概率（各个邻居独立计算）把它变成 `ParticleFlavor.FIRE`，并把它的 lifespan 设为 `FIRE_LIFESPAN`。
>
> 然后修改 `action` 方法：如果当前粒子是 `FIRE`，就调用 `burn`。

现在运行模拟，加一些植物或花，再点火。你会发现植物和花都是易燃的。你还会注意到，因为我们的世界有方向偏置——模拟是从左下往右上进行的——火烧得不对称：向右烧得比向左快。

运行 `TestParticleSimulator.java` 里的 `testBurn()`，验证你的 `burn` 方法工作正确。通过最后这个测试后，你就完成了本项目的必做部分，可以提交到 Gradescope 了。

`TestParticleSimulator.java` 里还有一些别的测试。确保它们也都通过！

## 任务 12（选做，不计分）：发挥创意

提交到 Gradescope 之后，尽管发挥创意，给你的模拟器添加新功能。例如，你可以让 `FOUNTAIN` 粒子做点什么，可以添加新的粒子类型，改变世界的视觉风格，或者添加与世界交互的新方式，比如加一个能用方向键跑来跑去的可操控角色。想做什么都行。

做任何可能导致自动评分器失败的改动之前，务必先拿到 Gradescope 满分。

## 任务 13：给你的模拟器录一段视频（选做）

你还可以给模拟器录一小段屏幕录像，展示你发现的一些有趣的东西。就算跳过了任务 12，也可以做这件事。把视频（设为不公开列出或公开都可以）发到 YouTube 上，然后在这里提交：[[61B SP26] Project 0 Contest](https://docs.google.com/forms/d/e/1FAIpQLSficxZcO_mkfYNCGWy6sUbWh8K_t8UH3t56MHgto3uMxBlPQw/viewform)

如果你在表单里选择参加比赛，我们会挑出一些最喜欢的作品，请你在课上演示，或者由我们替你演示。

（本站补充：视频比赛面向伯克利课堂，校外学习者无法参加课上演示评选；可以自行录制视频，留作自己的学习成果。）
