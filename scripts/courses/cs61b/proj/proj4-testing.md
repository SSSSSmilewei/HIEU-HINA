# 项目 4：测试说明

> 本页是 UC Berkeley CS61B 2026 春季官方项目说明「Project 4: Testing」的中文翻译，原文见页面下方的「项目原文」。命令、代码和程序输出保持原样。

> 项目 4CD 的说明有变化，拆成了多个页面。项目没有新增任何要求，自动评分和起始代码也和以前一样，所以如果你已经完成了项目，什么都不用做！

在项目 4 的整个过程中，我们都不会检查你的测试覆盖率。你写测试，是为了在后面遇到问题时给自己省时间！

## 项目 4A：NGrams

### TimeSeries

我们建议按下面的顺序写单元测试：

1. `years()`
2. `data()`
3. `TimeSeries(TimeSeries ts, int startYear, int endYear)`
4. `plus()`
5. `dividedBy()`

出于超纲的原因，你不必测试抛出的异常。

你会注意到，在 `testFromSpec()` 里我们没有把 `expectedTotal` 和 `totalPopulation.data()` 直接比较。这是因为 double 容易出现舍入误差，尤其是经过除法运算之后（原因你会在 61C 里学到）。因此，当 `x` 和 `y` 是 double 时，`assertThat(x).isEqualTo(y)` 可能出人意料地返回 false。你应该改用 `assertThat(x).isWithin(1E-10).of(y)`，只要 `x` 和 `y` 的差不超过 $10^{-10}$，它就返回 true。

### NGramMap

我们建议按下面的顺序写单元测试：

1. `countHistory(String word)`
2. `countHistory(String word, int startYear, int endYear)`
3. `NGramMap(String wordsFilename, String countsFilename)`
4. `totalCountHistory()`
5. `weightHistory(String word, int startYear, int endYear)`
6. `weightHistory(String word)`
7. `summedWeightHistory(List words)`

出于超纲的原因，你不必测试运行时间。

与其用大的输入文件（例如 `word_history_size14377.csv`），我们建议先从较小的输入文件开始（例如 `word_history_size3.csv`、`word_history_size4.csv`）。

### HistoryTextHandler

我们建议写下面的单元测试：

1. `handle(NgordnetQuery query)` 基本情形
2. `handle(NgordnetQuery query)` 无效情形

### HistoryHandler

不知道正确的 base-64 编码图像字符串，你就没法给 `HistoryHandler` 写测试。请按照项目说明里的指示，目视检查你的实现。

---

## 项目 4C：Wordnet（k==0）

### 图（Graph）

我们建议写测试，确认你的图实现符合预期。我们的解答里有一个叫 `TestGraph` 的类，测试实现的各个方面。

我们建议用与 WordNet 数据无关的操作来测试图方法。细粒度的测试能帮你定位失败的根源到底是不正确的图实现、不正确的 Wordnet 数据处理，还是别的什么。例如，如果你的实现里有 `createNode` 或 `addEdge` 方法，先单独确认它们给出预期的输出，再测 `hyponyms` 和 `synset` 的处理逻辑。

### WordNet

我们建议针对上面的例子写测试（例如，你可以查 `synsets_size11.txt` 和 `hyponyms_size11.txt` 里「descent」的 hyponym，或 `synsets_size16.txt` 和 `hyponyms_size16.txt` 里「change」的 hyponym）。

**译注**：原文这里把两组数据文件写成了 `hypernyms_size11.txt` 和 `hypernyms_size16.txt`，但数据集里实际提供（且本页示例代码实际使用）的文件是 `hyponyms_size11.txt` 和 `hyponyms_size16.txt`（见「数据文件」页），译文已更正。

例如，我们的代码里有一个叫 `TestWordNet` 的类，包含下面的函数。

