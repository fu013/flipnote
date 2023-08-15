import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TodoPrivateRepository } from 'src/repository/todo.private.repository';

@Injectable()
export class TodoService {
  constructor(
    private readonly todoPrivateRepository: TodoPrivateRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  public async getTodoPer(mbId: string) {
    return this.todoPrivateRepository.getTodoPerByMbIdAndChName(mbId);
  }
}
