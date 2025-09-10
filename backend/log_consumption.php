<?php
/**
 * Log food consumption
 */
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Only POST method allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validation
    if (!$input['user_id'] || !$input['food_id'] || !$input['amount']) {
        echo json_encode(['success' => false, 'error' => 'Missing required fields: user_id, food_id, amount']);
        exit;
    }
    
    // Get food details
    $stmt = $pdo->prepare("SELECT * FROM kalbuddy_foods WHERE id = :id AND is_active = 1");
    $stmt->execute(['id' => (int)$input['food_id']]);
    $food = $stmt->fetch();
    
    if (!$food) {
        echo json_encode(['success' => false, 'error' => 'Food not found']);
        exit;
    }
    
    $amount = (float)$input['amount'];
    
    // Calculate totals
    $total_calories = $food['calories'] * $amount;
    $total_protein = $food['protein'] * $amount;
    $total_carbs = $food['carbs'] * $amount;
    $total_fats = $food['fats'] * $amount;
    
    // Log consumption
    $stmt = $pdo->prepare("
        INSERT INTO kalbuddy_food_consumption (
            user_id, food_id, amount,
            total_calories, total_protein, total_carbs, total_fats
        ) VALUES (
            :user_id, :food_id, :amount,
            :total_calories, :total_protein, :total_carbs, :total_fats
        )
    ");
    
    $stmt->execute([
        'user_id' => $input['user_id'],
        'food_id' => (int)$input['food_id'],
        'amount' => $amount,
        'total_calories' => $total_calories,
        'total_protein' => $total_protein,
        'total_carbs' => $total_carbs,
        'total_fats' => $total_fats
    ]);
    
    $log_id = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'data' => [
            'id' => $log_id,
            'totals' => [
                'calories' => round($total_calories, 2),
                'protein' => round($total_protein, 2),
                'carbs' => round($total_carbs, 2),
                'fats' => round($total_fats, 2)
            ]
        ],
        'message' => 'Food consumption logged successfully'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
