# 第 3 章　引用、递归与列表（上）：引用与数组

> 本页是 UC Berkeley CS61B 2026 春季官方教材（Berkeley-CS61B/sp26-gitbook）第 3 章前半部分的中文翻译，原文见页面下方的「教材原文」。代码保持原样，代码中的注释和输出不翻译。第 3 章后半部分（IntList）在第 5 讲。原教材的部分插图来自旧版教材网站，现在只能从网页存档里取，加载可能较慢。

## 列表

你以前肯定用过列表这种数据结构。例如在 Python 里：

```python
L = [3, 5, 6]
L.append(7)
```

虽然 Java 确实有内置的 List 类型，但我们暂时不用它。在本章里，我们会从零开始构建自己的列表，并在这个过程中学习 Java 的一些关键特性。

### 海象之谜

开始我们的旅程之前，先来思考一个深奥的问题：海象之谜（the Mystery of the Walrus）。

试着预测运行下面的代码会发生什么。对 b 的修改会影响 a 吗？提示：如果你学过 Python，Java 的行为和 Python 一样。

```java
Walrus a = new Walrus(1000, 8.3);
Walrus b;
b = a;
b.weight = 5;
System.out.println(a);
System.out.println(b);
```

再试着预测运行下面的代码会发生什么。对 x 的修改会影响 y 吗？

```java
int x = 5;
int y;
y = x;
x = 2;
System.out.println("x is: " + x);
System.out.println("y is: " + y);
```

