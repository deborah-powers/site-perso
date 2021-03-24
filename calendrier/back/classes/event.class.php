<?php
// traiter les dates
include ('date.class.php');
class event{
	// la date
	public $year = 2018;
	public $month = 1;
	public $day = 1;
	public $hour = 0;
	public $minute = 0;
	public $recurrence = 'no';
	// le lieu
	public $city = "";
	public $adress = "";
	public $itinerary = "";
	// contact
	public $contact_name = "";
	public $contact_coord = "";
	// message
	public $title = "";
	public $note = "";
	public $tags = "";
	public $priority = "";
	// recuperer les donnees d'un json
	public function fromJson ($jsonObj){
		// la date
		if ($jsonObj->year) $this->year = $jsonObj->year;
		if ($jsonObj->month) $this->month = $jsonObj->month;
		if ($jsonObj->day) $this->day = $jsonObj->day;
		if ($jsonObj->hour) $this->hour = $jsonObj->hour;
		if ($jsonObj->minute) $this->minute = $jsonObj->minute;
		if ($jsonObj->recurrence) $this->recurrence = $jsonObj->recurrence;
		// le lieu
		if ($jsonObj->city) $this->city = $jsonObj->city;
		if ($jsonObj->adress) $this->adress = $jsonObj->adress;
		if ($jsonObj->itinerary) $this->itinerary = $jsonObj->itinerary;
		// contact
		if ($jsonObj->contact_name) $this->contact_name = $jsonObj->contact_name;
		if ($jsonObj->contact_coord) $this->contact_coord = $jsonObj->contact_coord;
		// message
		if ($jsonObj->title) $this->title = $jsonObj->title;
		if ($jsonObj->note) $this->note = $jsonObj->note;
		if ($jsonObj->tags) $this->tags = $jsonObj->tags;
		if ($jsonObj->priority) $this->priority = $jsonObj->priority;
	}
	public function fromJsonString ($jsonString){
		$jsonObj = json_decode ($jsonString);
		$this->fromJson ($jsonObj);
	}
	public function copy(){
		$newEvt = new event();
		$newEvt->fromJson ($this);
		return $newEvt;
	}
	// transformer l'objet en tableau associatif. le convertir en objet eventDb
	function toArray(){
		$table = get_object_vars ($this);
		return $table;
	}
	public function fromArray ($associativeArray){
		// la date
		if ($associativeArray['year']) $this->year = intval ($associativeArray['year']);
		if ($associativeArray['month']) $this->month = intval ($associativeArray['month']);
		if ($associativeArray['day']) $this->day = intval ($associativeArray['day']);
		if ($associativeArray['hour']) $this->hour = intval ($associativeArray['hour']);
		if ($associativeArray['minute']) $this->minute = intval ($associativeArray['minute']);
		if ($associativeArray['recurrence']) $this->recurrence = $associativeArray['recurrence'];
		// le lieu
		if ($associativeArray['city']) $this->city = $associativeArray['city'];
		if ($associativeArray['adress']) $this->adress = $associativeArray['adress'];
		if ($associativeArray['itinerary']) $this->itinerary = $associativeArray['itinerary'];
		// contact
		if ($associativeArray['contact_name']) $this->contact_name = $associativeArray['contact_name'];
		if ($associativeArray['contact_coord']) $this->contact_coord = $associativeArray['contact_coord'];
		// message
		if ($associativeArray['title']) $this->title = $associativeArray['title'];
		if ($associativeArray['note']) $this->note = $associativeArray['note'];
		if ($associativeArray['tags']) $this->tags = $associativeArray['tags'];
		if ($associativeArray['priority']) $this->priority = $associativeArray['priority'];
	}
	// traiter la date
	public function toDate(){
		$evtDate = new evtDate();
		$evtDate->year = $this->year;
		$evtDate->month = $this->month;
		$evtDate->day = $this->day;
		$evtDate->hour = $this->hour;
		$evtDate->minute = $this->minute;
		return $evtDate;
	}
	public function fromDate ($date){
		$this->year = $date->year;
		$this->month = $date->month;
		$this->day = $date->day;
		$this->hour = $date->hour;
		$this->minute = $date->minute;
	}
	// reperer les evenement depasses. passer la priorite a old
	public function findOldEvt(){}
	// gerer la recurence
	public function nextOccurrence(){}
}
?>