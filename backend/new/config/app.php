<?php
/**
 * Application Configuration
 * KalBuddy Food API
 */

return [
    'app_name' => 'KalBuddy Food API',
    'version' => '1.0.0',
    'debug' => $_ENV['DEBUG'] ?? false,
    'timezone' => 'UTC',
    'cors' => [
        'allowed_origins' => [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:5176',
            'capacitor://localhost',
            'ionic://localhost',
            'http://localhost'
        ],
        'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With'],
    ]
];
