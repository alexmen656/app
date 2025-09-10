<?php
/**
 * Get all categories
 */
require_once 'db.php';

try {
    $lang = $_GET['lang'] ?? 'en';
    
    $stmt = $pdo->query("SELECT * FROM kalbuddy_categories ORDER BY id");
    $categories = $stmt->fetchAll();
    
    $result = [];
    foreach ($categories as $category) {
        $result[] = [
            'id' => (int)$category['id'],
            'code' => $category['name'],
            'icon' => $category['icon'],
            'name' => $category["name_$lang"] ?? $category['name_en']
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
