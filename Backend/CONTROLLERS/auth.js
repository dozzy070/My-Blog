import { pool } from "../Config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret";

// Register admin
export const RegisterAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    const existing = await pool.query("SELECT id FROM admins WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin
    const result = await pool.query(
      "INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "Admin registered successfully", admin: result.rows[0] });
  } catch (error) {
    console.error("RegisterAdmin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login admin
export const LoginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const admin = result.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: "24h" });

    const { password: _, ...adminData } = admin;

    res.status(200).json({ message: "Login successful", admin: adminData, token });
  } catch (error) {
    console.error("LoginAdmin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
