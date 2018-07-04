import mysql.connector as mariadb

mariadb_connection = mariadb.connect(user = 'root', password = '', database='csci3308')
cursor = mariadb_connection.cursor()

# Removes Lat,Lng from tweeties and creates a separate table.
cursor.execute('SELECT City, Lat, Lng FROM tweeties;')
tweets = cursor.fetchall()
for tweet in tweets:
	city = tweet[0]
	lat = tweet[1]
	lng = tweet[2]
	print(city)
	cursor.execute("IF NOT EXISTS (SELECT 1 FROM cities WHERE City = '" + city + "') BEGIN INSERT INTO cities (City, Lat, Lng) VALUES ("+city+","+str(lat)+","+str(lng)+") END")
