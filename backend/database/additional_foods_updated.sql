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

-- Fast Food - McDonald's Produkte (Kategorie 9: fast_food)
INSERT INTO kalbuddy_foods (code, category_id, unit_id, icon, name_de, name_en, name_es, calories, protein, carbs, fats) VALUES
('mcdonalds_big_mac', 9, 1, '🍔', 'Big Mac', 'Big Mac', 'Big Mac', 563.00, 25.00, 45.00, 33.00),
('mcdonalds_quarter_pounder', 9, 1, '🍔', 'Quarter Pounder', 'Quarter Pounder', 'Cuarto de Libra', 520.00, 30.00, 42.00, 26.00),
('mcdonalds_mcchicken', 9, 1, '🍗', 'McChicken', 'McChicken', 'McPollo', 400.00, 14.00, 40.00, 22.00),
('mcdonalds_fries_medium', 9, 1, '🍟', 'Pommes mittel', 'Medium Fries', 'Papas Medianas', 340.00, 4.00, 43.00, 17.00),
('mcdonalds_fries_large', 9, 1, '🍟', 'Pommes groß', 'Large Fries', 'Papas Grandes', 510.00, 6.00, 66.00, 24.00),
('mcdonalds_nuggets_6', 9, 1, '🍗', '6 Chicken McNuggets', '6 Chicken McNuggets', '6 McNuggets', 250.00, 15.00, 15.00, 15.00),
('mcdonalds_nuggets_20', 9, 1, '🍗', '20 Chicken McNuggets', '20 Chicken McNuggets', '20 McNuggets', 830.00, 50.00, 50.00, 50.00),
('mcdonalds_coca_cola_medium', 7, 1, '🥤', 'Coca Cola mittel', 'Medium Coca Cola', 'Coca Cola Mediana', 210.00, 0.00, 58.00, 0.00),
('mcdonalds_mcflurry_oreo', 10, 1, '🍦', 'McFlurry Oreo', 'McFlurry Oreo', 'McFlurry Oreo', 510.00, 13.00, 80.00, 17.00),
('mcdonalds_apple_pie', 10, 1, '🥧', 'Apfeltasche', 'Apple Pie', 'Pastel de Manzana', 230.00, 2.00, 32.00, 11.00),

-- Fast Food - Burger King Produkte
('burger_king_whopper', 9, 1, '🍔', 'Whopper', 'Whopper', 'Whopper', 657.00, 28.00, 49.00, 40.00),
('burger_king_whopper_jr', 9, 1, '🍔', 'Whopper Jr.', 'Whopper Jr.', 'Whopper Jr.', 310.00, 13.00, 27.00, 18.00),
('burger_king_chicken_royal', 9, 1, '🍗', 'Chicken Royal', 'Chicken Royal', 'Chicken Royal', 630.00, 24.00, 44.00, 39.00),
('burger_king_fries_medium', 9, 1, '🍟', 'King Pommes mittel', 'Medium Fries', 'Papas Medianas', 365.00, 4.00, 46.00, 18.00),
('burger_king_onion_rings', 9, 1, '🧅', 'Zwiebelringe', 'Onion Rings', 'Aros de Cebolla', 410.00, 6.00, 46.00, 22.00),

-- Fast Food - KFC Produkte
('kfc_original_chicken', 9, 1, '🍗', 'Original Recipe Hähnchen', 'Original Recipe Chicken', 'Pollo Original', 320.00, 29.00, 8.00, 19.00),
('kfc_zinger_burger', 9, 1, '🍔', 'Zinger Burger', 'Zinger Burger', 'Zinger Burger', 550.00, 35.00, 45.00, 26.00),
('kfc_hot_wings', 9, 1, '🔥', 'Hot Wings', 'Hot Wings', 'Alitas Picantes', 150.00, 11.00, 5.00, 10.00),
('kfc_coleslaw', 3, 2, '🥗', 'Krautsalat', 'Coleslaw', 'Ensalada de Col', 150.00, 1.50, 14.00, 10.00),

