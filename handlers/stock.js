import axios from 'axios';

export async function handleStock(ctx, userInput, userId, n8nBaseUrl) {
  try {
    const res = await axios.post(`${n8nBaseUrl}/webhook/get-stock`, {
      input_text: userInput,
      username: userId,
    });
    return res.data.message || '⚠️ Не вдалося отримати інформацію про акції.';
  } catch (err) {
    console.error('❌ Stock API error:', err.message);
    return '⚠️ Помилка при зверненні до сервісу акцій.';
  }
}
