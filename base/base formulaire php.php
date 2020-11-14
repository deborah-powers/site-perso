<?php
/*
author: Deborah Powers
job: Dev Web
school: Simplon Lieusaint
creation: 2018/03/07
update: 2018/03/07
*/
session_start();

$day = date ('d/m/Y');
$hour = date ('H:i:s');
echo '<p>Nous sommes le '.$day.', il est '.$hour.'</p>';

$Lname = 'Nom';
$Fname = 'Prenom';
if ($_GET['Lname'])
	$Lname = $_GET['Lname'];
if ($_GET['Fname'])
	$Fname = $_GET['Fname'];
echo '<p>Bienvenue '.$Fname.' '.$Lname.'</p>';

$_SESSION['Fname'] = $Fname;
$_SESSION['Lname'] = $Lname;
?>
