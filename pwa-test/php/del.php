<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: POST');
include ('../../../site-dp/library-php/database.class.php');

$id= intval ($_POST['id']);
$db= new database();
$result = $db->deleteObjById ('message', $id);
echo json_encode ($result);
?>