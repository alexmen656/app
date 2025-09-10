-- KalBuddy Food Database Schema
-- Author: Generated for KalBuddy App
-- Date: 2025-09-10

-- Database creation
CREATE DATABASE IF NOT EXISTS kalbuddy_food_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kalbuddy_food_db;

-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    name_de VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL,
    name_es VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Food units table
CREATE TABLE units (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name_de VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL,
    name_es VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Foods table
CREATE TABLE foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    category_id INT NOT NULL,
    unit_id INT NOT NULL,
    icon VARCHAR(10) NOT NULL,
    name_de VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_es VARCHAR(100) NOT NULL,
    calories DECIMAL(8,2) NOT NULL,
    protein DECIMAL(8,2) NOT NULL DEFAULT 0,
    carbs DECIMAL(8,2) NOT NULL DEFAULT 0,
    fats DECIMAL(8,2) NOT NULL DEFAULT 0,
    fiber DECIMAL(8,2) DEFAULT 0,
    sugar DECIMAL(8,2) DEFAULT 0,
    sodium DECIMAL(8,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_active (is_active),
    INDEX idx_code (code)
);

-- User favorites table (for future use)
CREATE TABLE user_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    food_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_food (user_id, food_id),
    INDEX idx_user (user_id)
);

-- Food consumption history (for analytics)
CREATE TABLE food_consumption (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    food_id INT NOT NULL,
    amount DECIMAL(8,2) NOT NULL,
    total_calories DECIMAL(8,2) NOT NULL,
    total_protein DECIMAL(8,2) NOT NULL,
    total_carbs DECIMAL(8,2) NOT NULL,
    total_fats DECIMAL(8,2) NOT NULL,
    consumed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, consumed_at),
    INDEX idx_food (food_id)
);

-- Insert categories
INSERT INTO categories (name, icon, name_de, name_en, name_es) VALUES
('all', '🍽️', 'Alle', 'All', 'Todos'),
('fruits', '🍎', 'Obst', 'Fruits', 'Frutas'),
('vegetables', '🥬', 'Gemüse', 'Vegetables', 'Verduras'),
('proteins', '🥩', 'Proteine', 'Proteins', 'Proteínas'),
('grains', '🌾', 'Getreide', 'Grains', 'Cereales'),
('dairy', '🥛', 'Milchprodukte', 'Dairy', 'Lácteos'),
('nuts', '🥜', 'Nüsse', 'Nuts', 'Frutos Secos'),
('beverages', '☕', 'Getränke', 'Beverages', 'Bebidas');

-- Insert units
INSERT INTO units (code, name_de, name_en, name_es) VALUES
('piece', 'Stück', 'piece', 'pieza'),
('100g', '100g', '100g', '100g'),
('100ml', '100ml', '100ml', '100ml'),
('slice', 'Scheibe', 'slice', 'rebanada'),
('cup', 'Tasse', 'cup', 'taza');

-- Insert foods
INSERT INTO foods (code, category_id, unit_id, icon, name_de, name_en, name_es, calories, protein, carbs, fats) VALUES
-- Fruits
('apple', 2, 1, '🍎', 'Apfel', 'Apple', 'Manzana', 52.00, 0.30, 14.00, 0.20),
('banana', 2, 1, '🍌', 'Banane', 'Banana', 'Plátano', 89.00, 1.10, 23.00, 0.30),
('orange', 2, 1, '🍊', 'Orange', 'Orange', 'Naranja', 47.00, 0.90, 12.00, 0.10),
('strawberry', 2, 2, '🍓', 'Erdbeeren', 'Strawberries', 'Fresas', 32.00, 0.70, 8.00, 0.30),
('grapes', 2, 2, '🍇', 'Trauben', 'Grapes', 'Uvas', 62.00, 0.60, 16.00, 0.20),

-- Vegetables
('broccoli', 3, 2, '🥦', 'Brokkoli', 'Broccoli', 'Brócoli', 25.00, 3.00, 5.00, 0.30),
('carrot', 3, 2, '🥕', 'Karotte', 'Carrot', 'Zanahoria', 41.00, 0.90, 10.00, 0.20),
('tomato', 3, 1, '🍅', 'Tomate', 'Tomato', 'Tomate', 18.00, 0.90, 3.90, 0.20),
('cucumber', 3, 2, '🥒', 'Gurke', 'Cucumber', 'Pepino', 16.00, 0.70, 4.00, 0.10),
('spinach', 3, 2, '🥬', 'Spinat', 'Spinach', 'Espinacas', 23.00, 2.90, 3.60, 0.40),

-- Proteins
('chicken_breast', 4, 2, '🍗', 'Hähnchenbrust', 'Chicken Breast', 'Pechuga de Pollo', 165.00, 31.00, 0.00, 3.60),
('egg', 4, 1, '🥚', 'Ei', 'Egg', 'Huevo', 70.00, 6.00, 0.40, 5.00),
('salmon', 4, 2, '🐟', 'Lachs', 'Salmon', 'Salmón', 208.00, 20.00, 0.00, 13.00),
('tuna', 4, 2, '🐟', 'Thunfisch', 'Tuna', 'Atún', 144.00, 30.00, 0.00, 1.00),

-- Grains
('rice', 5, 2, '🍚', 'Reis', 'Rice', 'Arroz', 130.00, 2.70, 28.00, 0.30),
('pasta', 5, 2, '🍝', 'Nudeln', 'Pasta', 'Pasta', 131.00, 5.00, 25.00, 1.10),
('bread', 5, 4, '🍞', 'Brot', 'Bread', 'Pan', 265.00, 9.00, 49.00, 3.20),
('oats', 5, 2, '🌾', 'Haferflocken', 'Oats', 'Avena', 389.00, 17.00, 66.00, 7.00),

-- Dairy
('milk', 6, 3, '🥛', 'Milch', 'Milk', 'Leche', 64.00, 3.20, 4.80, 3.60),
('yogurt', 6, 2, '🥛', 'Joghurt', 'Yogurt', 'Yogur', 59.00, 10.00, 3.60, 0.40),
('cheese', 6, 2, '🧀', 'Käse', 'Cheese', 'Queso', 402.00, 25.00, 1.30, 33.00),

-- Nuts
('almonds', 7, 2, '🥜', 'Mandeln', 'Almonds', 'Almendras', 579.00, 21.00, 22.00, 50.00),
('walnuts', 7, 2, '🥜', 'Walnüsse', 'Walnuts', 'Nueces', 654.00, 15.00, 14.00, 65.00),

-- Beverages
('water', 8, 3, '💧', 'Wasser', 'Water', 'Agua', 0.00, 0.00, 0.00, 0.00),
('coffee', 8, 5, '☕', 'Kaffee', 'Coffee', 'Café', 2.00, 0.30, 0.00, 0.00);
