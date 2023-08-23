import * as fs from 'fs/promises';
import * as path from 'path';

export const readLogByMbId = async (mbId: string): Promise<string> => {
  try {
    const logFilePath = path.join(process.cwd(), `/logs/user/${mbId}.log`);
    const data = await fs.readFile(logFilePath, 'utf-8');
    return data;
  } catch (error) {
    console.error('Error reading log file:', error);
    return '';
  }
};
