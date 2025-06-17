<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

try {
    require_once '../db.php';
    require_once '../middleware/auth.php';

    // Verificar autenticación mejorada
    $auth = checkAuth();
    
    if (!$auth['authenticated']) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => $auth['error'] ?? 'No autorizado',
            'error_code' => 'UNAUTHORIZED'
        ]);
        exit;
    }
    
    $user_role = $auth['role'];
    $user_id = $auth['user_id'];

    if ($user_role === 'admin') {
        // KPIs para ADMIN - Vista general del sistema
        
        // Obtener total de clientes
        $sql_total = "SELECT COUNT(*) as total FROM clientes_leads";
        $stmt_total = $pdo->prepare($sql_total);
        $stmt_total->execute();
        $total_clientes = $stmt_total->fetchColumn();

        // Obtener total de usuarios activos (vendedores)
        $sql_usuarios = "SELECT COUNT(*) as total FROM users WHERE role = 'vendedor'";
        $stmt_usuarios = $pdo->prepare($sql_usuarios);
        $stmt_usuarios->execute();
        $usuarios_activos = $stmt_usuarios->fetchColumn();

        // Obtener planes activos (clientes que tienen planes)
        $sql_planes_activos = "SELECT COUNT(DISTINCT id_planes) as total FROM clientes_leads WHERE id_planes IS NOT NULL";
        $stmt_planes_activos = $pdo->prepare($sql_planes_activos);
        $stmt_planes_activos->execute();
        $planes_activos = $stmt_planes_activos->fetchColumn();
        
    } else {
        // KPIs para VENDEDOR - Vista personal
        
        // Obtener clientes asignados al vendedor
        $sql_total = "SELECT COUNT(*) as total FROM clientes_leads WHERE vendedor_asignado = :user_id";
        $stmt_total = $pdo->prepare($sql_total);
        $stmt_total->bindParam(':user_id', $user_id);
        $stmt_total->execute();
        $total_clientes = $stmt_total->fetchColumn();
        
        $usuarios_activos = 0; // No aplica para vendedores
        $planes_activos = 0; // No aplica para vendedores
    }    // Obtener clientes por estado (filtrado por rol)
    if ($user_role === 'admin') {
        $sql_estados = "SELECT e.tipo_estado, COUNT(c.id_cliente) as cantidad 
                        FROM estados e 
                        LEFT JOIN clientes_leads c ON e.id_estados = c.id_estado 
                        GROUP BY e.id_estados, e.tipo_estado";
        $stmt_estados = $pdo->prepare($sql_estados);
        $stmt_estados->execute();
    } else {
        $sql_estados = "SELECT e.tipo_estado, COUNT(c.id_cliente) as cantidad 
                        FROM estados e 
                        LEFT JOIN clientes_leads c ON e.id_estados = c.id_estado 
                        WHERE c.vendedor_asignado = :user_id OR c.vendedor_asignado IS NULL
                        GROUP BY e.id_estados, e.tipo_estado";
        $stmt_estados = $pdo->prepare($sql_estados);
        $stmt_estados->bindParam(':user_id', $user_id);
        $stmt_estados->execute();
    }
    $estados_data = $stmt_estados->fetchAll(PDO::FETCH_ASSOC);

    // Obtener clientes por plan (filtrado por rol)
    if ($user_role === 'admin') {
        $sql_planes = "SELECT p.Tipo_plan, COUNT(c.id_cliente) as cantidad 
                       FROM planes p 
                       LEFT JOIN clientes_leads c ON p.id_planes = c.id_planes 
                       GROUP BY p.id_planes, p.Tipo_plan";
        $stmt_planes = $pdo->prepare($sql_planes);
        $stmt_planes->execute();
    } else {
        $sql_planes = "SELECT p.Tipo_plan, COUNT(c.id_cliente) as cantidad 
                       FROM planes p 
                       LEFT JOIN clientes_leads c ON p.id_planes = c.id_planes 
                       WHERE c.vendedor_asignado = :user_id OR c.vendedor_asignado IS NULL
                       GROUP BY p.id_planes, p.Tipo_plan";
        $stmt_planes = $pdo->prepare($sql_planes);
        $stmt_planes->bindParam(':user_id', $user_id);
        $stmt_planes->execute();
    }
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
    }    // Calcular tasa de conversión (solo para vendedores, no para admin)
    $leads_activos = $clientes_frios + $clientes_tibios + $clientes_calientes;
    $tasa_conversion = ($user_role === 'vendedor' && $leads_activos > 0) ? round(($clientes_calientes / $leads_activos) * 100, 1) : 0;

    // Preparar respuesta diferenciada por rol
    $kpis_data = [
        'total_clientes' => $total_clientes,
        'ingresos_estimados' => $ingresos_estimados,
    ];

    if ($user_role === 'admin') {
        $kpis_data['usuarios_activos'] = $usuarios_activos;
        $kpis_data['planes_activos'] = $planes_activos;
        // Admin no necesita tasa de conversión
    } else {
        $kpis_data['clientes_calientes'] = $clientes_calientes;
        $kpis_data['tasa_conversion'] = $tasa_conversion;
    }

    $response = [
        'success' => true,
        'kpis' => $kpis_data,
        'estados' => $estados_data,
        'planes' => $planes_data,
        'metricas_detalladas' => [
            'frios' => $clientes_frios,
            'tibios' => $clientes_tibios,
            'calientes' => $clientes_calientes,
            'perdidos' => $clientes_perdidos
        ],
        'user_role' => $user_role
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
