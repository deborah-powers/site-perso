<?php
include ('../../library-php/common.php');

$id = $_GET['id'];
$message = $_GET['message'];

$sql = "update $base.message set message = '$message' where id= $id";
$result = $dbConnection->query ($sql);

if ($result == False) echo "la modification de l'élément $id à échoué";
else echo "la modification de l'élément $id à réussi";
?>