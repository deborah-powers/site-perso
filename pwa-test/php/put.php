<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: POST');
include ('../../../site-dp/library-php/database.class.php');

$array =[
	'id'		=> $_POST['id'],
	'message'	=> $_POST['message'],
];
$id= intval ($_POST['id']);
$db= new database();
$result = $db->updateObjById ('message', $array, $id);
echo $result;
?>