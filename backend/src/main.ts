import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: 'X-Requested-With, Content-Type, Authorization',
  });
  await app.listen(29000);
}
bootstrap();
