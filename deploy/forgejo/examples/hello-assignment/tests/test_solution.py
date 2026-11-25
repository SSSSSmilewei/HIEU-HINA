import unittest

from solution import add


class TestAdd(unittest.TestCase):
    def test_positive(self):
        self.assertEqual(add(1, 2), 3)

    def test_negative(self):
        self.assertEqual(add(-4, 1), -3)

    def test_float(self):
        self.assertAlmostEqual(add(0.1, 0.2), 0.3)


if __name__ == "__main__":
    unittest.main()
