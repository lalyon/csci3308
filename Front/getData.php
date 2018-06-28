<?php
#This is a class that we will keep our information in;
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

#This is a class to put our city class into
class TimeWindow {
  public $Time = "";
  public $Cities = array();
}

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
echo "Connected successfully";

#This gets the start and end time of the range of tweets from our the server and assigns it to a variable
$startTime = $_GET["startTime"];
$endTime = $_GET["endTime"];

#This gets all of the data from mariadb for the time range
$mariadbData = "SELECT * FROM Tweeties WHERE '$startTime' <= Timestamp AND Timestamp <= '$endTime' ;";
echo $mariadbData;
$tweetData = $connection->query($mariadbData);

#This will make an array that contains the times of each tweet and some.
$timeArray =  array();
$dateInterval = new DateInterval('P15M');
$timeCursor = new DateTime($startTime);
$timeCursor->add($dateInterval);
if ($tweetData->num_rows > 0){
  $cities = array();
  while($row = $tweetData->fetch_assoc()) {
    $rowTime = new DateTime($row["Timestamp"]);
    if($rowTime > $timeCursor) {
      $timeWindow = new TimeWindow;
      $timeWindow->Time = date_format($timeCursor, 'Y-m-d H:i:s');
      $timeWindow->Cities = $cities;
      $cities = array();
      $timeCursor->add($dateInterval);
      array_push($timeArray, $timeWindow);
    }
    echo json_encode($row);
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
  $timeWindow = new TimeWindow;
  $timeWindow->Time = date_format($timeCursor, 'Y-m-d H:i:s');
  $timeWindow->Cities = $cities;
  array_push($timeArray, $timeWindow);
} else {
  echo "Empty Set returned<br>";
}


$jsonData = json_encode($timeArray);

echo $jsonData;

$connection->close();

?>
