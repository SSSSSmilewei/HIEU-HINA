from cs61a_helpers import *  # tree、Link、Tree 等讨论课默认提供的工具


def iterate_in_order(s, t):
    """For increasing s and t, yields the elements in s and t, in non-decreasing order.

    >>> a = Link(3, Link(4, Link(6, Link(7, Link(9, Link(10))))))
    >>> b = Link(1, Link(3, Link(5, Link(7, Link(8)))))
    >>> t = iterate_in_order(a, b)
    >>> for item in t:
    ...     print(item)
    1
    3
    3
    4
    5
    6
    7
    7
    8
    9
    10
    >>> t = iterate_in_order(Link.empty, b)
    >>> for item in t:
    ...      print(item)
    1
    3
    5
    7
    8
    """
    "*** YOUR CODE HERE ***"
