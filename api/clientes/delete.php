<?php
header('Content-Type: application/json');
require_once '../db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];

$sql = "DELETE FROM clientes_leads WHERE id_cliente = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$id]);

echo json_encode(['success' => true]);
?>
