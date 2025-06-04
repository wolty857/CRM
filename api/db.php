<?php
$host = 'localhost';
$dbname = 'crm_cordova';
$user = 'root';
$pass = ''; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
} catch (PDOException $e) {
    die("Error en la conexión: " . $e->getMessage());
}
?>
