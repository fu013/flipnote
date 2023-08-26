import * as fs_p from 'fs/promises';
import * as path from 'path';

// 유저 로그 읽기
export const readLogByMbId = async (mbId: string): Promise<string> => {
  try {
    const logFilePath = path.join(process.cwd(), `logs/user/${mbId}.log`);
    try {
      await fs_p.access(logFilePath);
    } catch (error) {
      await fs_p.writeFile(logFilePath, '', 'utf-8');
    }
    const data = await fs_p.readFile(logFilePath, 'utf-8');
    return data;
  } catch (error) {
    console.error('Error reading log file:', error);
    return '';
  }
};
