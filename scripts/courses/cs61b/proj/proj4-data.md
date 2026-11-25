# 项目 4：数据文件

> 本页是 UC Berkeley CS61B 2026 春季官方项目说明「Project 4: Data」的中文翻译，原文见页面下方的「项目原文」。命令、代码和程序输出保持原样。

> 项目 4CD 的说明有变化，拆成了多个页面。项目没有新增任何要求，自动评分和起始代码也和以前一样，所以如果你已经完成了项目，什么都不用做！

## NGrams

在[项目 4A](https://sp26.datastructur.es/proj4/proj4a/)里，你要使用 NGrams 数据，它由单词历史文件（word history file）和年份历史文件（year history file）组成。

> 下载 [`cs61b_sp26_ngrams_data.zip`](https://drive.google.com/file/d/149_H-aFsKjVa0IwX4-mnMnJc82G465SG/view?usp=sharing)。

- [Windows 上如何解压文件夹](https://support.microsoft.com/en-us/windows/zip-and-unzip-files-f6dde0a7-0fec-8294-e1d3-703ed85e7ebc#:~:text=To%20unzip%20files,folder%20to%20a%20new%20location.)（英文）
- [Mac 上如何解压文件夹](https://support.apple.com/guide/mac-help/zip-and-unzip-files-and-folders-on-mac-mchlp2528/mac#:~:text=Unzip%20(expand)%20a%20compressed%20item,zip%20file.)（英文）

把 `data` 文件夹移动到 `proj4a` 下面，和 `src`、`tests` 同级：

```
proj4a
├── data
├── src
├── static
├── tests
```

下面的[视频](https://www.youtube.com/watch?v=8uIt7pXua6Y)演示了整个配置过程。视频是用这个项目的旧版本录的，一些文件名后来改过。

视频（英文）：<https://www.youtube.com/embed/8uIt7pXua6Y?si=wd35tOl_CZlRsMGs>

> 不要把你的 `data` 文件夹提交到 GitHub！
>
> [`.gitignore`](https://help.github.com/articles/ignoring-files/) 文件应该能阻止你对它执行 `git add`。你可以在你的 `sp26-s***` 仓库里运行下面的命令，确认输出里有下面这几行：

（下面这段命令输出确认 `.gitignore` 里包含 `proj4*/data/` 等条目。）

```
$ cat .gitignore
...
proj4*/data/
proj4*/*.zip
proj4*/*.txt
...
```

如果不小心提交了，请看 Git WTFS（Git 疑难解答）的 [Large Files Detected](https://sp26.datastructur.es/troubleshooting/git-wtfs/#large-files-detected) 一节（英文）来补救。

### 单词历史文件（Word History File）

NGram 数据集有两种文件。第一种是「单词历史文件」。单词历史文件的每一行用制表符分隔，提供一个英文单词在某一年份的历史信息。

```
airport     2007    175702  32788
airport     2008    173294  31271
request     2005    646179  81592
request     2006    677820  86967
request     2007    697645  92342
request     2008    795265  125775
wandered    2005    83769   32682
wandered    2006    87688   34647
wandered    2007    108634  40101
wandered    2008    171015  64395
```

每一行：

1. 第一列是单词。
2. 第二列是年份。
3. 第三列是该单词在那一年出现在所有书籍里的总次数。
4. 第四列可以忽略。（好奇的话：它是包含该单词的不同来源文本的数量。）

例如，从上面的文本文件可以看出，单词「wandered」在 2008 年出现了 171,015 次，这些出现在 64,395 种不同的文本里。

### 年份历史文件（Year History File）

另一种文件是「年份历史文件」。年份历史文件的每一行用逗号分隔，提供每个日历年可用数据总语料的信息。

```
1470,984,10,1
1472,117652,902,2
1475,328918,1162,1
1476,20502,186,2
1477,376341,2479,2
```

每一行：

1. 第一列是年份。
2. 第二列是该年从所有文本记录到的单词总数。
3. 第三列可以忽略。（好奇的话：它是该年文本的总页数。）
4. 第四列可以忽略。（好奇的话：它是该年不同来源文本的总数。）

例如，我们看到 Google 恰好有 1 本 1470 年的英文文本，它包含 984 个单词、10 页。对我们的项目来说，10 和 1 无关紧要。

你可能会奇怪，为什么一个文件用制表符分隔、另一个用逗号分隔。这不是我干的，是 Google 干的。好在，这个差异处理起来不算难。

回到[项目 4A 任务 1：TimeSeries](https://sp26.datastructur.es/proj4/proj4a/#task-1-timeseries)继续。

---

## Wordnet

在[项目 4BCD](https://sp26.datastructur.es/proj4/proj4b/)里，你要使用 Wordnet 数据，它由 synset 文件和 hyponym 文件组成。

> 下载 [`cs61b_sp26_wordnet_data.zip`](https://drive.google.com/file/d/1h4GKpQKd51v41vq3dhwR4gWHdiyHWBGF/view?usp=sharing)。

- [Windows 上如何解压文件夹](https://support.microsoft.com/en-us/windows/zip-and-unzip-files-f6dde0a7-0fec-8294-e1d3-703ed85e7ebc#:~:text=To%20unzip%20files,folder%20to%20a%20new%20location.)（英文）
- [Mac 上如何解压文件夹](https://support.apple.com/guide/mac-help/zip-and-unzip-files-and-folders-on-mac-mchlp2528/mac#:~:text=Unzip%20(expand)%20a%20compressed%20item,zip%20file.)（英文）

把 `data` 文件夹移动到 `proj4cd` 下面，和 `src`、`tests` 同级：

```
proj4cd
├── data
├── src
├── static
├── tests
```

> 这个数据集里也包含 NGrams 数据集里的单词历史文件和年份历史文件，完成[项目 4D：Wordnet（k!=0）](https://sp26.datastructur.es/proj4/proj4d/)和[可选的附加功能](https://sp26.datastructur.es/proj4/proj4-bonus-features/)时会用到。

> 再提醒一次，不要把你的 `data` 文件夹提交到 GitHub！
>
> [`.gitignore`](https://help.github.com/articles/ignoring-files/) 文件应该能阻止你对它执行 `git add`。你可以在你的 `sp26-s***` 仓库里运行下面的命令，确认输出里有下面这几行：

（下面这段命令输出确认 `.gitignore` 里包含 `proj4*/data/` 等条目。）

```
$ cat .gitignore
...
proj4*/data/
proj4*/*.zip
proj4*/*.txt
...
```

如果不小心提交了，请看 Git WTFS（Git 疑难解答）的 [Large Files Detected](https://sp26.datastructur.es/troubleshooting/git-wtfs/#large-files-detected) 一节（英文）来补救。

### WordNet 数据集

在把 WordNet 并入我们的项目之前，首先需要理解 WordNet 数据集。

[WordNet](http://en.wikipedia.org/wiki/WordNet) 是一个「英语的语义词典」（semantic lexicon），被计算语言学家和认知科学家广泛使用；例如，它是 IBM Watson 的关键组件。WordNet 把单词归入称为 synset（同义词集合）的集合，并描述它们之间的语义关系。

其中一种关系是 is-a（是一种）关系，把**下位词**（hyponym，更具体的 synset）连接到**上位词**（hypernym，更一般的 synset）。例如，「change」是「demotion」的上位词，因为 demotion is-a（是一种）change。「change」反过来又是「action」的下位词，因为 change is-a action。下面是英语里一些 hyponym 关系的图示：

![WordNet](https://sp26.datastructur.es/assets/projects/proj4c/1-wordnet-fig.webp)

上图里的每个节点是一个 **synset**。synset 由一个或多个意思相同的英语单词组成。例如，有一个 synset 是「jump, parachuting」，表示用降落伞降落到地面的行为。「jump, parachuting」是「descent」的下位词，因为 jump, parachuting is-a descent。

英语单词可以属于多个 synset。这其实就是说，单词可以有多个意思。例如，单词「jump」还属于 synset「jump, leap」，表示更比喻意义上的跳（比如出勤率的 jump），而不是另一个 synset 里字面意义的跳（比如跳过水坑）。synset「jump, leap」是「increase」的下位词，因为 jump, leap is-an increase。当然，「增加」一样东西还有别的办法：例如我们可以通过「augmentation」来增加，所以在上面的图里有一条从「increase」指向「augmentation」的向下的箭头，这一点也不奇怪。

synset 里不仅可以有单词，还可以有所谓的[词组搭配](http://en.wikipedia.org/wiki/Collocation)（collocation）。这些是多词短语，因为经常一起出现而被表示为**单个单词**，例如「nasal_decongestant」。

一个 synset 可以是多个 synset 的下位词。例如，「actifed」既是「antihistamine」的下位词，也是「nasal_decongestant」的下位词，因为 actifed 同时是这两样东西。

下面是这个项目的所有 synset/hyponym 数据文件的清单，以及各自用途的简要说明。

`synsets/hyponyms_size 82191`

- 来自 NGrams 数据集的完整数据集！

`synsets/hyponyms_eecs`

- 一个包含 ee/cs 各门课程名字的图，外加两个单词（「bee」和「bean」）用于测试。

`synsets/hyponyms_size 11,14,16`

- 说明里使用的示例图。

`synsets/hyponyms_size 10,25,1000`

- 完整数据集的子集，用于自动评分测试。

自动评分只会用 synsets/hyponyms_size 10,25,1000,82191 和 synsets/hyponyms_eecs 来测试——其余文件只是为了帮助你理解！

### Synset 文件

现在我们介绍存储 WordNet 数据集的两种数据文件。这些文件是逗号分隔格式，即每行包含一串用逗号分隔的字段。

第一种文件是「synset 文件」。synset 文件的每一行用逗号分隔，提供一个 synset 的信息。文件 `synsets_size82191.txt`（以及其他文件名里带 synset 的较小文件）列出了 WordNet 里所有的 synset。第一个字段是 synset 编号（一个整数），第二个字段是同义词集合（即 synset），第三个字段是它的词典释义。例如，这一行

（**译注**：下面这行是数据文件的样例行，行首的空格是官方页面原有的。）

```
   6829,Goofy,a cartoon character created by Walt Disney
```

表示 synset `{ Goofy }` 的编号是 6829，释义是「a cartoon character created by Walt Disney」（华特·迪士尼创作的卡通角色）。组成一个 synset 的各个名词之间用空格分隔（synset 里的一个元素不允许包含空格）。编号很有用，因为它们也会出现在下文介绍的 hyponym 文件里。

### Hyponym 文件

另一种文件是「hyponym 文件」。hyponym 文件的每一行用逗号分隔，提供一个 hyponym 关系的信息。文件 `hyponyms_size82191.txt`（以及其他文件名里带 hyponym 的文件）包含 hyponym 关系。第一个字段是一个 synset 编号，随后的字段是这个 synset 的直接下位词的编号。例如，下面这一行

（**译注**：下面各行是数据文件的样例行，行首的空格是官方页面原有的。）

```
  79537,38611,9007
```

表示 synset 79537（「viceroy vicereine」）有两个下位词：38611（「exarch」）和 9007（「Khedive」），表示 exarch 和 Khedive 都是 viceroy（或 vicereine，总督）的类型。这些 synset 来自 `synsets.txt` 文件里对应的行：

```
  79537,viceroy vicereine,governor of a country or province who rules...
  38611,exarch,a viceroy who governed a large province in the Roman Empire
  9007,Khedive,one of the Turkish viceroys who ruled Egypt between...
```

可能有不止一行以同一个 synset ID 开头。例如，在 `hyponyms_size16.txt` 里，我们有

```
  11,12
  11,13
```

这表示 synset 12 和 13 都是 synset 11 的直接下位词。这两行本来也可以合并成一行，也就是说，下面这一行的意思完全相同：synset 12 和 13 是 synset 11 的直接下位词。

```
  11,12,13
```

你可能会问，为什么会有两种写法表示同一件事。现实世界的数据经常很乱，我们只能应对。

回到[项目 4C 任务 1：Dummy HyponymsHandler](https://sp26.datastructur.es/proj4/proj4c/#task-1-dummy-hyponymshandler)继续。