-- Fast Food - Subway Produkte
('subway_italian_bmt', 9, 1, '🥪', 'Italian B.M.T.', 'Italian B.M.T.', 'Italian B.M.T.', 410.00, 19.00, 44.00, 16.00),
('subway_tuna', 9, 1, '🥪', 'Thunfisch Sub', 'Tuna Sub', 'Sub de Atún', 480.00, 20.00, 44.00, 25.00),
('subway_meatball_marinara', 9, 1, '🥪', 'Meatball Marinara', 'Meatball Marinara', 'Albóndigas Marinara', 480.00, 23.00, 59.00, 16.00),
('subway_chicken_teriyaki', 9, 1, '🥪', 'Chicken Teriyaki', 'Chicken Teriyaki', 'Pollo Teriyaki', 370.00, 25.00, 47.00, 4.50),

-- Fast Food - Domino's Pizza
('dominos_margherita_medium', 9, 4, '🍕', 'Domino\'s Margherita mittel', 'Domino\'s Medium Margherita', 'Domino\'s Margarita Mediana', 200.00, 8.00, 26.00, 8.00),
('dominos_pepperoni_medium', 9, 4, '🍕', 'Domino\'s Pepperoni mittel', 'Domino\'s Medium Pepperoni', 'Domino\'s Pepperoni Mediana', 298.00, 13.00, 26.00, 18.00),

-- Pizza generell
('pizza_margherita_slice', 13, 4, '🍕', 'Pizza Margherita Stück', 'Pizza Margherita Slice', 'Trozo Pizza Margarita', 200.00, 8.00, 26.00, 8.00),
('pizza_pepperoni_slice', 13, 4, '🍕', 'Pizza Pepperoni Stück', 'Pizza Pepperoni Slice', 'Trozo Pizza Pepperoni', 298.00, 13.00, 26.00, 18.00),
('pizza_hawaiian_slice', 13, 4, '🍕', 'Pizza Hawaii Stück', 'Pizza Hawaiian Slice', 'Trozo Pizza Hawaiana', 250.00, 12.00, 28.00, 12.00),
('pizza_quattro_stagioni', 13, 4, '🍕', 'Pizza Quattro Stagioni', 'Pizza Quattro Stagioni', 'Pizza Cuatro Estaciones', 270.00, 14.00, 28.00, 12.00),

-- Snacks und Süßigkeiten (Kategorie 12: snacks)
('chocolate_bar', 16, 1, '🍫', 'Schokoladenriegel', 'Chocolate Bar', 'Barra de Chocolate', 534.00, 7.90, 59.00, 30.00),
('potato_chips', 12, 2, '🥔', 'Kartoffelchips', 'Potato Chips', 'Papas Fritas', 536.00, 6.60, 50.00, 35.00),
('pretzels', 12, 2, '🥨', 'Brezeln', 'Pretzels', 'Pretzels', 381.00, 11.00, 80.00, 3.00),
('popcorn', 12, 2, '🍿', 'Popcorn', 'Popcorn', 'Palomitas', 387.00, 12.00, 78.00, 5.00),
('crackers', 12, 2, '🍘', 'Cracker', 'Crackers', 'Galletas Saladas', 502.00, 9.00, 62.00, 23.00),
('tortilla_chips', 12, 2, '🌮', 'Tortilla Chips', 'Tortilla Chips', 'Chips de Tortilla', 489.00, 7.00, 63.00, 24.00),

-- Süßwaren (Kategorie 16: candy)
('gummy_bears', 16, 2, '🐻', 'Gummibärchen', 'Gummy Bears', 'Ositos de Goma', 343.00, 6.90, 77.00, 0.20),
('chocolate_cookies', 16, 1, '🍪', 'Schokoladenkekse', 'Chocolate Cookies', 'Galletas de Chocolate', 502.00, 5.90, 64.00, 25.00),
('lollipop', 16, 1, '🍭', 'Lutscher', 'Lollipop', 'Piruleta', 22.00, 0.00, 6.00, 0.00),
('marshmallows', 16, 2, '🍡', 'Marshmallows', 'Marshmallows', 'Malvaviscos', 318.00, 1.80, 81.00, 0.20),
('jelly_beans', 16, 2, '🍬', 'Jelly Beans', 'Jelly Beans', 'Frijolitos de Dulce', 375.00, 0.00, 95.00, 0.10),

