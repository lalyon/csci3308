<?php
include '../Front/getData.php';
use PHPUnit\Framework\TestCase;

final class getDataTest extends TestCase {
	// Tests that the script returns any result
	public function testGetData(): void {
		$startTime = "2018-07-01 06:20:15";
		$endTime = "2018-07-01 06:45:15";
		$timeWindow = getData($startTime,$endTime);
		$this->assertNotEmpty($timeWindow);
	}
	// Tests that the result has real sql data.
	public function testDataFilled(): void {
		$startTime = "2018-06-29 06:20:15";
		$endTime = "2018-07-01 06:20:15";
		$timeWindow = getData($startTime,$endTime);
		$this->assertNotEquals($timeWindow,"Empty Set returned<br>");
	}
	// Tests that the data is in the right format, with non-null content.
	public function testJson(): void {
		$startTime = "2018-06-29 06:20:15";
		$endTime = "2018-07-01 06:20:15";
		$tweetWindow = getData($startTime,$endTime);
		$jsonTweets = json_decode($tweetWindow);
		echo gettype($jsonTweets[0]);
		var_dump($jsonTweets[0]);
		// check that all objects in array have full content.
		for ($i = 0; $i < count($jsonTweets); $i++) {
			$this->assertNotNull($jsonTweets[$i]->City);
			$this->assertNotNull($jsonTweets[$i]->Trend);
			$this->assertNotNull($jsonTweets[$i]->Lat);
			$this->assertNotNull($jsonTweets[$i]->Lng);
			$this->assertNotNull($jsonTweets[$i]->Sentiment);
			$this->assertNotNull($jsonTweets[$i]->PTweet1);
			$this->assertNotNull($jsonTweets[$i]->PTweet2);
			$this->assertNotNull($jsonTweets[$i]->PTweet3);
			$this->assertNotNull($jsonTweets[$i]->PTweet4);
			$this->assertNotNull($jsonTweets[$i]->PTweet5);
			$this->assertNotNull($jsonTweets[$i]->NTweet1);
			$this->assertNotNull($jsonTweets[$i]->NTweet2);
			$this->assertNotNull($jsonTweets[$i]->NTweet3);
			$this->assertNotNull($jsonTweets[$i]->NTweet4);
			$this->assertNotNull($jsonTweets[$i]->NTweet5);
		}
		// check that at least 15 entries exist
		$this->assertGreaterThan(15, count($jsonTweets));
	}
}







?>
