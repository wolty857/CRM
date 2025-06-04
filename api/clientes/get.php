<?php
header('Content-Type: application/json');
require_once '../db.php';

$sql = "SELECT c.id_cliente, c.nombre_cliente, e.tipo_estado, p.Tipo_plan 
        FROM clientes_leads c
        JOIN estados e ON c.id_estado = e.id_estados
        JOIN planes p ON c.id_planes = p.id_planes";

$stmt = $pdo->prepare($sql);
$stmt->execute();

$clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($clientes);
?>
