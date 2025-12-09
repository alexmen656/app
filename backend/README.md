# Digmio Food Database Backend

Einfaches PHP Backend für die Digmio Food Database - Old School Style! 🍎

## 🚀 Quick Start

### 1. Setup Datenbank
```
http://localhost/kalbuddy/backend/setup_database.php
```

### 2. Admin Panel öffnen
```
http://localhost/kalbuddy/backend/admin.html
```

### 3. API testen
```
http://localhost/kalbuddy/backend/get_foods.php
http://localhost/kalbuddy/backend/get_categories.php
```

## 📁 Datei-Struktur

```
backend/
├── db.php                    # Datenbankverbindung + CORS
├── get_categories.php        # Alle Kategorien abrufen
├── get_foods.php            # Alle Lebensmittel abrufen
├── get_units.php            # Alle Einheiten abrufen
├── add_category.php         # Neue Kategorie hinzufügen
├── add_food.php             # Neues Lebensmittel hinzufügen
├── log_consumption.php      # Verbrauch protokollieren
├── admin.html              # Admin Panel (UI)
├── setup_database.php      # Datenbank Setup
└── database/
    └── schema.sql          # Datenbankschema
```

## 🔧 Konfiguration

**db.php bearbeiten:**
```php
$host = 'localhost';
$dbname = 'kalbuddy_food_db';
$username = 'root';
$password = '';
```

## 📡 API Endpoints

### Kategorien
- `GET get_categories.php?lang=de` - Alle Kategorien
- `POST add_category.php` - Neue Kategorie

### Lebensmittel  
- `GET get_foods.php?category=2&search=apfel&lang=de` - Lebensmittel filtern
- `POST add_food.php` - Neues Lebensmittel

### Einheiten
- `GET get_units.php?lang=de` - Alle Einheiten

### Verbrauch
- `POST log_consumption.php` - Verbrauch protokollieren

## 📊 Datenbank

**Haupttabellen:**
- `categories` - Lebensmittelkategorien (Obst, Gemüse, etc.)
- `foods` - Lebensmittel mit Nährwerten  
- `units` - Einheiten (Stück, 100g, etc.)
- `food_consumption` - Verbrauchsprotokoll

**Features:**
- ✅ Mehrsprachigkeit (DE/EN/ES)
- ✅ 25+ vorinstallierte Lebensmittel
- ✅ Kategorisierung
- ✅ Flexible Einheiten
- ✅ Verbrauchstracking
- ✅ CORS für Frontend

## 🎯 Beispiel API Calls

### Neue Kategorie hinzufügen
```javascript
fetch('add_category.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'snacks',
        icon: '🍪',
        name_de: 'Snacks',
        name_en: 'Snacks', 
        name_es: 'Aperitivos'
    })
})
```

### Neues Lebensmittel hinzufügen
```javascript
fetch('add_food.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        code: 'chocolate',
        category_id: 8, // snacks
        unit_id: 2,     // 100g
        icon: '🍫',
        name_de: 'Schokolade',
        name_en: 'Chocolate',
        name_es: 'Chocolate',
        calories: 546,
        protein: 4.9,
        carbs: 61,
        fats: 31
    })
})
```

### Verbrauch protokollieren
```javascript
fetch('log_consumption.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        user_id: 'user123',
        food_id: 1,     // Apple
        amount: 2       // 2 Stück
    })
})
```

## 🛠 Integration in Vue App

Die Vue App kann direkt diese Endpoints verwenden:

```javascript
// In FoodDatabaseView.vue
const API_BASE = 'http://localhost/kalbuddy/backend'

// Load foods
const response = await fetch(`${API_BASE}/get_foods.php?lang=${locale}`)
const data = await response.json()
```

## 🚨 Wichtige Hinweise

- **CORS** ist bereits konfiguriert für localhost
- **Validation** ist in allen Endpoints implementiert  
- **Error Handling** gibt JSON-Responses zurück
- **MySQL** muss laufen für die Datenbank
- **Admin Panel** ist responsive und benutzerfreundlich
