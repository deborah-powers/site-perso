<?php
$table = 'links';
// dependences
include ('database.class.php');
// connextion a la bdd
$db= new database ('ovh');
$db->toJson ($table);
?>
