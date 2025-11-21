<?php
session_start();
header('Content-Type: application/json');

// Incluimos el archivo de configuración para obtener la variable $pdo
require_once 'config_db.php';

try {
    // 1. Verificar si el usuario ha iniciado sesión
    if (!isset($_SESSION['user']) || !isset($_SESSION['user']['id_user_PK'])) {
        throw new Exception('Usuario no autenticado.');
    }

    // 2. Obtener y validar datos de la petición
    $data = json_decode(file_get_contents('php://input'), true);
    $puntos_ganados = $data['puntos'] ?? null;
    $id_user = $_SESSION['user']['id_user_PK'];

    if (!is_numeric($puntos_ganados)) {
        throw new Exception('Puntuación inválida.');
    }

    // 3. Llamar al procedimiento almacenado utilizando la conexión existente
    $stmt = $pdo->prepare("CALL update_user_score(?, ?)");
    $stmt->execute([$id_user, $puntos_ganados]);

    // 4. Devolver una respuesta de éxito
    echo json_encode(['success' => true, 'message' => 'Puntuación procesada con éxito.']);

} catch (Exception $e) {
    // Capturar cualquier error (de sesión, de datos, de base de datos) y registrarlo.
    error_log('Error en guardar_puntos.php: ' . $e->getMessage());
    // Enviar una respuesta de error genérica al cliente.
    echo json_encode(['success' => false, 'message' => 'Error en el servidor al procesar la puntuación.']);
}
?>