-- Desserts (Kategorie 10: desserts)
('ice_cream_vanilla', 10, 2, '🍦', 'Vanilleeis', 'Vanilla Ice Cream', 'Helado de Vainilla', 207.00, 3.50, 24.00, 11.00),
('ice_cream_chocolate', 10, 2, '🍦', 'Schokoladeneis', 'Chocolate Ice Cream', 'Helado de Chocolate', 216.00, 3.80, 28.00, 11.00),
('ice_cream_strawberry', 10, 2, '🍦', 'Erdbeereis', 'Strawberry Ice Cream', 'Helado de Fresa', 192.00, 3.20, 24.00, 9.50),
('tiramisu', 10, 4, '🍰', 'Tiramisu', 'Tiramisu', 'Tiramisú', 240.00, 4.60, 28.00, 12.50),
('cheesecake_slice', 10, 4, '🍰', 'Käsekuchen Stück', 'Cheesecake Slice', 'Trozo de Tarta de Queso', 321.00, 5.50, 25.00, 23.00),
('chocolate_cake', 10, 4, '🍰', 'Schokoladenkuchen', 'Chocolate Cake', 'Pastel de Chocolate', 371.00, 5.00, 35.00, 24.00),
('apple_pie', 10, 4, '🥧', 'Apfelkuchen', 'Apple Pie', 'Pastel de Manzana', 237.00, 2.40, 34.00, 11.00),

-- Getränke (Kategorie 7: beverages)
('energy_drink', 7, 3, '⚡', 'Energy Drink', 'Energy Drink', 'Bebida Energética', 45.00, 0.00, 11.00, 0.00),
('orange_juice', 7, 3, '🍊', 'Orangensaft', 'Orange Juice', 'Zumo de Naranja', 45.00, 0.70, 10.40, 0.20),
('apple_juice', 7, 3, '🍎', 'Apfelsaft', 'Apple Juice', 'Zumo de Manzana', 46.00, 0.10, 11.30, 0.10),
('beer', 7, 3, '🍺', 'Bier', 'Beer', 'Cerveza', 43.00, 0.50, 3.60, 0.00),
('wine_red', 7, 3, '🍷', 'Rotwein', 'Red Wine', 'Vino Tinto', 85.00, 0.10, 2.60, 0.00),
('wine_white', 7, 3, '🍷', 'Weißwein', 'White Wine', 'Vino Blanco', 82.00, 0.10, 2.60, 0.00),
('coca_cola', 7, 3, '🥤', 'Coca Cola', 'Coca Cola', 'Coca Cola', 42.00, 0.00, 10.60, 0.00),
('pepsi', 7, 3, '🥤', 'Pepsi', 'Pepsi', 'Pepsi', 41.00, 0.00, 11.00, 0.00),
('sprite', 7, 3, '🥤', 'Sprite', 'Sprite', 'Sprite', 38.00, 0.00, 10.00, 0.00),
('green_tea', 7, 5, '🍵', 'Grüner Tee', 'Green Tea', 'Té Verde', 1.00, 0.00, 0.00, 0.00),
('hot_chocolate', 7, 5, '☕', 'Heiße Schokolade', 'Hot Chocolate', 'Chocolate Caliente', 193.00, 9.00, 27.00, 6.00),
('smoothie_berry', 7, 5, '🥤', 'Beeren Smoothie', 'Berry Smoothie', 'Batido de Bayas', 70.00, 1.00, 17.00, 0.50),
('protein_shake', 7, 3, '🥤', 'Proteinshake', 'Protein Shake', 'Batido de Proteína', 120.00, 25.00, 5.00, 2.00),
('sports_drink', 7, 3, '🥤', 'Sportgetränk', 'Sports Drink', 'Bebida Deportiva', 25.00, 0.00, 6.00, 0.00),

-- Bäckerei (Kategorie 13: bakery)
('croissant', 13, 1, '🥐', 'Croissant', 'Croissant', 'Croissant', 406.00, 8.20, 45.80, 21.00),
('bagel', 13, 1, '🥯', 'Bagel', 'Bagel', 'Bagel', 250.00, 10.00, 48.00, 2.00),
('muffin_blueberry', 13, 1, '🧁', 'Blaubeer Muffin', 'Blueberry Muffin', 'Muffin de Arándanos', 426.00, 6.00, 54.00, 21.00),
('muffin_chocolate', 13, 1, '🧁', 'Schokoladen Muffin', 'Chocolate Muffin', 'Muffin de Chocolate', 444.00, 6.50, 55.00, 23.00),
('pancakes', 13, 1, '🥞', 'Pfannkuchen', 'Pancakes', 'Panqueques', 227.00, 6.00, 28.00, 10.00),
('waffle', 13, 1, '🧇', 'Waffel', 'Waffle', 'Gofre', 291.00, 5.90, 33.00, 15.00),
('donut', 13, 1, '🍩', 'Donut', 'Donut', 'Donut', 452.00, 4.90, 51.00, 25.00),
('cupcake', 13, 1, '🧁', 'Cupcake', 'Cupcake', 'Cupcake', 305.00, 3.00, 45.00, 12.00),
('danish_pastry', 13, 1, '🥮', 'Dänisches Gebäck', 'Danish Pastry', 'Pastel Danés', 374.00, 6.60, 45.00, 18.00),
('french_baguette', 13, 4, '🥖', 'Französisches Baguette', 'French Baguette', 'Baguette Francés', 272.00, 9.40, 55.00, 1.60),

