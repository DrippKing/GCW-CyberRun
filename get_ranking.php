<?php
// get_ranking.php
// Este script se encarga de obtener y devolver los datos del ranking.

header('Content-Type: application/json');
require_once 'config_db.php'; // Reutilizamos la conexión a la BD

try {
    // Consultamos la tabla 'top_ranking' para obtener los 10 mejores puntajes.
    // Esta consulta es extremadamente rápida porque la tabla ya contiene los datos necesarios.
    // No es necesario ordenar la tabla 'users' completa en cada petición.
    $stmt = $pdo->query("SELECT u_name, max_score FROM top_ranking ORDER BY max_score DESC LIMIT 3");
    
    $ranking = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'ranking' => $ranking]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al obtener el ranking desde la base de datos.']);
}
?>