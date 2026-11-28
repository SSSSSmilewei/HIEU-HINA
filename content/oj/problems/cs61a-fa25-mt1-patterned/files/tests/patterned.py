test = {
  'name': 'patterned',
  'points': 4,
  'suites': [
    {
      'type': 'doctest',
      'scored': True,
      'setup': r"""
      >>> from patterned import *
      """,
      'teardown': '',
      'cases': [
        {'code': r"""
        >>> patterned(4123827)
        True
        """, 'hidden': False, 'locked': False},
        {'code': r"""
        >>> patterned(4412123384137)
        True
        """, 'hidden': False, 'locked': False},
        {'code': r"""
        >>> patterned(2468)
        True
        """, 'hidden': False, 'locked': False},
        {'code': r"""
        >>> patterned(1)
        False
        """, 'hidden': False, 'locked': False},
        {'code': r"""
        >>> patterned(8192)
        False
        """, 'hidden': False, 'locked': False},
        {'code': r"""
        >>> patterned(238)
        False
        """, 'hidden': False, 'locked': False},
        {'code': r"""
        >>> patterned(3888)
        False
        """, 'hidden': False, 'locked': False},
        {'code': r"""
        >>> patterned(4321587)
        False
        """, 'hidden': False, 'locked': False},
        {'code': r"""
        >>> patterned(9)
        False
        >>> patterned(28)
        True
        >>> patterned(87)
        True
        >>> patterned(6879)
        False
        """, 'hidden': False, 'locked': False}
      ]
    }
  ]
}
