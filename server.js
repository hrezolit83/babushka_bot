//Заглушка для Render.com.
//Даний файл необхідний у якості "костиля", щоб обійти
//платнй тариф для деплою нашого бота та обійтися безплатним.
//У реальному продакшені файлу server.js не повинно бути у структурі проекту бота.

import express from 'express';
import bot from './bot.js';
import { getEnvVar } from './utils/getEnvVar.js';

const app = express();
const PORT = getEnvVar('PORT', '3000');
const domain = getEnvVar('RENDER_EXTERNAL_URL');
const isLocal = getEnvVar('IS_LOCAL') === 'true';

app.use(express.json());

if (!isLocal) {
  // 🔗 Режим для Render.com/Webhook
  app.use(bot.webhookCallback('/telegraf'));

  app.listen(PORT, async () => {
    console.log(`🌐 Сервер запущено на порту ${PORT}`);
    const webhookUrl = `${domain}/telegraf`;
    await bot.telegram.setWebhook(webhookUrl);
    console.log(`✅ Встановлено webhook: ${webhookUrl}`);
  });
} else {
  // 🖥️ Локальний polling режим
  bot.launch();
  console.log('✅ Бот запущено локально через polling');

  app.listen(PORT, () => {
    console.log(`🌐 Сервер запущено локально на порту ${PORT}`);
  });
}
