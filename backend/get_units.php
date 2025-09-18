<?php
/**
 * Get available units
 */
require_once 'db.php';

try {
    $stmt = $pdo->query("SELECT * FROM kalbuddy_units ORDER BY id");
    $units = $stmt->fetchAll();
    
    $result = [];
    foreach ($units as $unit) {
        $result[] = [
            'id' => (int)$unit['id'],
            'code' => $unit['code'],
            'names' => [
                'de' => $unit['name_de'],
                'en' => $unit['name_en'],
                'es' => $unit['name_es']
            ]
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $result
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
