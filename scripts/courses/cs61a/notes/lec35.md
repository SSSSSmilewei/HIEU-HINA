# 第 35 讲：数据库

> 本页讲义由海纳协会依据官方幻灯片「Databases」整理，不是官方讲义的翻译。教材 Composing Programs 4.3 节讲的是 SELECT 查询，没有覆盖本讲的建表、修改表和 Python 访问数据库。

## 热身：两种写法找「翻拍片」

表 `titles(title, year)` 里有电影名和上映年份。找出同名、在不同年份上映过的电影（翻拍片），列出片名、较早的年份和较晚的年份。

**写法一：表与自己连接。**

```sql
SELECT old.title, old.year AS first, new.year AS second
  FROM titles AS old JOIN titles AS new
    ON old.title = new.title AND old.year < new.year;
```

**写法二：聚合，不用连接。**

```sql
SELECT title, MIN(year) AS first, MAX(year) AS second
  FROM titles
  GROUP BY title
  HAVING COUNT(*) > 1;
```

回顾 SELECT 各子句的作用：`FROM` 给出输入的行，`GROUP BY` 把行分组、形成输出的行，`HAVING` 决定哪些输出行保留，`SELECT` 决定每个输出行包含哪些值（以及列名）。

## 建表与删表

```sql
CREATE TABLE numbers (n, note);
CREATE TABLE numbers (n UNIQUE, note);   -- UNIQUE：这一列的值不能重复
DROP TABLE numbers;                      -- 删除整张表
```

`CREATE TABLE` 后面可以给每一列写约束（constraint），例如 `UNIQUE`、`PRIMARY KEY`、默认值等。

## 修改表

```sql
INSERT INTO t VALUES (value0, value1);          -- 插入一行（t 有两列）
INSERT INTO t (column1) VALUES (value1);         -- 只给指定的列赋值
UPDATE t SET column = expression WHERE condition; -- 修改满足条件的行
DELETE FROM t WHERE condition;                   -- 删除满足条件的行
```

`UPDATE` 把满足条件的那些行的某些列设成新值；`DELETE` 删除一部分或全部的行。`WHERE` 省略时，作用于整张表的每一行——这在实际使用中要特别小心。

## 在 Python 里使用 SQLite

Python 自带 `sqlite3` 模块：

```py
import sqlite3
db = sqlite3.Connection('number.db')
db.execute('CREATE TABLE nums (first INT, second INT);')
db.execute('INSERT INTO nums VALUES (?, ?), (?, ?);', range(6, 10))
print(db.execute('SELECT * FROM nums;').fetchall())   # [(6, 7), (8, 9)]
db.commit()
```

`?` 是占位符，参数单独传给数据库；`commit()` 把修改真正写进文件。

## SQL 注入攻击

下面的程序很危险：

```py
name = "Robert'); DROP TABLE Students; --"
cmd = "INSERT INTO Students VALUES ('" + name + "');"
db.executescript(cmd)
```

拼接之后，数据库收到的字符串是：

```sql
INSERT INTO Students VALUES ('Robert'); DROP TABLE Students; --');
```

用户输入的内容被当成了 SQL 代码执行，整张学生表被删掉了（著名的 xkcd 漫画 327 号就是讲这个）。

正确的做法是使用占位符：

```py
db.execute("INSERT INTO Students VALUES (?)", [name])
```

SQLite 先根据 SQL 语句做好执行计划，再单独接收参数。参数无论写成什么，都只会被当作数据，不会被当作代码执行。

## 小结

- `CREATE TABLE`、`DROP TABLE` 建表、删表；`INSERT`、`UPDATE`、`DELETE` 修改表中的数据。
- Python 用 `sqlite3` 访问数据库，参数一律用占位符 `?` 传递。
- 永远不要把用户输入直接拼进 SQL 字符串。
