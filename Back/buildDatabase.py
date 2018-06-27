#! /usr/bin/env python3

import tweepy
import googlemaps
from textblob import TextBlob
import sys
import json
import mysql.connector as mariadb
import random

# Open database connection
mariadb_connection = mariadb.connect(user='root', password='', database='csci3308', charset="utf8mb4")
cursor = mariadb_connection.cursor()

# Read in secrets file
with open("../../secrets.json","r") as f:
    secrets = json.load(f)

# Set up tweepy authorization
auth = tweepy.AppAuthHandler(
        secrets['twitter']['consumer_key'],
        secrets['twitter']['consumer_secret']
)
#auth.set_access_token(
#        secrets['twitter']['access_token'],
#        secrets['twitter']['access_token_secret']
#)

# Get twitter api wrapper
api = tweepy.API(
    auth,
    wait_on_rate_limit = True,
    wait_on_rate_limit_notify = True
)

# Get googlemaps api wrapper
gmaps = googlemaps.Client(key = secrets['google']['api_key'])

# Get list of places with trend data available. Trim it to 20 cities in the US
trendPlaces = api.trends_available()
trendPlaces = [trend for trend in trendPlaces if trend['countryCode'] == 'US']

# select random cities with trend data
max = 74
nPlaces = max if len(trendPlaces) > max else len(trendPlaces)
trendPlaces = random.sample(trendPlaces,nPlaces)

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
    tweets = tweepy.Cursor(api.search, q=trend['query'], geocode=geocode).items(99)

    tweetTexts = ''

    # Analyze tweet sentiment
    mostPositive = [(-2, '')] * 5
    mostNegative = [(2, '')] * 5
    for tweet in tweets:
        text = tweet.text
        tweetTexts = tweetTexts + "\n" + text
        sent = TextBlob(text).sentiment.polarity
        inserted = False
        for i,p in enumerate(mostPositive):
            if p[0] < sent:
                mostPositive.insert(i, (sent, text))
                mostPositive.pop()
                inserted = True
                break
        if inserted:
            continue
        for i,n in enumerate(mostNegative):
            if n[0] > sent:
                mostNegative.insert(i, (sent, text))
                mostNegative.pop()
                break

    # Magic
    blob = TextBlob(tweetTexts)

    # Print summary of trend for this city, with sentiment analysis
    print(trend['name'] + " in " + city + " | Analysis: " + str(blob.sentiment))

    # insert stuff into database
    cursor.execute("INSERT INTO tweeties (City,Trend,Lat,Lng,Sentiment,PTweet1,PTweet2,PTweet3,PTweet4,PTweet5,NTweet1,NTweet2,NTweet3,NTweet4,NTweet5) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",(city,trend['name'],str(location['lat']),str(location['lng']),str(blob.sentiment.polarity),mostPositive[0][1],mostPositive[1][1],mostPositive[2][1],mostPositive[3][1],mostPositive[4][1],mostNegative[0][1],mostNegative[1][1],mostNegative[2][1],mostNegative[3][1],mostNegative[4][1]))

cursor.execute("DELETE FROM tweeties WHERE Timestamp < DATEADD(minute, -30, GETDATE())")

mariadb_connection.commit()
mariadb_connection.close()
