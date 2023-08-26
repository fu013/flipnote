import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TodoRepository } from 'src/repository/todo.repository';
import { ChangeListItemInfo, ListItemInfo } from 'src/interface/todo';
import { getCurrentTimeFormatted } from 'src/lib/getCurrentTimeFormatted';

@Injectable()
export class TodoService {
  constructor(
    private readonly todoRepository: TodoRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  public async getFilteredTodoList(mbId: string) {
    try {
      return this.todoRepository.getFilteredTodoList(mbId);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getCompletedTodoList(mbId: string) {
    try {
      return this.todoRepository.getCompletedTodoList(mbId);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async setTodoSync(mbId: string, todoPrivate: ListItemInfo[], todoComplete: ListItemInfo[]) {
    try {
      await this.todoRepository.setTodoSync(mbId, todoPrivate, todoComplete);
      return Object.assign({
        status: 201,
        statusText: 'Created',
        message: "현재 상태가 저장되었습니다.",
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async setNewPreset(mbId: string, todoPrivate: ChangeListItemInfo[]) {
    try {
      await this.todoRepository.setNewPreset(mbId, todoPrivate);
      return Object.assign({
        status: 201,
        statusText: 'Created',
        message: "프리셋이 저장되었습니다.",
        resultData: todoPrivate,
        createdAt: getCurrentTimeFormatted(),
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
