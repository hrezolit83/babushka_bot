import { getCorrectedText } from '../services/openai.js';
import { getWeatherByCity } from '../services/weatherapi.js';

export async function handleWeather(ctx, userInput) {
  try {
    await ctx.reply('🔍 Перевіряю назву міста...');

    // const correctedCity = await getCorrectedText(userInput, 'місто');

    const correctedCity = userInput;

    await ctx.reply(`Використовую назву міста: ${correctedCity}`);

    const weather = await getWeatherByCity(correctedCity);

    const temp = weather.current.temp_c;
    const city = weather.location.name;

    let message = '';
    if (temp < 15) {
      message = `🌡️ Сьогодні ${temp}°C у ${city}. Холодно, одягни куртку.`;
    } else {
      message = `🌡️ Сьогодні ${temp}°C у ${city}. Гарна погода — можна в футболці!`;
    }

    await ctx.reply(message);
  } catch (error) {
    console.error('❌ Помилка у weather handler:', error.message);
    await ctx.reply('Виникла помилка при отриманні погоди. Спробуй ще раз.');
  }
}
