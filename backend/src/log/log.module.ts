import { Module } from '@nestjs/common';
import { LogGateway } from './log.gateway';

@Module({
  providers: [LogGateway]
})
export class LogModule { }
