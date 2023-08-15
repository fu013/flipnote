import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { NODE_ENV } from './config/config';
import { AuthModule } from './auth/auth.module';
import { CrawlerModule } from './crawler/crawler.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CharModule } from './char/char.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import path from 'path';
import { ExcelModule } from './excel/excel.module';
import { TodoModule } from './todo/todo.module';

/* NESTJS에서 앱은 여러개의 모듈로 구성되어있음 */
@Module({
  imports: [
    AuthModule,
    ExcelModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '../static'),
    }),
    ThrottlerModule.forRoot({
      // default는 300초(5분)당 1000번의 요청 허용
      ignoreUserAgents: [
        // 구글 봇을 통한 요청 무시(테러 방지), 하지만 google검색에 내 사이트에 검색이 되지않을수도 있으니 유의
        /googlebot/gi,
        // 빙 봇을 통한 요청 무시(테러 방지)
        new RegExp('bingbot', 'gi'),
      ],
      ttl: 300,
      limit: 1000,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    WinstonModule.forRoot({
      /* { 
        윈스턴 로깅모듈
        지정된 로그 레벨 이상의 레벨만 출력이 가능하기에 production 단계에서는 info(2)단계 이상, 
        그 외에는 silly(6)이상인 모든 레벨의 로그가 출력되는 형태 (숫자가 작아질수록 상위 레벨)
        production = info, warn, error
        deveploment = all message
        error: 0 : 실제 배포 서버에서 발생해서는 안되는 치명적인 오류 
        warn: 1 : x
        info: 2 : X
        http: 3 : X
        verbose: 4 : X
        debug: 5 : 시스템에 크게 지장이 안가는 일반적인 오류
        silly: 6 : X
      } */
      transports: [
        new winston.transports.Console({
          level: NODE_ENV === 'development' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('Dogrimong_Server', {
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.File({
          dirname: 'logs',
          filename: `${new Date().toISOString().slice(0, 10)}.error.log`,
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
    CrawlerModule,
    CharModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
