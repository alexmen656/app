<?php

namespace Digmio\Controllers;

use Digmio\Models\Food;

/**
 * Food Controller
 */
class FoodController
{
    /**
     * Get all foods
     */
    public function index(): array
    {
        try {
            $categoryId = $_GET['category'] ?? null;
            $search = $_GET['search'] ?? null;
            $language = $_GET['lang'] ?? 'en';

            $foods = Food::getAll(
                $categoryId ? (int)$categoryId : null,
                $search,
                $language
            );

            return [
                'success' => true,
                'data' => $foods,
                'count' => count($foods)
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get single food by ID
     */
    public function show(int $id): array
    {
        try {
            $language = $_GET['lang'] ?? 'en';
            $food = Food::getById($id, $language);

            if (!$food) {
                return [
                    'success' => false,
                    'error' => 'Food not found'
                ];
            }

            return [
                'success' => true,
                'data' => $food
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Create new food item
     */
    public function create(): array
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);

            // Validation
            $required = ['code', 'category_id', 'unit_id', 'icon', 'name_de', 'name_en', 'name_es', 'calories'];
            foreach ($required as $field) {
                if (!isset($input[$field])) {
                    return [
                        'success' => false,
                        'error' => "Missing required field: $field"
                    ];
                }
            }

            $foodId = Food::create($input);

            return [
                'success' => true,
                'data' => ['id' => $foodId],
                'message' => 'Food created successfully'
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Log food consumption
     */
    public function logConsumption(): array
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);

            // Validation
            $required = ['user_id', 'food_id', 'amount'];
            foreach ($required as $field) {
                if (!isset($input[$field])) {
                    return [
                        'success' => false,
                        'error' => "Missing required field: $field"
                    ];
                }
            }

            $logId = Food::logConsumption(
                $input['user_id'],
                (int)$input['food_id'],
                (float)$input['amount']
            );

            return [
                'success' => true,
                'data' => ['id' => $logId],
                'message' => 'Food consumption logged successfully'
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get user consumption history
     */
    public function getUserConsumption(): array
    {
        try {
            $userId = $_GET['user_id'] ?? null;
            $date = $_GET['date'] ?? null;

            if (!$userId) {
                return [
                    'success' => false,
                    'error' => 'User ID is required'
                ];
            }

            $consumption = Food::getUserConsumption($userId, $date);

            return [
                'success' => true,
                'data' => $consumption,
                'count' => count($consumption)
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Search foods
     */
    public function search(): array
    {
        try {
            $query = $_GET['q'] ?? '';
            $language = $_GET['lang'] ?? 'en';
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;

            if (strlen($query) < 2) {
                return [
                    'success' => false,
                    'error' => 'Search query must be at least 2 characters long'
                ];
            }

            $foods = Food::getAll(null, $query, $language);
            
            // Limit results
            $foods = array_slice($foods, 0, $limit);

            return [
                'success' => true,
                'data' => $foods,
                'count' => count($foods),
                'query' => $query
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
