<?php
include ('../../../library-php/dbCommon.php');

$ids = $_GET['ids'];
$ids = str_replace ($ids, ',', "','");
$sql = "delete from $base.depense where ids in ('$ids');";

$result = $connection->query ($sql);
if ($result == False) echo "ko";
else echo "ok";
?>