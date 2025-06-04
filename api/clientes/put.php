<?php
header('Content-Type: application/json');
require_once '../db.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$nombre = $data['nombre'];
$estado = $data['estado'];
$plan = $data['plan'];

$stmt_estado = $pdo->prepare("SELECT id_estados FROM estados WHERE tipo_estado = ?");
$stmt_estado->execute([$estado]);
$id_estado = $stmt_estado->fetchColumn();

$stmt_plan = $pdo->prepare("SELECT id_planes FROM planes WHERE Tipo_plan = ?");
$stmt_plan->execute([$plan]);
$id_plan = $stmt_plan->fetchColumn();

if ($id_estado && $id_plan) {
    $sql = "UPDATE clientes_leads SET nombre_cliente = ?, id_estado = ?, id_planes = ? WHERE id_cliente = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$nombre, $id_estado, $id_plan, $id]);

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Estado o plan inválido']);
}
?>
