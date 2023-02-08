<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: GET');
// include ('../library-php/database.class.php');
$array =[
	'id'		=> $_GET['id'],
	'message'	=> $_GET['message']
];
$id = $_GET['id'];
$message = $_GET['message'];

$servername = 'localhost';
$username = 'root';
$password = 'root';

$dbConnection = new mysqli ($servername, $username, $password);
if ($dbConnection->connect_error) die ("connection en échec: ". $dbConnection->connect_error);

$sql = "insert into site.message (id, message) values (".$id.", '".$message."')";
echo $sql;

if ($dbConnection->query ($sql) === TRUE) echo "New record created successfully";
else echo "Error: " . $sql . "<br>" . $dbConnection->error;

$dbConnection->close();
/*
$db= new database();
$result = $db->postObj ('message', $array);
echo $result;
*/
echo 'coucou';
?>
