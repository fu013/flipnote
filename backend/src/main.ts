import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CLIENT_URL, PORT } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: CLIENT_URL,
    credentials: true,
    allowedHeaders: 'X-Requested-With, Content-Type, Authorization',
  });
  await app.listen(PORT);
}
bootstrap();
