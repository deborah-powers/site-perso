<?php
include ('../../../library-php/dbCommon.php');

$sql = "select * from $base.depense;";
$result = $connection->query ($sql);

$resJson =[];
while ($row = $result->fetch_assoc()) $resJson[] =[
	'id' => $row['id'],
	'date' => $row['date'],
	'lieu' => $row['lieu'],
	'categorie' => $row['categorie'],
	'montant' => $row['montant'],
	'commentaire' => $row['commentaire']
];
echo json_encode ($resJson);
?>