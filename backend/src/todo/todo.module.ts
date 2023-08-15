import { Module } from '@nestjs/common';
import { TodoPrivateRepository } from 'src/repository/todo.private.repository';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService, TodoPrivateRepository]
})
export class TodoModule { }
