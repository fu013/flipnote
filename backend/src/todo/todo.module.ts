import { Module } from '@nestjs/common';
import { TodoRepository } from 'src/repository/todo.repository';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService, TodoRepository]
})
export class TodoModule { }