-- Italienische Küche
('spaghetti_bolognese', 5, 1, '🍝', 'Spaghetti Bolognese', 'Spaghetti Bolognese', 'Espaguetis Boloñesa', 220.00, 12.00, 26.00, 8.00),
('spaghetti_carbonara', 5, 1, '🍝', 'Spaghetti Carbonara', 'Spaghetti Carbonara', 'Espaguetis Carbonara', 350.00, 15.00, 35.00, 18.00),
('lasagna', 5, 1, '🍝', 'Lasagne', 'Lasagna', 'Lasaña', 135.00, 8.00, 9.00, 8.00),
('risotto', 5, 2, '🍚', 'Risotto', 'Risotto', 'Risotto', 166.00, 3.40, 28.00, 4.90),
('gnocchi', 5, 2, '🥟', 'Gnocchi', 'Gnocchi', 'Ñoquis', 131.00, 4.40, 23.00, 2.90),

-- Asiatische Küche
('sushi_salmon', 4, 1, '🍣', 'Lachs Sushi', 'Salmon Sushi', 'Sushi de Salmón', 40.00, 4.00, 3.00, 1.50),
('sushi_tuna', 4, 1, '🍣', 'Thunfisch Sushi', 'Tuna Sushi', 'Sushi de Atún', 35.00, 4.50, 3.00, 0.50),
('sashimi_salmon', 4, 1, '🍣', 'Lachs Sashimi', 'Salmon Sashimi', 'Sashimi de Salmón', 25.00, 4.00, 0.00, 1.50),
('ramen', 5, 1, '🍜', 'Ramen', 'Ramen', 'Ramen', 436.00, 20.00, 65.00, 12.00),
('fried_rice', 5, 2, '🍚', 'Gebratener Reis', 'Fried Rice', 'Arroz Frito', 163.00, 5.50, 20.00, 6.20),
('pad_thai', 5, 1, '🍜', 'Pad Thai', 'Pad Thai', 'Pad Thai', 300.00, 12.00, 40.00, 10.00),
('spring_rolls', 12, 1, '🥢', 'Frühlingsrollen', 'Spring Rolls', 'Rollitos de Primavera', 140.00, 4.00, 15.00, 7.00),
('dim_sum', 4, 1, '🥟', 'Dim Sum', 'Dim Sum', 'Dim Sum', 80.00, 4.00, 8.00, 3.00),

-- Mexikanische Küche
('taco', 5, 1, '🌮', 'Taco', 'Taco', 'Taco', 226.00, 9.00, 18.00, 13.00),
('burrito', 5, 1, '🌯', 'Burrito', 'Burrito', 'Burrito', 295.00, 13.00, 39.00, 10.00),
('quesadilla', 5, 1, '🫓', 'Quesadilla', 'Quesadilla', 'Quesadilla', 520.00, 27.00, 40.00, 31.00),
('nachos', 12, 1, '🌮', 'Nachos', 'Nachos', 'Nachos', 346.00, 9.00, 36.00, 19.00),
('guacamole', 14, 2, '🥑', 'Guacamole', 'Guacamole', 'Guacamole', 160.00, 2.00, 9.00, 15.00),
('salsa', 14, 2, '🌶️', 'Salsa', 'Salsa', 'Salsa', 36.00, 2.00, 7.00, 0.20),

