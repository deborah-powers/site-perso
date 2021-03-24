<?php
// cross-origin, a modifier pour updater les evts
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST');
// dependences
include ('../classes/tablesNames.php');
include ('../classes/database.class.php');
include ('../classes/event.class.php');
// angularData est une string
$angularData = file_get_contents ('php://input');
$jsonList = json_decode ($angularData);
// old evt pour reperer l'evenement dans la table, newEvt est la version modifiee
$oldEvt = new event();
$oldEvt->fromJson ($jsonList[0]);
$oldArray = $oldEvt->toArray();
$newEvt = new event();
$newEvt->fromJson ($jsonList[1]);
$newArray = $newEvt->toArray();
// connection a la bdd
$db = new database();
$result =2;
$message = "l'evenement n'est pas dans la table $tableEvt";
$result = $db->updateArray ($tableEvt, $newArray, $oldArray);
if ($result ==1) $message = "l'evenement a ete modifie";
elseif ($result ==0) $message = "l'evenement n'a pas put etre modifie";
echo json_encode ($message);
?>