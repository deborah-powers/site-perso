<?php
include ('../../../library-php/dbCommon.php');

$id = $_GET['id'];
$date = $_GET['date'];
$lieu = $_GET['lieu'];
$categorie = $_GET['categorie'];
$montant = $_GET['montant'];
$commentaire = $_GET['commentaire'];

$sql = "update $base.depense set date='$date', lieu='$lieu', categorie='$categorie', montant='$montant', commentaire='$commentaire' where id='$id';";
$result = $connection->query ($sql);

if ($result == False) echo "la modification de l'élément $id à échoué";
else echo "la modification de l'élément $id à réussi";
?>