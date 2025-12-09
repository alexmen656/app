<?php
/**
 * Simple PSR-4 Autoloader
 * Digmio Food API
 */

spl_autoload_register(function ($className) {
    // Base namespace
    $baseNamespace = 'Digmio\\';
    
    // Base directory for the namespace prefix
    $baseDirectory = __DIR__ . '/src/';
    
    // Check if the class uses the namespace prefix
    $len = strlen($baseNamespace);
    if (strncmp($baseNamespace, $className, $len) !== 0) {
        // Not our namespace, let other autoloaders handle it
        return;
    }
    
    // Get the relative class name
    $relativeClassName = substr($className, $len);
    
    // Replace namespace separators with directory separators
    $file = $baseDirectory . str_replace('\\', '/', $relativeClassName) . '.php';
    
    // If the file exists, require it
    if (file_exists($file)) {
        require $file;
    }
});
