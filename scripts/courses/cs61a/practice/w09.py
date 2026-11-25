"""第 7–9 周：对象、属性、继承、表示、组合（链表、Tree 类）、分解、效率。"""
from qhelp import choice, func, text, wwpd

LINK = '''
class Link:
    """A linked list."""
    empty = ()

    def __init__(self, first, rest=empty):
        assert rest is Link.empty or isinstance(rest, Link)
        self.first = first
        self.rest = rest

    def __repr__(self):
        if self.rest is not Link.empty:
            rest_repr = ', ' + repr(self.rest)
        else:
            rest_repr = ''
        return 'Link(' + repr(self.first) + rest_repr + ')'

    def __str__(self):
        string = '('
        while self.rest is not Link.empty:
            string += str(self.first) + ' '
            self = self.rest
        return string + str(self.first) + ')'
'''
LINK_NOTE = "起始代码里已经有课上的 `Link` 类：`s.first` 是第一个元素，`s.rest` 是余下的链表，空链表是 `Link.empty`。"

TREE = '''
class Tree:
    """A tree has a label and a list of branches."""
    def __init__(self, label, branches=[]):
        self.label = label
        for branch in branches:
            assert isinstance(branch, Tree)
        self.branches = list(branches)

    def is_leaf(self):
        return not self.branches

    def __repr__(self):
        if self.branches:
            branch_str = ', ' + repr(self.branches)
        else:
            branch_str = ''
        return 'Tree({0}{1})'.format(repr(self.label), branch_str)

    def __str__(self):
        def print_tree(t, indent=0):
            tree_str = '  ' * indent + str(t.label) + "\\n"
            for b in t.branches:
                tree_str += print_tree(b, indent + 1)
            return tree_str
        return print_tree(self).rstrip()
'''
TREE_NOTE = "起始代码里已经有课上的 `Tree` 类：`t.label` 是标签，`t.branches` 是分支列表（可以直接修改），`t.is_leaf()` 判断是否为叶子。"

ACCOUNT = '''
class Account:
    """An account has a balance and a holder."""
    max_withdrawal = 10
    interest = 0.02

    def __init__(self, account_holder):
        self.balance = 0
        self.holder = account_holder

    def deposit(self, amount):
        self.balance = self.balance + amount
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            return "Insufficient funds"
        if amount > self.max_withdrawal:
            return "Can't withdraw that amount"
        self.balance = self.balance - amount
        return self.balance
'''
TRANSACTION = '''
class Transaction:
    def __init__(self, id, before, after):
        self.id = id
        self.before = before
        self.after = after

    def changed(self):
        """Return whether the transaction resulted in a changed balance."""
        return self.before != self.after

    def report(self):
        """Return a string describing the transaction.

        >>> Transaction(3, 20, 10).report()
        '3: decreased 20->10'
        >>> Transaction(5, 50, 50).report()
        '5: no change'
        """
        msg = 'no change'
        if self.changed():
            if self.after < self.before:
                verb = 'decreased'
            else:
                verb = 'increased'
            msg = verb + ' ' + str(self.before) + '->' + str(self.after)
        return str(self.id) + ': ' + msg
'''
COINS = '''
class Mint:
    """A mint creates coins by stamping on years."""
    present_year = 2025

    def __init__(self):
        self.update()

    def create(self, coin):
        return coin(self.year)

    def update(self):
        self.year = Mint.present_year

class Coin:
    cents = None # will be provided by subclasses, but not by Coin itself

    def __init__(self, year):
        self.year = year

    def worth(self):
        return self.cents + max(0, Mint.present_year - self.year - 50)

class Nickel(Coin):
    cents = 5

class Dime(Coin):
    cents = 10
'''
D = lambda s: s.replace("\n             ", "\n")
LAB7I = "改编自官方实验 7 的 Q1「WWPD: Inheritance ABCs」。"
LAB7L = "改编自官方实验 7 的 Q4「WWPD: Linked Lists」。"
ABC = ">>> class A:\n...   x, y = 0, 0\n...   def __init__(self):\n...         return\n>>> class B(A):\n...   def __init__(self):\n...         return\n>>> class C(A):\n...   def __init__(self):\n...         return"

