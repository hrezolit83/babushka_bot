//Заглушка для render.com

import express from 'express';
import './bot.js'; // Імпортуємо і запускаємо бота

const app = express();
const PORT = process.env.PORT || 10000; // будь-який порт, Render сам підставляє

app.get('/', (req, res) => {
  res.send('🤖 Бот живий! Все працює.');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Express-сервер слухає порт ${PORT}`);
});
