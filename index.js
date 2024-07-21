import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
console.log(process.env.API_KEYS); //log api keys to analyze

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization,x-api-key'
}));

const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.get('x-api-key');
  if (apiKey && validApiKeys.includes(apiKey)) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Invalid API Key' });
  }
};
app.use(apiKeyMiddleware);
app.get('/api/data', (req, res) => {
    res.json({ message: 'Welcome to the secured API with ${apiKey}!' });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
