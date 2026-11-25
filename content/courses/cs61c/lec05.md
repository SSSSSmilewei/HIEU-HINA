# 第 5 讲：C 的内存管理

英文标题：C Memory Management

> 本页是海纳协会按官方课表整理的中文要点，不是官方讲义的翻译。视频、幻灯片和阅读材料见本页的链接。

## 本讲要点

- 程序的内存分成四个区域：栈（stack）、堆（heap）、静态数据区（data）、代码区（text）。
- 局部变量在栈上，函数返回后自动失效；返回局部变量的地址是错误的。
- `malloc(字节数)` 从堆上申请内存，用完必须调用 `free` 归还；常见写法是 `malloc(n * sizeof(int))`。
- 常见的内存错误：忘记 `free` 造成内存泄漏（memory leak）、释放后继续使用（use after free）、重复释放（double free）、访问越界。
- 用 Valgrind 这样的工具可以检查出大部分内存错误。
