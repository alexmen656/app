<?php
/**
 * Get available units
 */
require_once 'db.php';

try {
    $lang = $_GET['lang'] ?? 'en';
    
    $stmt = $pdo->query("SELECT * FROM units ORDER BY id");
    $units = $stmt->fetchAll();
    
    $result = [];
    foreach ($units as $unit) {
        $result[] = [
            'id' => (int)$unit['id'],
            'code' => $unit['code'],
            'name' => $unit["name_$lang"] ?? $unit['name_en']
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
