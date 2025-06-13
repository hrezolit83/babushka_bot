import { google } from 'googleapis';
import { readFile } from 'fs/promises';
import { getEnvVar } from '../utils/getEnvVar.js';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_ID = getEnvVar('SHEET_ID');

let sheetsClient;

async function authorize() {
  if (sheetsClient) return sheetsClient;

  const credentials = JSON.parse(
    // await readFile('/etc/secrets/google-credentials.json', 'utf-8'),
    await readFile(
      'google-credentials.json' || '/etc/secrets/google-credentials.json',
      'utf-8',
    ),
  );

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });

  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

export async function logToSheet({ date, username, input, mode, response }) {
  const sheets = await authorize();

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Logs!A1:E1',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[date, username, input, mode, response]],
    },
  });
}
