
import { pool } from '../Config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret";

export const RegisterAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    const existing = await pool.query('SELECT id FROM admins WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin
    const query = `
      INSERT INTO admins (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email
    `;
    const values = [name, email, hashedPassword];
    const result = await pool.query(query, values);

    const admin = result.rows[0];
    res.status(201).json({ message: 'Admin registered successfully', admin });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const LoginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const admin = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // res.cookie('token', token, 
    //     { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
    //     maxAge: 3600000 // 1 hour


    // Return admin data without password
    const { password: _, ...adminData } = admin;

    res.status(200).json({
      message: 'Login successful',
      admin: adminData,
      token
    });

  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
