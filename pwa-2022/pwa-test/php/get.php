<?php
include ('../../../library-php/dbCommon.php');

$sql = "select id, message from $base.message";
$result = $connection->query ($sql);

$resJson =[];
while ($row = $result->fetch_assoc()) $resJson[] =[ 'id' => $row['id'], 'message' => $row['message'] ];

echo json_encode ($resJson);
?>