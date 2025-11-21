<?php
session_start();
header('Content-Type: application/json');

// 1. Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['user']) || !isset($_SESSION['user']['id_user_PK'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado.']);
    exit;
}

// 2. Obtener datos de la petición
$data = json_decode(file_get_contents('php://input'), true);
$id_buff = $data['id_buff'] ?? null;
$id_user = $_SESSION['user']['id_user_PK'];

if (!$id_buff) {
    echo json_encode(['success' => false, 'message' => 'No se especificó el ID del buff.']);
    exit;
}

// 3. Conexión a la base de datos
$db_host = 'localhost';
$db_name = 'gcw_cyber_run';
$db_user = 'root';
$db_pass = '';

try {
    $pdo = new PDO("mysql:host=$db_host;port=3307;dbname=$db_name;charset=utf8", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 4. Llamar al procedimiento almacenado
    $stmt = $pdo->prepare("CALL comprar_buff(?, ?)");
    $stmt->bindParam(1, $id_user, PDO::PARAM_INT);
    $stmt->bindParam(2, $id_buff, PDO::PARAM_INT);
    $stmt->execute();

    // 5. Obtener el resultado del procedimiento
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stmt->closeCursor(); // Es importante cerrar el cursor para la siguiente consulta

    if ($result['success']) {
        // Si la compra fue exitosa, obtener los puntos actualizados del usuario
        $stmt_points = $pdo->prepare("SELECT current_points FROM users WHERE id_user_PK = ?");
        $stmt_points->execute([$id_user]);
        $user_data = $stmt_points->fetch(PDO::FETCH_ASSOC);
        $new_points = $user_data['current_points'];

        // Actualizar la sesión
        $_SESSION['user']['current_points'] = $new_points;

        echo json_encode(['success' => true, 'new_points' => $new_points]);
    } else {
        echo json_encode(['success' => false, 'message' => $result['message']]);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de base de datos: ' . $e->getMessage()]);
}
?>