<?php 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
require_once '../db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['nombre']) || !isset($data['estado']) || !isset($data['plan'])) {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
    exit;
}

$nombre = $data['nombre'];
$email = isset($data['email']) ? $data['email'] : null;
$telefono = isset($data['telefono']) ? $data['telefono'] : null;
$estado = $data['estado'];
$plan = $data['plan'];

$stmt_estado = $pdo->prepare("SELECT id_estados FROM estados WHERE tipo_estado = ?");
$stmt_estado->execute([$estado]);
$id_estado = $stmt_estado->fetchColumn();

$stmt_plan = $pdo->prepare("SELECT id_planes FROM planes WHERE Tipo_plan = ?");
$stmt_plan->execute([$plan]);
$id_plan = $stmt_plan->fetchColumn();

if ($id_estado && $id_plan) {
    $sql = "INSERT INTO clientes_leads (nombre_cliente, email_cliente, telefono_cliente, id_estado, id_planes) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$nombre, $email, $telefono, $id_estado, $id_plan]);

    $clienteId = $pdo->lastInsertId();
    echo json_encode(['success' => true, 'id' => $clienteId]);
} else {
    echo json_encode(['success' => false, 'error' => 'Estado o plan inválido']);
}
?>
