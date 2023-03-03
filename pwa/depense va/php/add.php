<?php
include ('../../../library-php/dbCommon.php');

$id = $_GET['id'];
$date = $_GET['date'];
$lieu = $_GET['lieu'];
$categorie = $_GET['categorie'];
$montant = $_GET['montant'];
$commentaire = $_GET['commentaire'];

$sql = "insert into $base.depense (id, date, lieu, categorie, montant, commentaire) values ('$id', '$date', '$lieu', '$categorie', '$montant', '$commentaire');";
echo "<p>$sql</p>";

$result = $connection->query ($sql);

if ($result == False) echo "l'insertion de l'élément $id à échoué";
else echo "l'insertion de l'élément $id à réussi";
?>