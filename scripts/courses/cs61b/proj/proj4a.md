# 设计项目 4A：TimeSeries 与 NGramMap

> 本页是 UC Berkeley CS61B 2026 春季官方项目说明「Project 4A: NGrams」的中文翻译，原文见页面下方的「项目原文」。命令、代码和程序输出保持原样。

> *完成本项目需要先学过以下讲座：*
>
> - 第 17 讲（Extends, Sets, Maps, and BSTs，继承、集合、映射与二叉搜索树），或教材第 XX 章（原文如此，待更新）。
>
> *组队政策：*本项目不组队，你提交的解答应该是你自己的工作！更多细节见[课程政策页](https://sp26.datastructur.es/policies/#collaboration-policy)（英文）。
>
> *LLM 政策：*不得让 LLM 编写你提交的任何代码。更多细节见 [LLM 政策页](https://sp26.datastructur.es/policies/#llm-policy)（英文）。

## 概述

在这个项目里，我们将构建一个基于浏览器的工具，用来探索英语文本中单词使用的历史。

[Google Ngram 数据集](http://storage.googleapis.com/books/ngrams/books/datasetsv3.html)提供了数太字节（terabyte）的信息，记录英语中所有观察到的单词和短语（更准确地说，是所有观察到的 [ngram](http://en.wikipedia.org/wiki/N-gram)，n 元语法）的历史词频。Google 在网上提供了 [Google Ngram Viewer](https://books.google.com/ngrams/graph?content=global+warming%2Cto+the+moon&year_start=1800&year_end=2019&corpus=en-2019&smoothing=0)，让用户可以可视化单词和短语的历史相对流行度。例如，上面这个链接画出了短语「global warming」（一个 2gram，二元语法）和「to the moon」（一个 3gram，三元语法）的*加权流行度历史*（weighted popularity history）。

在项目 4A 里，你要构建这个工具的一个只处理 1gram（一元语法，即单个词）的版本。换句话说，你只能处理单个的单词。我们只会使用完整 1gram 数据集里很小的一个子集（约 150 MB），因为更大的数据集需要更复杂的技术，超出了这门课的范围。

我们提供了收集用户输入、显示输出的前端代码（JavaScript 和 HTML）。你的 Java 代码将是这个工具的后端，接收输入并生成适当的输出用于显示。

为了支持这个工具，你将编写一系列用于数据分析的 Java 包（package）。在这个过程中，我们会大量练习各种有用的数据结构。项目的早期部分（项目 4A）会直接告诉你该写哪些函数、创建哪些类；后面的部分（项目 4C、4D）会更开放，要靠你自己的设计。

[看下面的视频介绍，或点击这里。](https://www.youtube.com/watch?v=ri9BzE723QA&list=PL8FaHk7qbOD7-899l1hKEd5aICB9u1wrm&index=1) 注意视频里可能有部分内容略微过时。

视频（英文）：<https://www.youtube.com/embed/ri9BzE723QA?si=CSpOnUIKmQjQ3Jm_>

视频（英文）：<https://www.youtube.com/embed/Jd1g9LnpTtg?si=cnti0cxFieGNAYrm>

视频（英文）：<https://www.youtube.com/embed/kX11gp2l_y0?si=d5ysNhFD6iJLIPKQ>

想看完成后的项目是什么样子，可以看助教团队的实现：[ngordnet.datastructur.es](https://ngordnet.datastructur.es)。

## 准备工作

按照[作业工作流程指南](https://sp26.datastructur.es/resources/assignment-workflow/)（英文）开始这份作业。起始代码在 `proj4a` 文件夹里。

你还需要下载 NGrams 数据文件（约 150 MB，太大，没法推到 GitHub 上）。

## 任务 0：NGrams 数据

> 请按照[数据文件](https://sp26.datastructur.es/proj4/proj4-data/#ngrams)说明里的步骤获取 NGrams 数据。那里有对数据集的描述。务必弄懂每个文件的格式，以便读取和解析它们。

## 任务 1：TimeSeries

`TimeSeries` 是对现有 `TreeMap` 类的一个特殊用途扩展，其中：

- 键的类型参数总是 `Integer`，表示一个年份。
- 值的类型参数总是 `Double`，表示该年份的一个数值数据点。

`TimeSeries` 类在它继承的 `TreeMap` 类之外提供了一些额外的实用方法。哪些方法可用，见 [`TreeMap` API 文档](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/TreeMap.html)（英文）。

例如，下面的代码会创建一个 `TimeSeries`，把 1992 年关联到值 3.6，把 1993 年关联到值 9.2。

```
TimeSeries ts = new TimeSeries();
ts.put(1992, 3.6);
ts.put(1993, 9.2);
```

> 在 `src/tests/TimeSeriesTest.java` 里为每个 `TimeSeries` 方法编写测试。
>
> 你的测试不会被评分，但请记住，写测试是很好的练习，遇到问题时能帮你省下大量时间。更多信息见[测试说明](https://sp26.datastructur.es/proj4/proj4-testing/#timeseries)。

写完测试后，按照文件里给出的 API 实现 `src/main/TimeSeries.java` 中的各个方法。怎样使用 `TimeSeries`，可以看 `src/tests/TimeSeriesTest.java` 里的 `testFromSpec()`。

你不能给这个类添加额外的公开方法。欢迎添加额外的私有方法。

提示：

- `TimeSeries` 对象不应有任何实例变量。`TimeSeries` 是一个（is-a）`TreeMap`。这意味着你的 `TimeSeries` 类也能使用 `TreeMap` 的所有方法；见 [`TreeMap` API 文档](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/TreeMap.html)（英文）。
- 有几个方法需要比较两个 `TimeSeries` 的数据。你不应该写任何「某个年份或数值不存在时补 0」的代码。
- 你可以假设 `dividedBy` 操作永远不会除以零。

## 任务 2：NGramMap

`NGramMap` 类将提供一系列便利方法，用于和 Google 的 NGrams 数据集打交道。这个任务比创建 `TimeSeries` 类更开放、更有挑战性。和 `TimeSeries` 一样，你要填写一个现成的 `NGramMap.java` 文件里的各个方法。

这部分有很多东西要想。我们想模拟现实世界的情形：摆在你面前的是一个大的开放式问题，你得从头摸索出做法。这可能让人发怵！想清楚怎么做，大概要花不少时间、做不少试验。为了不让难度过高，我们至少提供了要实现的方法清单。请记住，在现实世界里（以及这门课后面的项目里），连方法清单都要靠你自己定。

> 填写 `NGramMap` 的构造函数。
>
> 你需要解析提供的数据文件，把数据存进你自己选择的数据结构里。

提示：

- 选对数据结构很重要，因为选对数据结构能让后面实现其余方法轻松得多。因此我们**强烈建议**先看看其余的方法，帮助你决定用什么数据结构最合适，然后再开始实现构造函数。
- 避免把 `HashMap` 或 `TreeMap` 用作映射的[实际类型参数](https://docs.google.com/presentation/d/1j2vivowiaZWepIjUoWj6Cx3CdJiyuYslxkg8GsT8kxM/pub?start=false&loop=false&delayms=3000&slide=id.g631db3c57_38)（actual type argument）。这通常说明你真正想要的是一个自定义类型。换句话说，如果你的实例变量里有 `HashMap<blah, HashMap<blah, blah>>` 这种嵌套映射，那么换成 `TimeSeries` 或你自己想出来的其他类可能会更有用。
- 我们还没有教过 Java 里怎么读文件。我们推荐使用 `In` 类。[官方 `In` 文档在这里。](https://introcs.cs.princeton.edu/java/stdlib/javadoc/In.html)（英文）我们提供了一个示例类 `src/demo/FileReadDemo.java`，示范怎么用 `In`。你也可以使用你在线上学到的任何技术，但助教可能不熟悉、无法提供帮助。
- 如果你用 `In`，不要用 `readAllLines` 或 `readAllStrings`。这些方法很慢。要改为一次读一小块。例子见 `src/demo/FileReadDemo.java`。

### NGramMap 的方法

你的构造函数解析了数据文件，把数据存进了某些数据结构。现在，NGramMap 里的方法可以基于这些数据计算出有趣的结果。例如，考虑这些数据文件（只列出相关的行和列）：

```
word_history_size3.csv:
-----------------------------
Word        Year    Frequency
airport     2007    175702
airport     2008    173294
wandered    2005    83769
wandered    2006    87688
wandered    2007    108634
wandered    2008    171015
...
```

```
year_history.csv:
-----------------------------
Year    Total number of words
2005,   26609986084
2006,   27695491774
2007,   28307904288
2008,   28752030034
...
```

| 方法 | 说明 | 示例 |
| --- | --- | --- |
| `countHistory` | 接收一个单词。对每个年份，返回该单词在该年份的出现次数。 | `countHistory("wandered", 2006, 2007)`<br>应返回<br>`{2006: 87688, 2007: 108634}`。 |
| `totalCountHistory` | 对每个年份，返回该年份的单词总数。 | `totalCountHistory()` 应返回<br>`{2005: 26609986084, 2006: 27695491774, ...}`。 |
| `weightHistory` | 接收一个单词。对每个年份，返回该单词在该年份的出现次数除以该年份的单词总数。 | `weightHistory("wandered", 2006, 2007)`<br>应返回<br>`{2006: 87688 / 27695491774,`<br>`2007: 108634 / 28307904288}`。 |
| `summedWeightHistory` | 接收多个单词。对每个年份，返回所有输入单词在该年份的出现次数之和，除以该年份的单词总数。 | `summedWeightHistory(["wandered", "airport"], 2006, 2007)`<br>应返回<br>`{2006: (87688 + 0) / 27695491774,`<br>`2007: (108634 + 175702) / 28307904288}`。 |

对所有方法：如果提供了起始年份和结束年份，就把返回的结果限制在给定范围内的年份。

你可以假设所有数据都在 1400 年到 2100 年之间。这些值以常量 `MIN_YEAR` 和 `MAX_YEAR` 的形式存在 `TimeSeries` 类里。

如果调用的方法返回 `TimeSeries`，而该次调用没有可用的数据，你应该返回一个空的 `TimeSeries`。

- 例：`ngm.weightHistory("asdfasdf")` 应返回一个空的 `TimeSeries`，因为 `"asdfasdf"` 不是数据集里的单词。
- 例：`ngm.countHistory("adopt", 1400, 1410)` 也应返回一个空的 `TimeSeries`，因为 `"adopt"` 在这些年份里没有数据。

> 按照文件里给出的 API 实现 `src/main/NGramMap.java` 中的各个方法。
>
> 怎样使用 `NGramMap`，可以看 `src/tests/NGramMapTest.java` 里的 `testOnLargeFile()`。
>
> NGramMap 不应继承任何类。
>
> 你不能给这个类添加额外的公开方法。欢迎添加额外的私有方法。

提示：

- 你的方法应该很简单！如果选对了数据结构，方法应该都比较短。
- 和 TimeSeries 一样，你不应该写任何「值不存在时补 0」的代码。
- 你的代码要足够快，能创建一个使用 `word_history_size14377.csv` 的 `NGramMap`。加载应该在 60 秒内完成（旧计算机上可能会略久）。
- 提供的测试已经比较全面了。如果你想写额外的测试，见[测试说明](https://sp26.datastructur.es/proj4/proj4-testing/#ngrammap)。

## 任务 3：HistoryTextHandler

在项目 4A 的任务 3 和任务 4 里，我们要做一点软件工程：搭起一个能处理 NgordnetQuery 的 Web 服务器。这部分内容和数据结构没有严格的关系，但把项目部署到实际使用中，是非常重要的能力。

注意：只有当你相当确信 `TimeSeries` 和 `NGramMap` 都能正确工作后，才开始这一部分。

1. 在网页浏览器里打开 `static` 文件夹里的 `ngordnet_4a.html` 文件。可以在操作系统的文件管理器里打开，也可以在 IntelliJ 里右键点击 `ngordnet_4a.html`，点「Open in」（打开方式），再点「Browser」（浏览器）。用什么浏览器都行，不过助教最熟悉 Chrome。你会看到一个基于网页浏览器的界面，（等你完成项目后）它最终能让用户输入一组单词并显示可视化结果。
2. 在「words」（单词）框里试着输入「cat, dog」，然后点击 `History (Text)`。你会看到没有出现任何有用的东西。

   可选：如果你打开浏览器的开发者工具（怎么打开请自行搜索），会看到一个类似「CONNECTION_REFUSED」或「INVALID_URL」的错误。问题在于 JavaScript 想访问一个服务器来生成结果，但现在没有任何 Web 服务器在运行、能处理查看 cat 和 dog 历史的请求。
3. 打开 `main.Main` 类。这个类的 `main` 方法首先创建一个 `NgordnetServer` 对象。这个类的 API 如下：先对 `NgordnetServer` 对象调用 `startUp`，然后用 `register` 命令「注册」一个或多个 `NgordnetQueryHandler`。这里的细节超出了这门课的范围。

   基本思路是：当你调用 `hns.register("historytext", new DummyHistoryTextHandler(ngm))` 时，会创建一个 `DummyHistoryTextHandler` 类型的对象，由它处理对 `History (Text)` 按钮的每一次点击。
4. 试着运行 `main.Main` 类。在 IntelliJ 的终端输出里你应该看到这一行：`INFO org.eclipse.jetty.server.Server - Started...`，说明服务器正确启动了。

   现在重新打开 `ngordnet_4a.html` 文件（或访问 [http://localhost:4567/ngordnet_4a.html](http://localhost:4567/ngordnet_4a.html)）。再次输入「cat, dog」，点击 `History (Text)`。这次你应该看到一条消息：

   ```
   You entered the following info into the browser:
   Words: [cat, dog]
   Start Year: 2000
   End Year: 2020
   ```
5. 现在打开 `main.DummyHistoryTextHandler`，你会看到一个 `handle` 方法。每当用户点击 `History (Text)` 按钮时它都会被调用。正确的行为应该是：当用户针对上面的输入点击 `History (Text)`（使用更大的单词文件 `word_history_size14377.csv`）时，显示下面的文本：

   ```
   cat: {2000=1.71568475416827E-5, 2001=1.6120939684412677E-5, 2002=1.61742010630623E-5, 2003=1.703155141714967E-5, 2004=1.7418408946715716E-5, 2005=1.8042211615010028E-5, 2006=1.8126126955841936E-5, 2007=1.9411504094739293E-5, 2008=1.9999492186117545E-5, 2009=2.1599428349729816E-5, 2010=2.1712564894218663E-5, 2011=2.4857238078766228E-5, 2012=2.4198586699546612E-5, 2013=2.3131865569578688E-5, 2014=2.5344693375481996E-5, 2015=2.5237182007765998E-5, 2016=2.3157514119191215E-5, 2017=2.482102172595473E-5, 2018=2.3556758130732888E-5, 2019=2.4581322086049953E-5}
   dog: {2000=3.127517699525712E-5, 2001=2.99511426723737E-5, 2002=3.0283458650225453E-5, 2003=3.1470761877596034E-5, 2004=3.2890514515432536E-5, 2005=3.753038415155302E-5, 2006=3.74430614362125E-5, 2007=3.987077208249744E-5, 2008=4.267197824115907E-5, 2009=4.81026086549733E-5, 2010=5.30567576173992E-5, 2011=6.048536820577008E-5, 2012=5.179787485962082E-5, 2013=5.0225599367200654E-5, 2014=5.5575537540090384E-5, 2015=5.44261096781696E-5, 2016=4.805214145459557E-5, 2017=5.4171157785607686E-5, 2018=5.206751570646653E-5, 2019=5.5807040409297486E-5}
   ```

   要通过自动评分系统（autograder），输出的格式必须完全一致。

   包括最后一行在内，每一行文本都应以换行符结尾。

   所有空白和标点（逗号、花括号、冒号）都应遵循上面的示例。

   这些数字表示单词 cat 和 dog 在给定年份的*加权流行度历史*。由于舍入误差，你的数字可能和上面显示的不完全一样。

   你的格式应该和上面显示的一模一样，具体来说：

   - 单词……
   - ……后跟一个冒号……
   - ……后跟一个空格……
   - ……后跟相应 `TimeSeries` 的字符串表示：键值对以逗号分隔的列表放在花括号里给出，键和值之间是等号。注意，你不需要写任何代码来生成每个 `TimeSeries` 的字符串表示，直接用 `toString()` 方法即可。

   现在来实现 HistoryText 按钮吧！

> 在 `main` 文件夹里新建一个叫 `HistoryTextHandler.java` 的文件，让它接收给定的 `NgordnetQuery`，返回一个和上面格式相同的 String。
>
> 然后修改 `Main.java`，让用户点击 `History (Text)` 时使用你的 `HistoryTextHandler`。换句话说，注册的不再是 `DummyHistoryTextHandler`，而应该改成注册你的 `HistoryTextHandler` 类。

提示：

- 把 `DummyHistoryTextHandler.java` 当作参考，在合适的地方做模式匹配（pattern matching）。能够摆弄示例代码、让它听你的话，是现实中极其重要的技能。大胆实验，别怕弄坏东西！
- 在项目 4A 里，你可以忽略 `NgordnetQuery` 的 `k` 实例变量。
- 使用 `TimeSeries` 类从 `TreeMap` 继承来的 `.toString()` 方法。
- 要让你的 `HistoryTextHandler` 做点有用的事，它得能访问你的 `NGramMap` 里存的数据。**不要把 NGramMap 弄成静态变量！** 这就是所谓的「全局变量」，几乎对任何问题都不是合适的解法。提示：你的 `HistoryTextHandler` 类可以有一个这样的构造函数：`public HistoryTextHandler(NGramMap map)`。
- 如果一个单词无效，想想 `NGramMap` 是怎么处理这种情况的。
- 提供的测试已经比较全面了。如果你想写额外的测试，见[测试说明](https://sp26.datastructur.es/proj4/proj4-testing/#historytexthandler)。

## 任务 4：HistoryHandler

上一节的文本版历史除了给自动评分用之外，用处不大。真正用我们的工具去发现有趣的东西，需要可视化。

`src/demo/PlotDemo.java` 提供了示例代码，用你的 `NGramMap` 生成一张可视化图，画出单词 cat 和 dog 在 1900 到 1950 年间的加权流行度历史。试着运行它。如果你的 `NGramMap` 类正确，你应该看到控制台打印出一个非常长的字符串，大概像这样：

```
iVBORw0KGg...
```

这个字符串是一个图像文件的 base 64 编码。要可视化它，打开 [codebeautify.org](https://codebeautify.org/base64-to-image-converter)。把整个字符串复制粘贴进这个网站，你应该看到一张和下图类似的图：

![decoded base 64](https://sp26.datastructur.es/assets/projects/proj4a/1-default-base-64.webp)

这是怎么回事？你的代码打印出来的字符串就是图像本身。记住，任何数据都可以表示成一串比特。这个网站知道怎么按一个预定义的标准把这串字符串解码成对应的图像。

如果你看看绘图库，这段代码依赖 `Plotter.generateTimeSeriesChart` 方法，它接收两个参数：第一个是字符串列表，第二个是 `List<TimeSeries>`。每个 `TimeSeries` 用不同的颜色绘制，并分配字符串列表里给的名字。两个列表必须一样长（因为第 i 个字符串是第 i 个时间序列的标签）。

`Plotter.generateTimeSeriesChart` 方法返回一个 `XYChart` 类型的对象。这个对象既可以由 `Plotter.encodeChartAsString` 方法转换成 base-64，也可以由 `Plotter.displayChart` 直接显示到屏幕上。

再运行一次 `Main.java`，在浏览器里打开 `ngordnet_4a.html`（或访问 [http://localhost:4567/ngordnet_4a.html](http://localhost:4567/ngordnet_4a.html)）。在「words」框里输入「cat, dog」，然后点击「History」。你会看到下面这张奇怪的图：

![parabola and sinusoid](https://sp26.datastructur.es/assets/projects/proj4a/2-default-history-plot.webp)

你会注意到代码画的不是 cat 和 dog 的历史，而是一条抛物线和一条正弦曲线。打开 `DummyHistoryHandler`，你就知道为什么了。

> 在 `main` 文件夹里新建一个叫 `HistoryHandler.java` 的文件，让它接收给定的 `NgordnetQuery`，返回一个 String，内容是相应图像的 base-64 编码。
>
> 然后修改 `Main.java`，让用户点击 `History` 按钮时调用你的 `HistoryHandler`。

提示：

- `HistoryHandler` 的构造函数应该是这样的形式：`public HistoryHandler(NGramMap map)`。
- 和之前一样，把 `DummyHistoryHandler.java` 当作参考。就像上一节说的，我们非常希望你学会摆弄复杂的库代码来得到想要的行为。

## 提交

试着提交到自动评分系统。你可能会全部通过，也可能不会。

- 如果你没通过某个正确性测试，说明有一种情况你的本地测试没有覆盖到。
- 不修完所有风格（style）错误，自动评分不会运行。提醒：你随时可以在 IntelliJ 里检查风格：![Run style checker in IntelliJ](https://sp26.datastructur.es/assets/resources/style-guide-img/intellij_style_checker.webp)
- 你每 24 小时有 8 个令牌（token）的提交限额。我们不会因为忘记 add/commit/push 代码、没跑风格检查等补发令牌。

项目 4A 在讨论轨（Discussion Track）中计 120 分。

评分构成：

- **TimeSeries（30%）**：正确实现 `TimeSeries.java`。
- **NGramMap Count（20%）**：正确实现 `NGramMap.java` 里的 `countHistory()` 和 `totalCountHistory()`。
- **NGramMap Weight（30%）**：正确实现 `NGramMap.java` 里的 `weightHistory()` 和 `summedWeightHistory()`。
- **HistoryTextHandler（10%）**：正确实现 `HistoryTextHandler.java`。
- **HistoryHandler（10%）**：正确实现 `HistoryHandler.java`。

你在 Gradescope 上得到的分数就是这份作业的最终分数（前提是你遵守了[合作政策](https://sp26.datastructur.es/policies/#collaboration-policy)）。

> **本站补充（校外学习者请看）**：上面的提交和自动评分只对伯克利在读学生开放。不在伯克利的同学可以这样做：照常完成代码，用仓库里自带的测试（`TimeSeriesTest`、`NGramMapTest` 等）加上自己写的测试在本地验证；全部测试通过、风格检查没有报错，就算完成这个阶段。提交次数的令牌限制不用管。

本作业的 WordNet 部分大致改编自普林斯顿大学 Alina Ene 和 Kevin Wayne 的 [Wordnet 作业](http://www.cs.princeton.edu/courses/archive/fall14/cos226/assignments/wordnet.html)。
