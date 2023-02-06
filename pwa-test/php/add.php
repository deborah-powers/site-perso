<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: GET');
include ('../library-php/database.class.php');
$array =[
	'id'		=> $_GET['id'],
	'message'	=> $_GET['message']
];
$db= new database();
$result = $db->postObj ('message', $array);
echo $result;
?>
