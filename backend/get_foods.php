<?php
/**
 * Get all foods
 */
require_once 'db.php';

try {
    $category_id = $_GET['category'] ?? null;
    $search = $_GET['search'] ?? null;
    
    $query = "
        SELECT 
            f.*,
            c.name as category_name,
            u.code as unit_code,
            u.name_de as unit_name_de,
            u.name_en as unit_name_en,
            u.name_es as unit_name_es
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
            'names' => [
                'de' => $food['name_de'],
                'en' => $food['name_en'],
                'es' => $food['name_es']
            ],
            'calories' => (float)$food['calories'],
            'protein' => (float)$food['protein'],
            'carbs' => (float)$food['carbs'],
            'fats' => (float)$food['fats'],
            'unit' => $food['unit_code'],
            'unit_names' => [
                'de' => $food['unit_name_de'],
                'en' => $food['unit_name_en'],
                'es' => $food['unit_name_es']
            ]
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
