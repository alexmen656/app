import express from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3450;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

const htmlTemplate = (rows, count, sizePretty, sizeBytes) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kalbuddy DB Viewer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .truncate-text { max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    </style>
</head>
<body class="bg-gray-100 p-8">
    <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-800">🥑 Kalbuddy Products</h1>
            <div class="bg-white px-4 py-2 rounded shadow">
                <span class="text-gray-500">Total Products:</span>
                <span class="text-2xl font-bold text-blue-600 ml-2">${count}</span>
                <div class="text-xs text-gray-400">Table size: ${sizePretty || 'n/a'} (${sizeBytes || 0} bytes)</div>
            </div>
        </div>
        <form action="/" method="GET" class="mb-6 flex gap-2">
            <input type="text" name="q" placeholder="Search by name or barcode..." 
                   class="flex-1 p-3 rounded shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700">Search</button>
        </form>
        <div class="bg-white rounded-lg shadow overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name / Brand</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barcode</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nutrition (100g)</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score Vars</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${rows.map(row => `
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                            ${row.image ? `<img src="${row.image}" class="h-12 w-12 object-contain rounded bg-gray-100">` : '<div class="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">?</div>'}
                        </td>
                        <td class="px-6 py-4">
                            <div class="text-sm font-medium text-gray-900 truncate-text" title="${row.name}">${row.name}</div>
                            <div class="text-xs text-gray-500">${row.brand || '-'}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                            ${row.barcode}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            🔥 ${row.calories} kcal<br>
                            💪 ${row.protein}g P
                        </td>
                         <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                            Salt: ${row.salt}g | Sugar: ${row.sugar}g
                        </td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ${rows.length === 0 ? '<div class="p-8 text-center text-gray-500">No products found.</div>' : ''}
        </div>
        
        <div class="mt-4 text-center text-sm text-gray-400">
            Showing ${rows.length} results (displaying ${rows.length} of ${count} total) — Storage: ${sizePretty || 'n/a'}
        </div>
    </div>
</body>
</html>
`;

app.get('/', async (req, res) => {
    const search = req.query.q || '';

    try {
        const countResult = await pool.query('SELECT count(*) FROM products');
        const totalCount = parseInt(countResult.rows[0].count, 10) || 0;

        const sizeResult = await pool.query("SELECT pg_size_pretty(pg_total_relation_size('products')) AS size_pretty, pg_total_relation_size('products') AS size_bytes");
        const sizePretty = sizeResult.rows[0] ? sizeResult.rows[0].size_pretty : null;
        const sizeBytes = sizeResult.rows[0] ? sizeResult.rows[0].size_bytes : 0;

        let query = 'SELECT * FROM products ORDER BY updated_at DESC LIMIT 50';
        let params = [];

        if (search) {
            query = `
                SELECT * FROM products 
                WHERE name ILIKE $1 OR barcode ILIKE $1 
                LIMIT 50
            `;
            params = [`%${search}%`];
        }

        const result = await pool.query(query, params);
        res.send(htmlTemplate(result.rows, totalCount, sizePretty, sizeBytes));
    } catch (err) {
        res.status(500).send(`Error: ${err.message}`);
    }
});

app.listen(port, () => {
    console.log(`DB Visualizer running at http://localhost:${port}`);
});
