<?php
/**
 * Add new category
 */
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Only POST method allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validation
    if (!$input['name'] || !$input['icon'] || !$input['name_de'] || !$input['name_en'] || !$input['name_es']) {
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        exit;
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO categories (name, icon, name_de, name_en, name_es) 
        VALUES (:name, :icon, :name_de, :name_en, :name_es)
    ");
    
    $stmt->execute([
        'name' => $input['name'],
        'icon' => $input['icon'],
        'name_de' => $input['name_de'],
        'name_en' => $input['name_en'],
        'name_es' => $input['name_es']
    ]);
    
    $category_id = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'data' => ['id' => $category_id],
        'message' => 'Category created successfully'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
