import { Body, Controller, Post, Get, UseGuards, Request, Inject, Delete, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TodoService } from './todo.service';

@Controller('char')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) { }

  @Get('/getTodoPer')
  @Throttle(100, 10)
  @UseGuards(AuthGuard('jwt'))
  public async getTodoPer(@Request() req) {
    return this.todoService.getTodoPer(req.user.mbId);
  }
}
