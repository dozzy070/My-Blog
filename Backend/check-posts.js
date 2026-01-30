import { pool } from './Config/db.js';

async function checkPosts() {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM posts');
    console.log('Posts count:', result.rows[0].count);

    if (result.rows[0].count > 0) {
      const posts = await pool.query('SELECT id, title, status, created_at FROM posts ORDER BY created_at DESC LIMIT 5');
      console.log('Recent posts:', posts.rows);
    }
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    pool.end();
  }
}

checkPosts();