const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function migrate() {
    const client = await pool.connect();

    try {
        console.log('Starting database migration...');

        // Read and execute schema
        const schemaSQL = fs.readFileSync(
            path.join(__dirname, 'schema.sql'),
            'utf8'
        );

        await client.query(schemaSQL);
        console.log('✓ Database schema created successfully');

        // Initialize warehouse locations (18,200 positions)
        console.log('Initializing warehouse locations...');
        await initializeWarehouseLocations(client);
        console.log('✓ Warehouse locations initialized');

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

async function initializeWarehouseLocations(client) {
    const aisles = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const levels = Array.from({ length: 10 }, (_, i) => i + 1);
    const units = Array.from({ length: 10 }, (_, i) => i + 1);
    const positions = Array.from({ length: 7 }, (_, i) => i + 1);

    let insertCount = 0;
    const batchSize = 1000;
    let values = [];

    // Generate all locations for sales inventory (no C- prefix)
    for (const aisle of aisles) {
        for (const level of levels) {
            for (const unit of units) {
                for (const position of positions) {
                    const locationCode = `${aisle}-${String(level).padStart(2, '0')}-${String(unit).padStart(2, '0')}-${position}`;
                    values.push(`(
                        uuid_generate_v4(),
                        '${locationCode}',
                        '${aisle}',
                        ${level},
                        ${unit},
                        ${position},
                        false,
                        false
                    )`);

                    insertCount++;

                    // Insert in batches
                    if (values.length >= batchSize) {
                        await insertBatch(client, values);
                        console.log(`  Inserted ${insertCount} locations...`);
                        values = [];
                    }
                }
            }
        }
    }

    // Generate all locations for customer storage (C- prefix)
    for (const aisle of aisles) {
        for (const level of levels) {
            for (const unit of units) {
                for (const position of positions) {
                    const locationCode = `C-${aisle}-${String(level).padStart(2, '0')}-${String(unit).padStart(2, '0')}-${position}`;
                    values.push(`(
                        uuid_generate_v4(),
                        '${locationCode}',
                        '${aisle}',
                        ${level},
                        ${unit},
                        ${position},
                        true,
                        false
                    )`);

                    insertCount++;

                    // Insert in batches
                    if (values.length >= batchSize) {
                        await insertBatch(client, values);
                        console.log(`  Inserted ${insertCount} locations...`);
                        values = [];
                    }
                }
            }
        }
    }

    // Insert remaining
    if (values.length > 0) {
        await insertBatch(client, values);
    }

    console.log(`  Total locations created: ${insertCount}`);
}

async function insertBatch(client, values) {
    const query = `
        INSERT INTO warehouse_locations (
            id, location_code, aisle, level, unit, position, is_customer_storage, is_occupied
        ) VALUES ${values.join(',')}
        ON CONFLICT (location_code) DO NOTHING
    `;
    await client.query(query);
}

// Run migration
migrate().catch(console.error);
