<?php
/**
 * Database Setup Script
 * Run this once to set up the database
 */

require_once 'autoload.php';

try {
    // Read database configuration
    $config = require 'config/database.php';
    
    // Create connection without database name for initial setup
    $dsn = sprintf('mysql:host=%s;port=%d;charset=%s', 
        $config['host'], 
        $config['port'], 
        $config['charset']
    );
    
    $pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);
    
    // Read and execute schema
    $schema = file_get_contents(__DIR__ . '/database/schema.sql');
    
    // Split by semicolon and execute each statement
    $statements = array_filter(array_map('trim', explode(';', $schema)));
    
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            $pdo->exec($statement);
            echo "✓ Executed: " . substr($statement, 0, 50) . "...\n";
        }
    }
    
    echo "\n🎉 Database setup completed successfully!\n";
    echo "📊 Database: {$config['database']}\n";
    echo "🏠 Host: {$config['host']}:{$config['port']}\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
