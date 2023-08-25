import * as fs_p from 'fs/promises';
import * as path from 'path';

export const readLogByMbId = async (mbId: string): Promise<string> => {
  try {
    const logFilePath = path.join(process.cwd(), `logs/user/${mbId}.log`);

    // Check if the file exists
    try {
      await fs_p.access(logFilePath);
    } catch (error) {
      // If file does not exist, create it
      await fs_p.writeFile(logFilePath, '', 'utf-8');
    }

    const data = await fs_p.readFile(logFilePath, 'utf-8');
    return data;
  } catch (error) {
    console.error('Error reading log file:', error);
    return '';
  }
};
