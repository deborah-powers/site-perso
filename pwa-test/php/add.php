<?php
include ('../../library-php/common.php');

$id = $_GET['id'];
$message = $_GET['message'];

$sql = "insert into site.message (id, message) values ($id, '$message')";
$result = $dbConnection->query ($sql);

if ($result == False) echo "l'insertion de l'élément $id à échoué";
else echo "l'insertion de l'élément $id à réussi";
?>
