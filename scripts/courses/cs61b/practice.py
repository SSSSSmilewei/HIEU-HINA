"""CS61B 练手题。键是条目 id（lecNN、discNN、hwNN、projN…），值是题目列表。

题目来源：
- O：改编自官方讨论课 / 考试难度练习的题目（origin = official）。
- 教材每章末尾的官方练习题（Exercises）也算官方题目。
"""
import os, sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from qhelp import choice, text  # noqa: E402

PRACTICE = {
    "lec01": [
        {
         "id": "lec01-println-510",
         "type": "choice",
         "prompt": "在 Java 里运行 `IO.println(5 + \"10\");`，输出是什么？（官方教材第 1 章的思考题）",
         "options": [
          "510",
          "15",
          "5 10",
          "编译错误"
         ],
         "answer": 0,
         "explain": "参数里出现了字符串 `\"10\"`，`+` 在这里按字符串连接处理：先把 5 转成字符串再拼接，结果是 `\"510\"`。题目改编自官方教材第 1 章「入门」的正文和思考题。",
         "origin": "official"
        },
        {
         "id": "lec01-println-15",
         "type": "choice",
         "prompt": "在 Java 里运行 `IO.println(5 + 10);`，输出是什么？",
         "options": [
          "510",
          "15",
          "5 10",
          "编译错误"
         ],
         "answer": 1,
         "explain": "两个操作数都是 `int`，`+` 就是普通的加法，结果是整数 15；字符串连接只在有字符串参与时发生。题目改编自官方教材第 1 章「入门」的正文和思考题。",
         "origin": "review"
        },
        {
         "id": "lec01-static-type",
         "type": "choice",
         "prompt": "关于 Java 的静态类型（static typing），下面哪一句是**错误**的？",
         "options": [
          "变量声明类型之后，类型永远不能改变",
          "类型不相容的表达式会在编译时报错，而不是运行时崩溃",
          "编译器在程序运行之前就检查类型是否相容",
          "静态类型让代码更简短、通用性更强"
         ],
         "answer": 3,
         "explain": "前三个都是静态类型的优点或事实。静态类型的缺点恰恰是代码更冗长、通用性更差。题目改编自官方教材第 1 章「入门」的正文和思考题。",
         "origin": "official"
        },
        {
         "id": "lec01-string-assign",
         "type": "choice",
         "prompt": "下面哪一条语句能通过编译？",
         "options": [
          "`String h = 5 + \"horse\";`",
          "`int h = 5 + \"horse\";`",
          "两条都能",
          "两条都不能"
         ],
         "answer": 0,
         "explain": "声明成 `String` 时，Java 把 `+` 解释为字符串连接，结果 `\"5horse\"` 是字符串，类型相容；声明成 `int` 时没法把一个数和一个字符串连接成整数，编译失败。题目改编自官方教材第 1 章「入门」的正文和思考题。",
         "origin": "review"
        },
        {
         "id": "lec01-javac",
         "type": "text",
         "prompt": "在终端里要把 `Hello.java` 变成能运行的程序，第一步用的命令是什么？（只要命令名）",
         "answer": [
          "javac"
         ],
         "explain": "两步流程：先用 `javac Hello.java` 编译成 `.class` 文件，再用 `java Hello` 运行。`.class` 文件已经通过了类型检查，执行也更高效。题目改编自官方教材第 1 章「入门」的正文和思考题。",
         "origin": "review"
        },
    ],
    "lec02": [
        {
         "id": "lec02-instance-method",
         "type": "choice",
         "prompt": "`public class Dog { public int weightInPounds; public void makeNoise() { … } }`。下面哪种说法是对的？",
         "options": [
          "`makeNoise` 是实例方法，必须先实例化一只 `Dog` 再调用",
          "`makeNoise` 是静态方法，可以直接用 `Dog.makeNoise()` 调用",
          "`weightInPounds` 是静态变量，全体 `Dog` 共享一份",
          "实例变量可以在运行时随意添加"
         ],
         "answer": 0,
         "explain": "`makeNoise` 没有 `static` 关键字，是实例（非静态）方法；`weightInPounds` 也是非静态的实例变量，每个对象各有一份。Java 里实例变量必须在类里声明，不能运行时添加。题目改编自官方教材第 2 章「定义和使用类」的正文。",
         "origin": "review"
        },
        {
         "id": "lec02-weight-20",
         "type": "choice",
         "prompt": "教材里的 `Dog`：体重小于 10 打印 `yipyipyip!`，小于 30 打印 `bark. bark.`，否则打印 `woof!`。运行 `Dog d = new Dog(20); d.makeNoise();` 输出什么？",
         "options": [
          "yipyipyip!",
          "bark. bark.",
          "woof!",
          "编译错误"
         ],
         "answer": 1,
         "explain": "20 落在「小于 30」的分支，输出 `bark. bark.`。构造函数 `public Dog(int w)` 把 `weightInPounds` 设成 20。题目改编自官方教材第 2 章「定义和使用类」的正文。",
         "origin": "review"
        },
        {
         "id": "lec02-constructor",
         "type": "choice",
         "prompt": "关于 Java 的构造函数，下面哪句是正确的？",
         "options": [
          "构造函数用 `new` 调用，写法上和类同名",
          "构造函数必须声明返回类型 `void`",
          "构造函数和 Python 的 `__repr__` 方法非常相似",
          "每个类最多只能有一个构造函数"
         ],
         "answer": 0,
         "explain": "构造函数和类同名、没有返回类型、用 `new` 调用；教材说它和 Python 的 `__init__` 方法非常相似。一个类可以有多个不同参数的构造函数。题目改编自官方教材第 2 章「定义和使用类」的正文。",
         "origin": "review"
        },
        {
         "id": "lec02-client",
         "type": "text",
         "prompt": "使用另一个类的类，教材里叫作那个类的什么？（一个词，中文或英文均可）",
         "answer": [
          "客户端",
          "client"
         ],
         "explain": "`DogLauncher` 使用 `Dog` 类，就称为 `Dog` 的客户端（client）。题目改编自官方教材第 2 章「定义和使用类」的正文。",
         "origin": "review"
        },
    ],
}