```
@Test
public void testHyponymsSimple(){
        WordNet wn=new WordNet("./data/synsets_size11.txt","./data/hyponyms_size11.txt");
        assertThat(wn.hyponyms("antihistamine")).isEqualTo(Set.of("antihistamine","actifed"));
        }
```

（**译注**：上面这段测试代码的缩进与原文保持一致；它的意思是构造一个使用 `synsets_size11.txt` 和 `hyponyms_size11.txt` 的 `WordNet`，并断言「antihistamine」的 hyponym 是「antihistamine」和「actifed」。）

注意，你的 WordNet 类的方法可能和我们的不一样，所以上面展示的测试多半不能原样用在你的代码上。还要注意，我们的测试完全没有用到 `NGramMap`，没有用 `HyponymHandler`，也没有直接调用 Graph 类型的对象。它是专门为测试 WordNet 类而写的。

### 单个单词

我们为这个任务提供了一份简短的单元测试文件：`tests/TestOneWordK0Hyponyms.java`。

这个文件对应 k = 0 时查询单个单词的 hyponym 的测试。

这份测试文件并不全面！实际上，它只包含一个基本测试。你应该往这个文件里补充更多单元测试。

如果拿不准测试的期望输出，可以用[助教团队的解答网页](https://ngordnet.datastructur.es/)。

### 单词列表

我们为这个任务提供了一份简短的单元测试文件：`tests/TestMultiWordK0Hyponyms.java`。

这个文件对应 k=0 时查询多个单词（例如 `gallery, bowl`）的 hyponym 的测试。

这份测试文件并不全面！实际上，它只包含一个基本测试。你应该往这个文件里补充更多单元测试。

如果拿不准测试的期望输出，可以用[助教团队的解答网页](https://ngordnet.datastructur.es/)。

### 在浏览器里测试

你可以（也应该）为这个项目创建的辅助类/方法写单元测试，但另一种检验代码的好办法是：直接运行 `Main.java`，打开 `ngordnet.html`，往输入框里输入一些内容，点击「Hyponyms」按钮。你可能会发现，可视化调试能在这个项目里带来有用的发现。

例如，你可以用网页前端，针对 `synsets_size16.txt` 和 `hyponyms_size16.txt`，检查上面图里的两个输入例子（「descent」和「change」）。

你也可以带着调试器运行 `Main.java`，快速调试不同的输入。点击「Hyponyms」按钮后，代码会在调试器下执行——断点会触发，你可以使用变量窗口等等。

注意：只依赖浏览器测试会非常痛苦（而且慢）！用你的测试技能，为你构建的基础抽象（例如 Graph、WordNet 等）建立信心。

### 调试

- 测试时用小的输入文件！这能减少运行 `Main.java` 的启动时间，也更容易推理代码。如果你在运行 `Main.java`，这些文件是在 `main` 方法开头几行里设置的。单元测试里，文件名传给 `getHyponymHandler` 方法。
- 这个项目的活动部件很多。不要一上来就逐行调试。先缩小范围，找出是哪个函数/区域工作不正常，再到那些行里仔细查。
- 由于我们对项目 4A 的文件（尤其是 TimeSeries 和 NGramMap）做了混淆处理，在 IntelliJ 里使用这些类时，参数名预览可能看起来有点怪。你可能会看到又长又随机的字符串；这是为了混淆代码而特意做的，完全不代表你自己的代码有任何问题。

## 项目 4D：Wordnet（k!=0）

我们没有为 `k != 0` 的情形提供任何测试。

你可以把 `TestOneWordK0Hyponyms` 和 `TestMultiWordK0Hyponyms` 里的示例测试当模板，在新的测试文件里创建测试，例如 `tests/TestKNonzeroHyponyms.java`。

你需要构造自己的测试用例。我们在上面给过一个：`words = "food, cake"`、`startYear = 1950`、`endYear = 1990`、`k = 5`。

如果拿不准测试的期望输出，可以用[助教团队的解答网页](https://ngordnet.datastructur.es/)。
