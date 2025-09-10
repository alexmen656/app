<?php

namespace KalBuddy\Models;

use KalBuddy\Database\Database;

/**
 * Category Model
 */
class Category
{
    /**
     * Get all categories
     */
    public static function getAll(string $language = 'en'): array
    {
        $query = "
            SELECT 
                id,
                name,
                icon,
                name_de,
                name_en,
                name_es
            FROM categories
            ORDER BY id ASC
        ";

        $results = Database::fetchAll($query);

        return array_map(function($row) use ($language) {
            return [
                'id' => (int)$row['id'],
                'code' => $row['name'],
                'icon' => $row['icon'],
                'name' => $row["name_$language"] ?? $row['name_en']
            ];
        }, $results);
    }

    /**
     * Get category by ID
     */
    public static function getById(int $id, string $language = 'en'): ?array
    {
        $query = "
            SELECT 
                id,
                name,
                icon,
                name_de,
                name_en,
                name_es
            FROM categories
            WHERE id = :id
        ";

        $result = Database::fetchOne($query, ['id' => $id]);

        if (!$result) {
            return null;
        }

        return [
            'id' => (int)$result['id'],
            'code' => $result['name'],
            'icon' => $result['icon'],
            'name' => $result["name_$language"] ?? $result['name_en']
        ];
    }

    /**
     * Get foods count per category
     */
    public static function getFoodsCount(): array
    {
        $query = "
            SELECT 
                c.id,
                c.name,
                c.icon,
                COUNT(f.id) as foods_count
            FROM categories c
            LEFT JOIN foods f ON c.id = f.category_id AND f.is_active = 1
            GROUP BY c.id, c.name, c.icon
            ORDER BY c.id ASC
        ";

        return Database::fetchAll($query);
    }
}
