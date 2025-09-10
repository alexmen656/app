<?php
/**
 * Simple Database Setup
 */

$host = 'localhost';
$dbname = 'kalbuddy_food_db';
$username = 'root';
$password = '';

try {
    // First connect without database to create it
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Read and execute schema
    $schema = file_get_contents(__DIR__ . '/database/schema.sql');
    
    // Execute each statement
    $statements = explode(';', $schema);
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement)) {
            $pdo->exec($statement);
        }
    }
    
    echo "<h1>✅ Database Setup Erfolgreich!</h1>";
    echo "<p>🗄️ Datenbank: <strong>$dbname</strong> wurde erstellt</p>";
    echo "<p>📊 Tabellen wurden erstellt</p>";
    echo "<p>🍎 25+ Standardprodukte wurden hinzugefügt</p>";
    echo "<br>";
    echo "<h2>Nächste Schritte:</h2>";
    echo "<ol>";
    echo "<li>Öffne <a href='admin.html'>admin.html</a> um neue Kategorien und Produkte hinzuzufügen</li>";
    echo "<li>Teste die API mit <a href='get_foods.php'>get_foods.php</a></li>";
    echo "<li>Schaue dir die Kategorien an: <a href='get_categories.php'>get_categories.php</a></li>";
    echo "</ol>";
    
} catch (Exception $e) {
    echo "<h1>❌ Fehler beim Setup</h1>";
    echo "<p>Error: " . $e->getMessage() . "</p>";
    echo "<p>Stelle sicher, dass MySQL läuft und die Zugangsdaten in db.php korrekt sind.</p>";
}
?>
