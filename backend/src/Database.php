<?php

namespace KalBuddy\Database;

use PDO;
use PDOException;

/**
 * Database Connection Manager
 */
class Database
{
    private static ?PDO $connection = null;
    private static ?self $instance = null;

    private function __construct() {}

    /**
     * Get singleton instance
     */
    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Get database connection
     */
    public static function getConnection(): PDO
    {
        if (self::$connection === null) {
            try {
                $config = require __DIR__ . '/../config/database.php';
                
                $dsn = sprintf(
                    'mysql:host=%s;port=%d;dbname=%s;charset=%s',
                    $config['host'],
                    $config['port'],
                    $config['database'],
                    $config['charset']
                );

                self::$connection = new PDO(
                    $dsn,
                    $config['username'],
                    $config['password'],
                    $config['options']
                );

            } catch (PDOException $e) {
                throw new PDOException("Database connection failed: " . $e->getMessage());
            }
        }

        return self::$connection;
    }

    /**
     * Execute a prepared statement
     */
    public static function execute(string $query, array $params = []): \PDOStatement
    {
        $connection = self::getConnection();
        $stmt = $connection->prepare($query);
        $stmt->execute($params);
        return $stmt;
    }

    /**
     * Fetch single row
     */
    public static function fetchOne(string $query, array $params = []): ?array
    {
        $stmt = self::execute($query, $params);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    /**
     * Fetch multiple rows
     */
    public static function fetchAll(string $query, array $params = []): array
    {
        $stmt = self::execute($query, $params);
        return $stmt->fetchAll();
    }

    /**
     * Get last insert ID
     */
    public static function lastInsertId(): string
    {
        return self::getConnection()->lastInsertId();
    }

    /**
     * Begin transaction
     */
    public static function beginTransaction(): bool
    {
        return self::getConnection()->beginTransaction();
    }

    /**
     * Commit transaction
     */
    public static function commit(): bool
    {
        return self::getConnection()->commit();
    }

    /**
     * Rollback transaction
     */
    public static function rollback(): bool
    {
        return self::getConnection()->rollback();
    }
}
