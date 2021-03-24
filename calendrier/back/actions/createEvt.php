<?php
// cross-origin, a modifier pour updater les evts
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST');
// dependences
include ('../classes/event.class.php');
include ('../classes/database.class.php');
include ('../classes/tablesNames.php');
// recuperer les infos du formulaire envoyees par angular
// angularData est une string
$angularData = file_get_contents ('php://input');
// objet evt
$evt = new event();
$evt->fromJsonString ($angularData);
// verifier que l'enregistrement n'est pas une erreur
$result =2;
$message = "l'evenement n'a pas de titre";
if ($evt->title){
	$evtArray = $evt->toArray();
	$db = new database();
	$result = $db->postArray ($tableEvt, $evtArray);
}
if ($result ==1) $message = "l'evenement a ete enregistre dans la bdd";
elseif ($result ==0) $message = "l'evenement n'a pas put etre enregistre dans la bdd";
echo json_encode ($message);
?>