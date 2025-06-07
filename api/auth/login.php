<?php
header("Access-Control-Allow-Origin: http://localhost:3001");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");

require_once '../db.php';

// Si es una solicitud OPTIONS (preflight), finaliza la ejecución
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


// Obtener los datos del JSON
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['username']) || !isset($input['password'])) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos requeridos']);
    exit;
}

$username = trim($input['username']);
$password = $input['password'];

try {
    // Buscar el usuario en la base de datos
    $stmt = $pdo->prepare("SELECT id, username, nombre_completo, password_hash, email, plan FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($password, $user['password_hash'])) {
        // Login exitoso
        $token = bin2hex(random_bytes(32)); // Generar token simple
        
        // Actualizar la última vez que se conectó (opcional)
        $updateStmt = $pdo->prepare("UPDATE users SET updated_at = NOW() WHERE id = :id");
        $updateStmt->bindParam(':id', $user['id']);
        $updateStmt->execute();
        
        // Remover la contraseña de la respuesta
        unset($user['password_hash']);
        
        echo json_encode([
            'success' => true,
            'message' => 'Login exitoso',
            'user' => $user,
            'token' => $token
        ]);
    } else {
        // Login fallido
        echo json_encode([
            'success' => false,
            'message' => 'Usuario o contraseña incorrectos'
        ]);
    }
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor: ' . $e->getMessage()
    ]);
}
?>