-- Meeresfrüchte (Kategorie 11: seafood)
('shrimp', 11, 2, '🦐', 'Garnelen', 'Shrimp', 'Camarones', 99.00, 18.00, 0.20, 1.40),
('crab', 11, 2, '🦀', 'Krabbe', 'Crab', 'Cangrejo', 97.00, 19.00, 0.00, 1.50),
('lobster', 11, 2, '🦞', 'Hummer', 'Lobster', 'Langosta', 89.00, 19.00, 1.30, 0.90),
('scallops', 11, 2, '🐚', 'Jakobsmuscheln', 'Scallops', 'Vieiras', 111.00, 20.00, 5.00, 0.80),
('oysters', 11, 1, '🦪', 'Austern', 'Oysters', 'Ostras', 68.00, 7.00, 4.00, 2.50),
('mussels', 11, 2, '🦪', 'Muscheln', 'Mussels', 'Mejillones', 86.00, 12.00, 4.00, 2.20),
('squid', 11, 2, '🦑', 'Tintenfisch', 'Squid', 'Calamar', 92.00, 16.00, 3.00, 1.40),

-- Nüsse und Samen erweitert (Kategorie 6: nuts)
('peanuts', 6, 2, '🥜', 'Erdnüsse', 'Peanuts', 'Cacahuetes', 567.00, 26.00, 16.00, 49.00),
('cashews', 6, 2, '🥜', 'Cashewnüsse', 'Cashews', 'Anacardos', 553.00, 18.00, 30.00, 44.00),
('pistachios', 6, 2, '🥜', 'Pistazien', 'Pistachios', 'Pistachos', 560.00, 20.00, 28.00, 45.00),
('sunflower_seeds', 6, 2, '🌻', 'Sonnenblumenkerne', 'Sunflower Seeds', 'Semillas de Girasol', 584.00, 21.00, 20.00, 51.00),
('pumpkin_seeds', 6, 2, '🎃', 'Kürbiskerne', 'Pumpkin Seeds', 'Semillas de Calabaza', 559.00, 30.00, 11.00, 49.00),
('pecans', 6, 2, '🥜', 'Pekannüsse', 'Pecans', 'Nueces Pecanas', 691.00, 9.00, 14.00, 72.00),
('brazil_nuts', 6, 2, '🥜', 'Paranüsse', 'Brazil Nuts', 'Nueces de Brasil', 659.00, 14.00, 12.00, 67.00),
('macadamia_nuts', 6, 2, '🥜', 'Macadamianüsse', 'Macadamia Nuts', 'Nueces de Macadamia', 718.00, 8.00, 14.00, 76.00),

-- Weitere Früchte (Kategorie 2: fruits)
('pineapple', 2, 2, '🍍', 'Ananas', 'Pineapple', 'Piña', 50.00, 0.50, 13.00, 0.10),
('mango', 2, 1, '🥭', 'Mango', 'Mango', 'Mango', 60.00, 0.80, 15.00, 0.40),
('avocado', 2, 1, '🥑', 'Avocado', 'Avocado', 'Aguacate', 160.00, 2.00, 9.00, 15.00),
('kiwi', 2, 1, '🥝', 'Kiwi', 'Kiwi', 'Kiwi', 61.00, 1.10, 15.00, 0.50),
('watermelon', 2, 2, '🍉', 'Wassermelone', 'Watermelon', 'Sandía', 30.00, 0.60, 8.00, 0.20),
('cantaloupe', 2, 2, '🍈', 'Cantaloupe-Melone', 'Cantaloupe', 'Melón Cantalupo', 34.00, 0.80, 8.00, 0.20),
('peach', 2, 1, '🍑', 'Pfirsich', 'Peach', 'Durazno', 39.00, 0.90, 10.00, 0.30),
('pear', 2, 1, '🍐', 'Birne', 'Pear', 'Pera', 57.00, 0.40, 15.00, 0.10),
('plum', 2, 1, '🍇', 'Pflaume', 'Plum', 'Ciruela', 46.00, 0.70, 11.00, 0.30),
('blueberries', 2, 2, '🫐', 'Heidelbeeren', 'Blueberries', 'Arándanos', 57.00, 0.70, 14.00, 0.30),
('raspberries', 2, 2, '🍇', 'Himbeeren', 'Raspberries', 'Frambuesas', 52.00, 1.20, 12.00, 0.70),
('blackberries', 2, 2, '🍇', 'Brombeeren', 'Blackberries', 'Moras', 43.00, 1.40, 10.00, 0.50),
('coconut', 2, 1, '🥥', 'Kokosnuss', 'Coconut', 'Coco', 354.00, 3.30, 15.00, 33.00),
('pomegranate', 2, 1, '🍎', 'Granatapfel', 'Pomegranate', 'Granada', 83.00, 1.70, 19.00, 1.20),
('dragon_fruit', 2, 1, '🐉', 'Drachenfrucht', 'Dragon Fruit', 'Fruta del Dragón', 60.00, 1.20, 13.00, 0.40),

