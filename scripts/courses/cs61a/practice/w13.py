"""第 13–15 周：SQL、表、聚合、数据库、设计函数、总结。SQL 题在浏览器里用 sql.js 判：学员的查询结果与参考答案的结果比较。"""
from qhelp import choice, sql

BIG_GAME = """CREATE TABLE big_game (berkeley INTEGER, stanford INTEGER, year INTEGER);
INSERT INTO big_game (berkeley, stanford, year) VALUES (30, 7, 2002), (28, 16, 2003), (17, 38, 2014);
"""
COACHES = BIG_GAME + """CREATE TABLE coaches (name TEXT, start INTEGER, end INTEGER);
INSERT INTO coaches (name, start, end) VALUES ('Jeff Tedford', 2002, 2012), ('Sonny Dykes', 2013, 2016), ('Justin Wilcox', 2017, 2025);
"""
FLIGHTS = """CREATE TABLE flights (departure TEXT, arrival TEXT, price INTEGER);
INSERT INTO flights (departure, arrival, price) VALUES
  ('SFO', 'LAX', 97), ('SFO', 'AUH', 848), ('LAX', 'SLC', 115), ('SFO', 'PDX', 192), ('AUH', 'SEA', 932), ('SLC', 'PDX', 79), ('SFO', 'LAS', 40),
  ('SLC', 'LAX', 117), ('SEA', 'PDX', 32), ('SLC', 'SEA', 42), ('SFO', 'SLC', 97), ('LAS', 'SLC', 50), ('LAX', 'PDX', 89);
"""
PIZZA = """CREATE TABLE pizzas (name TEXT, open INTEGER, close INTEGER);
INSERT INTO pizzas VALUES ('Artichoke', 12, 15), ('La Val''s', 11, 22), ('Sliver', 11, 20), ('Cheeseboard', 16, 23), ('Emilia''s', 13, 18);
CREATE TABLE meals (meal TEXT, time INTEGER);
INSERT INTO meals VALUES ('breakfast', 11), ('lunch', 13), ('dinner', 19), ('snack', 22);
"""
SEATS = """CREATE TABLE finals (hall TEXT, course TEXT);
INSERT INTO finals VALUES ('RSF', '61A'), ('Wheeler', '61A'), ('Pimentel', '61A'), ('Li Ka Shing', '61A'), ('RSF', '61B'), ('Wheeler', '61B'), ('Morgan', '61B'),
  ('Wheeler', '61C'), ('Pimentel', '61C'), ('Soda 306', '10'), ('RSF', '70');
CREATE TABLE sizes (room TEXT, seats INTEGER);
INSERT INTO sizes VALUES ('RSF', 900), ('Wheeler', 700), ('Pimentel', 500), ('Li Ka Shing', 300), ('Morgan', 100), ('Soda 306', 80), ('Soda 310', 40), ('Soda 320', 30);
"""
DOGS = """CREATE TABLE parents (parent TEXT, child TEXT);
INSERT INTO parents VALUES ('ace', 'bella'), ('ace', 'charlie'), ('daisy', 'hank'), ('finn', 'ace'), ('finn', 'daisy'), ('finn', 'ginger'), ('ellie', 'finn');
CREATE TABLE dogs (name TEXT, fur TEXT, height INTEGER);
INSERT INTO dogs VALUES ('ace', 'long', 26), ('bella', 'short', 52), ('charlie', 'long', 47), ('daisy', 'long', 46), ('ellie', 'short', 35), ('finn', 'curly', 32), ('ginger', 'short', 28), ('hank', 'curly', 31);
CREATE TABLE sizes (size TEXT, min INTEGER, max INTEGER);
INSERT INTO sizes VALUES ('toy', 24, 28), ('mini', 28, 35), ('medium', 35, 45), ('standard', 45, 60);
"""
LAB11 = "改编自官方实验 11 的 SQL 入门说明。"
BG = "表 `big_game(berkeley, stanford, year)` 记录伯克利与斯坦福每年「大赛」的比分：两队的得分和年份。"
FL = "表 `flights(departure, arrival, price)` 记录航班的出发机场、到达机场和票价。"
PZ = "表 `pizzas(name, open, close)` 是披萨店的名字、开门和关门的时刻（整点，24 小时制）；表 `meals(meal, time)` 是各顿饭的名字和时刻。"
DG = ("三张表：`parents(parent, child)` 每行是一对亲子关系；`dogs(name, fur, height)` 是每只狗的名字、毛型和身高；"
      "`sizes(size, min, max)` 是体型分类，身高大于 `min` 且不超过 `max` 就属于这个体型。")

