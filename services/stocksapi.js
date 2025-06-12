import axios from 'axios';
import { getEnvVar } from '../utils/getEnvVar.js';

const FINNHUB_API_KEY = getEnvVar('FINNHUB_API_KEY');

if (!FINNHUB_API_KEY) {
  console.error('❌ FINNHUB_API_KEY не вказано в .env');
  process.exit(1);
}

// Спершу перетворимо назву компанії на символ (тикер)
async function getTickerByCompanyName(companyName) {
  try {
    const response = await axios.get('https://finnhub.io/api/v1/search', {
      params: {
        q: companyName,
        token: FINNHUB_API_KEY,
      },
    });

    const results = response.data.result;

    if (!results || results.length === 0) {
      throw new Error('Компанію не знайдено');
    }

    // Пошук з гнучкішою перевіркою біржі
    const preferred = results.find(
      (item) =>
        item.symbol &&
        ['NASDAQ', 'NASDAQ NMS', 'US', 'NYSE'].includes(item.exchange),
    );

    const fallback = results[0]; // якщо немає NASDAQ — беремо першу

    const selected = preferred || fallback;

    return selected.symbol;
  } catch (error) {
    console.error('❌ Помилка в getTickerByCompanyName:', error.message);
    throw new Error('Помилка отримання тикера компанії');
  }
}

// Отримуємо поточну ціну акції за тикером
async function getStockPriceByTicker(ticker) {
  try {
    const response = await axios.get('https://finnhub.io/api/v1/quote', {
      params: {
        symbol: ticker,
        token: FINNHUB_API_KEY,
      },
    });

    if (!response.data || response.data.c === 0) {
      throw new Error('Помилка отримання ціни акції');
    }

    return response.data.c; // поточна ціна
  } catch (error) {
    console.error('❌ Помилка в getStockPriceByTicker:', error.message);
    throw new Error('Помилка отримання ціни акції');
  }
}

export async function getStockPriceByCompany(companyName) {
  try {
    const ticker = await getTickerByCompanyName(companyName);
    const price = await getStockPriceByTicker(ticker);
    return { ticker, price };
  } catch (error) {
    throw error;
  }
}
