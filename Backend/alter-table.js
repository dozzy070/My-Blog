import { pool } from './Config/db.js';

async function alterTable() {
  try {
    // Add status column if it doesn't exist
    await pool.query(`
      ALTER TABLE posts
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
    `);
    console.log('Status column added to posts table');

    // Add updated_at column if it doesn't exist
    await pool.query(`
      ALTER TABLE posts
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
    `);
    console.log('Updated_at column added to posts table');
  } catch (error) {
    console.error('Error altering table:', error);
  } finally {
    pool.end();
  }
}

alterTable();