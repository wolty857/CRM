<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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
    // Verificar que el usuario existe
    $checkSql = "SELECT id FROM users WHERE id = :id";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->bindParam(':id', $input['id']);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
        exit;
    }
    
    // Construir query dinámicamente basado en los campos enviados
    $updateFields = [];
    $params = [':id' => $input['id']];
    
    if (isset($input['username'])) {
        $updateFields[] = "username = :username";
        $params[':username'] = $input['username'];
    }
    
    if (isset($input['nombre_completo'])) {
        $updateFields[] = "nombre_completo = :nombre_completo";
        $params[':nombre_completo'] = $input['nombre_completo'];
    }
    
    if (isset($input['email'])) {
        $updateFields[] = "email = :email";
        $params[':email'] = $input['email'];
    }
    
    if (isset($input['role'])) {
        $updateFields[] = "role = :role";
        $params[':role'] = $input['role'];
    }
    
    if (isset($input['plan'])) {
        $updateFields[] = "plan = :plan";
        $params[':plan'] = $input['plan'];
    }
    
    // Si se envía una nueva contraseña, encriptarla
    if (isset($input['password']) && !empty($input['password'])) {
        $updateFields[] = "password_hash = :password_hash";
        $params[':password_hash'] = password_hash($input['password'], PASSWORD_DEFAULT);
    }
    
    if (empty($updateFields)) {
        echo json_encode(['success' => false, 'message' => 'No hay campos para actualizar']);
        exit;
    }
    
    // Verificar username y email únicos (solo si se están actualizando)
    if (isset($input['username']) || isset($input['email'])) {
        $uniqueCheckSql = "SELECT COUNT(*) FROM users WHERE (";
        $uniqueParams = [];
        $conditions = [];
        
        if (isset($input['username'])) {
            $conditions[] = "username = :check_username";
            $uniqueParams[':check_username'] = $input['username'];
        }
        
        if (isset($input['email'])) {
            $conditions[] = "email = :check_email";
            $uniqueParams[':check_email'] = $input['email'];
        }
        
        $uniqueCheckSql .= implode(' OR ', $conditions) . ") AND id != :check_id";
        $uniqueParams[':check_id'] = $input['id'];
        
        $uniqueStmt = $pdo->prepare($uniqueCheckSql);
        $uniqueStmt->execute($uniqueParams);
        
        if ($uniqueStmt->fetchColumn() > 0) {
            echo json_encode(['success' => false, 'message' => 'Username o email ya existe']);
            exit;
        }
    }
    
    // Actualizar usuario
    $sql = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    
    if ($stmt->execute($params)) {
        echo json_encode([
            'success' => true,
            'message' => 'Usuario actualizado exitosamente'
        ]);
    } else {
        throw new Exception('Error al actualizar usuario');
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error en la base de datos: ' . $e->getMessage()
    ]);
}
?>
