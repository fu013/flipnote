import * as fs from 'fs';
import * as path from 'path';

// 유저 로그 저장
export const writeLogByMbId = async (
  mbId: string,
  logMessage: string,
): Promise<void> => {
  const logFilePath = path.join(process.cwd(), `/logs/user/${mbId}.log`);
  try {
    const logDir = path.dirname(logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    await fs.promises.appendFile(logFilePath, `${logMessage}\n`);
  } catch (error) {
    console.error('Error writing log:', error);
    throw error;
  }
};
