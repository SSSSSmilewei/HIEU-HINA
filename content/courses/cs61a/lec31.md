# 第 31 讲：宏

> 本页讲义由海纳协会依据官方幻灯片「Macros」整理，不是官方讲义的翻译。教材 Composing Programs 没有讲宏的小节。

## 准引用

引用一个表达式有两种方式：

- 引号（quote）：`'(a b)` 得到 `(a b)`
- 准引用（quasiquote）：`` `(a b) `` 也得到 `(a b)`

区别在于，准引用的表达式里可以用逗号 `,` **取消引用**（unquote），让其中一部分被求值：

```scheme
(define b 4)
`(a ,(+ b 1))    ; 得到 (a 5)
```

准引用特别适合生成 Scheme 表达式：

```scheme
(define (make-add-lambda n) `(lambda (d) (+ d ,n)))
(make-add-lambda 2)    ; 得到 (lambda (d) (+ d 2))
```

### 例题：生成阶乘表达式

定义 `fact-expr`：接收整数 `n`，返回一个嵌套的乘法表达式，它的值是 `n` 的阶乘。

```scheme
scm> (fact-expr 5)
(* 5 (* 4 (* 3 (* 2 1))))

(define (fact-expr n)
  (if (<= n 1)
      1
      `(* ,n ,(fact-expr (- n 1)))))
```

`*` 不加逗号，因为我们要的是符号 `*` 本身；`n` 和递归调用要加逗号，因为要的是它们的值。

## 宏：变换源代码

**宏**（macro）是在求值之前对程序源代码做的一种变换。很多语言都有宏，但在 Lisp 这样「程序就是列表」的语言里，宏最容易写对。CS61A 的 Scheme 用特殊形式 `define-macro` 定义宏：

```scheme
(define-macro (twice expr)
  (list 'begin expr expr))

scm> (twice (print 2))   ; 相当于 (begin (print 2) (print 2))
2
2
```

宏调用表达式的求值过程：

1. 对运算符求值，得到一个宏。
2. 用**没有求值的**运算数表达式调用宏的过程。
3. 对宏返回的表达式求值。

如果把 `twice` 写成普通过程，运算数 `(print 2)` 会在调用之前先被求值一次（打印一个 2），过程收到的只是 `print` 的返回值，就没办法再执行两遍了。

练习：定义宏 `second`，使 `(second (+ 5 7))` 的值是 5——宏收到的是表达式 `(+ 5 7)` 本身，它的第二个元素是 5，所以宏体是 `(car (cdr expr))`。

### 例题：重复执行

定义宏 `repeat`：接收数字 `n` 和表达式 `expr`，把 `expr` 求值 `n` 次，结果是最后一次的值。例如 `(repeat (+ 2 2) (print 3))` 等价于 `(begin (print 3) (print 3) (print 3) (print 3))`。

```scheme
; 返回一个包含 n 个 expr 的列表
(define (repeated-expr n expr)
  (if (zero? n) nil (cons expr (repeated-expr (- n 1) expr))))

(define-macro (repeat n expr)
  (cons 'begin (repeated-expr (eval n) expr)))
```

注意宏收到的 `n` 也是没有求值的表达式 `(+ 2 2)`，所以要用 `eval` 求出它的值。

另一种写法是让宏生成一个递归的辅助过程，而不是把 `expr` 复制 `n` 份：

```scheme
(define (repeated-expr n expr)
  `((define (repeater k)
      (if (= k 1) ,expr (begin ,expr (repeater (- k 1)))))
    (repeater ,n)))
```

## 例题：for 宏

定义宏 `for`，对序列里的每个值求一个表达式，返回结果组成的列表：

```scheme
scm> (for x '(2 3 4 5) (* x x))
(4 9 16 25)
```

这等价于 `(map (lambda (x) (* x x)) '(2 3 4 5))`，所以宏只要生成这个 `map` 表达式：

```scheme
(define-macro (for sym vals expr)
  (list 'map (list 'lambda (list sym) expr) vals))

; 用准引用改写
(define-macro (for sym vals expr)
  `(map (lambda (,sym) ,expr) ,vals))
```

进一步想：怎样让 `(for x (2 3 4 5) (* x x))` 不加引号也能用？只要在生成的表达式里给 `vals` 加上引号：`` `(map (lambda (,sym) ,expr) ',vals) ``。

## 小结

- 准引用 `` ` `` 加上取消引用 `,`，可以方便地拼出表达式。
- 宏收到的是没有求值的代码，返回新的代码，再对新代码求值。
- 宏能做到普通过程做不到的事：控制运算数是否求值、求值几次，甚至定义新的语法。
