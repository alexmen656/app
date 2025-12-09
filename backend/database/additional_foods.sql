-- Zusätzliche Lebensmittel für Digmio Food Database
-- Enthält Fast Food, Snacks, Desserts und weitere beliebte Produkte
-- Datum: 2025-09-11

USE kalbuddy_food_db;

-- Neue Kategorien hinzufügen
INSERT INTO kalbuddy_categories (name, icon, name_de, name_en, name_es) VALUES
('fast_food', '🍔', 'Fast Food', 'Fast Food', 'Comida Rápida'),
('desserts', '🍰', 'Desserts', 'Desserts', 'Postres'),
('seafood', '🐟', 'Meeresfrüchte', 'Seafood', 'Mariscos'),
('snacks', '🍿', 'Snacks', 'Snacks', 'Aperitivos'),
('bakery', '🥖', 'Bäckerei', 'Bakery', 'Panadería'),
('condiments', '🧂', 'Gewürze & Soßen', 'Condiments & Sauces', 'Condimentos y Salsas'),
('frozen', '🧊', 'Tiefkühlkost', 'Frozen Foods', 'Congelados'),
('candy', '🍭', 'Süßwaren', 'Candy', 'Dulces');

-- Fast Food - McDonald's Produkte
INSERT INTO kalbuddy_foods (code, category_id, unit_id, icon, name_de, name_en, name_es, calories, protein, carbs, fats) VALUES
('mcdonalds_big_mac', 4, 1, '🍔', 'Big Mac', 'Big Mac', 'Big Mac', 563.00, 25.00, 45.00, 33.00),
('mcdonalds_quarter_pounder', 4, 1, '🍔', 'Quarter Pounder', 'Quarter Pounder', 'Cuarto de Libra', 520.00, 30.00, 42.00, 26.00),
('mcdonalds_mcchicken', 4, 1, '🍗', 'McChicken', 'McChicken', 'McPollo', 400.00, 14.00, 40.00, 22.00),
('mcdonalds_fries_medium', 5, 1, '🍟', 'Pommes mittel', 'Medium Fries', 'Papas Medianas', 340.00, 4.00, 43.00, 17.00),
('mcdonalds_fries_large', 5, 1, '🍟', 'Pommes groß', 'Large Fries', 'Papas Grandes', 510.00, 6.00, 66.00, 24.00),
('mcdonalds_nuggets_6', 4, 1, '🍗', '6 Chicken McNuggets', '6 Chicken McNuggets', '6 McNuggets', 250.00, 15.00, 15.00, 15.00),
('mcdonalds_nuggets_20', 4, 1, '🍗', '20 Chicken McNuggets', '20 Chicken McNuggets', '20 McNuggets', 830.00, 50.00, 50.00, 50.00),
('mcdonalds_coca_cola_medium', 8, 1, '🥤', 'Coca Cola mittel', 'Medium Coca Cola', 'Coca Cola Mediana', 210.00, 0.00, 58.00, 0.00),
('mcdonalds_mcflurry_oreo', 6, 1, '🍦', 'McFlurry Oreo', 'McFlurry Oreo', 'McFlurry Oreo', 510.00, 13.00, 80.00, 17.00),
('mcdonalds_apple_pie', 2, 1, '🥧', 'Apfeltasche', 'Apple Pie', 'Pastel de Manzana', 230.00, 2.00, 32.00, 11.00),

-- Fast Food - Burger King Produkte
('burger_king_whopper', 4, 1, '🍔', 'Whopper', 'Whopper', 'Whopper', 657.00, 28.00, 49.00, 40.00),
('burger_king_whopper_jr', 4, 1, '🍔', 'Whopper Jr.', 'Whopper Jr.', 'Whopper Jr.', 310.00, 13.00, 27.00, 18.00),
('burger_king_chicken_royal', 4, 1, '🍗', 'Chicken Royal', 'Chicken Royal', 'Chicken Royal', 630.00, 24.00, 44.00, 39.00),
('burger_king_fries_medium', 5, 1, '🍟', 'King Pommes mittel', 'Medium Fries', 'Papas Medianas', 365.00, 4.00, 46.00, 18.00),
('burger_king_onion_rings', 3, 1, '🧅', 'Zwiebelringe', 'Onion Rings', 'Aros de Cebolla', 410.00, 6.00, 46.00, 22.00),

