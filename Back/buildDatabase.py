#! /usr/bin/env python3

import tweepy
import googlemaps
from textblob import TextBlob
import sys
import json
import mysql.connector as mariadb

# Open database connection
mariadb_connection = mariadb.connect(user='root', password='', database='csci3308')
cursor = mariadb_connection.cursor()

# Read in secrets file
with open("../../secrets.json","r") as f:
    secrets = json.load(f)

# Set up tweepy authorization
auth = tweepy.OAuthHandler(
        secrets['twitter']['consumer_key'],
        secrets['twitter']['consumer_secret']
)
auth.set_access_token(
        secrets['twitter']['access_token'],
        secrets['twitter']['access_token_secret']
)

# Get twitter api wrapper
api = tweepy.API(auth)

# Get googlemaps api wrapper
gmaps = googlemaps.Client(key = secrets['google']['api_key'])

# Get list of places with trend data available. Trim it to 20 cities in the US
trendPlaces = api.trends_available()
trendPlaces = [trend for trend in trendPlaces if trend['countryCode'] == 'US']
trendPlaces = trendPlaces[:5]

# Iterate through each place with data
for trendPlace in trendPlaces:

    # Extract the WOEID and city name
    woeid = trendPlace['woeid']
    city = trendPlace['name']

    # Get a latitude / longitude string for geocode searching with google
    location = gmaps.geocode(city)[0]['geometry']['location']
    geocode = str(location['lat']) + "," + str(location['lng']) + ",10mi"

    # Get the list of trends for this city
    trends = api.trends_place(woeid)[0]['trends']

    # Iterate through trends and find the trend with the most tweets about it
    largest = -1
    largestInd = -1
    for i,trend in enumerate(trends):
        if trend['tweet_volume'] and trend['tweet_volume'] > largest:
            largest = trend['tweet_volume']
            largestInd = i
    trend = trends[largestInd]

    # Get all tweets in this city about this trend. limit to 30 items
    tweets = tweepy.Cursor(api.search, q=trend['query'], geocode=geocode).items(30)

    # Join all those tweets into a single newline delimited string
    tweetTexts = "\n".join([tweet.text for tweet in tweets])

    # Magic
    blob = TextBlob(tweetTexts)

    # Print summary of trend for this city, with sentiment analysis
    print(trend['name'] + " in " + city + " | Analysis: " + str(blob.sentiment))
	
    # insert stuff into database
    cursor.execute("INSERT INTO tweeties (City,Trend,Lat,Lng,Sentiment) VALUES (%s,%s,%s,%s,%s)",(city,trend['name'],str(location['lat']),str(location['lng']),str(blob.sentiment.polarity)))

mariadb_connection.commit()
mariadb_connection.close()
