<?php

//! This is a class that we will keep our information in.
class City { 
	public $City = "";
	public $Trend = "";
	public $Lat = "";
	public $Lng = "";
	public $Sentiment = "";
	public $PTweet1 = "";
	public $PTweet2 = "";
	public $PTweet3 = "";
	public $PTweet4 = "";
	public $PTweet5 = "";
	public $NTweet1 = "";
	public $NTweet2 = "";
	public $NTweet3 = "";
	public $NTweet4 = "";
	public $NTweet5 = "";
}

function getData($startTime, $endTime){
	#This stores the server information
	$serverName = "localhost";
	$userName = "root";
	$password = "";
	$database = "csci3308"; 
	#This creates a connection
	$connection = new mysqli($serverName, $userName, $password, $database);

	#Check connection
	if ($connection->connect_error) {
		die("Connection failed: " . $connection->connect_error);
	}

	#This gets all of the data from mariadb for the time range
	$mariadbData = "SELECT Timestamp,tweeties.City,Lat,Lng,Trend,Sentiment,PTweet1,PTweet2,PTweet3,PTweet4,PTweet5,NTweet1,NTweet2,NTweet3,NTweet4,NTweet5 FROM tweeties INNER JOIN cities ON cities.City = tweeties.City AND '$startTime' <= Timestamp AND '$endTime' >= Timestamp;";
	$tweetData = $connection->query($mariadbData);

	#This will make an array that contains the times of each tweet and some.
	if ($tweetData->num_rows > 0){
		$cities = array();
		while($row = $tweetData->fetch_assoc()) {
			$city = new City;
			$city->City = $row["City"];
			$city->Trend = $row["Trend"];
			$city->Lat = $row["Lat"];
			$city->Lng = $row["Lng"];
			$city->Sentiment = $row["Sentiment"];
			$city->PTweet1 = $row["PTweet1"];
			$city->PTweet2 = $row["PTweet2"];
			$city->PTweet3 = $row["PTweet3"];
			$city->PTweet4 = $row["PTweet4"];
			$city->PTweet5 = $row["PTweet5"];
			$city->NTweet1 = $row["PTweet1"];
			$city->NTweet2 = $row["PTweet2"];
			$city->NTweet3 = $row["PTweet3"];
			$city->NTweet4 = $row["PTweet4"];
			$city->NTweet5 = $row["NTweet5"];
			array_push($cities, $city);
		}
		$jsonData = json_encode($cities);
		return $jsonData;
	} else {
		return "Empty Set returned<br>";
	}
	$connection->close();
}

$startTime = $_GET["startTime"]; //! This gets the start and end time of the range of tweets from our the server and assigns it to a variable
if (strlen($startTime)) {
	$endTime = $startTime;
	$dateInterval = new DateInterval('PT15M');
	$startTimeObj = new DateTime($startTime);
	$startTimeObj->sub($dateInterval);
	$startTime = date_format($startTimeObj, 'Y-m-d H:i:s');
	echo getData($startTime,$endTime);
}
?>
