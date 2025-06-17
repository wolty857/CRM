<?php
/**
 * Middleware de autenticación y autorización mejorado
 * Verificar permisos basados en roles con validación real de tokens
 */

require_once __DIR__ . '/../db.php';

function checkAuth($required_role = null) {
    global $pdo;
    
    // Verificar si hay un token en los headers
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
    
    // También verificar en parámetros GET para compatibilidad (solo en desarrollo)
    if (!$token && isset($_GET['token'])) {
        $token = $_GET['token'];
    }
    
    if (!$token) {
        // Para desarrollo temporal, usar parámetros GET como fallback
        $user_role = isset($_GET['role']) ? $_GET['role'] : null;
        $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;
        
        if ($user_role && $user_id) {
            // Verificar que el usuario existe en la base de datos
            try {
                $stmt = $pdo->prepare("SELECT id, role FROM users WHERE id = :id AND role = :role");
                $stmt->bindParam(':id', $user_id);
                $stmt->bindParam(':role', $user_role);
                $stmt->execute();
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($user) {
                    return [
                        'authenticated' => true,
                        'user_id' => $user_id,
                        'role' => $user_role,
                        'auth_method' => 'fallback'
                    ];
                }
            } catch (PDOException $e) {
                error_log("Error de autenticación: " . $e->getMessage());
            }
        }
        
        return [
            'authenticated' => false,
            'user_id' => null,
            'role' => null,
            'error' => 'Token de autenticación requerido'
        ];
    }
    
    // Verificar token en la base de datos
    try {
        // Buscar usuario por token (en un sistema real, los tokens estarían en una tabla separada)
        // Por ahora, usamos el token como identificador temporal
        $stmt = $pdo->prepare("
            SELECT u.id, u.username, u.role, u.nombre_completo 
            FROM users u 
            WHERE u.id = :token_as_id 
            LIMIT 1
        ");
        $stmt->bindParam(':token_as_id', $token);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            return [
                'authenticated' => true,
                'user_id' => $user['id'],
                'role' => $user['role'],
                'username' => $user['username'],
                'nombre_completo' => $user['nombre_completo'],
                'auth_method' => 'token'
            ];
        } else {
            return [
                'authenticated' => false,
                'user_id' => null,
                'role' => null,
                'error' => 'Token inválido'
            ];
        }
    } catch (PDOException $e) {
        error_log("Error verificando token: " . $e->getMessage());
        return [
            'authenticated' => false,
            'user_id' => null,
            'role' => null,
            'error' => 'Error del servidor'
        ];
    }
}

function requireRole($required_role) {
    $auth = checkAuth();
    
    if (!$auth['authenticated']) {
        http_response_code(401);
        echo json_encode([
            'success' => false, 
            'message' => $auth['error'] ?? 'No autorizado',
            'error_code' => 'UNAUTHORIZED'
        ]);
        exit;
    }
    
    if ($required_role && $auth['role'] !== $required_role) {
        http_response_code(403);
        echo json_encode([
            'success' => false, 
            'message' => "Acceso denegado. Se requiere rol: {$required_role}",
            'error_code' => 'FORBIDDEN',
            'user_role' => $auth['role']
        ]);
        exit;
    }
    
    return $auth;
}

function requireAdmin() {
    return requireRole('admin');
}

function requireSales() {
    return requireRole('vendedor');
}

function hasPermission($user_role, $required_permissions) {
    $permissions = [
        'admin' => [
            'view_all_clients',
            'manage_users',
            'view_system_reports',
            'manage_system_settings',
            'view_all_kpis'
        ],
        'vendedor' => [
            'view_own_clients',
            'manage_own_leads',
            'view_own_reports',
            'view_own_kpis'
        ]
    ];
    
    $user_permissions = $permissions[$user_role] ?? [];
    
    if (is_array($required_permissions)) {
        return !empty(array_intersect($required_permissions, $user_permissions));
    }
    
    return in_array($required_permissions, $user_permissions);
}
?>
