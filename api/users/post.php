<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['username']) || !isset($input['password']) || !isset($input['email'])) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos requeridos']);
    exit;
}

try {
    // Verificar si el usuario ya existe
    $checkSql = "SELECT COUNT(*) FROM users WHERE username = :username OR email = :email";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->bindParam(':username', $input['username']);
    $checkStmt->bindParam(':email', $input['email']);
    $checkStmt->execute();
    
    if ($checkStmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Usuario o email ya existe']);
        exit;
    }
    
    // Encriptar password
    $passwordHash = password_hash($input['password'], PASSWORD_DEFAULT);
    
    // Insertar nuevo usuario
    $sql = "INSERT INTO users (username, nombre_completo, password_hash, email, role, plan) 
            VALUES (:username, :nombre_completo, :password_hash, :email, :role, :plan)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':username', $input['username']);
    $stmt->bindParam(':nombre_completo', $input['nombre_completo']);
    $stmt->bindParam(':password_hash', $passwordHash);
    $stmt->bindParam(':email', $input['email']);
    $stmt->bindParam(':role', $input['role']);
    $stmt->bindParam(':plan', $input['plan']);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Usuario creado exitosamente',
            'user_id' => $pdo->lastInsertId()
        ]);
    } else {
        throw new Exception('Error al insertar usuario');
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error en la base de datos: ' . $e->getMessage()
    ]);
}
?>
