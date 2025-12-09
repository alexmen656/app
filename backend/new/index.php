<?php
/**
 * Digmio Food API
 * Entry Point
 */

require_once __DIR__ . '/autoload.php';

use Digmio\Router\Router;
use Digmio\Controllers\FoodController;
use Digmio\Controllers\CategoryController;
use Digmio\Middleware\CorsMiddleware;

// Set timezone
date_default_timezone_set('UTC');

// Handle CORS
CorsMiddleware::handle();

// Set content type
header('Content-Type: application/json');

// Initialize router
$router = new Router('/api');

// Health check
$router->get('/health', function() {
    return [
        'success' => true,
        'message' => 'Digmio Food API is running',
        'version' => '1.0.0',
        'timestamp' => date('c')
    ];
});

// Categories routes
$router->get('/categories', function() {
    $controller = new CategoryController();
    return $controller->index();
});

$router->get('/categories/{id}', function($params) {
    $controller = new CategoryController();
    return $controller->show($params['id']);
});

$router->get('/categories/stats', function() {
    $controller = new CategoryController();
    return $controller->stats();
});

// Foods routes
$router->get('/foods', function() {
    $controller = new FoodController();
    return $controller->index();
});

$router->get('/foods/{id}', function($params) {
    $controller = new FoodController();
    return $controller->show($params['id']);
});

$router->post('/foods', function() {
    $controller = new FoodController();
    return $controller->create();
});

$router->get('/foods/search', function() {
    $controller = new FoodController();
    return $controller->search();
});

// Food consumption routes
$router->post('/consumption', function() {
    $controller = new FoodController();
    return $controller->logConsumption();
});

$router->get('/consumption', function() {
    $controller = new FoodController();
    return $controller->getUserConsumption();
});

// Dispatch request
try {
    $router->dispatch();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Internal server error',
        'message' => $e->getMessage()
    ]);
}
