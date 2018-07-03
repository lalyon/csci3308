#!/usr/bin/python3
import mysql.connector as mariadb

mariadb_connection = mariadb.connect(user="root", password="", database="csci33038")
if !maridb_connection:
	print "Database exists"
else:
	print "Database DNE"
