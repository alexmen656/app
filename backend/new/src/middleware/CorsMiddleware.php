<?php

namespace KalBuddy\Middleware;

/**
 * CORS Middleware
 */
class CorsMiddleware
{
    public static function handle(): void
    {
        $config = require __DIR__ . '/../../config/app.php';
        $corsConfig = $config['cors'];

        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            self::setCorsHeaders($corsConfig);
            http_response_code(200);
            exit();
        }

        // Set CORS headers for all requests
        self::setCorsHeaders($corsConfig);
    }

    private static function setCorsHeaders(array $config): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        
        // Check if origin is allowed
        if (in_array($origin, $config['allowed_origins']) || in_array('*', $config['allowed_origins'])) {
            header("Access-Control-Allow-Origin: $origin");
        }

        header('Access-Control-Allow-Methods: ' . implode(', ', $config['allowed_methods']));
        header('Access-Control-Allow-Headers: ' . implode(', ', $config['allowed_headers']));
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 3600');
    }
}
