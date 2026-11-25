# 设计项目 4B：WordNet（设计）

> 本页是 UC Berkeley CS61B 2026 春季官方项目说明「Project 4B: Wordnet (Design)」的中文翻译，原文见页面下方的「项目原文」。命令、代码和程序输出保持原样。

> *完成本项目需要先学过以下讲座：*
>
> - 第 17 讲（Extends, Sets, Maps, and BSTs，继承、集合、映射与二叉搜索树）
> - 第 21、22 讲（Graph Traversals and Implementations，图的遍历与实现）
>
> *组队政策：*本项目不组队。可以和其他同学讨论想法，但不允许分享代码，你提交的解答应该是你自己的工作！更多细节见[课程政策页](https://sp26.datastructur.es/policies/#collaboration-policy)（英文）。
>
> *LLM 政策：*不得让 LLM 编写你提交的任何代码。更多细节见 [LLM 政策页](https://sp26.datastructur.es/policies/#llm-policy)（英文）。

在这个项目里，你要为 Wordnet——NGordnet 工具的其余部分——设计你自己的实现方案。

> **本站补充（校外学习者请看）**：这一阶段的两个任务（检查点和设计文档）都提交在 Gradescope 上，校外无法访问。替代做法：把 4C、4D 的说明仔细读完，对照下面「设计提示」里的问题自查对 Wordnet 的理解（什么是 synset、什么是 hyponym、输入多个单词时输出什么、k > 0 时输出什么）；设计文档可以用官方模板在本地照常完成，写完留好，做 4C、4D 时会非常有用。

## 任务 0：Wordnet 说明

> 动手之前，请先阅读[项目 4C：Wordnet（k == 0）](https://sp26.datastructur.es/proj4/proj4c/)和[项目 4D：Wordnet（k != 0）](https://sp26.datastructur.es/proj4/proj4d)的说明。不理解 Wordnet 的说明，后面的任务没法开始！

## 任务 1：检查点（Checkpoint）

[Project 4B: Wordnet Checkpoint](https://www.gradescope.com/courses/1211464/assignments/7764031/) 是一份概念性作业，考查你对 Wordnet 的理解。我们建议在做设计之前先完成它。

> 完成 [Project 4B: Wordnet Checkpoint](https://www.gradescope.com/courses/1211464/assignments/7764031/)。截止时间之前提交次数不限，答对后会显示解答。检查点不能延期$^*$，因为它是为了帮你启动项目的其余部分。
>
> $^*$*有 DSP 便利条件（DSP accommodations，伯克利的残障学生支持项目）的学生可以延期检查点。*

## 任务 2：技术设计文档（Technical Design Doc）

[Project 4B: Wordnet Design](https://www.gradescope.com/courses/1211464/assignments/7764035/) 是一份设计作业，让你在动手实现之前为 Wordnet 规划好方案。

你的设计文档必须包含下列评分表里的每个部分。设计文档的介绍和范例见[设计文档指南](https://sp26.datastructur.es/resources/design-doc-guide)（英文）。

1. **数据（20%）**：描述数据将如何被使用。
2. **数据结构（20%）**：描述将对数据使用哪些数据结构。
3. **算法（20%）**：描述将对数据结构和数据使用哪些算法。
4. **复杂度（20%）**：描述程序预期的时间和空间复杂度。
5. **示意图（20%）**：描述数据、数据结构和算法如何协同工作。必须是可视化的呈现。

我们按完成度和投入程度给设计文档评分，不按正确性。你最终设计的正确性由在代码上运行自动评分来检查。我们会在截止日期所在那一周结束前批改完设计文档。

你的设计文档除了示意图外必须可读、打印排版。提交时请把示意图作为单独的一页。如果示意图一页放不下，可以分成多页提交。不遵守这些说明可能会被扣格式分。

如果你没在原定截止时间前提交设计文档，我们不能保证会在那一周结束前批改完。

如果你打算在答疑时间（office hours）做这个项目，我们可能会要求看你的设计文档，以便了解你的思路。所以，请认真对待这份作业！在设计阶段吃透项目要求，对后面的实现阶段有巨大的帮助。

> 为 Wordnet 写一份设计文档，提交到 [Project 4B: Wordnet Design](https://www.gradescope.com/courses/1211464/assignments/7764035/) 作业。

### 设计提示

下面几个问题供你在头脑风暴时思考：

#### 一般问题

- 到处翻一翻 `/browser` 和 `/main` 文件夹，看看已有的代码。`/demo` 文件夹里的示例是怎么使用现有的类和方法的？
- 用户的输入（例如「cat」的 hyponym、k > 0）是怎么从 ngordnet 网页传到我们这边的？我们又是怎么把结果传回网页的？

  - *我们不要求你懂网站是怎么工作的。但是，搞清楚你的实现的边界在哪里很重要。*

- 哪些任务有重叠？不同情形之间有没有复用方法的机会？想想辅助方法（helper method）和方法重载（overloading）的机会。
- 你能不能找到一些服务于相似且目的明确的功能的数据结构和方法的组合？如果可以，考虑把它们挪到一个单独的类里。构建抽象屏障（abstraction barrier）有助于管理代码复杂度。

#### 考虑边界情况

- 你的实现要怎么处理出现在多个 hyponym 里的单词？
- 输入一组单词时期望输出什么？什么情况下一个 synset 是两个单词共同的 hyponym？多个单词呢？你的实现怎么确定正确的输出？
- 用户提供 k > 0 时期望输出什么？这和我们已经做过的东西有联系吗？

### 模板

如果你想用的话，我们提供了一份模板。见 [Project 4B: Wordnet Design Template](https://docs.google.com/document/d/1OEQTFUXAmjaeBwj6vujUKglEPM9igFzcxRUOS-Im5l8/edit?usp=sharing)，下面的作业里也附了这个链接。

或者，你也可以把整个设计画成示意图。如果选择这样做，务必把评分表里的所有部分都包含进去。

## 提交

提交完下面两份作业，你就完成了这个阶段！

1. [Project 4B: Wordnet Checkpoint](https://www.gradescope.com/courses/1211464/assignments/7764031/)（10 分）
2. [Project 4B: Wordnet Design](https://www.gradescope.com/courses/1211464/assignments/7764035/)（15 分）

你在 Gradescope 上得到的分数就是这份作业的最终分数（前提是你遵守了[合作政策](https://sp26.datastructur.es/policies/#collaboration-policy)）。

这份说明由 Daniel Wang 和 Ronnie Beggs 编写，是 2025 秋季的新作业。提供的模板由 Kanav Mittal 和 Stella Kaval 在 2025 春季制作、由 Daniel Wang 修改。
