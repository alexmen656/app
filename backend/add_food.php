<?php
/**
 * Add new food item
 */
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Only POST method allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validation
    $required = ['code', 'category_id', 'unit_id', 'icon', 'name_de', 'name_en', 'name_es', 'calories'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || $input[$field] === '') {
            echo json_encode(['success' => false, 'error' => "Missing required field: $field"]);
            exit;
        }
    }
    
    // Check if code already exists
    $stmt = $pdo->prepare("SELECT id FROM foods WHERE code = :code");
    $stmt->execute(['code' => $input['code']]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'error' => 'Food code already exists']);
        exit;
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO foods (
            code, category_id, unit_id, icon,
            name_de, name_en, name_es,
            calories, protein, carbs, fats,
            fiber, sugar, sodium
        ) VALUES (
            :code, :category_id, :unit_id, :icon,
            :name_de, :name_en, :name_es,
            :calories, :protein, :carbs, :fats,
            :fiber, :sugar, :sodium
        )
    ");
    
    $stmt->execute([
        'code' => $input['code'],
        'category_id' => (int)$input['category_id'],
        'unit_id' => (int)$input['unit_id'],
        'icon' => $input['icon'],
        'name_de' => $input['name_de'],
        'name_en' => $input['name_en'],
        'name_es' => $input['name_es'],
        'calories' => (float)$input['calories'],
        'protein' => (float)($input['protein'] ?? 0),
        'carbs' => (float)($input['carbs'] ?? 0),
        'fats' => (float)($input['fats'] ?? 0),
        'fiber' => isset($input['fiber']) ? (float)$input['fiber'] : null,
        'sugar' => isset($input['sugar']) ? (float)$input['sugar'] : null,
        'sodium' => isset($input['sodium']) ? (float)$input['sodium'] : null
    ]);
    
    $food_id = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'data' => ['id' => $food_id],
        'message' => 'Food item created successfully'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
