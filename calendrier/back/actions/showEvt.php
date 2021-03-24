<?php
// cross-origin, a modifier pour updater les evts
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST');
// dependences
include ('../classes/tablesNames.php');
include ('../classes/database.class.php');
include ('../classes/event.class.php');
include_once ('../classes/date.class.php');
// recuperer les donnees de la bdd
$db = new database();
$jsonData = $db->getTableContent ($tableEvt);
// transformer les pseudo-json en objets event
$listEvt =[];
foreach ($jsonData as $value){
	$evt = new event();
	$evt->fromArray ($value);
	$listEvt[] = $evt;
}
// gerer le temps
$today = new evtDate();
$today->today();
foreach ($listEvt as $evt){
	$evtDate = $evt->toDate();
	if (($evtDate < $today) && ($evt->priority !== 'old')){
		$oldEvt = $evt->copy();
		$oldArray = $oldEvt->toArray();
	// reperer les evenements passes. passer la priorite a old
		if ($evt->recurrence == 'no') $evt->priority = 'old';
	// la recurrence. quand la date d'un évênement est dépassé, trouver sa prochaine occurence
		else{
			switch ($evt->recurrence){
				case 'year':
					$evtDate->year +=1;
					break;
				case 'month':
					$evtDate->addMonth();
					break;
				case 'week':
					$evtDate->addweek();
					break;
				case 'day':
					$evtDate->addDay();
			}
			$evt->fromDate ($evtDate);
		}
		$evtArray = $evt->toArray();
		$message = $db->updateArray ($tableEvt, $evtArray, $oldArray);
	}
}
// trier les evt par date
function sortByDate ($evt1, $evt2){
	$date1 = $evt1->toDate();
	$date2 = $evt2->toDate();
	$res =-1;
	if ($date1 < $date2) $res =1;
	return $res;
}
$resSort = usort ($listEvt, sortByDate);
// la liste d'evenements est renvoyee en tant que json
echo json_encode ($listEvt);
?>