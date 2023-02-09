<?php
include ('../../library-php/common.php');

$id = $_GET['id'];

$sql = "delete from $base.message where id= $id";
$result = $dbConnection->query ($sql);

if ($result == False) echo "la suppression de l'élément $id à échoué";
else echo "la suppression de l'élément $id à réussi";
?>