<?php

namespace KalBuddy\Router;

/**
 * Simple Router
 */
class Router
{
    private array $routes = [];
    private string $basePath;

    public function __construct(string $basePath = '')
    {
        $this->basePath = rtrim($basePath, '/');
    }

    /**
     * Add GET route
     */
    public function get(string $path, callable $handler): void
    {
        $this->addRoute('GET', $path, $handler);
    }

    /**
     * Add POST route
     */
    public function post(string $path, callable $handler): void
    {
        $this->addRoute('POST', $path, $handler);
    }

    /**
     * Add PUT route
     */
    public function put(string $path, callable $handler): void
    {
        $this->addRoute('PUT', $path, $handler);
    }

    /**
     * Add DELETE route
     */
    public function delete(string $path, callable $handler): void
    {
        $this->addRoute('DELETE', $path, $handler);
    }

    /**
     * Add route
     */
    private function addRoute(string $method, string $path, callable $handler): void
    {
        $path = $this->basePath . $path;
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler,
            'pattern' => $this->pathToRegex($path)
        ];
    }

    /**
     * Convert path to regex pattern
     */
    private function pathToRegex(string $path): string
    {
        // Replace {id} with named capture groups
        $pattern = preg_replace('/\{(\w+)\}/', '(?P<$1>[^/]+)', $path);
        return '#^' . $pattern . '$#';
    }

    /**
     * Dispatch request
     */
    public function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uri = rtrim($uri, '/');

        foreach ($this->routes as $route) {
            if ($route['method'] === $method && preg_match($route['pattern'], $uri, $matches)) {
                // Extract named parameters
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                
                // Convert numeric string parameters to integers
                foreach ($params as $key => $value) {
                    if (is_numeric($value)) {
                        $params[$key] = (int)$value;
                    }
                }

                try {
                    $result = call_user_func($route['handler'], $params);
                    $this->sendJsonResponse($result);
                    return;
                } catch (\Exception $e) {
                    $this->sendJsonResponse([
                        'success' => false,
                        'error' => $e->getMessage()
                    ], 500);
                    return;
                }
            }
        }

        // No route found
        $this->sendJsonResponse([
            'success' => false,
            'error' => 'Route not found'
        ], 404);
    }

    /**
     * Send JSON response
     */
    private function sendJsonResponse(array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_PRETTY_PRINT);
    }
}
