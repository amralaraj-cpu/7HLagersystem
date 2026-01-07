const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function seed() {
    const client = await pool.connect();

    try {
        console.log('Starting database seeding...');

        // Create default admin user
        const password = await bcrypt.hash('Admin123!', 10);
        await client.query(`
            INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (email) DO NOTHING
        `, ['admin@sjuharads.se', password, 'Admin', 'User', 'admin', true]);

        console.log('✓ Default admin user created (email: admin@sjuharads.se, password: Admin123!)');

        // Create a test regular user
        const userPassword = await bcrypt.hash('User123!', 10);
        await client.query(`
            INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (email) DO NOTHING
        `, ['user@sjuharads.se', userPassword, 'Test', 'User', 'user', true]);

        console.log('✓ Test user created (email: user@sjuharads.se, password: User123!)');

        console.log('\nSeeding completed successfully!');
        console.log('\nDefault Credentials:');
        console.log('-----------------------------------');
        console.log('Admin: admin@sjuharads.se / Admin123!');
        console.log('User:  user@sjuharads.se / User123!');
        console.log('-----------------------------------');

    } catch (error) {
        console.error('Seeding failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run seed
seed().catch(console.error);
