# 小项目 1：LinkedListDeque61B

> 本页是 UC Berkeley CS61B 2026 春季官方项目说明「Mini-Project 1: LinkedListDeque61B」的中文翻译，原文见页面下方的「项目原文」。命令、代码和程序输出保持原样。

> **本站补充（校外学习者请先看）**：本项目的自动评分、提交次数限制（每 24 小时 4 次）和测试覆盖度检查（任务 10）都在 Gradescope 上，只对伯克利在读学生开放；Ed 论坛和办公时间答疑也一样。校外学习者请按「作业 1」页首「本站补充」的办法自建私有仓库、从 `skeleton` 远程拉取起始代码，用本地测试代替自动评分：为本页要求的每个方法写测试并全部跑通，再对照任务 10 的 flags 清单自查测试是否覆盖这些场景。原课程规定共享测试按作弊处理，请务必自己写测试。

*完成本项目需要以下讲座：*

- 第 4 讲（测试）。
- 第 5 讲（IntList）。
- 第 6 讲（单链表）。
- 第 7 讲（双链表）。

*组队政策：*本项目不组队。可以和其他同学讨论想法，但不允许共享代码，提交的解答必须是你自己的工作！详见[课程政策页](https://sp26.datastructur.es/policies/#collaboration-policy)。

在这份作业里，我们将用前几讲学到的知识，构建你自己的链表版 List 实现。为了让工作量轻一些，我们不构建完整的列表，而是构建一个双端队列（deque，读音近似 "deck"）。

**译注**：原文此句为 "we'll use what we've learned in the first fosevenur lectures"，其中 "fosevenur" 一词显然是笔误；结合本页开头的先修讲座列表（第 4–7 讲），此处按「前几讲」翻译。

完成这份作业后，你将……

- 理解数据结构中底层链表（backing linked list）的用法。
- 获得使用测试和测试驱动开发（test-driven development）来评估自己数据结构正确性的经验。

在小项目 1 里，我们会通过给出明确的指导来提供大量脚手架。在小项目 2 里，你会完成一个类似的任务，但脚手架要少得多。

关于本项目概念层面的快速介绍，这里是办公时间讲过的项目介绍幻灯片：[slides](https://docs.google.com/presentation/d/1tQW6x2QR6A_e4zwHaaFDKCAVQ5x7HZ7jYaUiJZxB6MY/edit?usp=sharing)（英文）。

## 准备工作

按[作业工作流程指南](https://sp26.datastructur.es/resources/assignment-workflow/)开始这份作业。起始代码在 `proj1` 文件夹里。

> 在这个项目上，你每 24 小时最多只能向 Gradescope 提交 4 次。换句话说，你有 4 个提交令牌（token），每个令牌 24 小时刷新一次。
>
> 与之前的作业不同，**本地不会提供全部测试**，所以你要自己写测试来验证代码的正确性。详见[编写测试](https://sp26.datastructur.es/projects/proj1/#writing-tests)一节。

## 任务 1：阅读 Deque61B ADT 和 API

双端队列和课上讨论过的 SLList、AList 类非常相似。下面是 [Java 标准库](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Deque.html)里的定义：

> 一种支持在两端插入和删除元素的线性集合。*deque* 这个名字是 "double ended queue"（双端队列）的缩写，通常读作 "deck"。大多数 `Deque` 实现对可容纳的元素数量不设固定上限，但这个接口既支持容量受限的双端队列，也支持没有固定大小限制的双端队列。

我们并不需要 Java `Deque` 里定义的全部方法，而是定义了自己的接口，见 `src/Deque61B.java`。

例如，`get` 方法用一种叫 *Javadoc 注释*（Javadoc comment）的东西描述如下：

```
/** ...
 * @param index index to get
 * @return element at {@code index} in the deque
 */
T get(int index);
```

这里，`@param` 表示方法的一个参数，`@return` 表示方法的返回值。`@code` 标签用来把内容格式化成代码。

在 IntelliJ 里把鼠标悬停在方法名上，你会看到像下面这样的弹出框；想知道一个方法做什么的时候很有用：

![Hover over method name to see JavaDoc](https://sp26.datastructur.es/assets/projects/proj1/1-hover-for-javadoc.webp)

> 打开 `Deque61B.java` 文件，通读里面的文档。这份说明并没有你完成项目所需的全部信息，所以**把 Deque61B.java 从头到尾读一遍非常重要**！
>
> 说真的，别跳过这一步。跳过它，你会白白困惑好几个小时。请给自己省下这些时间和压力！
>
> 你不应该修改 `Deque61B.java`。

## 作业理念

一个常见的新手错误，是一次写一大堆代码，然后指望写完后全都能用。这会让程序员的日子非常难过。想象一下：实现完上面所有方法，提交到自动评分器，收到一条类似「对 `get` 的调用返回了 9，应为 7」的消息。你根本不知道问题出在 `get` 方法本身，还是其他必需的方法坏了。

为了帮助大家养成更好的编程习惯，小项目 1 会在开发过程中手把手带你。你并不被强制要求按推荐的步骤来（只要通过自动评分器，就能拿到全部分数），但我们强烈建议按本说明给出的步骤做。

想要预期的体验，请按顺序完成这些步骤。如果你用了别的做法来找我们求助，我们会让你回到这些步骤上。

## 任务 2：创建文件

先创建一个叫 `LinkedListDeque61B` 的文件。

这个文件要在 `proj1/src` 目录里创建。做法：右键点击 `src` 目录，选 "New -> Java Class"，命名为 `LinkedListDeque61B`。

![New Java Class](https://sp26.datastructur.es/assets/projects/proj1/2-new-class.webp)

![Name class LinkedListDeque61B](https://sp26.datastructur.es/assets/projects/proj1/3-class-name.webp)

我们希望 `LinkedListDeque61B` 能装不同的类型。例如，`LinkedListDeque61B<String>` 装 `String`，`LinkedListDeque61B<Integer>` 装 `Integer`。为此，把类的声明改成：

```
public class LinkedListDeque61B<T>
```

回忆一下讲座里讲过的：用 `T` 还是别的字符串（比如 `LinkedListDeque61B<Glerp>`）其实无所谓。不过为了和其他 Java 代码保持一致，我们建议用 `<T>`。

我们还要告诉 Java，每个 `LinkedListDeque61B` 都是一个 `Deque61B`，这样用户就能写 `Deque61B<String> lld1 = new LinkedListDeque61B<>();` 这样的代码。为此，把类的声明改成：

```
public class LinkedListDeque61B<T> implements Deque61B<T>
```

到这里，你的类声明应该和上面那行一样。

![Add generic type and implements](https://sp26.datastructur.es/assets/projects/proj1/4-add-implements.webp)

但这产生了一个错误。要让 `LinkedListDeque61B` 成为一个 `Deque61B`，它需要实现 `Deque61B` 的所有方法。

把鼠标悬停在红色波浪线上，在弹出的错误信息框里点击 "implement methods"（实现方法）按钮。这会自动生成方法头。

![Click Implement Methods](https://sp26.datastructur.es/assets/projects/proj1/5-click-implement-methods.webp)

![Implement Methods menu](https://sp26.datastructur.es/assets/projects/proj1/6-implement-methods-menu.webp)

接下来，创建一个空的构造函数。

为此，把下面的代码加进你的文件，构造函数暂时留空。

```
public LinkedListDeque61B() {
}
```

最后，创建一个 main 方法。

你的 main 方法应该严格长这样：

```
public static void main(String[] args) {
  Deque61B<Integer> lld = new LinkedListDeque61B<>();
  lld.addLast(0);   // [0]
  lld.addLast(1);   // [0, 1]
  lld.addFirst(-1); // [-1, 0, 1]
}
```

现在可以开始写方法了！

> 开始写代码后请记住：实现里不许使用任何内置的 `java.util` 数据结构！这个项目的意义就在于构建你自己的版本！
>
> 有几处地方（测试之外）允许你使用特定的数据结构，我们会明确指出在哪里。

## 任务 3：构造函数

在这一节里，你要实现让 main 方法第一行 `Deque61B<Integer> lld = new LinkedListDeque61B<>();` 生成一个具有正确拓扑的新 LinkedListDeque 所需的功能。

回忆一下，「拓扑」（topology）指你的链表的形状。虽然讲座里讨论过多种选择，但在这个项目里，你**必须**实现带哨兵（sentinel）的循环双链表拓扑。

空列表由一个指向自身的哨兵节点表示，另有一个叫 `sentinel` 的实例变量指向这个哨兵。[见这张幻灯片。](https://docs.google.com/presentation/d/1O6Ok9HwmBxppT9CNFRZ2Sf2uvjtNlsKzO0z0LjMznmQ/edit?slide=id.g32f0fc7ea3c_0_6#slide=id.g32f0fc7ea3c_0_6)

正如讲座里提到的，这种循环拓扑最难理解，但在这个项目里能带来最简单的实现。

实现 `LinkedListDeque61B` 的构造函数。

在构造函数里，你需要：

- 给 `LinkedListDeque61B` 类添加一个或多个实例变量。
- 实例化一个哨兵节点。
- 给 `Node` 类添加一个或多个实例变量。
- 在构造函数里初始化这些实例变量。

要验证你的解法正确，在 `main` 方法里设一个断点，用可视化工具确认你的代码和预期拓扑一致（为方便起见，预期拓扑如下所示）。

![Empty Deque](https://sp26.datastructur.es/assets/projects/proj1/expected_topology.webp)

不要给 `LinkedListDeque61B` 添加额外的构造函数。我们要求你只有这一个无参构造函数。

## 任务 4：addFirst 与 addLast

现在，我们来实现 main 方法里调用的其他方法。

实现 `addFirst` 和 `addLast`。

`addFirst` 和 `addLast` **不得**使用循环或递归。单次添加操作必须花费「常数时间」（constant time），也就是说，无论队列多大，添加一个元素花的时间都应该大致相同。这意味着你不能使用遍历队列全部或大部分元素的循环。

实现这两个方法后，在 main 方法末尾设一个断点，验证创建的 LinkedListDeque61B 和下面的预期拓扑一致。

注意，在 Java 可视化工具里，箭头多半会显得很乱，但稍加努力你应该能看出拓扑是对的。

![Deque with 3 elements](https://sp26.datastructur.es/assets/projects/proj1/expected_topology_3_items.webp)

注意，在可视化工具的图里，箭头看起来可能指向数组中间，或指向节点的某个字段。但只要可视化工具画出一条指向对象的箭头，这个指针指向的就是*整个*对象，而不是对象的某个特定字段。事实上，在 Java 里，引用不可能指向对象的字段。

## 任务 5：toList

你可能会觉得，用调试器和可视化工具验证 `addFirst` 和 `addLast` 的正确性，既繁琐又不愉快。还有个问题：这种手工验证在你的代码一变之后就失效了。想象你对 `addLast` 做了一处小而不确定的改动。要确认没有弄坏任何东西，你得把整个过程再来一遍。真难受。

我们真正需要的是自动化测试。但遗憾的是，如果只实现了这两个方法，就没法方便地验证 `addFirst` 和 `addLast` 的正确性——目前还没办法遍历我们的列表、拿回它的值、检查它们对不对。

`toList` 方法就是为此而生的。调用时，这个方法返回 `Deque61B` 的一种 `List` 表示。例如，如果一个 `Deque61B` 依次被调用了 `addLast(5)`、`addLast(9)`、`addLast(10)`，然后是 `addFirst(3)`，那么 `toList()` 的结果应该是一个 `List`：最前面是 3，然后是 5、9、10。用 Java 打印出来是 `[3, 5, 9, 10]`。

如果队列为空，`toList` 应该返回一个不含任何元素的空列表，例如 `return new ArrayList<>()`。`toList` 方法永远不应该返回 null。

编写 `toList` 方法。

方法的第一行应该类似 `List<T> returnList = new ArrayList<>()`。这是允许你使用 Java 数据结构的一处。可以用 IntelliJ 的自动导入功能，或者复制这条语句：

```
import java.util.ArrayList; // import the ArrayList class
```

（这条注释的意思是「导入 ArrayList 类」。）

要验证 `toList` 方法工作正确，可以运行 `LinkedListDeque61BTest` 里的测试。

做法：打开 `LinkedListDeque61BTest.java`。你会看到每一行前面都有一个 `//`。把除最后一行外所有的 `//` 注释去掉。做法：选中所有以 `//` 开头的行，点顶部菜单栏的 "Code"，再点 "Comment with Line Comment"（行注释）。这样所有行就都取消注释了。也可以用 `Ctrl+/`（Windows / Linux）或 `⌘ /` / `Cmd+/`（Mac）。

如果全部测试通过，你就打下了继续做项目的坚实基础。好哇！如果没有通过，用调试器仔细查一查你的 `toList`（或其他方法）哪里有问题。如果实在卡住，回头验证你的 `addFirst` 和 `addLast` 是否工作正常。

> 你可能会想到：干脆在后面的方法里调用 `toList` 再调用相应的方法，绕过项目的其余部分。那就违背了项目的意义！你不许在 `LinkedListDeque61B` 的任何方法里调用 `toList`；自动评分器有一个测试专门检查这一点。

注：在这门课的后面，我们会学到不需要先把数据结构转成 Java 列表就能测试它们的技术。在第一个项目里这样做，纯粹是为了方便。

## 编写测试

我们提供了验证 `addFirst`、`addLast` 和 `toList` 的测试。但你会看到，还有更多的方法需要你实现。

对这些方法，你需要**写你自己的单元测试**（unit test）！注意：我们的评分器会测试你的测试，看它们够不够好。下面详细说。

> 在项目里共享测试会被视为学术不端（作弊）。在这个小项目里，我们建议你试着自己写测试，而不是直接用别人的！

写测试时，我们用 Google 的 [Truth](https://truth.dev/) 断言库。我们喜欢它，因为它好用，错误信息也有用。

我们写测试常用 Arrange-Act-Assert（准备-执行-断言）模式：

1. **Arrange**（准备）好测试场景，比如实例化数据结构、往里填元素。
2. **Act**（执行）你想测试的行为。
3. **Assert**（断言）（2）中动作的结果。

我们常常会在同一个测试方法里放多个「执行」和「断言」步骤，以减少样板（重复）代码。

你的测试应该写在 `LinkedListDeque61BTest.java` 里。

### Truth 断言

一个 Truth 断言的格式如下：

```
assertThat(actual).isEqualTo(expected);
```

要给断言附加一条消息，可以改用：

```
assertWithMessage("actual is not expected")
    .that(actual)
    .isEqualTo(expected);
```

根据 `actual` 的类型，我们可以用 `isEqualTo` 以外的方法。例如，`actual` 是一个 `List` 时，可以这样做来检查它的内容，而不用新建一个 `List`：

```
assertThat(actualList)
    .containsExactly(0, 1, 2, 3)
    .inOrder();
```

如果我们拿到的是 `List` 或其他引用对象，可以用：

```
assertThat(actualList)
    .containsExactlyElementsIn(expected)  // `expected` is a List
    .inOrder();
```

（注释的意思是「`expected` 是一个 List」。）

Truth 有很多断言，包括 `isNull` 和 `isNotNull`，以及用于 `boolean` 的 `isTrue` 和 `isFalse`。IntelliJ 的自动补全常常会给你可用断言的建议。

> 如果你什么也不断言，你自己的测试会通过，哪怕你的实现是错的！例如，下面的测试会通过，哪怕 `addFirst` 什么都不做：

```
@Test
public void noAssertionTest() {
    Deque61B<String> lld = new LinkedListDeque61B<>();
    lld.addFirst("front");
}
```

> 你还必须记得：断言布尔值时要用 `.isTrue()` 或 `.isFalse()`。例如，下面的测试永远会通过，哪怕 `isEmpty` 永远返回 `false`！

```
@Test
public void isEmptyTest() {
    Deque61B<String> lld = new LinkedListDeque61B<>();
    assertThat(lld.isEmpty());
}
```

> 上面这个测试的最后一行应该改成 `assertThat(lld.isEmpty()).isTrue();`。

### 示例测试

我们来拆解一下提供的 `addLastTestBasic`：

```
@Test
/** In this test, we use only one assertThat statement.
    *  Sometimes, the tedious work of adding the extra assertion statements isn't worth it. */
public void addLastTestBasic() {
    Deque61B<String> lld1 = new LinkedListDeque61B<>();

    lld1.addLast("front"); // after this call we expect: ["front"]
    lld1.addLast("middle"); // after this call we expect: ["front", "middle"]
    lld1.addLast("back"); // after this call we expect: ["front", "middle", "back"]
    assertThat(lld1.toList()).containsExactly("front", "middle", "back").inOrder();
}
```

（注释的意思是「在这个测试里，我们只用了唯一一条 assertThat 语句。有时候，多写那几条断言的麻烦活不值得。」）

- `@Test` 告诉 Java 这个方法是一个*测试*，运行测试时应该运行它。
- **Arrange**：构造一个新的 `Deque61B`，用 `addLast` 加 3 个元素。
- **Act**：对 `Deque61B` 调用 `toList`。这隐式依赖于前面的 `addLast` 调用。
- **Assert**：用 Truth 断言检查 `toList` 以特定的顺序包含特定的元素。

> 要检查你的 `LinkedListDeque61B` 的内容，必须调用 `toList()`。例如，`assertThat(lld1).containsExactly("front", "middle", "back").inOrder();` 是不行的，因为 Google Truth 不知道怎么遍历 `lld1` 来查看它的内容。后面某讲我们会讲怎么让我们的 Deque 变得可迭代，让 Google Truth 知道怎么检查它们的内容。`assertThat(lld1).isEqualTo(...)` 同样不行。

## 任务 6：isEmpty 与 size

现在你应该边测边实现剩下的所有方法。在本项目剩下的部分，我们只在较高的层面描述建议的步骤。我们强烈建议你按给出的顺序完成剩下的步骤。

特别是，**在实现之前先写测试**。这叫「测试驱动开发」（test-driven development），能帮你在动手之前就弄清楚方法应该做什么。

给 `isEmpty` 和 `size` 写一个或多个测试。运行它们，确认它们失败。**你的测试应该验证不止一个有意义的情况**，比如既检查空列表又检查非空列表，或者检查 size 会变化。

这些测试里，你可以在 `assertThat` 语句上使用 `isTrue` 或 `isFalse` 方法。

你的测试可以非常细（例如 `testIsEmpty`、`testSizeZero`、`testSizeOne`），也可以非常粗（例如 `testSizeAndIsEmpty`）。哪种粒度更好，由你自己探索决定。

写完测试后，就可以实现 `isEmpty` 和 `size`。

这两个方法必须花费*常数时间*。也就是说，任一方法执行完所花的时间，都不应该取决于队列里有多少个元素。

## 任务 7：getFirst 与 getLast

给 `getFirst` 和 `getLast` 方法写测试。务必测到 `Deque61B` 没有元素（为空）的情况。这些情况下，`getFirst` 和 `getLast` 应该返回 `null`。

写完测试、确认它们失败之后，实现 `getFirst` 和 `getLast`。

这两个方法必须花费*常数时间*。也就是说，任一方法执行完所花的时间，都不应该取决于队列里有多少个元素。

## 任务 8：get 与 getRecursive

给 `get` 方法写测试。务必测到 `get` 收到非法参数的情况，例如 `Deque61B` 只有 1 个元素时调用 `get(28723)`，或者负的下标。这些情况下 `get` 应该返回 `null`。

`get` 必须使用迭代（iteration）。

写完测试、确认它们失败之后，实现 `get`。

既然我们在写链表，再写一个递归版的 get 方法 `getRecursive` 会很有意思。

把你为 `get` 写的测试复制粘贴过来，让它们除了改调用 `getRecursive` 之外完全一致。（虽然有一种办法可以避免复制粘贴测试，但那个语法不值得引入——在 Java 里传递函数有点乱。）

复制粘贴测试、确认它们失败之后，实现 `getRecursive`。

## 任务 9：removeFirst 与 removeLast

最后，写一些测试 `removeFirst` 和 `removeLast` 行为的测试，同样先确认它们失败。这些测试里你会用到 `toList`！可以拿 `addFirstAndAddLastTest` 作参考。

不要保留指向已从队列移除的元素的引用。你的程序在任一时刻使用的内存必须和元素数量成正比。例如，往队列加 10,000 个元素，再移除 9,999 个，最终的内存用量应该相当于一个只有 1 个元素的队列，而不是 10,000 个。记住，只有当没有任何指针指向一个对象时，Java 的垃圾回收器才会替我们「删除」它。

如果 `Deque61B` 为空，移除操作应该返回 `null`。

`removeFirst` 和 `removeLast` 不得使用循环或递归。和 `addFirst`、`addLast` 一样，这些操作必须花费「常数时间」。这是什么意思，更多信息见前面写 `addFirst` 和 `addLast` 的那一节。

写完测试、确认它们失败之后，实现 `removeFirst` 和 `removeLast`。

## 任务 10：测试你的测试

前面说过，我们会测试你的测试，看它们够不够好。我们的自动评分器真的会测试你的测试，确认它们有足够的「覆盖度」（coverage）。做法本质上就是：拿你的测试文件（`LinkedListDeque61BTest.java`），用它来「测试」我们的 `LinkedListDeque61B` 参考解答（staff solution）。

借助一些自动评分器的魔法，我们能判断你的测试能命中哪些边界情况，从而知道你的测试套件的「覆盖度」。想在测试部分拿满分，你就得琢磨有意思的角落情况（corner case）。

如果想检查你的测试有多好，可以用 Gradescope 上的「[Ungraded] Mini-Project 1: LinkedListDeque Test Coverage」作业。这个作业*不计分*，不影响成绩。它是完整自动评分器的一个子集，只检查你的测试，不检查你真正的 LinkedListDeque 实现。换句话说，完整评分器里的覆盖度测试被复制到了这个不计分作业里。和完整评分器不同，这个不计分作业没有令牌限制，可以想用多少次就用多少次来检查测试质量。（本站补充：这项自查工具需要 Gradescope 账号，校外学习者用不了；可以对照下面的 flags 清单逐项自查。）

注意，四个小项目总共只需要 300 分就能拿到满分。漏掉几分不必紧张。

我们的参考解答同样只有一个接收 0 个参数的构造函数，所以你的测试也应该只使用无参构造函数。

> **通过覆盖度检查器不代表你的测试完美**！有可能你的 `LinkedListDeque61BTest` 通过了我们的测试，却没能发现你自己的 `LinkedListDeque61B` 里的 bug。
>
> 我们的覆盖度检查器只检查你调用 `LinkedListDeque` 的方式，不检查你做的断言。
>
> 如果你以为自己覆盖到了某个场景、却还是挂自动评分器的测试，一个好办法是给自己测试加更多断言。比如验证每次调用的结果、每次调用之间检查整个队列，或者检查其他队列方法的结果。
>
> 覆盖度检查器能检查你对队列*做了*什么，却检查不了你对队列*断言*了什么。

如果你卡住了、测试过不了自动评分器，下面是所需 flags 的描述。

### add 测试的 flags

- `add_first_from_empty`：检查空队列上的 `addFirst`。
- `add_last_from_empty`：检查空队列上的 `addLast`。
- `add_first_nonempty`：检查非空队列上的 `addFirst`。
- `add_last_nonempty`：检查非空队列上的 `addLast`。

### add-after-remove 测试的 flags

- `add_first_after_remove_to_empty`：往队列加一些元素再全部移除，然后检查 `addFirst` 仍然正确。
- `add_last_after_remove_to_empty`：往队列加一些元素再全部移除，然后检查 `addLast` 仍然正确。

### remove 测试的 flags

- `remove_first`：检查 `removeFirst`。
- `remove_last`：检查 `removeLast`。
- `remove_first_to_empty`：往队列加一些元素，移除到几乎全空。检查用 `removeFirst` 移除最后一个元素正确。
- `remove_last_to_empty`：往队列加一些元素，移除到几乎全空。检查用 `removeLast` 移除最后一个元素正确。
- `remove_first_to_one`：往队列加一些元素，移除到几乎全空。检查用 `removeFirst` 移除倒数第二个元素正确。
- `remove_last_to_one`：往队列加一些元素，移除到几乎全空。检查用 `removeLast` 移除倒数第二个元素正确。

### get 测试的 flags

- `get_first_empty`：检查空队列上的 `getFirst`。
- `get_last_empty`：检查空队列上的 `getLast`。
- `get_first_valid`：检查非空队列上的 `getFirst`。
- `get_last_valid`：检查非空队列上的 `getLast`。
- `get_valid`：检查合法下标上的 `get`。
- `get_oob_large`：检查很大的越界下标上的 `get`。
- `get_oob_neg`：检查负下标上的 `get`。
- `get_recursive_valid`：检查合法下标上的 `getRecursive`。
- `get_recursive_oob_large`：检查很大的越界下标上的 `getRecursive`。
- `get_recursive_oob_neg`：检查负下标上的 `getRecursive`。

**译注**：原文对 `get_first_empty` 和 `get_first_valid` 的描述写反了（原文分别只写了 "Check that getFirst works" 和 "Check that getFirst works on a empty deque"，`get_last_empty`、`get_last_valid` 两条同样如此）。按 flag 的命名和小项目 2 的同名 flags，空队列对应 `_empty`、非空队列对应 `_valid`，译文已更正。

（oob 是 "out of bounds"（越界）的缩写）

### size 测试的 flags

- `size`：检查 `size`。
- `size_after_remove_to_empty`：往队列加一些元素再全部移除，然后检查 `size` 仍然正确。
- `size_after_remove_from_empty`：从空队列移除，然后检查 `size` 仍然正确。

### isEmpty 测试的 flags

- `is_empty_true`：检查空队列上的 `isEmpty`。
- `is_empty_false`：检查非空队列上的 `isEmpty`。

### toList 测试的 flags

- `to_list_empty`：检查空 `LinkedListDeque61B` 上的 `toList`。
- `to_list_nonempty`：检查非空 `LinkedListDeque61B` 上的 `toList`。

## 提交

为每个方法写完本地测试并全部通过后，按[作业工作流程指南](https://sp26.datastructur.es/resources/assignment-workflow/#submitting-to-gradescope)提交到自动评分器。你可能会全过，也可能不会。

- 如果挂了任何覆盖度测试，说明有一种情况你的本地测试没有覆盖。任务 10 里列了[你应当覆盖的测试用例清单](https://sp26.datastructur.es/projects/proj1/#flags-for-add-tests)。
- 如果挂了任何计时（timing）测试，说明你的实现不满足上面描述的时间限制。
- 你的令牌限额是每 24 小时 4 个。我们不会因为忘记 add/commit/push 代码等原因补发令牌。

### 评分

本项目分成以下评分组件：

1. **空列表（14%）**：定义合法的 `Node` 类，并正确实现构造函数。
2. **添加（24%）**：正确实现 `addFirst`、`addLast` 和 `toList`。
3. **isEmpty、size（5%）**：在 add 方法正确工作的前提下，正确实现 `isEmpty` 和 `size`。
4. **getFirst、getLast（5%）**：正确实现 `getFirst` 和 `getLast`。
5. **get（5%）**：正确实现 `get`。
6. **getRecursive（5%）**：正确实现 `getRecursive`。
7. **移除（24%）**：正确实现 `removeFirst` 和 `removeLast`。
8. **综合（9%）**：通过一个随机调用所有方法的综合测试套件。
9. **测试覆盖度（9%）**：写出覆盖足够数量 flags 的测试。我们会把你的测试跑在参考解答上，检查测到了多少场景和边界情况。（flags 清单见任务 10。）

你在 Gradescope 上得到的分数就是本次作业的最终分数（前提是你遵守了[合作政策](https://sp26.datastructur.es/policies/#collaboration-policy)）。
