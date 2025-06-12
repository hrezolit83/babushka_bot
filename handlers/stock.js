import { getStockPriceByCompany } from '../services/stocksapi.js';

export async function handleStock(ctx, userInput) {
  try {
    await ctx.reply('🔍 Шукаю інформацію про акції...');

    const { ticker, price } = await getStockPriceByCompany(userInput);

    await ctx.reply(
      `Ціна акцій ${ticker} зараз становить $${price.toFixed(2)}.`,
    );
  } catch (error) {
    console.error('❌ Помилка у stock handler:', error.message);
    await ctx.reply(
      'Виникла помилка при отриманні ціни акцій. Спробуй ще раз.',
    );
  }
}
