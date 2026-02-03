import { pool } from './Config/db.js';

async function checkSchema() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'posts'
      ORDER BY ordinal_position;
    `);
    console.log('Posts table schema:');
    result.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type} (${row.is_nullable})`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    pool.end();
  }
}

checkSchema();