import { google } from 'googleapis';
import { getEnvVar } from './getEnvVar.js';

export async function logToSheet({ username, input, mode, response }) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'google-credentials.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = getEnvVar('SHEET_ID');
    const sheetName = 'Logs';

    const now = new Date();
    const dateStr =
      now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0];

    const values = [[dateStr, username, input, mode, response]];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    console.log('✅ Лог успішно додано до Google Таблиці');
  } catch (error) {
    console.error('❌ Помилка при логуванні в Google Таблицю:', error.message);
  }
}