-- Weitere Gemüse (Kategorie 3: vegetables)
('bell_pepper', 3, 1, '🫑', 'Paprika', 'Bell Pepper', 'Pimiento', 31.00, 1.00, 7.00, 0.30),
('mushrooms', 3, 2, '🍄', 'Pilze', 'Mushrooms', 'Setas', 22.00, 3.10, 3.30, 0.30),
('onion', 3, 1, '🧅', 'Zwiebel', 'Onion', 'Cebolla', 40.00, 1.10, 9.30, 0.10),
('garlic', 3, 1, '🧄', 'Knoblauch', 'Garlic', 'Ajo', 149.00, 6.40, 33.00, 0.50),
('corn', 5, 2, '🌽', 'Mais', 'Corn', 'Maíz', 86.00, 3.20, 19.00, 1.20),
('zucchini', 3, 2, '🥒', 'Zucchini', 'Zucchini', 'Calabacín', 17.00, 1.20, 3.10, 0.30),
('eggplant', 3, 2, '🍆', 'Aubergine', 'Eggplant', 'Berenjena', 25.00, 1.00, 6.00, 0.20),
('asparagus', 3, 2, '🌱', 'Spargel', 'Asparagus', 'Espárragos', 20.00, 2.20, 3.90, 0.10),
('cauliflower', 3, 2, '🌼', 'Blumenkohl', 'Cauliflower', 'Coliflor', 25.00, 1.90, 5.00, 0.30),
('brussels_sprouts', 3, 2, '🥬', 'Rosenkohl', 'Brussels Sprouts', 'Coles de Bruselas', 43.00, 3.40, 9.00, 0.30),
('artichoke', 3, 1, '🌾', 'Artischocke', 'Artichoke', 'Alcachofa', 47.00, 3.30, 11.00, 0.20),
('beetroot', 3, 2, '🍠', 'Rote Beete', 'Beetroot', 'Remolacha', 43.00, 1.60, 10.00, 0.20),
('sweet_potato', 3, 1, '🍠', 'Süßkartoffel', 'Sweet Potato', 'Batata', 86.00, 1.60, 20.00, 0.10),

-- Weitere Proteine (Kategorie 4: proteins)
('turkey', 4, 2, '🦃', 'Truthahn', 'Turkey', 'Pavo', 135.00, 30.00, 0.00, 1.00),
('pork', 4, 2, '🐷', 'Schweinefleisch', 'Pork', 'Cerdo', 242.00, 27.00, 0.00, 14.00),
('beef', 4, 2, '🥩', 'Rindfleisch', 'Beef', 'Carne de Res', 250.00, 26.00, 0.00, 15.00),
('tofu', 4, 2, '🟫', 'Tofu', 'Tofu', 'Tofu', 76.00, 8.00, 1.90, 4.80),
('tempeh', 4, 2, '🟫', 'Tempeh', 'Tempeh', 'Tempeh', 192.00, 20.00, 9.00, 11.00),
('seitan', 4, 2, '🟫', 'Seitan', 'Seitan', 'Seitán', 370.00, 75.00, 14.00, 1.90),
('lamb', 4, 2, '🐑', 'Lammfleisch', 'Lamb', 'Cordero', 294.00, 25.00, 0.00, 21.00),
('duck', 4, 2, '🦆', 'Entenfleisch', 'Duck', 'Pato', 337.00, 19.00, 0.00, 28.00),
('venison', 4, 2, '🦌', 'Hirschfleisch', 'Venison', 'Venado', 158.00, 30.00, 0.00, 3.20),

