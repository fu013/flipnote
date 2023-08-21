import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class LogSerivce {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  public async getLog(mbId: string) {
    try {
      /* return this.todoRepository.getFilteredTodoList(mbId); */
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
