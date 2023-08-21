import { Module } from '@nestjs/common';
import { LogSerivce } from './log.service';
import { LogController } from './log.controller';

@Module({
  controllers: [LogController],
  providers: [LogSerivce]
})
export class LogModule { }
