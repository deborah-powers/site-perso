<?php
// Constantes de connexion
$DBhost = '127.0.0.1:3306';
$DBuser = 'root';
$DBpassword = 'noisette416';
$DBname = 'deborahprrdebbie';
$tableEvents = 'events';
// $tableContacts = 'contacts';
// Create mysql connection
$mysqli = new mysqli ($DBhost, $DBuser, $DBpassword);
// Gestion des erreurs de connexion
if ($mysqli->connect_errno) {
	echo "<h1>Connection failed: </h1>" . mysqli_connect_error() . PHP_EOL . "<br/>";
	echo "<h1>Error: Unable to connect to MySQL.</h1>" . PHP_EOL . "<br/>";
	echo "<h1>Debugging errno: </h1>" . mysqli_connect_errno() . PHP_EOL . "<br/>";
	// On sort du programme
	die();
}
/*/ creer la bdd. je l'ai deja cree lors d'un precedent lancement du script
if (! $mysqli->query ("CREATE DATABASE $DBname") ) {
	printf("Errormessage: %s\n", $mysqli->error);
}*/
// selectionner la bdd
mysqli_select_db ($mysqli, $DBname);
// creer la table
$request = "CREATE TABLE `$DBname`.`$tableEvents` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`year` INT DEFAULT 2018,
	`month` INT DEFAULT 1,
	`day` INT DEFAULT 1,
	`hour` INT DEFAULT 14,
	`minute` INT DEFAULT 0,
	`city` VARCHAR(255),
	`adress` VARCHAR(255),
	`itinerary` VARCHAR(255),
	`contact_name` VARCHAR(255),
	`contact_coord` VARCHAR(255),
	`title` VARCHAR(50) NOT NULL,
	`note` TEXT(65000),
	`tags` VARCHAR(255),
	`priority` VARCHAR(100) DEFAULT 'low',
	`recurrence` VARCHAR(255) DEFAULT 'no',
PRIMARY KEY (`id`) ) CHARACTER SET utf8 COLLATE utf8_general_ci;";
$mysqli->query ($request) or die ($mysqli->error);
?>