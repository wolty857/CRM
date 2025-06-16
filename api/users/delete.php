<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID de usuario requerido']);
    exit;
}

try {
    // Verificar que no sea admin
    $checkSql = "SELECT role FROM users WHERE id = :id";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->bindParam(':id', $input['id']);
    $checkStmt->execute();
    
    $user = $checkStmt->fetch(PDO::FETCH_ASSOC);
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
        exit;
    }
    
    if ($user['role'] === 'admin') {
        echo json_encode(['success' => false, 'message' => 'No se puede eliminar un administrador']);
        exit;
    }
    
    // Actualizar clientes asignados para que no tengan vendedor
    $updateClientsSql = "UPDATE clientes_leads SET vendedor_asignado = NULL WHERE vendedor_asignado = :id";
    $updateClientsStmt = $pdo->prepare($updateClientsSql);
    $updateClientsStmt->bindParam(':id', $input['id']);
    $updateClientsStmt->execute();
    
    // Eliminar usuario
    $sql = "DELETE FROM users WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $input['id']);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Usuario eliminado exitosamente'
        ]);
    } else {
        throw new Exception('Error al eliminar usuario');
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error en la base de datos: ' . $e->getMessage()
    ]);
}
?>
