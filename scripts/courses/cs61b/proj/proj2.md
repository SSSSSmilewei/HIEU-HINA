# 小项目 2：ArrayDeque61B

> 本页是 UC Berkeley CS61B 2026 春季官方项目说明「Mini-Project 2: ArrayDeque61B」的中文翻译，原文见页面下方的「项目原文」。命令、代码和程序输出保持原样。

> **本站补充（校外学习者请先看）**：本项目的自动评分、提交次数限制（每 24 小时 4 次）和测试覆盖度检查（任务 11）都在 Gradescope 上，只对伯克利在读学生开放；Ed 论坛和办公时间答疑也一样。校外学习者请按「作业 1」页首「本站补充」的办法自建私有仓库、从 `skeleton` 远程拉取起始代码，用本地测试代替自动评分：为本页要求的每个方法写测试并全部跑通，再对照任务 11 的 flags 清单自查测试是否覆盖这些场景。原课程规定共享测试按作弊处理，请务必自己写测试。

*完成本项目需要以下讲座：*

- 第 4 讲（测试）
- 第 7 讲（DLList、ArrayList）
- 第 8 讲（ArrayList）
- 第 10 讲（迭代器、对象方法）——只有最后两个任务需要。

*组队政策：*本项目不组队。可以和其他同学讨论想法，但不允许共享代码，提交的解答必须是你自己的工作！详见[课程政策页](https://sp26.datastructur.es/policies/#collaboration-and-llm-policy)。

在上一个项目里，我们构建了 `LinkedListDeque61B`。现在来看 `Deque61B` 接口的另一种实现：使用*底层数组*（backing array），而不是链表节点。另外，与上一个项目不同，我们提供的脚手架要少得多。换句话说，我们只说你要做什么，不说怎么做。

完成这份作业后，你将……

- 理解数据结构中底层数组的实现。
- 获得更多使用测试和测试驱动开发来验证这些数据结构正确性的经验。

## 准备工作

按[作业工作流程指南](https://sp26.datastructur.es/resources/assignment-workflow/)开始这份作业。起始代码在 `proj2` 文件夹里。

> 在这个项目上，你每 24 小时最多只能向 Gradescope 提交 4 次。换句话说，你有 4 个提交令牌（token），每个令牌 24 小时刷新一次。
>
> 和项目 1 一样，**本地不会提供全部测试**，所以你要自己写测试来验证代码的正确性。详见[编写测试](https://sp26.datastructur.es/projects/proj2/#task-11-writing-tests)一节。

## 任务 1：创建文件

如果需要复习 `Deque61B`，请看[项目 1 说明](https://sp26.datastructur.es/projects/proj1/#task-1-read-the-deque61b-adt-and-api)和 `Deque61B.java` 文件。

先创建一个叫 `ArrayDeque61B` 的文件。

这个文件要在 `proj2/src` 目录里创建。做法：右键点击 `src` 目录，选 "New -> Java Class"，命名为 `ArrayDeque61B`。

![New Java Class](https://sp26.datastructur.es/assets/projects/proj2/1-new-class.webp)

![Name class LinkedListDeque61B](https://sp26.datastructur.es/assets/projects/proj2/2-class-name.webp)

和项目 1 一样，我们希望 `ArrayDeque61B` 能装不同的类型。为此，把类的声明改成：

```
public class ArrayDeque61B<T>
```

回忆一下讲座里讲过的：用 `T` 还是别的字符串（比如 `ArrayDeque61B<Glerp>`）其实无所谓。不过为了和其他 Java 代码保持一致，我们建议用 `<T>`。

我们还要告诉 Java，每个 `ArrayDeque61B` 都是一个 `Deque61B`，这样用户就能写 `Deque61B<String> ad = new ArrayDeque61B<>();` 这样的代码。为此，把类的声明改成：

```
public class ArrayDeque61B<T> implements Deque61B<T>
```

到这里，你的类声明应该和上面那行一样。

![Add generic type and implements](https://sp26.datastructur.es/assets/projects/proj2/3-add-implements.webp)

做完这一步后，你多半会看到整条类声明下面有一条红色波浪线。这是因为你说你的类实现了一个接口，却还没有真正实现这个接口的任何方法。

把鼠标悬停在红色波浪线上，在弹出的错误信息框里点击 "implement methods"（实现方法）按钮。这会自动生成方法头。

![Click Implement Methods](https://sp26.datastructur.es/assets/projects/proj2/4-click-implement-methods.webp)

![Implement Methods menu](https://sp26.datastructur.es/assets/projects/proj2/5-implement-methods-menu.webp)

现在，你的类里应该填满了一堆空的方法声明。这些就是你要在本项目里实现的方法！

最后，创建一个空的构造函数。

为此，把下面的代码加进你的文件，构造函数暂时留空。

```
public ArrayDeque61B() {
}
```

现在可以开始了！

> 和上一个项目一样，实现里不许使用任何内置的 `java.util` 数据结构！这个项目的意义就在于构建你自己的版本！
>
> 有几处地方（测试之外）允许你使用特定的数据结构，我们会明确指出在哪里。
>
> 本项目的任何时候都不应该修改 `Deque61B.java`（除了一处我们会指出的地方）。

## 任务 2：构造函数

你的队列必须用 Java 数组作为底层数据结构。

你需要想办法记录队列的首元素和尾元素分别存在数组的哪些下标上。我们*强烈建议*你把这个数组当作循环数组（circular array）来用。也就是说，如果你的首元素在下标 `0`，这时执行 `addFirst`，新的首元素应该回绕到数组末尾（队列的新首元素就是底层数组的最后一个元素）。这会比非循环的做法少让你头疼得多。

更多细节见[讲座幻灯片](https://docs.google.com/presentation/d/1askFQ_VAqE-sTmfeZhsL3CtMWylUQizgIloYVOHul6A/edit?slide=id.g37e166ec507_0_1685#slide=id.g37e166ec507_0_1685)。特别要注意：虽然概念上的队列和数组装着相同的元素，但元素在两者里的顺序并不相同。

*提示：*如果卡住了，记住让 `nextLast` 的初值比 `nextFirst` 大是有用的，不过具体怎么实现由你决定！

*提示：*Java 里不能创建泛型数组（例如 `new T[1000]`），原因超出了本课的范围（可参考 [OpenJDK Valhalla 项目](https://openjdk.org/projects/valhalla/)，英文）。你需要改用 `(T[]) new Object[1000]` 这个写法。

如果你觉得有必要，可以在 `ArrayDeque61B.java` 里添加私有的辅助类或方法。我们建议写一个（或多个）辅助函数，避免在多个地方重复实现回绕逻辑。

> 声明必要的实例变量，并实现构造函数。
>
> 为了自动评分，你的底层数组的初始大小**必须**是 `8`。

## 任务 3：addFirst 与 addLast

这两个方法*不得*使用循环或递归。单次添加操作必须花费*常数时间*，也就是说，无论队列多大，添加一个元素花的时间都应该大致相同（有一个例外）。这意味着你不能使用遍历队列全部或大部分元素的循环。

> 实现 `addFirst` 和 `addLast`。
>
> 你需要先完成任务 7（toList），再给 `addFirst` 和 `addLast` 写测试，因为测试这些方法需要一个能用的 `toList`。做完之后，写测试并验证你的实现。

为了预期的体验，先别急着做数组扩容，我们会在后面的任务里实现它。

## 任务 4：getFirst 与 getLast

给 `getFirst` 和 `getLast` 方法写测试。务必测到 `Deque61B` 没有元素（为空）的情况。这些情况下，`getFirst` 和 `getLast` 应该返回 `null`。

*提示：*如果 `ad.getFirst()` 永远返回 `items[0]`，你就写错了。记住，队列的首元素不一定在下标 0 上。例如，在[讲座幻灯片](https://docs.google.com/presentation/d/1askFQ_VAqE-sTmfeZhsL3CtMWylUQizgIloYVOHul6A/edit?slide=id.g37e166ec507_0_1685#slide=id.g37e166ec507_0_1685)里，我就是随便挑了下标 4 作为队列首元素的起始位置。

写完测试、确认它们失败之后，实现 `getFirst` 和 `getLast`。

这两个方法必须花费*常数时间*。也就是说，任一方法执行完所花的时间，都不应该取决于队列里有多少个元素。

## 任务 5：get 与 getRecursive

与 `LinkedListDeque61B` 不同，`get` 方法必须花费*常数时间*。

与 `LinkedListDeque61B` 一样，下标非法（太大或为负）时，`get` 应该返回 null。

注意，下标比较的对象是队列的大小，而不是底层数组的大小。例如，底层数组的大小是 8，但对队列只调用过 3 次 `add`，那就只有 3 个元素，任何大于 2 的下标都越界。

队列为空时，`get` 应该返回 null。

写完测试、确认它们失败之后，实现 `get`。

虽然本项目不再用链表，但为了和接口保持一致，仍然要求实现 `getRecursive`。这个方法本来就不该出现在接口里，放进来只是为了让测试方便。你可以直接把这段 `getRecursive` 代码复制过去：

```
@Override
public T getRecursive(int index) {
    throw new UnsupportedOperationException("No need to implement getRecursive for ArrayDeque61B.");
}
```

复制上面的代码块，就算「实现」了 `getRecursive`。

## 任务 6：isEmpty 与 size

这两个方法必须花费*常数时间*。也就是说，任一方法执行完所花的时间，都不应该取决于队列里有多少个元素。

给 `isEmpty` 和 `size` 方法写测试，确认它们失败。然后实现这两个方法。

## 任务 7：toList

`toList` 会继续在测试你的 `Deque61B` 时派上用场。

给 `toList` 方法写测试，确认它们失败。然后实现这个方法。这次没有给你现成的测试，得自己写！

方法的第一行应该类似 `List<T> returnList = new ArrayList<>()`。这是允许你使用内置 Java 数据结构的一处。

*提示：*前面的某个方法可能对实现这个方法有帮助。

*提示：*你的 `toList` 方法应该返回一个装着 ArrayDeque61B 全部元素的列表，顺序和元素加入的顺序一致（也就是「概念上的队列」）。另外，只能把真正作为元素加入队列的值返回（例如，不要返回 null，除非 null 是被显式当作元素加进去的）。

后面有些方法用 `toList` 实现起来似乎会很简单。你不许在 `ArrayDeque61B` 里调用 `toList`；有一个测试专门检查这一点。

## 任务 8：removeFirst 与 removeLast

剩下的就是测试并实现所有其余方法。在本项目剩下的部分，我们只在较高的层面描述建议的步骤。我们*强烈建议*你按给出的顺序完成剩下的步骤。特别是，先写测试，再实现方法的功能！这叫*测试驱动开发*（test-driven development），能帮你在动手之前就弄清楚方法应该做什么。

写一些测试 `removeFirst` 和 `removeLast` 行为的测试，同样先确认它们失败。然后实现这两个方法。

不要保留指向已从队列移除的元素的引用。

`removeFirst` 和 `removeLast` 不得使用循环或递归。和 `addFirst`、`addLast` 一样，这些操作必须花费*常数时间*。这是什么意思，更多信息见前面对此的解释。

## 任务 9：扩容

我们建议先完成前面所有任务，确认不扩容时一切工作正常，之后再回来做扩容。

ArrayDeque「常数时间」要求有一个例外：数组满了，你需要「扩容」才有空间添加下一个元素。这时，可以先花「线性时间」把数组扩容，再添加元素。

正确地扩容非常棘手，需要深入的思考。试着在纸上把各种方案画出来。想出正确的方案可能要花相当长的时间，我们鼓励你和同学或助教讨论大的思路，但具体实现必须由你独立完成。

务必按几何倍数（geometric factor）扩容。如果做扩容时遇到 `ExecutionTimeoutException`，请确认你用的是乘法（几何）倍数，而不是加法增量！

扩容过程中的一些提示：

- 先让固定大小的数组一切正常，这是熟悉情况的好起点。
- 等固定大小数组的方案有把握了，再试扩容——可以考虑写一个辅助方法！
- 拿不准就画出来！方法出问题时，我们建议画「盒子与指针」图（或者随便什么示意图），这会帮你更好地理解你的代码和预期的逻辑。
- 我们*不*建议在循环数组的实现里用 `arraycopy`。那样能行，但实现会明显更复杂（也更难调试！），没有必要。相反，我们建议往前想一想你会怎么实现 `get`，用某种 `for` 循环来代替。

等 `addFirst` 和 `addLast`（不扩容的版本）能用了，修改这两个方法以支持扩容。用测试验证它们正确。

你的测试里务必加足够多的元素，让底层数组真的发生扩容！更多关于扩容的内容，见[这些讲座幻灯片](https://docs.google.com/presentation/d/1askFQ_VAqE-sTmfeZhsL3CtMWylUQizgIloYVOHul6A/edit?slide=id.g2037ceccec1_0_787#slide=id.g2037ceccec1_0_787)。

## 任务 10：缩容

你的程序在任一时刻使用的内存必须和元素数量成正比。例如，往队列加 10,000 个元素，再移除 9,999 个，你不应该还在用一个装得下 10,000 个元素的数组。对于长度 16 及以上的数组，你的使用率（usage factor）必须始终不低于 25%。也就是说，在执行移除操作之前，如果数组里的元素数已经降到了数组长度的 25% 或以下，你就应该把数组缩小。对于长度 15 及以下的数组，使用率可以任意低。

我们同样不建议在循环数组的实现里用 `arraycopy`。如果你照上面的建议用 `for` 循环扩容，缩容会和扩容非常相似（也许可以写个辅助方法？）。

等 `removeFirst` 和 `removeLast`（不缩容的版本）能用了，修改这两个方法以支持缩容。用测试验证它们正确。

## 任务 11：编写测试

测试写法的复习请看[项目 1 说明](https://sp26.datastructur.es/projects/proj1/#writing-tests)。和项目 1 类似，项目 2 的自动评分器会为你的单元测试的覆盖度打分。

项目 1 的一些测试或许可以直接复用到本项目里，别怕把它们复制过来！

注意，写覆盖度测试时，只能使用 `Deque` 接口里有的变量和方法。这是因为我们会把我们「自己的」Deque 实现拿来跑你的测试，判断覆盖是否足够。

如果想检查你的测试有多好，可以用 Gradescope 上的「[Ungraded] Mini-Project 2: ArrayDeque Test Coverage」作业。这个作业*不计分*，不影响成绩。它是完整自动评分器的一个子集，只检查你的测试，不检查你真正的 ArrayDeque 实现。换句话说，完整评分器里的覆盖度测试被复制到了这个不计分作业里。和完整评分器不同，这个不计分作业没有令牌限制，可以想用多少次就用多少次来检查测试质量。（本站补充：这项自查工具需要 Gradescope 账号，校外学习者用不了；可以对照下面的 flags 清单逐项自查。）

*提示：*如果覆盖度测试出了问题，有可能是因为拿你的测试跑我们助教版代码时，我们的代码遇到了断言错误。确保你所有断言语句的期望输出都是对的！例如，如果你的代码对一个元素为 `[1, 2, 3]` 的 `ArrayDeque61B` 调用 `ad.get(0)`，却断言第 0 个元素是 2，那么在这条错误的测试之后写的测试都不会计入覆盖度。

由于我们是在我们的助教版实现上跑你的测试，这带来两点影响。第一，你没法直接检查自己有没有扩容，因为你的测试只能用 `Deque61B` 接口里的方法，而接口不提供访问底层数组长度的途径。所以，只要确保写出会让你的 `ArrayDeque61B` 扩容的代码，就能拿到 flags。第二，我们根据我们自己的实现判断一个测试是否触发了扩容，它和你的实现可能相差 1。如果在扩容相关的 flags 上挂了测试，务必比你的实现所需要的多 add/remove 1–2 个元素。

如果你卡住了、测试过不了自动评分器，下面是所需 flags 的描述。

### add 测试的 flags

- `add_first_from_empty`：检查空队列上的 `addFirst`。
- `add_last_from_empty`：检查空队列上的 `addLast`。
- `add_first_nonempty`：检查非空队列上的 `addFirst`。
- `add_last_nonempty`：检查非空队列上的 `addLast`。
- `add_first_trigger_resize`：检查底层数组已满时 `addFirst` 是否正确。
- `add_last_trigger_resize`：检查底层数组已满时 `addLast` 是否正确。

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
- `remove_first_trigger_resize`：在使用率 ≤ 25% 且数组大小 > 8 时触发。检查数组正确地缩容。
- `remove_last_trigger_resize`：在使用率 ≤ 25% 且数组大小 > 8 时触发。检查数组正确地缩容。

### get 测试的 flags

- `get_first_empty`：检查空 ArrayDeque 上的 `getFirst`。
- `get_first_valid`：检查非空 ArrayDeque 上的 `getFirst`。
- `get_last_empty`：检查空 ArrayDeque 上的 `getLast`。
- `get_last_valid`：检查非空 ArrayDeque 上的 `getLast`。
- `get_valid`：检查合法下标上的 `get`。
- `get_oob_large`：检查很大的越界下标上的 `get`。
- `get_oob_neg`：检查负下标上的 `get`。

### size 测试的 flags

- `size`：检查 `size`。
- `size_after_remove_to_empty`：往队列加一些元素再全部移除，然后检查 `size` 仍然正确。
- `size_after_remove_from_empty`：从空队列移除，然后检查 `size` 仍然正确。

### isEmpty 测试的 flags

- `is_empty_true`：检查空队列上的 `isEmpty`。
- `is_empty_false`：检查非空队列上的 `isEmpty`。

**译注**：原文对这两条 flags 的描述写的是 "Check that size works on an empty deque / on a non-empty deque"（检查 `size`），与本组 flags 的名称（`is_empty_*`）不符，应为 `isEmpty`，译文已更正。

### toList 测试的 flags

- `to_list_empty`：检查空 `ArrayDeque` 上的 `toList`。
- `to_list_nonempty`：检查非空 `ArrayDeque` 上的 `toList`。

### 扩容进阶测试的 flags

- `resize_up_and_resize_down`：在同一个测试里先触发一次扩容，再触发一次缩容。

## 任务 12：iterator

在项目剩下的部分，你将扩展 `Deque61B` 接口的功能。最后这两个任务会用到第 10 讲「迭代器与对象方法」的内容。（**译注**：原文此处写作 "Lecture 9"，与本页开头列出的「第 10 讲（迭代器、对象方法）」不一致；按开头的讲座列表应为第 10 讲，译文已更正。）

我们的 `Deque61B` 接口有一个缺点：不能被迭代。也就是说，下面的代码无法编译，报错 "foreach not applicable to type"：

```
Deque61B<String> ad = new ArrayDeque61B<>();

ad.addLast("front");
ad.addLast("middle");
ad.addLast("back");
for (String s : ad) {
    System.out.println(s);
}
```

同样，如果我们想写一个测试，断言我们的 `Deque61B` 包含特定的一组元素，也会得到一个编译错误，这次是 "Cannot resolve method containsExactly in Subject"：

```
public void addLastTestBasicWithoutToList() {
    Deque61B<String> ad = new ArrayDeque61B<>();

    ad.addLast("front"); // after this call we expect: ["front"]
    ad.addLast("middle"); // after this call we expect: ["front", "middle"]
    ad.addLast("back"); // after this call we expect: ["front", "middle", "back"]
    assertThat(ad).containsExactly("front", "middle", "back");
}
```

问题还是在于：我们的对象不能被迭代。`Truth` 库的工作方式是迭代我们的对象（就像第一个例子那样），而我们的 `ArrayDeque61B` 不支持迭代。

要解决这个问题，先把 `Deque61B` 接口的声明改成下面这样：

```
public interface Deque61B<T> extends Iterable<T> {
```

（这是本项目唯一一处应该修改 `Deque61B.java` 的地方。）

用讲座里讲到的技术，在 `ArrayDeque61B.java` 里实现 `iterator()` 方法。

提醒：这里不许调用 `toList`。

我们没有为你的迭代器（以及接下来两个任务里的两个方法）提供测试文件。不过，我们强烈鼓励你用到目前为止学到的技术自己写测试。

这些测试你想怎么组织都行，因为我们不会在测试覆盖度里检查它们。一种可能（也是建议）的做法，是在 `tests` 目录里新建一个类似 `ArrayDeque61BEnhancementTest.java` 的文件，让项目的这部分有单独的测试文件。

## 任务 13：equals

考虑下面的代码：

```
@Test
public void testEqualDeques61B() {
    Deque61B<String> ad = new ArrayDeque61B<>();
    Deque61B<String> ad2 = new ArrayDeque61B<>();

    ad.addLast("front");
    ad.addLast("middle");
    ad.addLast("back");

    ad2.addLast("front");
    ad2.addLast("middle");
    ad2.addLast("back");

    assertThat(ad).isEqualTo(ad2);
}
```

运行这段代码，我们会看到测试失败，消息如下：

```
expected: [front, middle, back]
but was : (non-equal instance of same class with same string representation)
```

问题在于 `Truth` 库用到了 `ArrayDeque61B` 类的 `equals` 方法。默认的实现如下（[代码见这里](https://github.com/openjdk/jdk17/blob/master/src/java.base/share/classes/java/lang/Object.java#L162)）：

```
public boolean equals(Object obj) {
    return (this == obj);
}
```

也就是说，这个 equals 方法只是检查两个对象的地址是否相同。我们想要能检查两个 `Deque61B` 对象在元素和顺序上是否相等，所以需要另一个 `equals` 方法。

在 `ArrayDeque61B` 类里重写 equals 方法。写 `equals` 方法的指导见讲座幻灯片（之后会更新，周三的讲座会讲）。

在 `ArrayDeque61B` 类里重写 `equals()` 方法。

注：正如讲座里简单提过的，对带类型参数的类使用 `instanceof` 会产生警告。例如 `o instanceof ArraySet uddaSet`。（**译注**：原文此处写作 `o instance of ArraySet uddaSet`，是笔误，应为 `o instanceof ArraySet uddaSet`，下文原文里正确的写法也是这样，译文已更正。）警告是 "Raw use of parameterized class 'ArraySet'"。如果你不喜欢这个警告，可以把代码改成用 `<?>`。例如，我们可以写 `o instanceof ArraySet<?> uddaSet`。这不是项目的要求，超出了 61B 的范围。欢迎来办公时间找我，我很乐意讲解。

重写方法时，务必使用 `@Override` 标签。学生代码里的一个常见错误，是想重写 `equals(ArrayList<T> other)` 而不是 `equals(Object other)`。可选的 `@Override` 标签会让你犯这个错误时代码无法编译。`@Override` 是一张很好的安全网。

提醒：这里不许调用 `toList`。

## 任务 14：toString

考虑下面的代码，它打印一个 `ArrayDeque61B`：

```
Deque61B<String> ad = new ArrayDeque61B<>();

ad.addLast("front");
ad.addLast("middle");
ad.addLast("back");

System.out.println(ad);
```

这段代码的输出类似 `deque.proj1a.ArrayDeque61B@1a04f701`。这是因为打印语句隐式调用了 `ArrayDeque61B` 的 `toString` 方法。你没有重写这个方法，所以它用的是默认实现，即下面的代码（不需要理解这段代码是怎么工作的）：

```
public String toString() {
    return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```

而 `hashCode` 方法（你同样没有重写它）只是返回对象的地址，上例里就是 `1a04f701`。

重写 `ArrayDeque61B.java` 里的 `toString` 方法，让上面的代码打印 `[front, middle, back]`。

提醒：这里不许调用 `toList`。

## 提交

写完本地测试并通过之后，试着提交到自动评分器。你可能会全过，也可能不会。

- 如果挂了任何覆盖度测试，说明有一种情况你的本地测试没有覆盖。自动评分器的测试名和测试覆盖度部分会给你提示，指出缺失的情况。
- 如果挂了正确性测试，说明有一种情况你的本地测试没有覆盖（尽管你已经拿到了足够的 flags 覆盖）。这是正常的！覆盖度 flags 只是一种近似！它们既没有描述每一种需要测试的行为，也不保证你把该断言的都断言了。[flags 清单在这里！](https://sp26.datastructur.es/projects/proj2/#flags-for-add-tests)
- 如果挂了任何计时（timing）测试，说明你的实现不满足上面描述的时间限制。
- 你的令牌限额是每 24 小时 4 个。我们不会因为忘记 add/commit/push 代码等原因补发令牌。

评分：

1. **添加（25%）**：正确实现 `addFirst`、`addLast` 和 `toList`。
2. **isEmpty、size（3.33%）**：在 add 方法正确工作的前提下，正确实现 `isEmpty` 和 `size`。
3. **get（3.33%）**：正确实现 `get`。
4. **移除（25%）**：正确实现 `removeFirst` 和 `removeLast`。
5. **内存（16.67%）**：正确实现扩容，内存使用不超量。
6. **对象方法（20%）**：正确实现 `ArrayDeque61B` 的 `iterator`、`equals` 和 `toString`。
7. **测试覆盖度（6.67%）**：写出覆盖足够数量 flags 的测试。我们会把你的测试跑在参考解答上，检查测到了多少场景和边界情况。（flags 清单在本说明前面。）

你在 Gradescope 上得到的分数就是本次作业的最终分数（前提是你遵守了[合作政策](https://sp26.datastructur.es/policies/#collaboration-policy)）。
