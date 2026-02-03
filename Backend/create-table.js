import { pool } from './Config/db.js';

async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        image TEXT,
        status TEXT DEFAULT 'published',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Posts table created or already exists');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    pool.end();
  }
}

createTable();