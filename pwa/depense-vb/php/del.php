<?php
include ('../../../library-php/dbCommon.php');

$id = $_GET['id'];
$sql = "delete from $base.depense where id='$id';";

$result = $connection->query ($sql);
if ($result == False) echo "ko $id"
else echo "ok $id";
?>