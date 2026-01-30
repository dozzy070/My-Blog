
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Use environment variables
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "Blog",
  password: process.env.DB_PASSWORD || "dozzy",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  ssl: { rejectUnauthorized: false } // Enable SSL with self-signed certificates
  
});

// Test connection (optional)
pool.connect()
  .then(() => console.log("PostgreSQL connected"))
  .catch(err => console.error("PostgreSQL connection error:", err));

export { pool };
