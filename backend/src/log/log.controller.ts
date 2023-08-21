import {
  Controller,
  Get,
  UseGuards,
  Request,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { LogSerivce } from './log.service';

@Controller('log')
export class LogController {
  constructor(
    private readonly logSerivce: LogSerivce,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) { }

  @Get('/getLog')
  @Throttle(100, 10)
  @UseGuards(AuthGuard('jwt'))
  public async getLog(@Request() req) {
    return this.logSerivce.getLog(req.user.mbId);
  }
}
