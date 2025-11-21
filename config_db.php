<?php
// config_db.php

$db_host = 'localhost';
$db_name = 'gcw_cyber_run';
$db_user = 'root';
$db_pass = '';

try {
    $pdo = new PDO("mysql:host=$db_host;port=3307;dbname=$db_name;charset=utf8", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log("Error de conexión a la BD: " . $e->getMessage());
    die("Error de conexión. Por favor, revisa los logs del servidor.");
}
?>