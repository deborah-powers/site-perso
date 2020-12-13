<?php
/* script pour récupérer des données simples d'une base sql
dépendences: text.js, file.js, database.js, database.class.php
forme des url: http://url?action=coucou&id=2&a=b
les actions: delete, select, create, update, list, table (créer une table)
*/
include ('../../library-php/crossOrigin.php');
include ('../../library-php/database.class.php');
// préciser le nom de la table et adapter la fonction
$tableName = 'librairie';
$action = $_GET['action'];
function strClean ($text){
	$text = str_replace ('%20', ' ', $text);
	return $text;
}
function getData(){
	$array = array();
	foreach ($_GET as $id => $value) if ($id != 'action') $array [$id] = strClean ($value);
	return $array;
}
$id= Null;
if ($action != 'create' && $action != 'list' && $action != 'table') $id= intval ($_GET['id']);
$result = Null;
$db= new database ($tableName);
if ($action == 'table'){
//	$fields = array ('id' => 'int(3) not null auto_increment');
	$fields = array ('id' => 'int(3) not null');
	foreach ($_GET as $id => $value) if ($id != 'action') $fields [$id] = $value;
	$result = $db->createTable ($fields, null);
//	$result = $db->createTable ($fields, 'id');
}
elseif ($action == 'delete'){
	$result = $db->deleteObjById ($id);
}
elseif ($action == 'select') $result = $db->getObjById ($id);
elseif ($action == 'list') $result = $db->getAll();
elseif ($action == 'create' || $action == 'update'){
	$array = getData();
	if ($id == Null) $result = $db->postObj ($array);
	else $result = $db->updateObjById ($array, $id);
}
echo json_encode ($result);
?>