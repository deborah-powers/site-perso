<?php
include ('../../library-php/common.php');

$sql = "select id, message from $base.message";
$result = $dbConnection->query ($sql);
$json =[];

while ($row = $result->fetch_assoc()) var_dump ($row);

if ($result == False) echo "impossible de récupérer le contenu de la table $base.$table";
else echo json_encode (json);
?>