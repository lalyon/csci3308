<?php
#This stores the server information
$serverName = "localhost";
$userName = "root";
$password = "";

#This creates a connection
$connection = new mysqli($serverName, $userName, $password);

// Check connection
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}
echo "Connected successfully";

#This gets the start and end time of the range of tweets from our the server and assigns it to a variable
$startTime = $_GET["startTime"];
$endTime = $_GET["endTime"];

echo $startTime;
echo $endTime;


#This gets all of the data from mariadb for the time range
$mariadbData = "SELECT * FROM Tweeties WHERE startTime <= Timestamp AND Timestamp <= endTime ";
$tweetData = $connection->query($mariadbData);

echo $tweetData;

?>