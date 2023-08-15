import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TodoPrivateRepository } from 'src/repository/todo.private.repository';
import { ListItemInfo } from 'src/interface/todo';

@Injectable()
export class TodoService {
  constructor(
    private readonly todoPrivateRepository: TodoPrivateRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  public async getFilteredTodoList(mbId: string) {
    try {
      return this.todoPrivateRepository.getFilteredTodoList(mbId);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getCompletedTodoList(mbId: string) {
    try {
      return this.todoPrivateRepository.getCompletedTodoList(mbId);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async setTodoSync(mbId: string, todoPrivate: ListItemInfo[], todoComplete: ListItemInfo[]) {
    try {
      await this.todoPrivateRepository.setTodoSync(mbId, todoPrivate, todoComplete);
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

  public async setNewPreset(mbId: string, todoPrivate: ListItemInfo[]) {
    try {
      await this.todoPrivateRepository.setNewPreset(mbId, todoPrivate);
      return Object.assign({
        status: 201,
        statusText: 'Created',
        message: "프리셋이 추가되었습니다.",
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
