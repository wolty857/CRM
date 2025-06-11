<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

try {
    require_once '../db.php';

    // Obtener total de clientes
    $sql_total = "SELECT COUNT(*) as total FROM clientes_leads";
    $stmt_total = $pdo->prepare($sql_total);
    $stmt_total->execute();
    $total_clientes = $stmt_total->fetchColumn();

    // Obtener clientes por estado
    $sql_estados = "SELECT e.tipo_estado, COUNT(c.id_cliente) as cantidad 
                    FROM estados e 
                    LEFT JOIN clientes_leads c ON e.id_estados = c.id_estado 
                    GROUP BY e.id_estados, e.tipo_estado";
    $stmt_estados = $pdo->prepare($sql_estados);
    $stmt_estados->execute();
    $estados_data = $stmt_estados->fetchAll(PDO::FETCH_ASSOC);

    // Obtener clientes por plan
    $sql_planes = "SELECT p.Tipo_plan, COUNT(c.id_cliente) as cantidad 
                   FROM planes p 
                   LEFT JOIN clientes_leads c ON p.id_planes = c.id_planes 
                   GROUP BY p.id_planes, p.Tipo_plan";
    $stmt_planes = $pdo->prepare($sql_planes);
    $stmt_planes->execute();
    $planes_data = $stmt_planes->fetchAll(PDO::FETCH_ASSOC);

    // Calcular métricas
    $clientes_frios = 0;
    $clientes_tibios = 0;
    $clientes_calientes = 0;
    $clientes_perdidos = 0;

    foreach ($estados_data as $estado) {
        switch ($estado['tipo_estado']) {
            case 'Frío':
                $clientes_frios = $estado['cantidad'];
                break;
            case 'Tibio':
                $clientes_tibios = $estado['cantidad'];
                break;
            case 'Caliente':
                $clientes_calientes = $estado['cantidad'];
                break;
            case 'Cliente Perdido':
                $clientes_perdidos = $estado['cantidad'];
                break;
        }
    }

    // Calcular ingresos estimados (basado en planes)
    $ingresos_estimados = 0;
    foreach ($planes_data as $plan) {
        switch ($plan['Tipo_plan']) {
            case 'Plan Básico':
                $ingresos_estimados += $plan['cantidad'] * 50; // $50 por mes
                break;
            case 'Plan Pro':
                $ingresos_estimados += $plan['cantidad'] * 100; // $100 por mes
                break;
            case 'Plan Premium':
                $ingresos_estimados += $plan['cantidad'] * 200; // $200 por mes
                break;
        }
    }

    // Calcular tasa de conversión (Calientes / Total de leads activos)
    $leads_activos = $clientes_frios + $clientes_tibios + $clientes_calientes;
    $tasa_conversion = $leads_activos > 0 ? round(($clientes_calientes / $leads_activos) * 100, 1) : 0;

    // Preparar respuesta
    $response = [
        'success' => true,
        'kpis' => [
            'total_clientes' => $total_clientes,
            'clientes_calientes' => $clientes_calientes,
            'ingresos_estimados' => $ingresos_estimados,
            'tasa_conversion' => $tasa_conversion
        ],
        'estados' => $estados_data,
        'planes' => $planes_data,
        'metricas_detalladas' => [
            'frios' => $clientes_frios,
            'tibios' => $clientes_tibios,
            'calientes' => $clientes_calientes,
            'perdidos' => $clientes_perdidos
        ]
    ];

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error al obtener KPIs: ' . $e->getMessage()
    ]);
}
?>
