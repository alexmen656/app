// Made by AI

const fs = require('fs');
const readline = require('readline');
const { Pool } = require('pg');
const format = require('pg-format');
const dotendv = require('dotenv');
dotendv.config();

// --- KONFIGURATION ---
const DB_CONFIG = {
    user: 'postgres',      // Dein DB User
    host: 'localhost',
    database: 'postgres',  // Deine DB Name
    password: process.env.DB_PASSWORD,   // <--- HIER PASSWORT EINTRAGEN
    port: 5432,
};

// Dateipfad zur JSONL Datei (die du mit wget oder curl geholt hast)
const INPUT_FILE = 'sample.jsonl';
// Oder zum Testen: 'sample.jsonl'

const BATCH_SIZE = 5000; // Anzahl Produkte pro INSERT (Performance)

// --- DATENBANK SETUP ---
const pool = new Pool(DB_CONFIG);

async function startImport() {
    console.log('🚀 Starte Import von', INPUT_FILE);

    const client = await pool.connect();

    try {
        // 1. Tabelle erstellen (Falls nicht existiert)
        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                barcode TEXT PRIMARY KEY,
                name TEXT,
                brand TEXT,
                image TEXT,
                ingredients TEXT,
                package_size TEXT,
                serving_quantity NUMERIC,
                serving_unit TEXT,
                calories NUMERIC,
                protein NUMERIC,
                carbs NUMERIC,
                fat NUMERIC,
                fiber NUMERIC,
                sugar NUMERIC,
                salt NUMERIC,
                sodium NUMERIC,
                saturated_fat NUMERIC,
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('✅ Tabelle "products" bereit.');

        // 2. File Stream öffnen
        const fileStream = fs.createReadStream(INPUT_FILE);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let batch = [];
        let totalCount = 0;

        console.log('⏳ Lese Daten...');

        for await (const line of rl) {
            try {
                const p = JSON.parse(line);

                // --- DEIN PARSING LOGIC ---
                // Überspringen wenn Barcode oder Name fehlt
                if (!p.code || !p.product_name) continue;

                const n = p.nutriments || {};

                // Array für pg-format vorbereiten (Reihenfolge muss matchen!)
                const row = [
                    p.code,                                     // barcode
                    p.product_name.substring(0, 500),           // name (limit length)
                    (p.brands || '').substring(0, 200),         // brand
                    p.image_front_small_url || p.image_front_url || null, // image
                    (p.ingredients_text || '').substring(0, 2000), // ingredients
                    p.quantity || null,                         // package_size
                    Number(p.serving_quantity) || 0,            // serving_quantity
                    p.serving_quantity_unit || 'g',             // serving_unit
                    Number(n['energy-kcal_100g']) || 0,         // calories
                    Number(n.proteins_100g) || 0,               // protein
                    Number(n.carbohydrates_100g) || 0,          // carbs
                    Number(n.fat_100g) || 0,                    // fat
                    Number(n.fiber_100g) || 0,                  // fiber
                    Number(n.sugars_100g) || 0,                 // sugar
                    Number(n.salt_100g) || 0,                   // salt
                    Number(n.sodium_100g) || 0,                 // sodium
                    Number(n['saturated-fat_100g']) || 0        // saturated_fat
                ];

                batch.push(row);

                // Wenn Batch voll ist -> Insert
                if (batch.length >= BATCH_SIZE) {
                    await insertBatch(client, batch);
                    totalCount += batch.length;
                    process.stdout.write(`\r📦 Importiert: ${totalCount} Produkte...`);
                    batch = [];
                }

            } catch (err) {
                // Einzelne Zeilenfehler ignorieren (oft kaputtes JSON)
                continue;
            }
        }

        // Letzten Rest importieren
        if (batch.length > 0) {
            await insertBatch(client, batch);
            totalCount += batch.length;
        }

        console.log(`\n🎉 FERTIG! Insgesamt ${totalCount} Produkte importiert.`);

    } catch (e) {
        console.error('\n❌ Fataler Fehler:', e);
    } finally {
        client.release();
        await pool.end();
    }
}

async function insertBatch(client, rows) {
    const query = format(
        `INSERT INTO products (
            barcode, name, brand, image, ingredients, package_size, 
            serving_quantity, serving_unit, calories, protein, carbs, 
            fat, fiber, sugar, salt, sodium, saturated_fat
        ) VALUES %L 
        ON CONFLICT (barcode) DO UPDATE SET
            name = EXCLUDED.name,
            image = EXCLUDED.image,
            calories = EXCLUDED.calories,
            protein = EXCLUDED.protein,
            updated_at = NOW()`,
        rows
    );

    await client.query(query);
}

startImport();