PRACTICE = {
    "lec18": [
        wwpd("coin-1", "class Coin:\n    cents = None\n    def __init__(self, year):\n        self.year = year\n\nclass Nickel(Coin):\n    cents = 5\n\n>>> c = Nickel(1990)", "c.year", "1990",
             "Nickel 没有定义 __init__，于是使用父类 Coin 的 __init__，给实例设置了 year 属性。", "改编自官方实验 6 的「Inheritance」示例。"),
        choice("self", "改编自官方实验 6 的 Q1「Bank Account」。\n\n```py\nclass BankAccount:\n    def __init__(self, account_holder):\n        self.balance = 0\n        self.holder = account_holder\n\n    def deposit(self, amount):\n        self.balance = self.balance + amount\n        return self.balance\n\na = BankAccount('Eric')\nb = BankAccount('Erica')\na.deposit(100)\n```\n\n执行完之后，`a.balance` 和 `b.balance` 分别是多少？",
               ["100 和 0", "100 和 100", "0 和 0", "报错"], 0, "每个实例有自己的实例属性 balance；a.deposit(100) 调用时 self 绑定到 a，只修改 a 的余额。"),
    ],
    "lab06": [
        func("bank-account", "Bank Account", "改编自官方实验 6 的 Q1。\n\n"
             "起始代码里的 `Transaction` 类记录一次交易：编号 `id`、交易前余额 `before`、交易后余额 `after`，`report()` 返回交易的文字描述。\n\n"
             "修改 `BankAccount` 类，给它加上 `transactions` 属性：一个列表，按顺序记录这个账户的每一次交易。每次调用 `deposit` 或 `withdraw` 都要新建一个 `Transaction` 加进去，**取款失败也要记录**（这时余额没有变化）。每个账户的交易编号从 0 开始。",
             TRANSACTION + '''
class BankAccount:
    """A bank account that tracks its transaction history.

    >>> a = BankAccount('Eric')
    >>> a.deposit(100)    # Transaction 0 for a
    100
    >>> a.withdraw(30)    # Transaction 1 for a
    70
    >>> a.withdraw(100)   # Transaction 2 for a
    'Insufficient funds'
    >>> for t in a.transactions:
    ...     print(t.report())
    0: increased 0->100
    1: decreased 100->70
    2: no change
    """

    # *** YOU NEED TO MAKE CHANGES IN SEVERAL PLACES IN THIS CLASS ***

    def __init__(self, account_holder):
        self.balance = 0
        self.holder = account_holder

    def deposit(self, amount):
        """Increase the account balance by amount, add the deposit
        to the transaction history, and return the new balance.
        """
        self.balance = self.balance + amount
        return self.balance

    def withdraw(self, amount):
        """Decrease the account balance by amount, add the withdraw
        to the transaction history, and return the new balance.
        """
        if amount > self.balance:
            return 'Insufficient funds'
        self.balance = self.balance - amount
        return self.balance
''',
             TRANSACTION + '''
class BankAccount:
    def __init__(self, account_holder):
        self.balance = 0
        self.holder = account_holder
        self.transactions = []

    def next_id(self):
        return len(self.transactions)

    def deposit(self, amount):
        self.transactions.append(Transaction(self.next_id(), self.balance, self.balance + amount))
        self.balance = self.balance + amount
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            self.transactions.append(Transaction(self.next_id(), self.balance, self.balance))
            return 'Insufficient funds'
        self.transactions.append(Transaction(self.next_id(), self.balance, self.balance - amount))
        self.balance = self.balance - amount
        return self.balance
''',
             [("官方示例", ["a = BankAccount('Eric')", "a.deposit(100)", "b = BankAccount('Erica')", "a.withdraw(30)", "a.deposit(10)", "b.deposit(50)", "b.withdraw(10)", "a.withdraw(100)",
                         "len(a.transactions)", "len([t for t in a.transactions if t.changed()])", "[t.report() for t in a.transactions]", "b.withdraw(100)", "b.withdraw(30)", "[t.report() for t in b.transactions]"])]),
        func("email", "Email", "改编自官方实验 6 的 Q2。\n\n"
             "电子邮件系统有三个类：`Email`、`Server`、`Client`。`Client` 用 `compose` 写一封邮件交给 `Server`，`Server` 再把它放进收件人的 `inbox`（收件箱列表）。\n\n"
             "- `Server` 有一个实例属性 `clients`：从客户端名字到 `Client` 实例的字典。实现 `register_client(client)`（登记客户端，同名的新客户端覆盖旧的）和 `send(email)`（把邮件放进收件人的收件箱）。\n"
             "- `Client` 创建时要向服务器登记自己。实现 `compose(message, recipient_name)`：新建一封 `Email` 并通过服务器发送。",
             '''
             class Email:
                 """An email has the following instance attributes:

                     msg (str): the contents of the message
                     sender (Client): the client that sent the email
                     recipient_name (str): the name of the recipient (another client)
                 """
                 def __init__(self, msg, sender, recipient_name):
                     self.msg = msg
                     self.sender = sender
                     self.recipient_name = recipient_name

             class Server:
                 """Each Server has one instance attribute called clients that is a
                 dictionary from client names to client objects.
                 """
                 def __init__(self):
                     self.clients = {}

                 def send(self, email):
                     """Append the email to the inbox of the client it is addressed to."""
                     ____.inbox.append(email)

                 def register_client(self, client):
                     """Add a client to the clients mapping."""
                     ____[____] = ____

             class Client:
                 """A client has a server, a name (str), and an inbox (list).

                 >>> s = Server()
                 >>> a = Client(s, 'Alice')
                 >>> b = Client(s, 'Bob')
                 >>> a.compose('Hello, World!', 'Bob')
                 >>> b.inbox[0].msg
                 'Hello, World!'
                 """
                 def __init__(self, server, name):
                     self.inbox = []
                     self.server = server
                     self.name = name
                     server.register_client(____)

                 def compose(self, message, recipient_name):
                     """Send an email with the given message to the recipient."""
                     email = Email(message, ____, ____)
                     self.server.send(email)
             ''',
             '''
             class Email:
                 def __init__(self, msg, sender, recipient_name):
                     self.msg = msg
                     self.sender = sender
                     self.recipient_name = recipient_name

             class Server:
                 def __init__(self):
                     self.clients = {}

                 def send(self, email):
                     self.clients[email.recipient_name].inbox.append(email)

                 def register_client(self, client):
                     self.clients[client.name] = client

             class Client:
                 def __init__(self, server, name):
                     self.inbox = []
                     self.server = server
                     self.name = name
                     server.register_client(self)

                 def compose(self, message, recipient_name):
                     email = Email(message, self, recipient_name)
                     self.server.send(email)
             ''',
             [("Client", ["s = Server()", "a = Client(s, 'Alice')", "b = Client(s, 'Bob')", "a.compose('Hello, World!', 'Bob')", "b.inbox[0].msg", "a.compose('CS 61A Rocks!', 'Bob')", "len(b.inbox)", "b.inbox[1].sender.name"]),
              ("同名覆盖", ["s = Server()", "a = Client(s, 'Alice')", "new_a = Client(s, 'Alice')", "len(s.clients)", "s.clients['Alice'] is new_a", "Client(s, 'Bob').compose('hi', 'Alice')", "len(new_a.inbox)", "len(a.inbox)"])]),
        func("mint", "Mint", "改编自官方实验 6 的 Q3。\n\n"
             "造币厂（`Mint`）给硬币盖上年份。每个 `Mint` 实例有一个年份 `year`；`update` 方法把它设成类属性 `Mint.present_year`；`create(coin)` 用当前的年份造一枚指定种类的硬币（`coin` 是 `Nickel` 或 `Dime` 这样的类）。\n\n"
             "硬币的 `worth()` 等于它的面值 `cents`，再加上它超过 50 年的那部分年数（每多一年加 1 分）。实现 `Mint` 的 `create`、`update`，以及 `Coin` 的 `worth`。",
             '''
             class Mint:
                 """A mint creates coins by stamping on years.

                 >>> mint = Mint()
                 >>> mint.year
                 2025
                 >>> Mint.present_year = 2105  # Time passes
                 >>> nickel = mint.create(Nickel)
                 >>> nickel.year     # The mint has not updated its stamp yet
                 2025
                 >>> nickel.worth()  # 5 cents + (80 - 50 years)
                 35
                 """
                 present_year = 2025

                 def __init__(self):
                     self.update()

                 def create(self, coin):
                     "*** YOUR CODE HERE ***"

                 def update(self):
                     "*** YOUR CODE HERE ***"

             class Coin:
                 cents = None # will be provided by subclasses, but not by Coin itself

                 def __init__(self, year):
                     self.year = year

                 def worth(self):
                     "*** YOUR CODE HERE ***"

             class Nickel(Coin):
                 cents = 5

             class Dime(Coin):
                 cents = 10
             ''',
             COINS,
             [("官方示例", ["mint = Mint()", "mint.year", "dime = mint.create(Dime)", "dime.year", "Mint.present_year = 2105", "nickel = mint.create(Nickel)", "nickel.year", "nickel.worth()",
                         "mint.update()", "Mint.present_year = 2180", "mint.create(Dime).worth()", "Mint().create(Dime).worth()", "dime.worth()", "Dime.cents = 20", "dime.worth()"])]),
        func("virfib", "Next Virahanka Fibonacci Object", "改编自官方实验 6 的 Q4。\n\n"
             "`VirFib` 实例的 `value` 属性是一个斐波那契数。实现 `next` 方法：返回一个新的 `VirFib`，它的 `value` 是下一个斐波那契数。`next` 只能花常数时间，不能修改 `self`。提示：可以给新实例额外记一个属性，保存前一个数。",
             '''
             class VirFib():
                 """A Virahanka Fibonacci number.

                 >>> start = VirFib()
                 >>> start
                 VirFib object, value 0
                 >>> start.next()
                 VirFib object, value 1
                 >>> start.next().next().next()
                 VirFib object, value 2
                 """
                 def __init__(self, value=0):
                     self.value = value

                 def next(self):
                     "*** YOUR CODE HERE ***"

                 def __repr__(self):
                     return "VirFib object, value " + str(self.value)
             ''',
             '''
             class VirFib():
                 def __init__(self, value=0):
                     self.value = value

                 def next(self):
                     if self.value == 0:
                         result = VirFib(1)
                     else:
                         result = VirFib(self.value + self.previous)
                     result.previous = self.value
                     return result

                 def __repr__(self):
                     return "VirFib object, value " + str(self.value)
             ''',
             [("官方示例", ["start = VirFib()", "start", "start.next()", "start.next().next()", "start.next().next().next()", "start.next().next().next().next()",
                         "start.next().next().next().next().next()", "start.next().next().next().next().next().next()", "start.next().next().next().next().next().next()"])]),
    ],
    "lec19": [
        wwpd("mint-1", COINS.strip() + "\n\n>>> mint = Mint()\n>>> dime = mint.create(Dime)\n>>> Mint.present_year = 2180", "dime.worth()", "115",
             "dime 是 2025 年造的；present_year 是类属性，改了它所有地方都看得到：10 + (2180 - 2025 - 50) = 115。", "改编自官方实验 6 的 Q3「Mint」。"),
        wwpd("mint-2", COINS.strip() + "\n\n>>> mint = Mint()\n>>> dime = mint.create(Dime)\n>>> Mint.present_year = 2180\n>>> Dime.cents = 20", "dime.worth()", "125",
             "dime 自己没有 cents 实例属性，查找时到类 Dime 里找，得到修改后的 20：20 + 105 = 125。", "改编自官方实验 6 的 Q3「Mint」。"),
        wwpd("abc-1", ABC + "\n>>> B.x = 2", "print(A.x, B.x, C.x)", "0 2 0", "给 B.x 赋值是在类 B 里新建了属性 x，不影响 A 和 C。", LAB7I),
        wwpd("abc-2", ABC + "\n>>> B.x = 2\n>>> A.x += 1", "print(A.x, B.x, C.x)", "1 2 1", "A.x 变成 1；C 没有自己的 x，查找到父类 A，得到 1；B 有自己的 x = 2。", LAB7I),
        wwpd("abc-3", ABC + "\n>>> obj = C()\n>>> obj.y = 1", "C.y == obj.y", "False", "obj.y = 1 只给实例 obj 创建了属性，C.y 仍然是从 A 继承来的 0。", LAB7I),
    ],
    "lec20": [
        func("bear", "Bear", "改编自官方讨论课 7 的 Q2。\n\n"
             "起始代码里有 `Eye` 类（`draw()` 睁眼返回 `'0'`，闭眼返回 `'-'`）和 `Bear` 类（`print()` 打印出 `? 0o0?` 这样的熊脸，两只眼睛都由 `next_eye()` 提供）。\n\n"
             "实现两个子类：`SleepyBear` 两只眼睛都闭着；`WinkingBear` 左眼闭、右眼睁。代码要尽量少，不要重复 `Eye` 和 `Bear` 里已有的逻辑——只需要重写 `next_eye`（`WinkingBear` 还需要 `__init__`）。",
             '''
             class Eye:
                 """An eye."""
                 def __init__(self, closed=False):
                     self.closed = closed

                 def draw(self):
                     if self.closed:
                         return '-'
                     else:
                         return '0'

             class Bear:
                 """A bear.

                 >>> Bear().print()
                 ? 0o0?
                 """
                 def __init__(self):
                     self.nose_and_mouth = 'o'

                 def next_eye(self):
                     return Eye()

                 def print(self):
                     left, right = self.next_eye(), self.next_eye()
                     print('? ' + left.draw() + self.nose_and_mouth + right.draw() + '?')

             class SleepyBear(Bear):
                 """A bear with closed eyes.

                 >>> SleepyBear().print()
                 ? -o-?
                 """
                 "*** YOUR CODE HERE ***"

             class WinkingBear(Bear):
                 """A bear whose left eye is different from its right eye.

                 >>> WinkingBear().print()
                 ? -o0?
                 """
                 "*** YOUR CODE HERE ***"
             ''',
             '''
             class Eye:
                 def __init__(self, closed=False):
                     self.closed = closed

                 def draw(self):
                     if self.closed:
                         return '-'
                     else:
                         return '0'

             class Bear:
                 def __init__(self):
                     self.nose_and_mouth = 'o'

                 def next_eye(self):
                     return Eye()

                 def print(self):
                     left, right = self.next_eye(), self.next_eye()
                     print('? ' + left.draw() + self.nose_and_mouth + right.draw() + '?')

             class SleepyBear(Bear):
                 def next_eye(self):
                     return Eye(True)

             class WinkingBear(Bear):
                 def __init__(self):
                     super().__init__()
                     self.eye_calls = 0

                 def next_eye(self):
                     self.eye_calls += 1
                     return Eye(self.eye_calls % 2)
             ''',
             [("三种熊", ["Bear().print()", "SleepyBear().print()", "WinkingBear().print()"]), ("连续两次", ["w = WinkingBear()", "w.print()", "w.print()"])]),
        func("free-checking", "FreeChecking", "改编自官方实验 7 的 Q3。\n\n"
             "起始代码里有课上的 `Account` 类。实现它的子类 `FreeChecking`：前 `free_withdrawals`（2）次取款免费，之后每次取款额外收取 `withdraw_fee`（1）元手续费。**失败的取款也算一次取款**。尽量调用父类的 `withdraw`，不要重复它的逻辑。",
             ACCOUNT + D('''
             class FreeChecking(Account):
                 """A bank account that charges for withdrawals, but the first two are free!

                 >>> ch = FreeChecking('Jack')
                 >>> ch.balance = 20
                 >>> ch.withdraw(100)  # First one's free. Still counts as a free withdrawal even though it was unsuccessful
                 'Insufficient funds'
                 >>> ch.withdraw(3)    # Second withdrawal is also free
                 17
                 >>> ch.withdraw(3)    # Now there is a fee because free_withdrawals is only 2
                 13
                 """
                 withdraw_fee = 1
                 free_withdrawals = 2

                 "*** YOUR CODE HERE ***"
             '''),
             ACCOUNT + D('''
             class FreeChecking(Account):
                 withdraw_fee = 1
                 free_withdrawals = 2

                 def __init__(self, account_holder):
                     super().__init__(account_holder)
                     self.withdrawals = 0

                 def withdraw(self, amount):
                     self.withdrawals += 1
                     fee = 0
                     if self.withdrawals > self.free_withdrawals:
                         fee = self.withdraw_fee
                     return super().withdraw(amount + fee)
             '''),
             [("官方示例", ["ch = FreeChecking('Jack')", "ch.balance = 20", "ch.withdraw(100)", "ch.withdraw(3)", "ch.balance", "ch.withdraw(3)", "ch.withdraw(3)",
                         "ch2 = FreeChecking('John')", "ch2.balance = 10", "ch2.withdraw(3)", "ch.withdraw(3)", "ch.withdraw(5)"])]),
    ],
    "lab07": [
        func("retirement", "Retirement", "改编自官方实验 7 的 Q2。\n\n"
             "给 `Account` 类加上方法 `time_to_retire(amount)`：假定银行每年年底按利率 `interest` 给余额计息，返回余额增长到**至少** `amount` 需要多少年。这个方法不能改变真实的余额。",
             ACCOUNT.rstrip() + D('''

                 def time_to_retire(self, amount):
                     """Return the number of years until balance would grow to amount.

                     >>> a = Account('John')
                     >>> a.deposit(10)
                     10
                     >>> a.time_to_retire(10.25)  # 10 -> 10.2 -> 10.404
                     2
                     """
                     assert self.balance > 0 and amount > 0 and self.interest > 0
                     "*** YOUR CODE HERE ***"
             ''').replace("\n    ", "\n    ").replace("\n                 ", "\n    "),
             ACCOUNT.rstrip() + D('''

                 def time_to_retire(self, amount):
                     future = self.balance
                     years = 0
                     while future < amount:
                         future += self.interest * future
                         years += 1
                     return years
             ''').replace("\n                 ", "\n    "),
             [("官方示例", ["a = Account('John')", "a.deposit(10)", "a.time_to_retire(10.25)", "a.balance", "a.time_to_retire(11)", "a.time_to_retire(100)"])]),
        func("without", "Without One", "改编自官方实验 7 的 Q5。\n\n"
             "实现 `without(s, i)`：返回一个**新的**链表，包含 `s` 中除了下标为 `i` 的元素以外的所有元素（`s.first` 的下标是 0）。如果没有下标 `i`，就保留全部元素。不能修改 `s`。\n\n" + LINK_NOTE,
             LINK + D('''
             def without(s, i):
                 """Return a new linked list like s but without the element at index i.

                 >>> s = Link(3, Link(5, Link(7, Link(9))))
                 >>> without(s, 0)
                 Link(5, Link(7, Link(9)))
                 >>> without(s, 2)
                 Link(3, Link(5, Link(9)))
                 """
             '''),
             LINK + D('''
             def without(s, i):
                 if s is Link.empty:
                     return s
                 if i == 0:
                     return s.rest
                 return Link(s.first, without(s.rest, i-1))
             '''),
             [("官方示例", ["s = Link(3, Link(5, Link(7, Link(9))))", "without(s, 0)", "without(s, 2)", "without(s, 4)", "s"])]),
        func("duplicate-link", "Duplicate Link", "改编自官方实验 7 的 Q6。\n\n"
             "实现 `duplicate_link(s, val)`：**原地修改**链表 `s`，让每个等于 `val` 的元素后面再跟一个 `val`。函数返回 `None`。\n\n" + LINK_NOTE,
             LINK + D('''
             def duplicate_link(s, val):
                 """Mutates s so that each element equal to val is followed by another val.

                 >>> x = Link(5, Link(4, Link(5)))
                 >>> duplicate_link(x, 5)
                 >>> x
                 Link(5, Link(5, Link(4, Link(5, Link(5)))))
                 """
             '''),
             LINK + D('''
             def duplicate_link(s, val):
                 if s is Link.empty:
                     return
                 elif s.first == val:
                     remaining = s.rest
                     s.rest = Link(val, remaining)
                     duplicate_link(remaining, val)
                 else:
                     duplicate_link(s.rest, val)
             '''),
             [("官方示例", ["x = Link(5, Link(4, Link(5)))", "duplicate_link(x, 5)", "x", "y = Link(2, Link(4, Link(6, Link(8))))", "duplicate_link(y, 10)", "y",
                         "z = Link(1, Link(2, Link(2, Link(3))))", "duplicate_link(z, 2)", "z"])]),
    ],
    "disc07": [
        func("keyboard", "Keyboard", "改编自官方讨论课 7 的 Q1。\n\n"
             "键盘上每个字母有一个按钮（`Button`），按下时调用 `output` 函数输出字母；所有按钮共用一个大写锁定键 `Button.caps_lock`，它被按了奇数次时输出大写字母。\n\n"
             "实现 `Button.press`（输出字母并返回按钮本身，以便连续调用）和 `Keyboard`：`Keyboard` 有属性 `typed`（打过的字母列表）和 `keys`（从字母到按钮的字典，每个按钮的 `output` 是 `typed.append`），`type(word)` 依次按下单词里每个字母的按钮。",
             '''
             LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'

             class CapsLock:
                 def __init__(self):
                     self.pressed = 0

                 def press(self):
                     self.pressed += 1

             class Button:
                 """A button on a keyboard.

                 >>> f = lambda c: print(c, end='') # The end='' argument avoids going to new line
                 >>> k, e, y = Button('k', f), Button('e', f), Button('y', f)
                 >>> s = e.press().press().press()
                 eee
                 """
                 caps_lock = CapsLock()

                 def __init__(self, letter, output):
                     assert letter in LOWERCASE_LETTERS
                     self.letter = letter
                     self.output = output
                     self.pressed = 0

                 def press(self):
                     """Call output on letter (maybe uppercased), then return the button that was pressed."""
                     self.pressed += 1
                     "*** YOUR CODE HERE ***"

             class Keyboard:
                 """A keyboard.

                 >>> Button.caps_lock.pressed = 0  # Reset the caps_lock key
                 >>> bored = Keyboard()
                 >>> bored.type('hello')
                 >>> bored.typed
                 ['h', 'e', 'l', 'l', 'o']
                 >>> bored.keys['l'].pressed
                 2
                 """
                 def __init__(self):
                     self.typed = []
                     self.keys = ____  # Try a dictionary comprehension!

                 def type(self, word):
                     """Press the button for each letter in word."""
                     assert all([w in LOWERCASE_LETTERS for w in word]), 'word must be all lowercase'
                     "*** YOUR CODE HERE ***"
             ''',
             '''
             LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'

             class CapsLock:
                 def __init__(self):
                     self.pressed = 0

                 def press(self):
                     self.pressed += 1

             class Button:
                 caps_lock = CapsLock()

                 def __init__(self, letter, output):
                     self.letter = letter
                     self.output = output
                     self.pressed = 0

                 def press(self):
                     self.pressed += 1
                     if self.caps_lock.pressed % 2 == 1:
                         self.output(self.letter.upper())
                     else:
                         self.output(self.letter)
                     return self

             class Keyboard:
                 def __init__(self):
                     self.typed = []
                     self.keys = {c: Button(c, self.typed.append) for c in LOWERCASE_LETTERS}

                 def type(self, word):
                     for w in word:
                         self.keys[w].press()
             ''',
             [("Button", ["Button.caps_lock.pressed = 0", "out = []", "k, e, y, caps = Button('k', out.append), Button('e', out.append), Button('y', out.append), Button.caps_lock",
                          "s = e.press().press().press()", "t = [x.press() for x in [k, e, y, caps, e, e, k, caps, e, y, e, caps, y, e, e]]", "''.join(out)"]),
              ("Keyboard", ["Button.caps_lock.pressed = 0", "bored = Keyboard()", "bored.type('hello')", "bored.typed", "bored.keys['l'].pressed", "Button.caps_lock.press()",
                            "bored.type('hello')", "bored.typed", "bored.keys['l'].pressed"])]),
        func("counter", "Counter", "改编自官方讨论课 7 的 Q3（原题是 2024 年秋季期末考试第 4(a) 题）。\n\n"
             "实现 `Counter` 类：`count` 属性记录在它自己**以及它所有后代**上调用 `inc` 的总次数。后代是用它的 `spawn` 方法创建的计数器，以及后代再 `spawn` 出来的计数器。",
             '''
             class Counter:
                 """Counts how many times inc has been called on itself or any of its spawn.

                 >>> total = Counter()
                 >>> odd, even = total.spawn(), total.spawn()
                 >>> one, three = odd.spawn(), odd.spawn()
                 >>> for c in [one, even, three, even, odd, even]:
                 ...     c.inc()
                 >>> [c.count for c in [one, three, even, odd, total]]
                 [1, 1, 3, 3, 6]
                 """
                 def __init__(self, parent=None):
                     "*** YOUR CODE HERE ***"

                 def inc(self):
                     "*** YOUR CODE HERE ***"

                 def spawn(self):
                     "*** YOUR CODE HERE ***"
             ''',
             '''
             class Counter:
                 def __init__(self, parent=None):
                     self.parent = parent
                     self.count = 0

                 def inc(self):
                     self.count += 1
                     if self.parent is not None:
                         self.parent.inc()

                 def spawn(self):
                     return Counter(self)
             ''',
             [("官方示例", ["total = Counter()", "odd, even = total.spawn(), total.spawn()", "one, three = odd.spawn(), odd.spawn()", "[c.inc() for c in [one, even, three, even, odd, even]]",
                         "[c.count for c in [one, three, even, odd, total]]"])]),
    ],
    "lec21": [
        wwpd("tree-repr", TREE.strip() + "\n\n>>> t = Tree(3, [Tree(1, [Tree(4), Tree(1)]), Tree(5, [Tree(9)])])", "t.branches[1]", "Tree(5, [Tree(9)])",
             "交互式解释器显示的是 repr(t.branches[1])，由 __repr__ 决定，写出的是能重新创建这棵树的表达式。", "改编自官方作业 6 的「Tree Class」说明。"),
        choice("tree-str", "改编自官方作业 6 的「Tree Class」说明。\n\n对上题中的同一棵树 `t = Tree(3, [Tree(1, [Tree(4), Tree(1)]), Tree(5, [Tree(9)])])`，执行 `print(t)` 显示的是什么？",
               ["3\n  1\n    4\n    1\n  5\n    9", "Tree(3, [Tree(1, [Tree(4), Tree(1)]), Tree(5, [Tree(9)])])", "3 1 4 1 5 9", "<Tree object at ...>"], 0,
               "print 使用 str(t)，也就是 __str__ 方法：每个标签占一行，按深度缩进两个空格。"),
    ],
    "lec22": [
        wwpd("link-1", LINK.strip() + "\n\n>>> link = Link(1, Link(2, Link(3)))", "link.rest.first", "2", "link.rest 是从 2 开始的链表。", LAB7L),
        wwpd("link-2", LINK.strip(), "Link(1000, 2000)", "Error", "rest 必须是 Link.empty 或者 Link 实例，__init__ 里的 assert 会失败（AssertionError）。", LAB7L),
        wwpd("link-3", LINK.strip() + "\n\n>>> link = Link(1, Link(2, Link(3)))\n>>> link.rest = link.rest.rest", "link.rest.first", "3", "跳过了原来的第二个节点。", LAB7L),
        wwpd("link-4", LINK.strip() + "\n\n>>> link = Link(1)\n>>> link.rest = link", "link.rest.rest.rest.rest.first", "1", "rest 指回自己，形成了环，无论走多少步都是同一个节点。", LAB7L),
        wwpd("link-5", LINK.strip() + "\n\n>>> link = Link(5, Link(6, Link(7)))", "print(link)", "(5 6 7)", "print 使用 __str__，写成括号里用空格分开的形式。", LAB7L),
    ],
    "disc08": [
        func("strange-loop", "Strange Loop", "改编自官方讨论课 8 的 Q1。\n\n实现 `strange_loop()`：返回一个链表 `s`，使得 `s.rest.first.rest is s` 成立。\n\n" + LINK_NOTE,
             LINK + D('''
             def strange_loop():
                 """Return a Link s for which s.rest.first.rest is s.

                 >>> s = strange_loop()
                 >>> s.rest.first.rest is s
                 True
                 """
             '''),
             LINK + D('''
             def strange_loop():
                 s = Link(1, Link(Link(2)))
                 s.rest.first.rest = s
                 return s
             '''),
             [("检查", ["s = strange_loop()", "s.rest.first.rest is s"])],
             hint="s.rest.first 本身也是一个链表。"),
        func("sum-two-ways", "Sum Two Ways", "改编自官方讨论课 8 的 Q2。\n\n"
             "分别用递归和循环实现 `sum_rec(s, k)` 和 `sum_iter(s, k)`：返回链表 `s` 前 `k` 个元素之和；不足 `k` 个时返回全部元素之和。\n\n" + LINK_NOTE,
             LINK + D('''
             def sum_rec(s, k):
                 """Return the sum of the first k elements in s.

                 >>> a = Link(1, Link(6, Link(8)))
                 >>> sum_rec(a, 2)
                 7
                 """
                 # Use a recursive call to sum_rec; don't call sum_iter

             def sum_iter(s, k):
                 """Return the sum of the first k elements in s.

                 >>> a = Link(1, Link(6, Link(8)))
                 >>> sum_iter(a, 2)
                 7
                 """
                 # Don't call sum_rec or sum_iter
             '''),
             LINK + D('''
             def sum_rec(s, k):
                 if k == 0 or s is Link.empty:
                     return 0
                 return s.first + sum_rec(s.rest, k - 1)

             def sum_iter(s, k):
                 total = 0
                 while k > 0 and s is not Link.empty:
                     total, s, k = total + s.first, s.rest, k - 1
                 return total
             '''),
             [("sum_rec", ["a = Link(1, Link(6, Link(8)))", "sum_rec(a, 2)", "sum_rec(a, 5)", "sum_rec(Link.empty, 1)"]),
              ("sum_iter", ["a = Link(1, Link(6, Link(8)))", "sum_iter(a, 2)", "sum_iter(a, 5)", "sum_iter(Link.empty, 1)"])]),
    ],
    "hw06": [
        func("vending-machine", "Vending Machine", "改编自官方作业 6 的 Q2。\n\n"
             "实现只卖一种商品的自动售货机 `VendingMachine(product, price)`。它的方法返回的提示语必须和下面的示例完全一致：\n\n"
             "- `restock(n)`：补货 `n` 件，返回当前库存。\n- `add_funds(n)`：投币；没有库存时把钱原样退回。\n- `vend()`：出货；没有库存、钱不够、正好、需要找零，四种情况的提示语各不相同。出货后余额清零。\n\n可以用 f 字符串拼接提示语，例如 `f'Current balance: ${self.balance}'`。",
             '''
             class VendingMachine:
                 """A vending machine that vends some product for some price.

                 >>> v = VendingMachine('candy', 10)
                 >>> v.vend()
                 'Nothing left to vend. Please restock.'
                 >>> v.add_funds(15)
                 'Nothing left to vend. Please restock. Here is your $15.'
                 >>> v.restock(2)
                 'Current candy stock: 2'
                 >>> v.vend()
                 'Please add $10 more funds.'
                 >>> v.add_funds(7)
                 'Current balance: $7'
                 >>> v.add_funds(5)
                 'Current balance: $12'
                 >>> v.vend()
                 'Here is your candy and $2 change.'
                 >>> v.add_funds(10)
                 'Current balance: $10'
                 >>> v.vend()
                 'Here is your candy.'
                 """
                 def __init__(self, product, price):
                     """Set the product and its price, as well as other instance attributes."""
                     "*** YOUR CODE HERE ***"
             ''',
             '''
             class VendingMachine:
                 def __init__(self, product, price):
                     self.product = product
                     self.price = price
                     self.stock = 0
                     self.balance = 0

                 def restock(self, n):
                     self.stock += n
                     return f'Current {self.product} stock: {self.stock}'

                 def add_funds(self, n):
                     if self.stock == 0:
                         return f'Nothing left to vend. Please restock. Here is your ${n}.'
                     self.balance += n
                     return f'Current balance: ${self.balance}'

                 def vend(self):
                     if self.stock == 0:
                         return 'Nothing left to vend. Please restock.'
                     difference = self.price - self.balance
                     if difference > 0:
                         return f'Please add ${difference} more funds.'
                     message = f'Here is your {self.product}'
                     if difference != 0:
                         message += f' and ${-difference} change'
                     self.balance = 0
                     self.stock -= 1
                     return message + '.'
             ''',
             [("官方示例 1", ["v = VendingMachine('candy', 10)", "v.vend()", "v.add_funds(15)", "v.restock(2)", "v.vend()", "v.add_funds(7)", "v.vend()", "v.add_funds(5)", "v.vend()",
                           "v.add_funds(10)", "v.vend()", "v.add_funds(15)"]),
              ("官方示例 2", ["w = VendingMachine('soda', 2)", "w.restock(3)", "w.restock(3)", "w.add_funds(2)", "w.vend()"])]),
        func("store-digits", "Store Digits", "改编自官方作业 6 的 Q3。\n\n实现 `store_digits(n)`：返回一个链表，从左到右依次存放正整数 `n` 的各位数字。不能使用 `str`、`reversed` 等字符串函数。\n\n" + LINK_NOTE,
             LINK + D('''
             def store_digits(n):
                 """Stores the digits of a positive number n in a linked list.

                 >>> store_digits(2345)
                 Link(2, Link(3, Link(4, Link(5))))
                 """
             '''),
             LINK + D('''
             def store_digits(n):
                 result = Link.empty
                 while n > 0:
                     result = Link(n % 10, result)
                     n //= 10
                 return result
             '''),
             [("官方示例", ["store_digits(1)", "store_digits(2345)", "store_digits(876)", "store_digits(2450)", "store_digits(20105)"])],
             hint="从最后一位开始，每次把新数字接在链表的最前面。"),
        func("deep-map-mut", "Mutable Mapping", "改编自官方作业 6 的 Q4。\n\n"
             "实现 `deep_map_mut(func, s)`：对链表 `s` 中的每个元素原地调用 `func` 替换；如果某个元素本身是链表，就递归地处理它里面的元素。**不能创建新的 `Link`**，函数不返回值。可以用 `isinstance(x, Link)` 判断。\n\n" + LINK_NOTE,
             LINK + D('''
             def deep_map_mut(func, s):
                 """Mutates a deep link s by replacing each item found with the
                 result of calling func on the item. Does NOT create new Links.

                 >>> link1 = Link(3, Link(Link(4), Link(5, Link(6))))
                 >>> deep_map_mut(lambda x: x * x, link1)
                 >>> print(link1)
                 (9 (16) 25 36)
                 """
             '''),
             LINK + D('''
             def deep_map_mut(func, s):
                 if s is Link.empty:
                     return None
                 elif isinstance(s.first, Link):
                     deep_map_mut(func, s.first)
                 else:
                     s.first = func(s.first)
                 deep_map_mut(func, s.rest)
             '''),
             [("平方", ["link1 = Link(3, Link(Link(4), Link(5, Link(6))))", "deep_map_mut(lambda x: x * x, link1)", "print(link1)"]),
              ("乘二", ["link2 = Link(1, Link(Link(Link(2, Link(3))), Link(4)))", "deep_map_mut(lambda x: x * 2, link2)", "print(link2)"]),
              ("不创建新节点", ["s = Link(1, Link(2))", "second = s.rest", "deep_map_mut(lambda x: x + 1, s)", "s.rest is second", "s"])]),
        func("prune-small", "Prune Small", "改编自官方作业 6 的 Q5。\n\n"
             "实现 `prune_small(t, n)`：**原地修改**树 `t`，对每个分支多于 `n` 个的节点，只保留标签最小的 `n` 个分支。函数不返回值。\n\n" + TREE_NOTE,
             TREE + D('''
             def prune_small(t, n):
                 """Prune the tree mutatively, keeping only the n branches
                 of each node with the smallest labels.

                 >>> t2 = Tree(6, [Tree(3), Tree(4)])
                 >>> prune_small(t2, 1)
                 >>> t2
                 Tree(6, [Tree(3)])
                 """
                 while ___________________:
                     largest = max(_______________, key=____________________)
                     _________________________
                 for __ in _____________:
                     ___________________
             '''),
             TREE + D('''
             def prune_small(t, n):
                 while len(t.branches) > n:
                     largest = max(t.branches, key=lambda x: x.label)
                     t.branches.remove(largest)
                 for b in t.branches:
                     prune_small(b, n)
             '''),
             [("官方示例", ["t1 = Tree(6)", "prune_small(t1, 2)", "t1", "t2 = Tree(6, [Tree(3), Tree(4)])", "prune_small(t2, 1)", "t2",
                         "t3 = Tree(6, [Tree(1), Tree(3, [Tree(1), Tree(2), Tree(3)]), Tree(5, [Tree(3), Tree(4)])])", "prune_small(t3, 2)", "t3"])]),
        func("delete", "Delete", "改编自官方作业 6 的 Q6。\n\n"
             "实现 `delete(t, x)`：删除树 `t` 中根以外所有标签为 `x` 的节点；被删除节点的孩子改挂到离它最近的、没被删除的祖先下面，并保持原来的先后顺序。根节点即使标签是 `x` 也不删。原地修改，不返回值。\n\n" + TREE_NOTE,
             TREE + D('''
             def delete(t, x):
                 """Remove all nodes labeled x below the root within Tree t. When a non-leaf
                 node is deleted, the deleted node's children become children of its parent.

                 >>> t = Tree(1, [Tree(2, [Tree(4, [Tree(2)]), Tree(5)]), Tree(3, [Tree(6), Tree(2)]), Tree(4)])
                 >>> delete(t, 2)
                 >>> t
                 Tree(1, [Tree(4), Tree(5), Tree(3, [Tree(6)]), Tree(4)])
                 """
                 new_branches = []
                 for _________ in ________________:
                     _______________________
                     if b.label == x:
                         __________________________________
                     else:
                         __________________________________
                 t.branches = ___________________
             '''),
             TREE + D('''
             def delete(t, x):
                 new_branches = []
                 for b in t.branches:
                     delete(b, x)
                     if b.label == x:
                         new_branches.extend(b.branches)
                     else:
                         new_branches.append(b)
                 t.branches = new_branches
             '''),
             [("全部删掉", ["t = Tree(3, [Tree(2, [Tree(2), Tree(2)]), Tree(2), Tree(2, [Tree(2, [Tree(2), Tree(2)])])])", "delete(t, 2)", "t"]),
              ("官方示例", ["t = Tree(1, [Tree(2, [Tree(4, [Tree(2)]), Tree(5)]), Tree(3, [Tree(6), Tree(2)]), Tree(4)])", "delete(t, 2)", "t"]),
              ("更多", ["t = Tree(1, [Tree(2, [Tree(4), Tree(5)]), Tree(3, [Tree(6), Tree(2)]), Tree(2, [Tree(6), Tree(2), Tree(7), Tree(8)]), Tree(4)])", "delete(t, 2)", "t"])]),
        func("two-list", "Two List", "改编自官方作业 6 的 Q7。\n\n"
             "实现 `two_list(vals, counts)`：两个列表长度相同。返回一个链表，按顺序把 `vals[i]` 重复 `counts[i]` 次。\n\n" + LINK_NOTE,
             LINK + D('''
             def two_list(vals, counts):
                 """
                 Returns a linked list according to the two lists that were passed in.

                 >>> a = [1, 3]
                 >>> b = [1, 1]
                 >>> two_list(a, b)
                 Link(1, Link(3))
                 >>> a = [1, 3, 2]
                 >>> b = [2, 2, 1]
                 >>> two_list(a, b)
                 Link(1, Link(1, Link(3, Link(3, Link(2)))))
                 """
             '''),
             LINK + D('''
             def two_list(vals, counts):
                 result = Link.empty
                 for i in range(len(vals) - 1, -1, -1):
                     for _ in range(counts[i]):
                         result = Link(vals[i], result)
                 return result
             '''),
             [("官方示例", ["two_list([1, 3], [1, 1])", "two_list([1, 3, 2], [2, 2, 1])", "two_list([1, 3, 2], [3, 1, 1])"])],
             hint="从最后一个元素开始往前，每次把新元素接在链表最前面，会简单很多。"),
    ],
}
