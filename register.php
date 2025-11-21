<?php
// --- MODO DE DEPURACIÓN ---
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// --- FIN MODO DE DEPURACIÓN ---

// --- CORS y Headers ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Respuesta pre-vuelo para CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Lógica del Servidor ---
require_once 'config_db.php'; // Incluimos la conexión

// 1. Leer los datos JSON
$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$usuario = $data->usuario ?? null;
$password = $data->password ?? null;

if (!$usuario || !$password) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Faltan usuario o contraseña.']);
    exit();
}

// 2. Llamar al procedimiento almacenado para crear el usuario
try {
    $stmt = $pdo->prepare("CALL create_user(?, ?)");
    $stmt->execute([$usuario, $password]);
    
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($resultado && $resultado['success']) {
        // Registro exitoso
        echo json_encode(['success' => true, 'message' => $resultado['message']]);
    } else {
        // Error devuelto por el procedimiento (ej: usuario ya existe)
        http_response_code(409); // Conflict
        echo json_encode(['success' => false, 'message' => $resultado['message'] ?? 'Error al registrar el usuario.']);
    }

} catch (PDOException $e) {
    // Error de conexión o de consulta
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
}
?>