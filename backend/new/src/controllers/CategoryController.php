<?php

namespace KalBuddy\Controllers;

use KalBuddy\Models\Category;

/**
 * Category Controller
 */
class CategoryController
{
    /**
     * Get all categories
     */
    public function index(): array
    {
        try {
            $language = $_GET['lang'] ?? 'en';
            $categories = Category::getAll($language);

            return [
                'success' => true,
                'data' => $categories,
                'count' => count($categories)
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get single category by ID
     */
    public function show(int $id): array
    {
        try {
            $language = $_GET['lang'] ?? 'en';
            $category = Category::getById($id, $language);

            if (!$category) {
                return [
                    'success' => false,
                    'error' => 'Category not found'
                ];
            }

            return [
                'success' => true,
                'data' => $category
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get categories with food counts
     */
    public function stats(): array
    {
        try {
            $stats = Category::getFoodsCount();

            return [
                'success' => true,
                'data' => $stats,
                'count' => count($stats)
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