-- Pizza
('pizza_margherita_slice', 5, 4, '🍕', 'Pizza Margherita Stück', 'Pizza Margherita Slice', 'Trozo Pizza Margarita', 200.00, 8.00, 26.00, 8.00),
('pizza_pepperoni_slice', 5, 4, '🍕', 'Pizza Pepperoni Stück', 'Pizza Pepperoni Slice', 'Trozo Pizza Pepperoni', 298.00, 13.00, 26.00, 18.00),
('pizza_hawaiian_slice', 5, 4, '🍕', 'Pizza Hawaii Stück', 'Pizza Hawaiian Slice', 'Trozo Pizza Hawaiana', 250.00, 12.00, 28.00, 12.00),

-- Snacks und Süßigkeiten
('chocolate_bar', 6, 1, '🍫', 'Schokoladenriegel', 'Chocolate Bar', 'Barra de Chocolate', 534.00, 7.90, 59.00, 30.00),
('potato_chips', 3, 2, '🥔', 'Kartoffelchips', 'Potato Chips', 'Papas Fritas', 536.00, 6.60, 50.00, 35.00),
('pretzels', 5, 2, '🥨', 'Brezeln', 'Pretzels', 'Pretzels', 381.00, 11.00, 80.00, 3.00),
('ice_cream_vanilla', 6, 2, '🍦', 'Vanilleeis', 'Vanilla Ice Cream', 'Helado de Vainilla', 207.00, 3.50, 24.00, 11.00),
('cookies', 5, 1, '🍪', 'Kekse', 'Cookies', 'Galletas', 502.00, 5.90, 64.00, 25.00),
('gummy_bears', 2, 2, '🐻', 'Gummibärchen', 'Gummy Bears', 'Ositos de Goma', 343.00, 6.90, 77.00, 0.20),

-- Getränke
('energy_drink', 8, 3, '⚡', 'Energy Drink', 'Energy Drink', 'Bebida Energética', 45.00, 0.00, 11.00, 0.00),
('orange_juice', 8, 3, '🍊', 'Orangensaft', 'Orange Juice', 'Zumo de Naranja', 45.00, 0.70, 10.40, 0.20),
('apple_juice', 8, 3, '🍎', 'Apfelsaft', 'Apple Juice', 'Zumo de Manzana', 46.00, 0.10, 11.30, 0.10),
('beer', 8, 3, '🍺', 'Bier', 'Beer', 'Cerveza', 43.00, 0.50, 3.60, 0.00),
('wine_red', 8, 3, '🍷', 'Rotwein', 'Red Wine', 'Vino Tinto', 85.00, 0.10, 2.60, 0.00),
('coca_cola', 8, 3, '🥤', 'Coca Cola', 'Coca Cola', 'Coca Cola', 42.00, 0.00, 10.60, 0.00),

-- Frühstück
('croissant', 5, 1, '🥐', 'Croissant', 'Croissant', 'Croissant', 406.00, 8.20, 45.80, 21.00),
('bagel', 5, 1, '🥯', 'Bagel', 'Bagel', 'Bagel', 250.00, 10.00, 48.00, 2.00),
('muffin_blueberry', 5, 1, '🧁', 'Blaubeer Muffin', 'Blueberry Muffin', 'Muffin de Arándanos', 426.00, 6.00, 54.00, 21.00),
('pancakes', 5, 1, '🥞', 'Pfannkuchen', 'Pancakes', 'Panqueques', 227.00, 6.00, 28.00, 10.00),
('waffle', 5, 1, '🧇', 'Waffel', 'Waffle', 'Gofre', 291.00, 5.90, 33.00, 15.00),

-- Italienische Küche
('spaghetti_bolognese', 5, 1, '🍝', 'Spaghetti Bolognese', 'Spaghetti Bolognese', 'Espaguetis Boloñesa', 220.00, 12.00, 26.00, 8.00),
('lasagna', 5, 1, '🍝', 'Lasagne', 'Lasagna', 'Lasaña', 135.00, 8.00, 9.00, 8.00),
('risotto', 5, 2, '🍚', 'Risotto', 'Risotto', 'Risotto', 166.00, 3.40, 28.00, 4.90),

-- Asiatische Küche
('sushi_salmon', 4, 1, '🍣', 'Lachs Sushi', 'Salmon Sushi', 'Sushi de Salmón', 40.00, 4.00, 3.00, 1.50),
('ramen', 5, 1, '🍜', 'Ramen', 'Ramen', 'Ramen', 436.00, 20.00, 65.00, 12.00),
('fried_rice', 5, 2, '🍚', 'Gebratener Reis', 'Fried Rice', 'Arroz Frito', 163.00, 5.50, 20.00, 6.20),

-- Mexikanische Küche
('taco', 5, 1, '🌮', 'Taco', 'Taco', 'Taco', 226.00, 9.00, 18.00, 13.00),
('burrito', 5, 1, '🌯', 'Burrito', 'Burrito', 'Burrito', 295.00, 13.00, 39.00, 10.00),
('quesadilla', 5, 1, '🫓', 'Quesadilla', 'Quesadilla', 'Quesadilla', 520.00, 27.00, 40.00, 31.00),

