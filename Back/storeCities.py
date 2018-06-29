import mysql.connector as mariadb

mariadb_connection = mariadb.connect(user = 'root', password = '', database='csci3308')
cursor = mariadb_connection.cursor()

hello = cursor.execute('SELECT ID FROM tweeties;')

print(hello)
