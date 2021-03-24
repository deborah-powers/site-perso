<?php
// la premiere case represente decembre, le mois avant janvier
$daysInMonth =[31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function isBissextile ($year){
	$bissextile = false;
	if ($year %4 ==0){
		$bissextile = true;
		if ($year %100 ==0){
			$bissextile = false;
			if ($year %400 ==0) $bissextile = true;
		}
	}
	return $bissextile;
}
function countDaysSince1900 ($year){
	// calculer le nb de jours ecoules depuis l'an 1900, en prenant en compte les annees bissextiles
	$nbYears = $year -1900;
	$nbDays = 365* $nbYears;
	for ($i=1900; $i< $year; $i++){
		if (isBissextile ($i)) $nbDays = $nbDays +1;
	}
	return $nbDays;
}
class evtDay{
	public $year = 2018;
	public $month = 1;
	public $day = 1;
	protected $bissextile = false;

	protected function isBissextile(){
		if (isBissextile ($this->year)) $this->bissextile = true;
	}
	public function __construct ($year=2018, $month=1, $day=1){
		$this->year = $year;
		$this->month = $month;
		$this->day = $day;
		$this->isBissextile();
	}
	public function today(){
		$todayDate = date ('Y/m/d');
		$todayList = explode ('/', $todayDate);
		$this->year = intval ($todayList[0]);
		$this->month = intval ($todayList[1]);
		$this->day = intval ($todayList[2]);
		$this->isBissextile();
	}
	public function addMonth(){
		$this->month +=1;
		if ($this->month >12){
			$this->month =1;
			$this->year +=1;
		}
	}
	public function addDay(){
		$this->day +=1;
		if (($this->month ==2) && ($this->bissextile) && ($this->day >29)){
			$this->day =1;
			$this->addMonth();
		}
		elseif ($this->day > $daysInMonth [$this->month]){
			$this->day =1;
			$this->addMonth();
		}
	}
	public function addWeek(){
		for ($d=0; $d<7; $d++){
			$this->addDay();
		}
	}
	public function comparDates ($otherDate){
		// si otherDate > this. toujours avoir la plus grande date en premier
		if ($otherDate > $this) return $otherDate->comparDates ($this);
		// cas simple, this > otherDate
		$newDate = new evtDay();
		$newDate->year = $this->year - $otherDate->year;
		$newDate->month = $this->month - $otherDate->month;
		$newDate->day = $this->day - $otherDate->day;
		if ($newDate->day <0){
			$newDate->day += $daysInMonth [$this->month -1];
			if ($this->bissextile && $this->month >2) $newDate->day +=1;
			if ($otherDate->bissextile && $otherDate->month >2) $newDate->day -=1;
			$newDate->month -=1;
		}
		if ($newDate->month <0){
			$newDate->month +=12;
			$newDate->year -=1;
		}
		return $newDate;
	}
}
class evtDate extends evtDay{
	public $hour = 0;
	public $minute = 0;
	public function __construct ($year=2018, $month=1, $day=1, $hour=0, $minute=0){
		parent::__construct ($year, $month, $day);
		$this->hour = $hour;
		$this->minute = $minute;
	}
	public function today(){
		parent::today();
		$todayDate = date ('H/i');
		$todayList = explode ('/', $todayDate);
		$this->hour = intval ($todayList[0]);
		$this->minute = intval ($todayList[1]);
	}
	public function comparDates ($otherDate){
		// si otherDate > this. toujours avoir la plus grande date en premier
		if ($otherDate > $this) return $otherDate->comparDates ($this);
		// cas simple, this > otherDate
		$newDate = new evtDate();
		$newDate->year = $this->year - $otherDate->year;
		$newDate->month = $this->month - $otherDate->month;
		$newDate->day = $this->day - $otherDate->day;
		$newDate->hour = $this->hour - $otherDate->hour;
		$newDate->minute = $this->minute - $otherDate->minute;
		if ($newDate->minute <0){
			$newDate->minute +=60;
			$newDate->hour -=1;
		}
		if ($newDate->hour <0){
			$newDate->hour +=24;
			$newDate->day -=1;
		}
		if ($newDate->day <0){
			$newDate->day += $daysInMonth [$this->month -1];
			if ($this->bissextile && $this->month >2) $newDate->day +=1;
			if ($otherDate->bissextile && $otherDate->month >2) $newDate->day -=1;
			$newDate->month -=1;
		}
		if ($newDate->month <0){
			$newDate->month +=12;
			$newDate->year -=1;
		}
		return $newDate;
	}
}
?>