-- Tiefkühlkost (Kategorie 15: frozen)
('frozen_pizza', 15, 1, '🍕', 'Tiefkühlpizza', 'Frozen Pizza', 'Pizza Congelada', 285.00, 12.00, 36.00, 10.00),
('frozen_vegetables_mix', 15, 2, '🥦', 'TK-Gemüsemischung', 'Frozen Vegetable Mix', 'Verduras Congeladas', 65.00, 2.90, 13.00, 0.40),
('ice_cream_sandwich', 15, 1, '🍦', 'Eis-Sandwich', 'Ice Cream Sandwich', 'Sándwich de Helado', 237.00, 4.00, 35.00, 9.00),
('frozen_berries', 15, 2, '🫐', 'TK-Beeren', 'Frozen Berries', 'Bayas Congeladas', 57.00, 0.70, 14.00, 0.30),

-- Gewürze und Soßen (Kategorie 14: condiments)
('ketchup', 14, 2, '🍅', 'Ketchup', 'Ketchup', 'Ketchup', 112.00, 1.70, 27.00, 0.10),
('mustard', 14, 2, '🌭', 'Senf', 'Mustard', 'Mostaza', 66.00, 4.40, 5.80, 3.30),
('mayonnaise', 14, 2, '🥪', 'Mayonnaise', 'Mayonnaise', 'Mayonesa', 680.00, 1.00, 0.60, 75.00),
('bbq_sauce', 14, 2, '🍖', 'BBQ Sauce', 'BBQ Sauce', 'Salsa BBQ', 172.00, 0.80, 41.00, 0.60),
('soy_sauce', 14, 2, '🥢', 'Sojasoße', 'Soy Sauce', 'Salsa de Soja', 8.00, 1.30, 0.80, 0.00),
('hot_sauce', 14, 2, '🌶️', 'Scharfe Soße', 'Hot Sauce', 'Salsa Picante', 12.00, 0.50, 3.00, 0.10),
('ranch_dressing', 14, 2, '🥗', 'Ranch Dressing', 'Ranch Dressing', 'Aderezo Ranch', 320.00, 1.00, 4.00, 33.00),
('honey', 14, 2, '🍯', 'Honig', 'Honey', 'Miel', 304.00, 0.30, 82.00, 0.00),
('maple_syrup', 14, 2, '🍁', 'Ahornsirup', 'Maple Syrup', 'Jarabe de Arce', 260.00, 0.00, 67.00, 0.60),
('olive_oil', 14, 2, '🫒', 'Olivenöl', 'Olive Oil', 'Aceite de Oliva', 884.00, 0.00, 0.00, 100.00),
('butter', 14, 2, '🧈', 'Butter', 'Butter', 'Mantequilla', 717.00, 0.90, 0.10, 81.00),
('salt', 14, 2, '🧂', 'Salz', 'Salt', 'Sal', 0.00, 0.00, 0.00, 0.00),
('black_pepper', 14, 2, '🌶️', 'Schwarzer Pfeffer', 'Black Pepper', 'Pimienta Negra', 251.00, 10.00, 64.00, 3.30),

-- Deutsche Spezialitäten
('bratwurst', 4, 1, '🌭', 'Bratwurst', 'Bratwurst', 'Salchicha Alemana', 297.00, 12.00, 2.00, 27.00),
('sauerkraut', 3, 2, '🥬', 'Sauerkraut', 'Sauerkraut', 'Chucrut', 19.00, 0.90, 4.30, 0.10),
('schnitzel', 4, 1, '🍖', 'Schnitzel', 'Schnitzel', 'Escalope', 291.00, 25.00, 15.00, 16.00),
('pretzel', 13, 1, '🥨', 'Brezel', 'Pretzel', 'Pretzel', 338.00, 9.00, 71.00, 3.00),

-- Internationale Spezialitäten
('sushi_roll', 4, 1, '🍣', 'Sushi Rolle', 'Sushi Roll', 'Rollo de Sushi', 200.00, 8.50, 20.00, 7.00),
('paella', 4, 1, '🥘', 'Paella', 'Paella', 'Paella', 172.00, 10.00, 24.00, 4.00),
('fish_and_chips', 9, 1, '🐟', 'Fish and Chips', 'Fish and Chips', 'Pescado y Papas', 365.00, 18.00, 32.00, 19.00),
('curry_chicken', 4, 1, '🍛', 'Hähnchen Curry', 'Chicken Curry', 'Pollo al Curry', 165.00, 25.00, 8.00, 4.00),
('falafel', 4, 1, '🧆', 'Falafel', 'Falafel', 'Falafel', 333.00, 13.00, 32.00, 18.00);
