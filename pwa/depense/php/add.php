<?php
include ('../../../library-php/dbCommon.php');

$id = $_GET['id'];
$etat = $_GET['etat']

$date = $_GET['date'];
$lieu = $_GET['lieu'];
$categorie = $_GET['categorie'];
$montant = $_GET['montant'];
$commentaire = $_GET['commentaire'];

if ($etat == 'new')
    $sql = "insert into $base.depense (id, date, lieu, categorie, montant, commentaire) values ('$id', '$date', '$lieu', '$categorie', '$montant', '$commentaire');";
elseif ($etat == 'upd')
    $sql = "update $base.depense set date='$date', lieu='$lieu', categorie='$categorie', montant='$montant', commentaire='$commentaire' where id='$id';";

$result = $connection->query ($sql);
if ($result == False) echo "ko $id"
else echo "ok $id";
?>