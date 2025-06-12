import express from 'express';
import { getEnvVar } from './utils/getEnvVar';
import './bot.js';

const app = express();
const PORT = getEnvVar('PORT', '3000');

app.get('/', (req, res) => {
  res.send('Бот працює 🟢');
});

app.listen(PORT, () => {
  console.log(`🌐 Сервер запущено на порту ${PORT}`);
});
