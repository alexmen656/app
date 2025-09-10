<?php
/**
 * Get all foods
 */
require_once 'db.php';

try {
    $category_id = $_GET['category'] ?? null;
    $search = $_GET['search'] ?? null;
    $lang = $_GET['lang'] ?? 'en';
    
    $query = "
        SELECT 
            f.*,
            c.name as category_name,
            u.code as unit_code,
            u.name_$lang as unit_name
        FROM kalbuddy_foods f
        LEFT JOIN kalbuddy_categories c ON f.category_id = c.id
        LEFT JOIN kalbuddy_units u ON f.unit_id = u.id
        WHERE f.is_active = 1
    ";
    
    $params = [];
    
    // Filter by category (skip 'all' category)
    if ($category_id && $category_id != 1) {
        $query .= " AND f.category_id = :category_id";
        $params['category_id'] = $category_id;
    }
    
    // Search functionality
    if ($search) {
        $query .= " AND (f.name_de LIKE :search OR f.name_en LIKE :search OR f.name_es LIKE :search)";
        $params['search'] = '%' . $search . '%';
    }
    
    $query .= " ORDER BY f.name_en";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $foods = $stmt->fetchAll();
    
    $result = [];
    foreach ($foods as $food) {
        $result[] = [
            'id' => (int)$food['id'],
            'code' => $food['code'],
            'category_id' => (int)$food['category_id'],
            'icon' => $food['icon'],
            'name' => $food["name_$lang"] ?? $food['name_en'],
            'calories' => (float)$food['calories'],
            'protein' => (float)$food['protein'],
            'carbs' => (float)$food['carbs'],
            'fats' => (float)$food['fats'],
            'unit' => $food['unit_code'],
            'unit_name' => $food['unit_name']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $result,
        'count' => count($result)
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
