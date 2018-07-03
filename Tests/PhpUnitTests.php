<?php
  use PHPUnit\Framework\TestCase;

  final class getDataTest extends TestCase {
    public function testGetData(): void {
      $startTime = "2018-07-01 06:20:15";
      $endTime = "2018-07-01 06:45:15";
      $timeWindow = getData($startTime,$endTime);
      $this->assertNotEmpty($timeWindow);
      $this->assertNotEquals($timeWindow,"Empty Set returned<br>");
    }

  }







?>
