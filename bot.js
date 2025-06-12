import { session, Markup, Telegraf } from 'telegraf';
import { handleStock } from './handlers/stock.js';
import { handleWeather } from './handlers/weather.js';
import { getEnvVar } from './utils/getEnvVar.js';

const BOT_TOKEN = getEnvVar('BOT_TOKEN');

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не вказано в .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

bot.use(session());

bot.start((ctx) => {
  ctx.session = {};
  ctx.reply(
    'Привіт! Обери, що тебе цікавить:',
    Markup.keyboard([['🌦 Погода', '📈 Акції NASDAQ']]).resize(),
  );
});

bot.hears('🌦 Погода', (ctx) => {
  ctx.session ??= {};
  ctx.session.mode = 'weather';
  ctx.session.step = 'waitingCity';
  ctx.reply('Введи назву міста 🌍');
});

bot.hears('📈 Акції NASDAQ', (ctx) => {
  ctx.session ??= {};
  ctx.session.mode = 'stocks';
  ctx.session.step = 'waitingCompany';
  ctx.reply('Введи назву компанії (наприклад: Apple, Tesla):');
});

bot.on('text', async (ctx) => {
  const input = ctx.message.text.trim();
  const { mode, step } = ctx.session ?? {};

  console.log('Session:', ctx.session);

  if (mode === 'weather' && step === 'waitingCity') {
    ctx.session.step = null;
    await handleWeather(ctx, input);
  } else if (mode === 'stocks' && step === 'waitingCompany') {
    ctx.session.step = null;
    await handleStock(ctx, input);
  } else {
    ctx.reply('Будь ласка, обери опцію в меню: 🌦 або 📈');
  }
});

bot.launch();
console.log('✅ Бот запущено');
