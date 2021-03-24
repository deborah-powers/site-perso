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
// objet evt
$evt = new event();
$evt->fromJsonString ($angularData);
$evtArray = $evt->toArray();
// connection a la bdd
$db = new database();
$result =2;
$message = "l'evenement n'est pas dans la table $tableEvt";
$result = $db->deleteArray ($tableEvt, $evtArray);
if ($result ==1) $message = "l'evenement a ete supprime de la table $tableEvt";
elseif ($result ==0) $message = "l'evenement n'a pas put etre supprime de la table $tableEvt";
echo json_encode ($message);
?>