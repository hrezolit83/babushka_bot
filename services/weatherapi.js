import axios from 'axios';
import { getEnvVar } from '../utils/getEnvVar.js';

const WEATHER_API_KEY = getEnvVar('WEATHER_API_KEY');

export async function getWeatherByCity(cityName) {
  try {
    const response = await axios.get(
      'http://api.weatherapi.com/v1/current.json',
      {
        params: {
          key: WEATHER_API_KEY,
          q: cityName,
          aqi: 'no',
        //   lang: 'en',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('❌ Помилка в WeatherAPI:', error.message);
    throw new Error('Не вдалося отримати погоду');
  }
}
