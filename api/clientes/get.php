<?php
// Permite que React (puerto 3001) consulte tu API
header("Access-Control-Allow-Origin: http://localhost:3001");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit; // responde OK a preflight
}

try {
    require_once '../db.php';    $sql = "SELECT c.id_cliente, c.nombre_cliente, c.email_cliente as email, c.telefono_cliente as telefono, e.tipo_estado, p.Tipo_plan 
            FROM clientes_leads c
            JOIN estados e ON c.id_estado = e.id_estados
            JOIN planes p ON c.id_planes = p.id_planes";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($clientes);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Error al obtener clientes: ' . $e->getMessage()
    ]);
}
?>
