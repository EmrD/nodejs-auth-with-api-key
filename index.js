// index.js
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.get('x-api-key');
  const validApiKey = process.env.API_KEY;

  if (apiKey && apiKey === validApiKey) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Invalid API Key' });
  }
};

app.use(apiKeyMiddleware);

app.get('/api/data', (req, res) => {
  res.json({ message: 'Welcome to the secured API!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
