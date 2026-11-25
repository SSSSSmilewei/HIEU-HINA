# 设计项目 4D：WordNet（k ≠ 0）

> 本页是 UC Berkeley CS61B 2026 春季官方项目说明「Project 4D: Wordnet (k!=0)」的中文翻译，原文见页面下方的「项目原文」。命令、代码和程序输出保持原样。

> 项目 4CD 的说明有变化，拆成了多个页面。项目没有新增任何要求，自动评分和起始代码也和以前一样，所以如果你已经完成了项目，什么都不用做！

> *完成本项目需要先学过以下讲座：*
>
> - 第 17 讲（Extends, Sets, Maps, and BSTs，继承、集合、映射与二叉搜索树）
> - 第 21、22 讲（Graph Traversals and Implementations，图的遍历与实现）
>
> *组队政策：*本项目不组队。可以和其他同学讨论想法，但不允许分享代码，你提交的解答应该是你自己的工作！更多细节见[课程政策页](https://sp26.datastructur.es/policies/#collaboration-policy)（英文）。
>
> *LLM 政策：*不得让 LLM 编写你提交的任何代码。更多细节见 [LLM 政策页](https://sp26.datastructur.es/policies/#llm-policy)（英文）。

在这个项目里，你要通过处理 `k != 0` 的情形，完成 Wordnet 的实现。

## 准备工作

你会复用做项目 4C 时创建的 `proj4cd` 文件夹。换句话说，没有新的 skeleton 代码要拉，也没有新的数据文件要下载。

## 处理 `k != 0`

在项目 4C 里，我们处理了 `k = 0` 的情形，也就是用户不输入 `k` 值时的默认值。

你的最后一个目标是处理用户输入 `k` 的情形。`k` 表示我们希望输出里最多包含多少个 hyponym。例如，如果有人输入单词「dog」，然后输入 `k = 5`，你的代码应返回恰好 5 个单词。

挑选这 5 个 hyponym 的办法是：返回在请求的时间范围内出现次数最多的 `k` 个单词。例如，如果有人输入 `words = "food, cake"`、`startYear = 1950`、`endYear = 1990`、`k = 5`，你就要找出这段时间里既是 food 又是 cake 的 hyponym、同时又最流行的 5 个单词。这里的流行度定义为该单词在整个时间段内出现的总次数。**自动评分里不会有并列的情形，并列时可以任意/随机地打破。**

这些单词随后按字母顺序返回。在 `word_history_size14377.csv`、`synsets_size82191.txt` 和 `hyponyms_size82191.txt` 这组文件下，这个例子的答案是 `[cake, cookie, kiss, snap, wafer]`。

> 一定要取出现次数（count）最高的单词，而不是权重（weight）最高的单词。否则你会遇到非常难调试的问题！

在大文件上很难判断 `k != 0` 时单词的 hyponym 是什么，所以我们提供了一批更容易可视化的数据！下面是一个改编版的 EECS 课程要求图，受 [HKN](https://hkn.eecs.berkeley.edu/courseguides) 课程指南启发。我们还提供了表示下面这张图的数据（`word_history_eecs.csv`、`hyponyms_eecs.txt`、`synsets_eecs.txt`）。如果有人输入 `words = ["CS61A"]`、`startYear = 2010`、`endYear = 2020`、`k = 4`，你应该得到 `"[CS170, CS61A, CS61B, CS61C]"`。这个 `word_history_eecs.csv` 和之前的不太一样，它含有频率相同的值。我们强烈建议你看一看 `word_history_eecs.csv`。设计实现时请记住，我们会给你频率相同的单词（只是你不需要为频率相同的单词打破并列）。

嵌入图表（Figma）：<https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FFw2oz5FIMrFRhh9yL8Ylun%2F2C%3Ftype%3Ddesign%26node-id%3D0%253A1%26mode%3Ddesign%26t%3Dn6fDDOrwY4Lb9Gbi-1>

> EECS 课程指南在交互式的助教解答网页上没有，所以输入 `CS61A` 不会返回任何东西。不过，自动评分会为使用 EECS 数据集的每个失败测试提供查询信息和期望的响应。我们建议用这些信息在本地复现自动评分测试，从那里开始调试。

**注意**

- 如果前端没有提供年份，`NGordnetQueryHandler.readQueryMap` 会给出默认值 `startYear = 1900` 和 `endYear = 2020`。
- 如果 `k = 0`，或用户没有输入 `k`（默认值为零），则 `startYear` 和 `endYear` 应被完全忽略。
- 如果一个单词在指定时间范围内从未出现，即计数为零，就不应该返回它。换句话说，如果 `k > 0`，我们不应该显示任何不在 `ngrams` 数据集里出现的单词。
- 如果没有计数非零的单词，你应该返回空列表，即 `[]`。
- 如果计数非零的单词少于 `k` 个，只返回这些单词。例如，输入单词「potato」和「k = 15」，但 potato 只有 7 个计数非零的 hyponym，那就只返回 7 个单词。

## 任务 1：非零的 k

> 修改你的 `HyponymsHandler` 和其余实现，处理 `k != 0` 的情形。

这个任务有点棘手，因为你得想清楚怎么在各处传递信息，让 `HyponymsHandler` 知道怎么访问一个「有用的」`NGramMap`。

此外，我们建议把 `k != 0` 的情形和 `k == 0` 的情形分开处理，因为你的实现将建立在项目 4C 已有工作的基础上。

这意味着你的代码仍然要能处理 `k == 0` 的情形。

测试 `k != 0` 的情形，见[测试说明](https://sp26.datastructur.es/proj4/proj4-testing/#project-4d-wordnet-k0)。

> **TimeSeries**
>
> 你可能注意到了，我们没有提供 `TimeSeries` 类。记住，`TimeSeries` 继承自 `TreeMap` 类，也就是说，如果你想用它的某个等价方法，可以用 `TreeMap` 对象代替 `TimeSeries` 对象，调用相应的 `TreeMap` 方法（例如要用 `data()` 的地方改用 `values()`）。
>
> **NGramMap**
>
> 这个任务里不要做静态的 NGramMap！直接做一个在你代码的任何地方都能访问的 `public static NGramMap` 可能很诱人。这叫「全局变量」。我们强烈反对这种编程思路，建议改为把 NGramMap 传给构造函数或方法。软件工程的讲座里我们还会回到这个话题。

## 任务 2：Autograder Buddy

> 把你完成项目 4C 时用的 `AutograderBuddy` 实现拷过来。修改它，让它也使用 `wordHistoryFile` 和 `yearHistoryFile`。

## 提交

试着提交到自动评分系统。你可能会全部通过，也可能不会。

- 如果你没通过某个正确性测试，说明有一种情况你的本地测试没有覆盖到。
- 不修完所有风格（style）错误，自动评分不会运行。提醒：你随时可以在 IntelliJ 里检查风格：![Run style checker in IntelliJ](https://sp26.datastructur.es/assets/resources/style-guide-img/intellij_style_checker.webp)
- 你每 24 小时有 **4** 个令牌（token）的提交限额。我们不会因为忘记 add/commit/push 代码、没跑风格检查等补发令牌。

项目 4D 计 160 分。

评分构成：

- **HyponymHandler k == 0 单个单词（25%）**
- **HyponymHandler k == 0 多个单词（25%）**
- **HyponymHandler k != 0 单个单词（25%）**
- **HyponymHandler k != 0 多个单词（25%）**

你在 Gradescope 上得到的分数就是这份作业的最终分数（前提是你遵守了[合作政策](https://sp26.datastructur.es/policies/#collaboration-policy)）。

> **本站补充（校外学习者请看）**：提交和自动评分只对伯克利在读学生开放。不在伯克利的同学可以这样做：照常完成代码，仿照 `TestOneWordK0Hyponyms` 和 `TestMultiWordK0Hyponyms` 自己写 `k != 0` 的测试（比如 `tests/TestKNonzeroHyponyms.java`），在本地验证；全部测试通过、风格检查没有报错，就算完成这个阶段。提交次数的令牌限制不用管。

## 前端（Front End）

### 准备工作

作业的这一部分是选做的，但强烈推荐。

项目的这一部分把 `NGramMap`（项目 4A）和 `WordNet`（项目 4B、4C、4D）的能力结合起来。开始之前，把项目 4A 里的 `TimeSeries`、`NGramMap`、`HistoryHandler` 和 `HistoryTextHandler` 拷到项目 4D 里。你还应该调整 `Main.java`，让它注册全部三个 handler。

### 添加新按钮

得到一张 hyponym 列表很酷，但有时更酷的是画出它们的相对词频。例如，如果用户输入单词「food, cake」、startYear = 1900、endYear = 2020、k = 8，然后点击「Hypohist」，就能看到 1900 到 2020 年间既是 food 又是 cake 的 hyponym 的 8 个最流行单词的相对词频。

在这一部分里，你要编辑三种不同的文件：

- HTML
- JavaScript
- Java

我们假设你完全没接触过 HTML 或 JavaScript。在现实项目里，修改你不熟悉的代码——甚至可能是你从没见过的编程语言——是非常常见的事。

### 添加 Hypohist 按钮

打开 `ngordnet.html` 文件。找到创建现有按钮（例如 `History` 和 `Hyponyms`）的代码。凭着你的直觉，复制粘贴你认为必要的代码片段，创建两个新按钮：「Hypohist」和「Hypohist (text)」。

做完后，试着点 Hypohist 按钮，什么都不会发生。

### 创建 Hypohist Handler

回到 `Ngordnet.main.Main`，注册一个叫 `HypohistHandler` 的新 Handler。它应该注册到字符串 `hypohist` 上。这个 handler 先简单地返回文本「hello i am hypohist」。运行你的 Java 服务器，它就准备好监听 Hypohist 的点击了。

服务器运行着，试着点 Hypohist 按钮……还是什么都不会发生！

### JavaScript 回调

明明服务器在监听 Hypohist 的点击，我们也点了 Hypohist 按钮，却什么都没发生！

也就是说，你的浏览器压根没在尝试把查询发给你的 Java 代码。这是因为 HTML 代码通常很「笨」，基本上只说明网站长什么样，别的基本不干。

通常用来描述页面如何工作的语言叫 JavaScript。别看名字，它和 Java 实际上毫无关系；人们普遍认为这个名字是 1990 年代中期的营销手段（见[这个页面](https://www.webucator.com/article/why-javascript-is-called-javascript/)或 [JavaScript 之父 Brendan Eich 的这个视频](https://www.youtube.com/watch?v=XOmhtfTrRxc&t=125s)，均为英文），当时 Java 正当红，JavaScript 刚刚诞生。

让我们窥探一下前端 JavaScript 编程的黑暗宇宙。打开「ngordnet.js」。这段代码是浏览器里漂亮（？）的可视界面和你的 Java 代码之间的中间人。注意，这个项目的 HTML 和 JavaScript 文件没有达到专业水准，说实话它们是我赶工快速拼出来的，尽量保持简单，好让你至少敢动手玩一玩。

你的艰巨任务：试着修改 JavaScript 代码，让点击「Hypohist」按钮时能成功拿回你的 `HypohistHandler` 输出的文本（如果你完全照我上面的建议做，应该是「hello i am hypohist」）。我们建议这个任务不要用 LLM，试试纯靠直觉。

这种全凭手感、摸索着完成一个快速粗糙的编程活儿的老派说法叫「hacking」（折腾），不过这个词如今有很多相互竞争的含义。

提示：

- 仔细做模式匹配！
- 尽情编辑、测试、实验。你不会永久弄坏任何东西。
- 弄坏了，就用 git checkout 恢复 JS 文件的原始版本。
- 别作弊，别直接问 LLM 该怎么做。修改和实验你不理解的代码，这项技能在做原型和拼装代码时非常重要。
- 现实世界里，生产代码绝不应该直接发布这种折腾出来的东西。但它对做原型非常有用！

### Hypohist

接下来，把 Hypohist 按钮的 handler 填好，让它有预期的行为，也就是：这个按钮应返回一张图，画出 Hyponyms 返回的单词在所述时间段内的相对词频。

也就是做我们上面说的事：例如，用户输入单词 `"food, cake"`、设 `startYear=1900`、`endYear=2020`、`k=8`，点击「Hypohist」按钮，就能看到 1900 到 2020 年间既是 food 又是 cake 的 hyponym 的 8 个最流行单词的相对词频。

注意：对 Hypohist 来说，k > 0 时行为很直接。如果 k = 0，该发生什么并不明确。也许你可以想出一个酷点子。

想在这个项目里更上一层楼，读一读[可选功能](https://sp26.datastructur.es/proj4/proj4-bonus-features/)的说明！

本作业的 WordNet 部分大致改编自普林斯顿大学 Alina Ene 和 Kevin Wayne 的 [Wordnet 作业](http://www.cs.princeton.edu/courses/archive/fall14/cos226/assignments/wordnet.html)。
