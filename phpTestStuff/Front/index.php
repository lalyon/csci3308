<?php
#This stores the server information
echo "asdf";
$serverName = "localhost";
$userName = "root";
$password = "";
$database = "csci3308";

#This creates a connection
$connection = new mysqli($serverName, $userName, $password, $database);

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
$mariadbData = "SELECT * FROM Tweeties;";
# WHERE '" . $startTime . "' <= Timestamp AND Timestamp <= '" . $endTime . "';";
echo $mariadbData;
$tweetData = $connection->query($mariadbData);

echo gettype($tweetData);
echo mysqli_error($connection);
if ($tweetData){
echo "true";
} else {
echo "false";
}

if ($tweetData->num_rows > 0) {
    // output data of each row
    while($row = $tweetData->fetch_assoc()) {
        echo "id: " . $row["ID"]. " - Name: " . $row["City"]. " " . $row["Trend"]. "<br>";
    }
} else {
    echo "0 results";
}

$connection->close();

echo $tweetData;

?>
