import { Telegraf, session, Markup } from 'telegraf';
import { getEnvVar } from './utils/getEnvVar.js';
import { handleWeather } from './handlers/weather.js';
import { handleStock } from './handlers/stock.js';

const BOT_TOKEN = getEnvVar('BOT_TOKEN');
const DOMAIN = getEnvVar('RENDER_EXTERNAL_URL');

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не вказано');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

bot.use(session());

bot.start((ctx) => {
  ctx.reply(
    'Привіт! Обери, що тебе цікавить:',
    Markup.keyboard([['🌦 Погода', '📈 Акції NASDAQ']]).resize(),
  );
});

bot.hears('🌦 Погода', (ctx) => {
  ctx.reply('Введи назву міста 🌍');
  ctx.session = { mode: 'weather', step: 'waitingCity' };
});

bot.hears('📈 Акції NASDAQ', (ctx) => {
  ctx.reply('Введи назву компанії:');
  ctx.session = { mode: 'stocks', step: 'waitingCompany' };
});

bot.on('text', async (ctx) => {
  const mode = ctx.session?.mode;
  const step = ctx.session?.step;
  const input = ctx.message.text.trim();

  if (mode === 'weather' && step === 'waitingCity') {
    await handleWeather(ctx, input);
    ctx.session = {}; // 🔧 очищення сесії
  } else if (mode === 'stocks' && step === 'waitingCompany') {
    await handleStock(ctx, input);
    ctx.session = {}; // 🔧 очищення сесії
  } else {
    ctx.reply('Будь ласка, обери опцію з меню 🌦 або 📈');
  }
});

export default bot;
