def patterned(n):
    """Return whether every odd digit of n has a larger even digit somewhere before it.

    >>> patterned(4123827) # 8 is before 7; 4 is before 1 and 3
    True
    >>> patterned(4412123384137)
    True
    >>> patterned(2468)     # No odd digits
    True
    >>> patterned(1)              # No even digits
    False
    >>> patterned(8192)           # 9 does not have a larger even digit before it (or anywhere)
    False
    >>> patterned(238)            # 3 does not have a larger even digit before it (8 comes after)
    False
    >>> patterned(3888)           # 3 does not have a larger even digit before it (8 comes after)
    False
    >>> patterned(4321587)        # 5 does not have a larger even digit before it (8 comes after)
    False
    """
    "*** YOUR CODE HERE ***"
