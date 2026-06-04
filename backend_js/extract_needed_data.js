// Made by AI
import fs from 'fs';
import readline from 'readline';
import { Pool } from 'pg';
import format from 'pg-format';
import dotendv from 'dotenv';
dotendv.config();

const DB_CONFIG = {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: 5432,
};

const INPUT_FILE = 'sample2.jsonl' //'sample.jsonl';
const BATCH_SIZE = 5000; // Anzahl Produkte pro INSERT (Performance)

const pool = new Pool(DB_CONFIG);

async function startImport() {
    console.log('Starting Import of', INPUT_FILE);

    const client = await pool.connect();

    try {
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
        console.log('Table "products" ready.');

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

                if (!p.code || !p.product_name) continue;

                const n = p.nutriments || {};

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

                if (batch.length >= BATCH_SIZE) {
                    await insertBatch(client, batch);
                    totalCount += batch.length;
                    process.stdout.write(`\r📦 Importiert: ${totalCount} Produkte...`);
                    batch = [];
                }

            } catch (err) {
                continue;
            }
        }

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
