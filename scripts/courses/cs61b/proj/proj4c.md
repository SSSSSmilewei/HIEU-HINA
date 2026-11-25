# 设计项目 4C：WordNet（k = 0）

> 本页是 UC Berkeley CS61B 2026 春季官方项目说明「Project 4C: Wordnet (k==0)」的中文翻译，原文见页面下方的「项目原文」。命令、代码和程序输出保持原样。

> 项目 4CD 的说明有变化，拆成了多个页面。项目没有新增任何要求，自动评分和起始代码也和以前一样，所以如果你已经完成了项目，什么都不用做！

> *完成本项目需要先学过以下讲座：*
>
> - 第 17 讲（Extends, Sets, Maps, and BSTs，继承、集合、映射与二叉搜索树）
> - 第 21、22 讲（Graph Traversals and Implementations，图的遍历与实现）
>
> *组队政策：*本项目不组队。可以和其他同学讨论想法，但不允许分享代码，你提交的解答应该是你自己的工作！更多细节见[课程政策页](https://sp26.datastructur.es/policies/#collaboration-policy)（英文）。
>
> *LLM 政策：*不得让 LLM 编写你提交的任何代码。更多细节见 [LLM 政策页](https://sp26.datastructur.es/policies/#llm-policy)（英文）。

在这个项目里，我们将继续构建基于浏览器的工具 NGordnet，新增一个功能：在 WordNet 数据集里返回下位词（hyponym）。（别担心，说明后面会解释。）

和项目 4A 不同，这一部分的实现非常开放。决定整体设计是一项重要的技能，项目 5 里我们还会再次用到它。这个项目的代码行数不一定多，但一路上你要做很多相互独立的决定。

[看下面的视频介绍，或点击这里。](https://www.youtube.com/playlist?list=PLNpmrGKEeMf727KwSrG8Ez1o3odK--o9i) 注意视频里可能有部分内容略微过时。

视频（英文）：<https://www.youtube.com/embed/pHVCB4Lomik?si=vyTRNWWyPbTgZzQe>

视频（英文）：<https://www.youtube.com/embed/Em3nRZWmkUU?si=8ZS-a0g1NJf9skh9>

## 准备工作

按照[作业工作流程指南](https://sp26.datastructur.es/resources/assignment-workflow/)（英文）开始这份作业。起始代码在 `proj4cd` 文件夹里。

你还需要下载 Wordnet 数据文件（约 150 MB，太大，没法推到 GitHub 上）。

你会注意到这份起始代码和项目 4A 的（几乎）完全一样。项目 4C/4D 会用到项目 4A 的 `NGramMap` 类，所以我们提供了一个占位实现，其中包含一个能用的 `countHistory` 方法。你可以换成自己的实现测试，但我们强烈建议使用助教团队的实现。

你可能还注意到 `Plotter` 类和其他 handler 不在起始代码里。因为它们依赖 `TimeSeries`，想用的话你得把它们连同你的 `TimeSeries` 实现一起从项目 4A 拷过来。导入 `library-sp26` 之后，`NGramMap.java` 里的代码应该不再标红。

## 任务 0：Wordnet 数据

> 按照[数据文件](https://sp26.datastructur.es/proj4/proj4-data/#wordnet)说明里的步骤获取 Wordnet 数据。那里有对数据集的描述。务必弄懂每个文件的格式，以便读取和解析它们。

## 任务 1：Dummy HyponymsHandler

> 1. 和项目 4A 一样，在**网页浏览器**里打开 `static` 文件夹里的 `ngordnet.html` 文件。怎么打开可以回去看[项目 4A 的这一节](https://sp26.datastructur.es/proj4/proj4a/#task-3-historytexthandler)。你会看到两个新东西：「Hyponyms」按钮和 `k` 输入框。`k` 输入框先不用管，那是项目 4D 的。
> 2. 试着点一下 Hyponyms 按钮。你会看到什么都没发生（如果打开浏览器的开发者工具，会看到浏览器报了一个错误）。

在项目 4C/4D 里，你的主要目标就是实现这个按钮。这需要读入另一种类型的数据集，并把它和项目 4A 的数据集综合起来。和 4A 不同，创建哪些类和方法来帮自己完成这个任务，完全由你自己决定。

> 1. 先打开你的 `Main.java` 文件。
> 2. 新建一个叫 `HyponymsHandler` 的文件，让它在用户点击浏览器里的 Hyponyms 按钮时简单地返回「Hello!」。你需要新建一个继承 `NgordnetQueryHandler` 类的 `HyponymsHandler` 类。可以参考项目 4A 里的各个 handler 类。注册你的 handler 时，务必给 `register` 方法的第一个参数传字符串 "hyponyms"，而不是 "hyponym"。
> 3. 改好 `Main`、注册了新 handler 之后，启动 `Main`，再到浏览器里点一下 Hyponyms 按钮。你应该看到页面上出现了「Hello」。

额外资源：

- [助教团队的解答网页](https://ngordnet.datastructur.es/)：对不同的测试输入生成期望输出非常有用。可以用它来写单元测试！

  - 注意它用的是 `word_history_size14377`、`year_history.csv`、`synsets_size82191.txt` 和 `hyponyms_size82191.txt` 这几个文件，你用的文件不同，结果可能不一样！
  - 你可以用可视化图功能帮助理解 hyponym/hypernym 关系。这个功能不考虑起始年份、结束年份和 k，只对输入单词列表里的第一个单词，可视化你所选 synset 的子节点。

- [Wordnet Visualizer](https://www.qxbytes.com/wordnet/)：帮助直观理解 synset 和 hyponym 的运作方式，还可以用不同的单词或单词列表测试可能的测试输入。点击「?」气泡可以学会这个工具的各项功能！

## Hyponyms（基本情形）

在接下来的 3 个任务里，你要做出 Hyponyms 按钮的一个部分实现。目前，这个按钮应当：

- 假设输入的「words」只有一个单词。
- 忽略 startYear、endYear 和 k。
- 返回一个列表的字符串表示，列表内容是这个单词的所有 hyponym，包括它自己。列表应按**字母顺序**排列，**不含重复单词**。排序应区分大小写（Java 本来就是这么做的！只要注意别画蛇添足加上忽略大小写的逻辑）。

例如，假设 WordNet 数据集如下图所示（即给你的输入文件 `synsets_size11.txt` 和 `hyponyms_size11.txt`）。假设用户输入「descent」并点击 Hyponyms 按钮。

![fig 1](https://sp26.datastructur.es/assets/projects/proj4c/1-wordnet-fig.webp)

这种情况下，你的 handler 的输出应该是一个包含「descent」「jump」「parachuting」的列表的字符串表示，即 `[descent, jump, parachuting]`。注意单词是按字母顺序排的。

再看一个例子。假设我们用一个稍大一点的数据集，比如下面这个（即给你的输入文件 `synsets_size16.txt` 和 `hyponyms_size16.txt`）：

![synsets16](https://sp26.datastructur.es/assets/projects/proj4c/2-wordnet-fig2.webp)

假设用户输入「change」并点击 Hyponyms 按钮。这种情况下，hyponym 就是下面这张图里蓝色节点里的所有单词：

![synsets16-change-hyponyms](https://sp26.datastructur.es/assets/projects/proj4c/3-wordnet-fig2-change-hyponyms.webp)

也就是说，输出是 `[alteration, change, demotion, increase, jump, leap, modification, saltation, transition, variation]`。注意尽管「change」属于两个不同的 synset，它只出现一次。

**注意：别想太多**，别把日子过得比需要的更难。具体来说，注意输出**不**包括：

- 同义词的同义词（例如不包括 *“adjustment”*）
- 同义词的 hyponym（例如不包括 *“conversion”*）
- hyponym 的其他释义的 hyponym（例如不包括 *“flashback”*，它是「transition」另一个释义的 hyponym）

换句话说，用最直白的方式解决这个问题就足够了。

## 任务 2：图（Graph）的实现

要让 Hyponyms 按钮工作，你需要某种有向图（directed graph）的实现，就像第 21、22 讲里讲的那样。我们建议从这个项目的这一步做起。

> 实现一个有向图来表示 Wordnet。

这个项目和课上前面任何项目都不一样。我们不会给你的图实现评分，甚至不会告诉你图里该放什么。那是你的选择。

要决定你的图设计里包含哪些方法，你得提前想好将来怎么用它。这就要求你理解下面描述的整个任务。

你可能还想要一些表示「遍历」这个概念的辅助类或方法，但这不是必需的——你也可以把遍历直接实现在你的图类里面。

> 在这个项目里，你不许往代码里导入任何现成的图库。你应该自己构建一个或多个图类。记住，这个项目不允许用 LLM 生成代码！

> 既然你只会写一个实现，就没必要定义 `interface`。也就是说，与其写一个 `DirectedGraph` 接口再加上好几个实现（例如 `AdjacencyMatrixDG` 和 `AdjacencyListDG`），不如直接写一个类。

测试你的图，见[测试说明](https://sp26.datastructur.es/proj4/proj4-testing/#graph)。

## 任务 3：读入 WordNet 数据集文件

> 1. 解析 Wordnet 数据文件。
> 2. 用你的有向图实现来存储数据。

### 设计提示

Hyponyms 按钮涉及各种不同的查找、图操作和数据处理操作。没有唯一正确的做法。

下面是你在 WordNet 数据集上可能要做的一些查找的例子：

- 给定一个单词（例如「change」），哪些节点包含这个单词？

  - `synsets_size16.txt` 里的例子：change 在 synset 2 和 8 里

- 给定一个整数，哪个节点对应这个编号？

  - 处理 hyponyms.txt 需要这个。例如在 hyponyms_size16.txt 里，我们知道 synset 8 的节点指向 synset 9 和 10，所以要能找到节点 8 来取得它的邻接表。

- 给定一个节点，这个节点里有哪些单词？

  - `synsets_size16.txt` 里的例子：synset 11 包含 alteration、modification 和 adjustment

下面是你可能要做的一些图操作的例子：

- 创建节点，例如 `synsets_size16.txt` 的每一行包含一个节点的信息。
- 在节点之间加边，例如 `hyponyms_size16.txt` 的每一行包含一条或多条要加到相应节点上的边。
- 找可达节点，例如 `hyponyms_size16.txt` 里从节点 #7 可达的节点是 7、8、9、10。

如果你为各个类选的实例变量能自然而然地帮上上面这六个问题的忙，你的日子会好过得多。

注意：如果你过度设计、写了一些最后用不上的方法，没关系。

> 和 NGramMap 一样，你的辅助类应该只解析输入文件一次。不要写出每次调用都要把整个 Wordnet 文件读一遍的方法。那样会太慢！
>
> 另外，项目 4A 有一条提醒：深层嵌套的泛型是「你把事情搞得太复杂了」的信号。要么找个更简单的办法，要么建一个辅助类来管理复杂度。例如，如果你发现自己在用 `Map<Set<Set<...` 这种东西，你就已经走上一条不必要的弯路了。

如果你的设计很痛苦、推不下去，别害怕删掉现有的实例变量重来。这个项目难在设计，不在编程。如果你后来又觉得原来的设计好，随时可以用 git 找回旧版本。

## 任务 4：遍历 WordNet 图

> 在你的有向图实现上使用一个算法，返回查询的 hyponym。

现在你有了在内存里表示 WordNet 数据集的办法，搭好 Hyponyms 按钮的最后一步，就是写代码：接收一个单词，用**图遍历**（graph traversal）在给定的图里找出这个单词的所有 hyponym。

我们建议把代码加到一个 WordNet 类里，让一个 WordNet 对象能接收一个单词并返回它的 hyponym。

### 设计提示

这个任务里你可能需要的一些数据处理操作的例子：

- 给定一组东西，怎么找出所有不重复的项？（提示：有一种数据结构能让这件事非常简单高效。）也别害怕上网搜索你选的那种数据结构的用法（例如如果你出于某种原因选了 TreeMap，尽管去搜「TreeMap methods java」「Map methods java」「Collection methods java」等等）。
- 给定一组东西，怎么给它们排序？（提示：搜一搜你用的那种集合怎么排序。）

测试你的 WordNet 和「单个单词」情形，见[测试说明](https://sp26.datastructur.es/proj4/proj4-testing/#wordnet)。

浏览器测试和调试技巧，见测试说明的[「在浏览器里测试」和「调试」小节](https://sp26.datastructur.es/proj4/proj4-testing/#testing-in-browser)。

## 处理单词列表

你的下一个目标是处理单词列表。举个例子，如果用户针对下图输入「change, occurrence」，我们应该只返回每个单词共同的 hyponym，即 `[alteration, change, increase, jump, leap, modification, saltation, transition]`。「Demotion」和「variation」不包括在内，因为它们不是所有单词共同的 hyponym；具体来说，它们不是「occurrence」的 hyponym。

![synsets16-two-word-query](https://sp26.datastructur.es/assets/projects/proj4c/4-wordnet-fig2-two-word-query.webp)

如你所见，我们只想返回是列表里**所有**单词的 hyponym 的单词。另外注意，用户提供的单词列表可以不止两个单词，尽管本说明里的例子没有超过两个。

注意，两个单词可以共享 hyponym，但不一定共享节点。看这个例子。如果用户针对下图输入「car, bug」，我们应该得到 `[beetle]`，而不是 `[]`（空列表）！这个例子说明我们取的是**单词**的交集，不是**节点**的交集。

![wordnet-fig](https://sp26.datastructur.es/assets/projects/proj4c/5-wordnet-fig3.webp)

再举几个体现这个功能用处的例子。假设我们使用完整的 `synsets_size82191.txt` 和 `hyponyms_size82191.txt`：

- 在单词框里输入「video, recording」并点击「Hyponyms」，应该显示 `[video, video_recording, videocassette, videotape]`，因为这些是「video」和「recording」共同的所有 hyponym 单词。
- 在单词框里输入「pastry, tart」并点击「Hyponyms」，应该显示 `[apple_tart, lobster_tart, quiche, quiche_Lorraine, tart, tartlet ]`。

## 任务 5：单词列表

> 修改你的 `HyponymsHandler` 和其余实现，处理单词列表的情形。

要测试这部分代码，我们建议用 `synsets_size16.txt` 和 `hyponyms_size16.txt` 手工构造例子，用提供的前端来检验正确性。

测试单词列表情形，见[测试说明](https://sp26.datastructur.es/proj4/proj4-testing/#list-of-words)。

## 任务 6：Autograder Buddy

整个作业里，我们都让你用前端来测试代码。我们的评分器没有那么先进，没法假装成网页浏览器来调用你的代码。所以，需要你在 `AutograderBuddy` 类里提供一个方法，由它提供一个能处理 hyponym 请求的 handler。

在说明开头运行 `git pull skeleton main` 时，你应该已经收到一个叫 `AutograderBuddy.java` 的文件。

打开 `AutograderBuddy.java`，填写 `getHyponymHandler` 方法，让它返回一个使用 `synsetFile` 和 `hyponymFile` 的 `HyponymsHandler`。你这里的代码应该和 `Main.java` 里的很像。

写好 `AutograderBuddy` 之后，就可以提交到自动评分系统了。如果有测试没过，你应该能基于上面那些测试文件，把它们在本地复现成 Truth 测试。如果需要额外的数据文件，相关链接会补到这一节。

## 提交

试着提交到自动评分系统。你可能会全部通过，也可能不会。

- 如果你没通过某个正确性测试，说明有一种情况你的本地测试没有覆盖到。
- 不修完所有风格（style）错误，自动评分不会运行。提醒：你随时可以在 IntelliJ 里检查风格：![Run style checker in IntelliJ](https://sp26.datastructur.es/assets/resources/style-guide-img/intellij_style_checker.webp)
- 你每 24 小时有 **4** 个令牌（token）的提交限额。我们不会因为忘记 add/commit/push 代码、没跑风格检查等补发令牌。

项目 4C 计 160 分。

评分构成：

- **HyponymHandler k == 0 单个单词（50%）**
- **HyponymHandler k == 0 多个单词（50%）**

你在 Gradescope 上得到的分数就是这份作业的最终分数（前提是你遵守了[合作政策](https://sp26.datastructur.es/policies/#collaboration-policy)）。

> **本站补充（校外学习者请看）**：提交和自动评分只对伯克利在读学生开放。不在伯克利的同学可以这样做：照常完成代码，用仓库里自带的测试（`TestOneWordK0Hyponyms.java`、`TestMultiWordK0Hyponyms.java` 等）加上自己写的测试在本地验证；全部测试通过、风格检查没有报错，就算完成这个阶段。提交次数的令牌限制不用管。

本作业的 WordNet 部分大致改编自普林斯顿大学 Alina Ene 和 Kevin Wayne 的 [Wordnet 作业](http://www.cs.princeton.edu/courses/archive/fall14/cos226/assignments/wordnet.html)。
