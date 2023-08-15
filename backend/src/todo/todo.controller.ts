import {
  Controller,
  Get,
  UseGuards,
  Request,
  Inject,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ListItemInfo } from 'src/interface/todo';
import { Logger } from 'winston';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('/getTodo')
  @Throttle(100, 10)
  @UseGuards(AuthGuard('jwt'))
  public async getTodo(@Request() req) {
    return this.todoService.getFilteredTodoList(req.user.mbId);
  }

  @Get('/getTodoComplete')
  @Throttle(100, 10)
  @UseGuards(AuthGuard('jwt'))
  public async getTodoComplete(@Request() req) {
    return this.todoService.getCompletedTodoList(req.user.mbId);
  }

  @Post('/setTodoSync')
  @Throttle(100, 10)
  @UseGuards(AuthGuard('jwt'))
  public async setTodoSync(
    @Request() req,
    @Body('todo_private') todoPrivate: ListItemInfo[],
    @Body('todo_complete') todoComplete: ListItemInfo[],
  ) {
    return this.todoService.setTodoSync(
      req.user.mbId,
      todoPrivate,
      todoComplete,
    );
  }

  @Post('/setNewPreset')
  @Throttle(100, 10)
  @UseGuards(AuthGuard('jwt'))
  public async setNewPreset(
    @Request() req,
    @Body('todo_private') todoPrivate: ListItemInfo[],
  ) {
    return this.todoService.setNewPreset(req.user.mbId, todoPrivate);
  }
}
