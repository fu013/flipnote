import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { CLIENT_URL, PORT, SESSION_SECRET_KEY } from './config/config';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: CLIENT_URL,
    credentials: true,
    allowedHeaders: 'X-Requested-With, Content-Type, Authorization',
  }); // 서로 다른 주소 CORS policy 설정
  app.useGlobalPipes( // 코드가 지나가는 통로, express의 미들웨어같은 역할
    new ValidationPipe({ // 유효성 검사를 위한 파이프
      whitelist: false, // decorator가 없는 어떠한 property도 거름
      forbidNonWhitelisted: false, // 화이트리스트 기준에 부합하지 않는 모든 property를 거르고, 경고 메세지를 출력해줌
      transform: false, // 유저가 보낸 property를 원하는 속성으로 변경해줌, 요청 파라미터 Default 타입이 string 고정이라 string으로 받아야만 하는 상황임에도, transform을 이용하면, 요청할때마다 원하는 타입으로 변환후 받을 수 있음, 쓰지 않으면 자기가 직접 파싱해야함
    }),
  );
  app.use( // express-session 설정
    session({
      secret: SESSION_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000,
      },
    }),
    rateLimit({ // 요청 제한과 IP 차단: 100회 / 5분, IP 주소로 제한
      windowMs: 5 * 60 * 1000, // 5분
      max: 1000, // 최대 허용 횟수
      keyGenerator: (req) => req.ip, // IP 주소를 기준으로 제한
    }),
    cookieParser()
  );
  await app.listen(PORT);
}
bootstrap();