PRACTICE = {
    "lec32": [
        sql("berkeley-after-2002", "筛选行", LAB11 + "\n\n" + BG + "\n\n写一条查询，列出 2002 年以后（不含 2002 年）每场比赛伯克利的得分（一列 `berkeley`）。", BIG_GAME,
            "SELECT berkeley FROM big_game WHERE year > 2002"),
        sql("berkeley-won", "比较两列", LAB11 + "\n\n" + BG + "\n\n写一条查询，列出伯克利获胜的比赛中两队的得分（两列：`berkeley`、`stanford`）。", BIG_GAME,
            "SELECT berkeley, stanford FROM big_game WHERE berkeley > stanford"),
    ],
    "lec33": [
        sql("game-coach", "连接两张表", LAB11 + "\n\n" + BG + "表 `coaches(name, start, end)` 是伯克利历任主教练和任期的起止年份。\n\n写一条查询，列出每场比赛的年份和当年伯克利主教练的名字（两列：`year`、`name`），按年份从小到大排列。",
            COACHES, "SELECT year, name FROM big_game JOIN coaches ON year >= start AND year <= end ORDER BY year", ordered=True,
            hint="连接两张表时，用 ON 或 WHERE 写出「比赛年份落在任期之内」的条件。"),
        sql("game-diff", "表和自己连接", LAB11 + "\n\n" + BG + "\n\n把 `big_game` 和它自己连接，对每一对「较早的比赛 a、较晚的比赛 b」，列出伯克利得分的变化 `b.berkeley - a.berkeley`、斯坦福得分的变化 `b.stanford - a.stanford`，以及 `a.year`、`b.year`（四列）。",
            BIG_GAME, "SELECT b.berkeley - a.berkeley, b.stanford - a.stanford, a.year, b.year FROM big_game AS a, big_game AS b WHERE a.year < b.year",
            hint="同一张表连接两次时，要用 AS 起两个别名。"),
    ],
    "lec34": [
        sql("min-price", "分组聚合", LAB11 + "\n\n" + FL + "\n\n写一条查询，对每个出发机场，列出从它出发的最便宜票价（两列：`departure` 和最低票价）。", FLIGHTS,
            "SELECT departure, MIN(price) FROM flights GROUP BY departure"),
        sql("busy-airports", "筛选分组", LAB11 + "\n\n" + FL + "\n\n写一条查询，列出至少有 2 个航班从这里出发的机场（一列 `departure`）。", FLIGHTS,
            "SELECT departure FROM flights GROUP BY departure HAVING COUNT(*) >= 2", hint="WHERE 筛选的是行，HAVING 筛选的是分组。"),
        sql("count-distinct", "去重计数", LAB11 + "\n\n" + FL + "\n\n写一条查询，求一共有多少个不同的出发机场（一行一列）。", FLIGHTS, "SELECT COUNT(DISTINCT departure) FROM flights"),
    ],
    "lec35": [
        choice("injection", "据第 35 讲「数据库」。\n\n用 Python 的 `sqlite3` 执行 SQL 时，下面哪种写法可以防止 SQL 注入？",
               ["`db.execute('SELECT * FROM users WHERE name = ?', [name])`", "`db.execute('SELECT * FROM users WHERE name = \"' + name + '\"')`", "`db.execute(f'SELECT * FROM users WHERE name = \"{name}\"')`", "`db.execute('SELECT * FROM users WHERE name = %s' % name)`"], 0,
               "用占位符 ? 传参数，数据库会把 name 当作数据而不是 SQL 代码；把用户输入直接拼进字符串，就可能被构造成恶意的 SQL。", origin="review"),
        choice("insert", "据第 35 讲「数据库」。\n\n向已有的表 `dogs(name, fur, height)` 加入一行数据，应该用哪条语句？",
               ["`INSERT INTO dogs VALUES ('fido', 'short', 30);`", "`CREATE TABLE dogs AS SELECT 'fido', 'short', 30;`", "`SELECT 'fido', 'short', 30 FROM dogs;`", "`UPDATE dogs SET name = 'fido';`"], 0,
               "INSERT INTO 加入新行；CREATE TABLE 会新建表；UPDATE 修改已有的行。", origin="review"),
    ],
    "lab11": [
        sql("flights-cheap", "按条件筛选并排序", LAB11 + "\n\n" + FL + "\n\n写一条查询，列出票价不超过 100 的所有航班的出发机场、到达机场和票价（三列），按票价从低到高排列；票价相同的再按出发机场的字母顺序排列。",
            FLIGHTS, "SELECT departure, arrival, price FROM flights WHERE price <= 100 ORDER BY price, departure", ordered=True),
        sql("two-hop", "两段联程", LAB11 + "\n\n" + FL + "\n\n写一条查询，列出所有从 SFO 出发、转机一次到达 PDX 的方案：第一段的到达机场（中转机场）和两段票价之和（两列），按总价从低到高排列。",
            FLIGHTS, "SELECT a.arrival, a.price + b.price AS total FROM flights AS a, flights AS b WHERE a.departure = 'SFO' AND a.arrival = b.departure AND b.arrival = 'PDX' ORDER BY total", ordered=True,
            hint="把 flights 表和它自己连接：第一段的到达机场等于第二段的出发机场。"),
    ],
    "disc12": [
        sql("open-early", "Open Early", "改编自官方讨论课 12 的 Q1。\n\n" + PZ + "\n\n写一条查询，列出 13 点之前开门的披萨店的名字（一列），按名字的字母**倒序**排列。",
            PIZZA, "SELECT name FROM pizzas WHERE open < 13 ORDER BY name DESC", ordered=True),
        sql("study-session", "Study Session", "改编自官方讨论课 12 的 Q2。\n\n" + PZ + "\n\n你打算在 14 点之前去披萨店学习。写一条查询，列出每家店的名字和你能在店里学习多少小时（开门时刻到 14 点之间的时长；14 点或之后才开门的店是 0），按时长从长到短排列；时长相同的按名字排列。",
            PIZZA, "SELECT name, MAX(14 - open, 0) AS duration FROM pizzas ORDER BY duration DESC, name", ordered=True,
            hint="SQLite 的 MAX 可以接收多个参数，返回其中最大的。"),
        sql("late-night", "Late Night Snack", "改编自官方讨论课 12 的 Q3。\n\n" + PZ + "\n\n写一条查询，对每家在宵夜（snack）时刻还开着门的店，输出一个字符串（一列），格式如 `La Val's closes at 22`。",
            PIZZA, "SELECT name || ' closes at ' || close FROM pizzas, meals WHERE meal = 'snack' AND time <= close",
            hint="用 || 拼接字符串。"),
        sql("double-pizza", "Double Pizza", "改编自官方讨论课 12 的 Q4。\n\n" + PZ + "\n\n如果一家店在两顿相隔超过 6 小时的饭的时刻都开着门，你就可以在这家店吃两顿。写一条查询，列出所有这样的组合：较早的那顿饭、较晚的那顿饭、店名（三列）。",
            PIZZA, "SELECT a.meal, b.meal, name FROM meals AS a, meals AS b, pizzas WHERE b.time > a.time + 6 AND open <= a.time AND a.time <= close AND open <= b.time AND b.time <= close"),
        sql("total-seats", "Total Seats", "改编自官方讨论课 12 的 Q5。\n\n表 `finals(hall, course)` 记录每门课的期末考试用了哪些考场；表 `sizes(room, seats)` 是每个考场的座位数。\n\n写一条查询，对使用了**不止一个**考场的课程，列出课程名和它所有考场的座位总数（两列）。",
            SEATS, "SELECT course, SUM(seats) FROM finals, sizes WHERE hall = room GROUP BY course HAVING COUNT(*) > 1"),
    ],
    "hw10": [
        sql("by-parent-height", "By Parent Height", "改编自官方作业 10 的 Q1。\n\n" + DG + "\n\n写一条查询，列出所有有父母记录的狗的名字（一列），按父母的身高从高到低排列；父母身高相同的，按自己的名字排列。",
            DOGS, "SELECT child FROM parents, dogs WHERE name = parent ORDER BY height DESC, child", ordered=True),
        sql("size-of-dogs", "Size of Dogs", "改编自官方作业 10 的 Q2。\n\n" + DG + "\n\n写一条查询，列出每只狗的名字和它的体型（两列）。",
            DOGS, "SELECT name, size FROM dogs, sizes WHERE height > min AND height <= max"),
        sql("sentences", "Sentences", "改编自官方作业 10 的 Q3。\n\n" + DG + "\n\n两只狗有共同的父母就是兄弟姐妹。写一条查询，对每一对**体型相同**的兄弟姐妹，输出一句话（一列），格式如 `The two siblings, bella and charlie, have the same size: standard`，两只狗按名字的字母顺序排列，每对只出现一次。",
            DOGS, "SELECT 'The two siblings, ' || a.child || ' and ' || b.child || ', have the same size: ' || sa.size FROM parents AS a, parents AS b, dogs AS da, dogs AS db, sizes AS sa, sizes AS sb "
                  "WHERE a.parent = b.parent AND a.child < b.child AND da.name = a.child AND db.name = b.child AND da.height > sa.min AND da.height <= sa.max AND db.height > sb.min AND db.height <= sb.max AND sa.size = sb.size",
            hint="官方的做法是先建两张中间表：兄弟姐妹表 siblings 和体型表 size_of_dogs，再把它们连接起来。在一条查询里，可以把这几张表各连接两次，用不同的别名区分。"),
        sql("low-variance", "Low Variance", "改编自官方作业 10 的 Q4。\n\n" + DG + "\n\n按毛型分组，找出身高都在这组平均身高的 70% 到 130% 之间的毛型。写一条查询，列出这些毛型和这组身高的极差（最高减最低），两列。",
            DOGS, "SELECT fur, MAX(height) - MIN(height) FROM dogs GROUP BY fur HAVING MIN(height) >= 0.7 * AVG(height) AND MAX(height) <= 1.3 * AVG(height)"),
    ],
    "lec37": [
        choice("memoize", "据第 37 讲「设计函数」（课堂上演示了记忆化）。\n\n```py\ndef memo(f):\n    cache = {}\n    def memoized(n):\n        if n not in cache:\n            cache[n] = f(n)\n        return cache[n]\n    return memoized\n```\n\n这个记忆化函数适合用在下面哪种函数上？",
               ["相同参数总是返回相同结果、没有副作用的函数，例如 fib", "每次调用都要打印一行日志的函数", "返回当前时间的函数", "随机生成数字的函数"], 0, "缓存的前提是结果只取决于参数；有副作用或结果会变的函数，缓存后行为就变了。", origin="review"),
    ],
    "lec38": [
        choice("cs61", "第 38 讲「总结」。\n\nCS61 系列在 CS61A 之后的两门课分别是？",
               ["CS61B（数据结构）和 CS61C（计算机体系结构）", "CS70 和 CS188", "CS10 和 CS50", "CS161 和 CS162"], 0, "本站也收录了这两门课。", origin="review"),
    ],
}
