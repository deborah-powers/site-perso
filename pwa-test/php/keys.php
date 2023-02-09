<?php

$servername = 'localhost';
$username = 'root';
$password = 'root';

$dbConnection = new mysqli ($servername, $username, $password);
if ($dbConnection->connect_error) die ("<p>connection en échec: ". $dbConnection->connect_error .'</p>');
else echo '<p>connection réussie</p>';

$sql = "show columns from site.message";
$result = $dbConnection->query ($sql);

if ($result === TRUE || $result === True || $result === true) echo '<p>New record created successfully</p>';
elseif ($result === FALSE || $result === False || $result === false) echo '<p>error</p>';
elseif ($result === NULL || $result === Null || $result === null) echo '<p>null</p>';
else{
	echo '<p>inconnu</p>';
	while ($row = $result->fetch_assoc()){
		var_dump ($row);
		echo '<br/>';
	}
}
?>