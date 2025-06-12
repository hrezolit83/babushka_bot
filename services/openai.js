import axios from 'axios';
import { getEnvVar } from '../utils/getEnvVar.js';

const OPENAI_API_KEY = getEnvVar('OPENAI_API_KEY');

export async function getCorrectedText(input, type = 'місто') {
  try {
    const prompt = `
      Ти — помічник, який отримує назву ${type} українською, російською або англійською.
      Якщо назва не англійською — переведи її на англійську.
      Якщо є помилки — виправ їх.
      Поверни тільки виправлену/перекладену назву без додаткового тексту.
      Вхід: "${input}"
    `;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const result = response.data.choices[0].message.content.trim();
    return result;
  } catch (error) {
    console.error('❌ Помилка в OpenAI:', error.message);
    throw new Error('Помилка автокорекції');
  }
}