答案可以在 [这里](http://cscircles.cemc.uwaterloo.ca/java_visualize/#code=public+class+PollQuestions+%7B%0A+++public+static+void+main%28String%5B%5D+args%29+%7B%0A++++++Walrus+a+%3D+new+Walrus%281000,+8.3%29%3B%0A++++++Walrus+b%3B%0A++++++b+%3D+a%3B%0A++++++b.weight+%3D+5%3B%0A++++++System.out.println%28a%29%3B%0A++++++System.out.println%28b%29%3B++++++%0A%0A++++++int+x+%3D+5%3B%0A++++++int+y%3B%0A++++++y+%3D+x%3B%0A++++++x+%3D+2%3B%0A++++++System.out.println%28%22x+is%3A+%22+%2B+x%29%3B%0A++++++System.out.println%28%22y+is%3A+%22+%2B+y%29%3B++++++%0A+++%7D%0A+++%0A+++public+static+class+Walrus+%7B%0A++++++public+int+weight%3B%0A++++++public+double+tuskSize%3B%0A++++++%0A++++++public+Walrus%28int+w,+double+ts%29+%7B%0A+++++++++weight+%3D+w%3B%0A+++++++++tuskSize+%3D+ts%3B%0A++++++%7D%0A%0A++++++public+String+toString%28%29+%7B%0A+++++++++return+String.format%28%22weight%3A+%25d,+tusk+size%3A+%25.2f%22,+weight,+tuskSize%29%3B%0A++++++%7D%0A+++%7D%0A%7D\&mode=edit) 找到（Java 可视化工具，英文）。

海象之谜背后的关键思想虽然微妙，但对我们在这门课里要实现的数据结构的效率极其重要，深入理解这个问题也会让你写出更安全、更可靠的代码。

### 比特

计算机里的所有信息都以 0 和 1 的序列存放在*内存*里。举几个例子：

* 72 常常存成 01001000
* 205.75 常常存成 01000011 01001101 11000000 00000000
* 字母 H 常常存成 01001000（和 72 一样）
* 真值 true 常常存成 00000001

在这门课里，我们不会花很多时间讨论具体的二进制表示，例如 205.75 到底为什么存成上面那串看起来随机的 32 个比特。理解具体的表示方法是 [CS61C](http://www-inst.eecs.berkeley.edu/~cs61c/)（61B 的后续课程）的内容。

虽然我们不学二进制这门「语言」，但知道底层发生的就是这些事是有好处的。

一个有意思的现象是，72 和 H 都存成 01001000。这就引出一个问题：一段 Java 代码怎么知道该怎样解读 01001000？

答案是通过类型！例如，看下面的代码：

```java
char c = 'H';
int x = c;
System.out.println(c);
System.out.println(x);
```

运行这段代码，得到：

```
H
72
```

在这个例子里，变量 x 和 c 存放的比特相同（嗯，几乎相同……），但 Java 解释器打印它们时对它们的处理不同。

Java 有 8 种基本类型（primitive type）：byte、short、int、long、float、double、boolean 和 char。它们各有不同的性质，我们会在整门课里陆续讨论，只有 short 和 float 例外，你多半永远用不到它们。

### 声明变量（简化版）

可以把计算机想象成拥有海量用于存放信息的内存比特，每个比特都有唯一的地址。现代计算机有几十亿个这样的比特可用。

当你声明某种类型的变量时，Java 会找到一块连续的、比特数恰好够存放那种类型的东西的区域。例如，声明一个 int，你会得到一块 32 比特的区域。声明一个 byte，你会得到一块 8 比特的区域。Java 里每种数据类型占的比特数不同。确切的数字在这门课里不太重要。

为了方便打比方，我们把这样的一块区域称为一个装比特的「盒子」。

除了留出内存，Java 解释器还会在一张内部表格里记一条，把每个变量名对应到盒子第一个比特的位置。

例如，如果你声明了 `int x` 和 `double y`，Java 可能决定用内存的第 352 到 384 个比特存放 x，用第 20800 到 20864 个比特存放 y。然后解释器会记下：int x 从第 352 个比特开始，y 从第 20800 个比特开始。例如，执行了代码：

```java
int x;
double y;
```

之后，我们就有了大小分别为 32 和 64 的两个盒子，如下图所示：

![x\_and\_y\_empty\_bitwise](https://joshhug.gitbooks.io/hug61b/content/chap2/fig21/x_and_y_empty_bitwise.png)

Java 语言没有提供任何办法让你知道盒子的位置，例如，你没法查出 x 在第 352 个位置。换句话说，确切的内存地址位于 Java 让我们接触到的抽象层次之下。这和 C 这样的语言不同，在 C 里可以向语言询问一段数据的确切地址。因为这个原因，上图省略了地址。

Java 的这一特性是一种权衡！对程序员隐藏内存位置，让你的控制力变少，使你没法做某些 [类型的优化](http://www.informit.com/articles/article.aspx?p=2246428\&seqNum=5)。但它也避免了 [一大类非常棘手的编程错误](http://www.informit.com/articles/article.aspx?p=2246428\&seqNum=1)。在计算成本极低的现代，这种权衡通常非常值得。正如睿智的高德纳（Donald Knuth）所说：「大约 97% 的时候，我们都应该忘掉那些微小的效率：过早优化是万恶之源。」

打个比方，你没法直接控制自己的心跳。这虽然限制了你在某些情况下优化的能力，但也避免了犯下蠢错误的可能，比如不小心把心跳关掉。

声明变量时，Java 不会往预留的盒子里写任何东西。换句话说，没有默认值。因此，在用 `=` 运算符往盒子里填入比特之前，Java 编译器不允许你使用这个变量。因为这个原因，上图的盒子里没有画任何比特。

给内存盒子赋值时，盒子里会填上你指定的比特。例如，如果执行这两行：

```java
x = -1431195969;
y = 567213.112;
```

上面的内存盒子就会被填成下图的样子，我把这种画法叫作**盒子记法**（box notation）。

![x\_and\_y\_empty\_filled.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig21/x_and_y_empty_filled.png)

上面的比特表示 -1431195969，下面的比特表示 567213.112。为什么这两串特定的比特表示这两个数并不重要，那是 CS61C 的内容。不过，如果好奇，可以看维基百科上的 [整数表示](https://en.wikipedia.org/wiki/Two's_complement) 和 [双精度浮点数表示](https://en.wikipedia.org/wiki/IEEE_floating_point)。

注意：内存分配实际上比这里描述的要复杂一些，那是 CS 61C 的内容。不过对 61B 来说，这个模型已经足够接近实际了。

**简化的盒子记法**

上一节用的盒子记法很适合大致理解底层发生了什么，但没什么实际用处，因为我们不知道怎样解读那些二进制比特。

所以，我们不再用二进制写内存盒子的内容，而是用人能看懂的符号来写。课程剩下的部分都会这样做。例如，执行了：

```java
int x;
double y;
x = -1431195969;
y = 567213.112;
```

之后，可以用我所说的**简化盒子记法**来表示程序的环境，如下图所示：

![x\_and\_y\_simplified\_box\_notation.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig21/x_and_y_simplified_box_notation.png)

### 等号的黄金法则（GRoE）

有了简化盒子记法，我们终于可以开始解开海象之谜了。

原来这个谜有一个简单的答案：当你写 `y = x` 时，你是在让 Java 解释器把 x 里的比特复制到 y 里。这条**等号的黄金法则**（Golden Rule of Equals，GRoE）是理解海象之谜的一切真理的根源。

```java
int x = 5;
int y;
y = x;
x = 2;
System.out.println("x is: " + x);
System.out.println("y is: " + y);
```

「复制比特」这个简单的想法，对 Java 里**任何**用 `=` 的赋值都成立。要看它的实际效果，点 [这个链接](http://cscircles.cemc.uwaterloo.ca/java_visualize/#code=public+class+PollQuestions+%7B%0A+++public+static+void+main\(String%5B%5D+args%29+%7B%0A++++++int+x+%3D+5%3B%0A++++++int+y%3B%0A++++++y+%3D+x%3B%0A++++++x+%3D+2%3B%0A++++++System.out.println\(%22x+is%3A+%22+%2B+x%29%3B%0A++++++System.out.println\(%22y+is%3A+%22+%2B+y%29%3B++++++%0A+++%7D%0A%7D\&mode=display\&curInstr=0)。

### 引用类型

上面说过，基本类型有 8 种：byte、short、int、long、float、double、boolean、char。其他一切，包括数组，都不是基本类型，而是**引用类型**（`reference type`）。

**对象的实例化**

当我们用 `new` *实例化*一个对象（例如 Dog、Walrus、Planet）时，Java 先为类的每个实例变量分配一个盒子，并用默认值填好。然后构造函数通常（但不总是）会把每个盒子都填上别的值。

例如，如果我们的 Walrus 类是：

```java
public static class Walrus {
    public int weight;
    public double tuskSize;

    public Walrus(int w, double ts) {
          weight = w;
          tuskSize = ts;
    }
}
```

用 `new Walrus(1000, 8.3);` 创建一只 Walrus，就会得到一只由大小分别为 32 和 64 比特的两个盒子组成的 Walrus：

![anonymous\_walrus.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig21/anonymous_walrus.png)

在 Java 编程语言的真实实现里，任何对象实际上都有一些额外开销，所以一只 Walrus 占的比特比 96 个多一些。不过就我们的目的而言，会忽略这些开销，因为我们永远不会直接和它们打交道。

我们创建的这只 Walrus 是匿名的，意思是它被创建了，但没有存放在任何变量里。下面来看存放对象的变量。

**引用变量的声明**

当我们*声明*任何引用类型（Walrus、Dog、Planet、数组等）的变量时，Java 都分配一个 64 比特的盒子，不管是什么类型的对象。

乍一看，这似乎会导致一个「海象悖论」。上一节的 Walrus 需要超过 64 个比特来存放。而且，不管对象是什么类型，都只给 64 个比特来存放它，这似乎很奇怪。

不过，只要知道下面这一点，问题就迎刃而解：这个 64 比特的盒子里存的不是海象的数据，而是这只 Walrus 在内存中的地址。

例如，假设我们执行：

```java
Walrus someWalrus;
someWalrus = new Walrus(1000, 8.3);
```

第一行创建一个 64 比特的盒子。第二行创建一只新的 Walrus，`new` 运算符返回它的地址。然后根据 GRoE，这些比特被复制进 `someWalrus` 盒子。

假设这只 Walrus 的 weight 从内存的第 `5051956592385990207` 个比特开始存放，tuskSize 从第 `5051956592385990239` 个比特开始，我们就可能在 Walrus 变量里存放 `5051956592385990207`。`5051956592385990207` 的二进制是 64 个比特 `0100011000011100001001111100000100011101110111000001111000111111`，用盒子记法画出来是：

![someWalrus\_bit\_notation.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig21/someWalrus_bit_notation.png)

也可以给引用变量赋一个特殊值 `null`，它对应于全零。

![someWalrus\_bit\_notation\_null.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig21/someWalrus_bit_notation_null.png)

**盒子与指针记法**

和前面一样，一个引用变量里的一堆比特很难解读，所以我们为引用变量制定一种简化的盒子记法：

* 如果地址全为零，就用 null 表示。
* 非零的地址用一个指向实例化出来的对象的**箭头**表示。

这有时也叫「盒子与指针」记法（box and pointer notation）。

对上一节的例子，就得到：

![someWalrus\_simplified\_bit\_notation.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig21/someWalrus_simplified_bit_notation.png)

![someWalrus\_simplified\_bit\_notation\_null.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig21/someWalrus_simplified_bit_notation_null.png)

**解开海象之谜**

现在我们终于可以完完全全地解开海象之谜了。

```java
Walrus a = new Walrus(1000, 8.3);
Walrus b;
b = a;
```

执行第一行之后，得到：

![mystery\_of\_the\_walrus\_resolved\_step1.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig21/mystery_of_the_walrus_resolved_step1.png)

执行第二行之后，得到：

![mystery\_of\_the\_walrus\_resolved\_step2.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig21/mystery_of_the_walrus_resolved_step2.png)

注意上面的 b 是未定义的，不是 null。

根据 GRoE，最后一行只是把 `a` 盒子里的比特复制到 `b` 盒子里。用我们的图示来说，就是 b 原样复制 a 里的箭头，现在也有一个箭头指向同一个对象。

![mystery\_of\_the\_walrus\_resolved\_step3.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig21/mystery_of_the_walrus_resolved_step3.png)

就是这样。没有比这更复杂的了。

### 参数传递

给函数传参数时，你也只是在复制比特。换句话说，GRoE 同样适用于参数传递。复制比特通常叫作「按值传递」（pass by value）。在 Java 里，我们**总是**按值传递。

例如，看下面的函数：

```java
public static double average(double a, double b) {
    return (a + b) / 2;
}
```

假设我们像下面这样调用这个函数：

```java
public static void main(String[] args) {
    double x = 5.5;
    double y = 10.5;
    double avg = average(x, y);
}
```

执行这个函数的前两行之后，main 方法里有两个标着 `x` 和 `y` 的盒子，存放的值如下图所示：

![main\_x\_y.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig21/main_x_y.png)

调用函数时，`average` 函数有**自己的**作用域，里面有两个新盒子，标着 `a` 和 `b`，比特只是被*复制*进去。我们说「按值传递」，指的就是这种比特的复制。

![average\_a\_b.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig21/average_a_b.png)

如果 `average` 函数修改了 `a`，main 里的 `x` 不会变，因为 GRoE 告诉我们，那只是往标着 `a` 的盒子里填入新的比特。

**检验你的理解**

**练习 2.1.1**：假设有下面的代码：

```java
public class PassByValueFigure {
    public static void main(String[] args) {
           Walrus walrus = new Walrus(3500, 10.5);
           int x = 9;

           doStuff(walrus, x);
           System.out.println(walrus);
           System.out.println(x);
    }

    public static void doStuff(Walrus W, int x) {
           W.weight = W.weight - 100;
           x = x - 5;
    }
}
```

调用 `doStuff` 会影响 walrus 和（或）x 吗？提示：只需要知道 GRoE 就能解这道题。

### 数组的实例化

上面提到过，存放数组的变量和其他引用变量一样，也是引用变量。例如，看下面的声明：

```java
int[] x;
Planet[] planets;
```

这两个声明都创建 64 比特的内存盒子。`x` 只能存放 `int` 数组的地址，`planets` 只能存放 `Planet` 数组的地址。

实例化数组和实例化对象非常相似。例如，像下面这样创建一个大小为 5 的整数数组：

```
x = new int[]{0, 1, 2, 95, 4};
```

`new` 关键字会创建 5 个各 32 比特的盒子，并返回整个对象的地址，赋给 x。

如果丢掉了对应地址的那些比特，对象就可能丢失。例如，如果某只 Walrus 的地址唯一的一份拷贝存在 `x` 里，那么 `x = null` 就会让你永久失去这只 Walrus。这不一定是坏事，因为你常常会决定不再需要某个对象，这时直接扔掉引用是安全的。本章后面构建列表时会看到这一点。

**破蒲团定律**

你可能会问，为什么要花这么多时间和篇幅讲一件看起来微不足道的事。如果你以前有 Java 经验，大概尤其会这样想。原因是，学生很容易对这个问题一知半解：能写出代码，却并不真正明白发生了什么。

短期内这也许没问题，但长远来看，不求甚解地做题，可能注定让你日后失败。有一篇关于这条所谓 [破蒲团定律](https://mathwithbaddrawings.com/2015/04/08/the-math-ceiling-wheres-your-cognitive-breaking-point/)（Law of the Broken Futon）的博客文章，你也许会觉得有意思。

### == 与 Arrays.equals

和 = 类似，也可以从比特的角度理解 == 运算符。每当我们写 `x==y`，就是在让 Java 比较内存盒子 `x` 和 `y` 里的原始比特。

例如，假设有代码：

```java
int[] x = new int[]{0, 1, 2, 95, 4};
int[] y = new int[]{0, 1, 2, 95, 4};
System.out.println(x == y); #false
```

这段代码会打印 false，因为 `x` 和 `y` 各自存放的是内存中两个不同数组的 64 比特地址，尽管这两个数组碰巧存放着相同的信息。如果想比较两个数组的内容，可以改用 Arrays.equals，例如：

```java
int[] x = new int[]{0, 1, 2, 95, 4};
int[] y = new int[]{0, 1, 2, 95, 4};
System.out.println(Arrays.equals(x, y)); #true
```

（译注：原文代码里的 `#false`、`#true` 是 Python 风格的注释，在 Java 里应写成 `// false`、`// true`，否则无法编译；这里保留原样，只表示打印结果。）
