<?php
session_start(); // ¡ESTA LÍNEA ES LA SOLUCIÓN! Inicia o reanuda una sesión.

// --- MODO DE DEPURACIÓN ---
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// --- FIN MODO DE DEPURACIÓN ---

// --- CORS y Headers ---
// Esto es CRUCIAL para permitir que tu frontend (en el puerto 5501) se comunique con este script PHP.
header("Access-Control-Allow-Origin: *"); // Permite peticiones desde cualquier origen. Para producción, deberías cambiar "*" por "http://127.0.0.1:5501".
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// El navegador envía una petición "pre-vuelo" (OPTIONS) para verificar CORS. Respondemos que está bien.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Lógica del Servidor ---
require_once 'config_db.php'; // Incluimos la conexión centralizada

// 1. Leer los datos JSON enviados desde el frontend
$json_data = file_get_contents('php://input');
$data = json_decode($json_data);

$usuario = $data->usuario ?? null;
$password = $data->password ?? null;

if (!$usuario || !$password) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Faltan usuario o contraseña']);
    exit();
}

// 2. Conectar a la base de datos y verificar credenciales
try {
    // Preparamos la consulta para evitar inyección SQL
    $stmt = $pdo->prepare("SELECT * FROM users WHERE u_name = ? AND u_password = ?"); // Usando los nombres de tu BD
    $stmt->execute([$usuario, $password]);
    
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($resultado) {
        // Usuario encontrado
        // Guardamos la información del usuario en la sesión del servidor para uso futuro.
        $_SESSION['user'] = $resultado;

        // Devolvemos que el login fue exitoso.
        echo json_encode(['success' => true, 'message' => 'Login exitoso', 'user' => $resultado]);
    } else {
        // Usuario no encontrado o contraseña incorrecta
        http_response_code(401); // Unauthorized
        echo json_encode(['success' => false, 'message' => 'Credenciales inválidas']);
    }

} catch (PDOException $e) {
    // Error de conexión o de consulta
    http_response_code(500); // Internal Server Error
    echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
}

?>