-- Meeresfrüchte
('shrimp', 4, 2, '🦐', 'Garnelen', 'Shrimp', 'Camarones', 99.00, 18.00, 0.20, 1.40),
('crab', 4, 2, '🦀', 'Krabbe', 'Crab', 'Cangrejo', 97.00, 19.00, 0.00, 1.50),
('lobster', 4, 2, '🦞', 'Hummer', 'Lobster', 'Langosta', 89.00, 19.00, 1.30, 0.90),

-- Nüsse und Samen erweitert
('peanuts', 7, 2, '🥜', 'Erdnüsse', 'Peanuts', 'Cacahuetes', 567.00, 26.00, 16.00, 49.00),
('cashews', 7, 2, '🥜', 'Cashewnüsse', 'Cashews', 'Anacardos', 553.00, 18.00, 30.00, 44.00),
('pistachios', 7, 2, '🥜', 'Pistazien', 'Pistachios', 'Pistachos', 560.00, 20.00, 28.00, 45.00),
('sunflower_seeds', 7, 2, '🌻', 'Sonnenblumenkerne', 'Sunflower Seeds', 'Semillas de Girasol', 584.00, 21.00, 20.00, 51.00),

-- Weitere Früchte
('pineapple', 2, 2, '🍍', 'Ananas', 'Pineapple', 'Piña', 50.00, 0.50, 13.00, 0.10),
('mango', 2, 1, '🥭', 'Mango', 'Mango', 'Mango', 60.00, 0.80, 15.00, 0.40),
('avocado', 2, 1, '🥑', 'Avocado', 'Avocado', 'Aguacate', 160.00, 2.00, 9.00, 15.00),
('kiwi', 2, 1, '🥝', 'Kiwi', 'Kiwi', 'Kiwi', 61.00, 1.10, 15.00, 0.50),
('watermelon', 2, 2, '🍉', 'Wassermelone', 'Watermelon', 'Sandía', 30.00, 0.60, 8.00, 0.20),

-- Weitere Gemüse
('bell_pepper', 3, 1, '🫑', 'Paprika', 'Bell Pepper', 'Pimiento', 31.00, 1.00, 7.00, 0.30),
('mushrooms', 3, 2, '🍄', 'Pilze', 'Mushrooms', 'Setas', 22.00, 3.10, 3.30, 0.30),
('onion', 3, 1, '🧅', 'Zwiebel', 'Onion', 'Cebolla', 40.00, 1.10, 9.30, 0.10),
('garlic', 3, 1, '🧄', 'Knoblauch', 'Garlic', 'Ajo', 149.00, 6.40, 33.00, 0.50),
('corn', 5, 2, '🌽', 'Mais', 'Corn', 'Maíz', 86.00, 3.20, 19.00, 1.20),

-- Weitere Proteine
('turkey', 4, 2, '🦃', 'Truthahn', 'Turkey', 'Pavo', 135.00, 30.00, 0.00, 1.00),
('pork', 4, 2, '🐷', 'Schweinefleisch', 'Pork', 'Cerdo', 242.00, 27.00, 0.00, 14.00),
('beef', 4, 2, '🥩', 'Rindfleisch', 'Beef', 'Carne de Res', 250.00, 26.00, 0.00, 15.00),
('tofu', 4, 2, '🟫', 'Tofu', 'Tofu', 'Tofu', 76.00, 8.00, 1.90, 4.80),

-- Konditorei und Backwaren
('donut', 5, 1, '🍩', 'Donut', 'Donut', 'Donut', 452.00, 4.90, 51.00, 25.00),
('cupcake', 5, 1, '🧁', 'Cupcake', 'Cupcake', 'Cupcake', 305.00, 3.00, 45.00, 12.00),
('cheesecake_slice', 6, 4, '🍰', 'Käsekuchen Stück', 'Cheesecake Slice', 'Trozo de Tarta de Queso', 321.00, 5.50, 25.00, 23.00),

-- Weitere Getränke
('green_tea', 8, 5, '🍵', 'Grüner Tee', 'Green Tea', 'Té Verde', 1.00, 0.00, 0.00, 0.00),
('hot_chocolate', 8, 5, '☕', 'Heiße Schokolade', 'Hot Chocolate', 'Chocolate Caliente', 193.00, 9.00, 27.00, 6.00),
('smoothie_berry', 8, 5, '🥤', 'Beeren Smoothie', 'Berry Smoothie', 'Batido de Bayas', 70.00, 1.00, 17.00, 0.50);
