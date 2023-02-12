<?php
include ('../../../library-php/dbCommon.php');

$id = $_GET['id'];
$message = $_GET['message'];

$sql = "insert into $base.message (id, message) values ($id, '$message')";
$result = $connection->query ($sql);

if ($result == False) echo "l'insertion de l'élément $id à échoué";
else echo "l'insertion de l'élément $id à réussi";
?>