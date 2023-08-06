import { Logger } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 } from 'uuid';

// uploads 폴더가 존재하지 않으면 폴더를 생성하고, 존재하면 생성하지 않습니다.
const mkdir = (directory: string) => {
  const logger = new Logger('Mkdir');
  try {
    fs.readdirSync(path.join(process.cwd(), directory));
  } catch (err) {
    logger.log(
      `지정한 경로에 ${directory}가 존재하지 않아 ${directory}를 생성합니다.`,
    );
    fs.mkdirSync(path.join(process.cwd(), directory), {
      recursive: true,
      mode: 777,
    });
  }
};
export const multerOptionsFactory = (): MulterOptions => {
  return {
    storage: multer.diskStorage({
      destination(req, file, done) {
        const dirPath = `/static/uploads`;
        mkdir(dirPath);
        done(null, path.join(process.cwd(), dirPath));
      },
      filename(req, file, done) {
        // 파일의 이름을 설정합니다.
        const ext = path.extname(file.originalname); // 파일 확장자 추출
        const basename = path.basename(v4(), ext); // 파일 이름

        // 파일 이름이 중복되는 것을 막기 위해 '파일이름_날짜.확장자' 의 형식으로 파일이름을 지정합니다.
        done(null, `${basename}_${Date.now()}${ext}`);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB로 크기를 제한
  };
};
