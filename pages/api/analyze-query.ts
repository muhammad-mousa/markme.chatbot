// pages/api/analyze-query.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { TextAnalyticsClient, AzureKeyCredential } from "@azure/ai-text-analytics";

const AZURE_CHAT_KEY = process.env.NEXT_PUBLIC_AZURE_CHAT_KEY ;
const AZURE_CHAT_ENDPOINT = process.env.NEXT_PUBLIC_AZURE_CHAT_ENDPOINT ;

const client = new TextAnalyticsClient(
  AZURE_CHAT_ENDPOINT,
  new AzureKeyCredential(AZURE_CHAT_KEY)
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  debugger;
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query } = req.body;

  try {
    const documents = [query];
    const keyPhrases = await client.extractKeyPhrases(documents);
    console.log('Key Phrases:', keyPhrases[0].keyPhrases);

    // Sample attendance data
    const attendanceData = [
      { date: '2024-01-30', employee: 'John Doe', status: 'Present', hours: 8 },
      { date: '2024-01-30', employee: 'Jane Smith', status: 'Late', hours: 7 },
      { date: '2024-01-29', employee: 'John Doe', status: 'Present', hours: 8 },
      { date: '2024-01-29', employee: 'Jane Smith', status: 'Absent', hours: 0 },
    ];

    // Process key phrases and filter attendance data
    const response = processAttendanceQuery(keyPhrases[0].keyPhrases, attendanceData);

    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: 'Error processing query' });
  }
}

function processAttendanceQuery(keyPhrases: string[], data: any[]) {
// Basic query processing logic
  if (keyPhrases.some(phrase => phrase.includes('Absent'))) {
    return data.filter(record => record.status === 'Absent');
  }
  if (keyPhrases.some(phrase => phrase.includes('Late'))) {
    return data.filter(record => record.status === 'Late');
  }
  if (keyPhrases.some(phrase => phrase.includes('John'))) {
    return data.filter(record => record.employee === 'John Doe');
  }
  if (keyPhrases.some(phrase => phrase.includes('Present'))) {
    return data.filter(record => record.status === 'Present');
  }

  return data;
}