import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mysql from 'mysql2/promise';
import config from './config.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization,x-api-key'
}));

const pool = mysql.createPool(config.db);

const apiKeyMiddleware = async (req, res, next) => {
  const apiKey = req.get('x-api-key');

  if (!apiKey) {
    return res.status(403).json({ error: 'Forbidden: API Key is required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [apiKey]);

    if (rows.length > 0) {
      req.user = rows[0]; // Kullanıcı bilgilerini req.user içine kaydediyoruz
      next();
    } else {
      res.status(403).json({ error: 'Forbidden: Invalid API Key' });
    }
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

app.use(apiKeyMiddleware);

app.get('/api/data', (req, res) => {
  res.json({
    message: 'Welcome to the secured API!',
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
