<?php
  include '../Front/getData.php';
  use PHPUnit\Framework\TestCase;

  final class getDataTest extends TestCase {
    public function testGetData(): void {
      $startTime = "2018-07-01 06:20:15";
      $endTime = "2018-07-01 06:45:15";
      $timeWindow = getData($startTime,$endTime);
      $this->assertNotEmpty($timeWindow);
    }
    public function getDataFilledTest(): void {
      $startTime = "2018-06-29 06:20:15";
      $endTime = "2018-07-01 06:20:15";
      $timeWindow = getData($startTime,$endTime);
      $this->assertNotEquals($timeWindow,"Empty Set returned<br>");
    }
    public function checkJson(): void {
      $startTime = "2018-06-29 06:20:15";
      $endTime = "2018-07-01 06:20:15";
      $tweetWindow = getData($startTime,$endTime);
      $jsonTweets = json_decode($tweetWindow, true);
      $this->assertGreaterThan(15, count($jsonTweets));
    }
  }







?>
