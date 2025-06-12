//Заглушка для render.com

import express from 'express';
import bot from './bot.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// обробка запитів від Telegram
app.use(bot.webhookCallback('/telegraf'));

// запуск сервера
app.get('/', (req, res) => {
  res.send('🤖 Бот працює через Webhook!');
});

app.listen(PORT, async () => {
  console.log(`🌐 Сервер запущено на порту ${PORT}`);

  const domain = process.env.RENDER_EXTERNAL_URL;
  if (!domain) {
    console.warn('⚠️ RENDER_EXTERNAL_URL не вказано — Webhook не встановлено');
    return;
  }

  const webhookUrl = `${domain}/telegraf`;
  await bot.telegram.setWebhook(webhookUrl);
  console.log(`✅ Встановлено webhook: ${webhookUrl}`);
});
