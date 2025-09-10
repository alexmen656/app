<?php

namespace KalBuddy\Models;

use KalBuddy\Database\Database;

/**
 * Food Model
 */
class Food
{
    private int $id;
    private string $code;
    private int $categoryId;
    private int $unitId;
    private string $icon;
    private array $names;
    private float $calories;
    private float $protein;
    private float $carbs;
    private float $fats;
    private ?float $fiber;
    private ?float $sugar;
    private ?float $sodium;
    private bool $isActive;

    /**
     * Get all foods
     */
    public static function getAll(?int $categoryId = null, ?string $search = null, string $language = 'en'): array
    {
        $query = "
            SELECT 
                f.id,
                f.code,
                f.category_id,
                f.unit_id,
                f.icon,
                f.name_de,
                f.name_en,
                f.name_es,
                f.calories,
                f.protein,
                f.carbs,
                f.fats,
                f.fiber,
                f.sugar,
                f.sodium,
                c.name as category_name,
                u.code as unit_code,
                u.name_de as unit_name_de,
                u.name_en as unit_name_en,
                u.name_es as unit_name_es
            FROM foods f
            LEFT JOIN categories c ON f.category_id = c.id
            LEFT JOIN units u ON f.unit_id = u.id
            WHERE f.is_active = 1
        ";

        $params = [];

        // Filter by category
        if ($categoryId && $categoryId > 1) { // Skip 'all' category (id=1)
            $query .= " AND f.category_id = :category_id";
            $params['category_id'] = $categoryId;
        }

        // Search functionality
        if ($search) {
            $query .= " AND (
                f.name_de LIKE :search OR 
                f.name_en LIKE :search OR 
                f.name_es LIKE :search OR
                f.code LIKE :search
            )";
            $params['search'] = '%' . $search . '%';
        }

        $query .= " ORDER BY f.name_en ASC";

        $results = Database::fetchAll($query, $params);

        return array_map(function($row) use ($language) {
            return [
                'id' => (int)$row['id'],
                'code' => $row['code'],
                'category_id' => (int)$row['category_id'],
                'icon' => $row['icon'],
                'name' => $row["name_$language"] ?? $row['name_en'],
                'calories' => (float)$row['calories'],
                'protein' => (float)$row['protein'],
                'carbs' => (float)$row['carbs'],
                'fats' => (float)$row['fats'],
                'fiber' => $row['fiber'] ? (float)$row['fiber'] : null,
                'sugar' => $row['sugar'] ? (float)$row['sugar'] : null,
                'sodium' => $row['sodium'] ? (float)$row['sodium'] : null,
                'unit' => $row['unit_code'],
                'unit_name' => $row["unit_name_$language"] ?? $row['unit_name_en'],
                'category' => $row['category_name']
            ];
        }, $results);
    }

    /**
     * Get food by ID
     */
    public static function getById(int $id, string $language = 'en'): ?array
    {
        $query = "
            SELECT 
                f.id,
                f.code,
                f.category_id,
                f.unit_id,
                f.icon,
                f.name_de,
                f.name_en,
                f.name_es,
                f.calories,
                f.protein,
                f.carbs,
                f.fats,
                f.fiber,
                f.sugar,
                f.sodium,
                c.name as category_name,
                u.code as unit_code,
                u.name_de as unit_name_de,
                u.name_en as unit_name_en,
                u.name_es as unit_name_es
            FROM foods f
            LEFT JOIN categories c ON f.category_id = c.id
            LEFT JOIN units u ON f.unit_id = u.id
            WHERE f.id = :id AND f.is_active = 1
        ";

        $result = Database::fetchOne($query, ['id' => $id]);

        if (!$result) {
            return null;
        }

        return [
            'id' => (int)$result['id'],
            'code' => $result['code'],
            'category_id' => (int)$result['category_id'],
            'icon' => $result['icon'],
            'name' => $result["name_$language"] ?? $result['name_en'],
            'calories' => (float)$result['calories'],
            'protein' => (float)$result['protein'],
            'carbs' => (float)$result['carbs'],
            'fats' => (float)$result['fats'],
            'fiber' => $result['fiber'] ? (float)$result['fiber'] : null,
            'sugar' => $result['sugar'] ? (float)$result['sugar'] : null,
            'sodium' => $result['sodium'] ? (float)$result['sodium'] : null,
            'unit' => $result['unit_code'],
            'unit_name' => $result["unit_name_$language"] ?? $result['unit_name_en'],
            'category' => $result['category_name']
        ];
    }

    /**
     * Create new food item
     */
    public static function create(array $data): int
    {
        $query = "
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
        ";

        Database::execute($query, [
            'code' => $data['code'],
            'category_id' => $data['category_id'],
            'unit_id' => $data['unit_id'],
            'icon' => $data['icon'],
            'name_de' => $data['name_de'],
            'name_en' => $data['name_en'],
            'name_es' => $data['name_es'],
            'calories' => $data['calories'],
            'protein' => $data['protein'] ?? 0,
            'carbs' => $data['carbs'] ?? 0,
            'fats' => $data['fats'] ?? 0,
            'fiber' => $data['fiber'] ?? null,
            'sugar' => $data['sugar'] ?? null,
            'sodium' => $data['sodium'] ?? null,
        ]);

        return (int)Database::lastInsertId();
    }

    /**
     * Log food consumption
     */
    public static function logConsumption(string $userId, int $foodId, float $amount): int
    {
        // Get food details
        $food = self::getById($foodId);
        if (!$food) {
            throw new \Exception('Food not found');
        }

        // Calculate totals
        $totalCalories = $food['calories'] * $amount;
        $totalProtein = $food['protein'] * $amount;
        $totalCarbs = $food['carbs'] * $amount;
        $totalFats = $food['fats'] * $amount;

        $query = "
            INSERT INTO food_consumption (
                user_id, food_id, amount,
                total_calories, total_protein, total_carbs, total_fats
            ) VALUES (
                :user_id, :food_id, :amount,
                :total_calories, :total_protein, :total_carbs, :total_fats
            )
        ";

        Database::execute($query, [
            'user_id' => $userId,
            'food_id' => $foodId,
            'amount' => $amount,
            'total_calories' => $totalCalories,
            'total_protein' => $totalProtein,
            'total_carbs' => $totalCarbs,
            'total_fats' => $totalFats,
        ]);

        return (int)Database::lastInsertId();
    }

    /**
     * Get user's consumption history
     */
    public static function getUserConsumption(string $userId, ?string $date = null): array
    {
        $query = "
            SELECT 
                fc.*,
                f.name_en as food_name,
                f.icon as food_icon,
                f.code as food_code
            FROM food_consumption fc
            LEFT JOIN foods f ON fc.food_id = f.id
            WHERE fc.user_id = :user_id
        ";

        $params = ['user_id' => $userId];

        if ($date) {
            $query .= " AND DATE(fc.consumed_at) = :date";
            $params['date'] = $date;
        }

        $query .= " ORDER BY fc.consumed_at DESC";

        return Database::fetchAll($query, $params);
    }
}
