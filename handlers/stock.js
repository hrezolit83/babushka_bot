import { getCorrectedText } from '../services/openai.js';
import { getStockPriceByCompany } from '../services/stocksapi.js';
import { logToSheet } from '../services/googleSheets.js';

export async function handleStock(ctx, userInput) {
  try {
    await ctx.reply('🔍 Перевіряю назву компанії...');

    // const correctedCompany = await getCorrectedText(userInput, 'компанія');

    const correctedCompany = userInput;

    await ctx.reply(`Використовую назву компанії: ${correctedCompany}`);

    const { ticker, price } = await getStockPriceByCompany(correctedCompany);

    const message = `📈 Поточна ціна акцій ${correctedCompany} (${ticker}) — $${price}`;
    await ctx.reply(message);

    await logToSheet({
      date: new Date().toISOString(),
      username: ctx.from?.username || ctx.from?.first_name || 'Невідомо',
      input: userInput,
      mode: 'stock',
      response: message,
    });
  } catch (error) {
    console.error('❌ Помилка у stock handler:', error.message);
    await ctx.reply(
      'Виникла помилка при отриманні ціни акцій. Спробуй ще раз.',
    );
  }
}
