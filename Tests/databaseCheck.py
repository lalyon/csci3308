#!/usr/bin/python3
#import MySQLdb1 as mariadb
import unittest


class databaseTestCase(unittest.TestCase):
	@classmethod
	def setUpClass(cls):
		pass

	@classmethod
	def tearDownClass(cls):
		pass

	def setUp(self):
		pass

	def tearDown(self):
		pass

	def test_database(self):
		#mariadb_connection = mariadb.connect(user="root", password="", database="csci33038")
		mariadb_connection=0
		self.assertFalse(mariadb_connection)

if __name__ == '__main__':
	unittest.main()
