import { Injectable } from '@nestjs/common';
import { TodoPrivate } from 'src/entity/todo.private.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TodoPrivateRepository extends Repository<TodoPrivate> {
    constructor(
        private dataSource: DataSource,
    ) {
        super(TodoPrivate, dataSource.createEntityManager());
    }
    async getTodoPerByMbIdAndChName(mbId: string): Promise<TodoPrivate[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const characters = await queryRunner.manager.find(TodoPrivate, {
                select: ['todoId', 'mbId', 'chName', 'todoName', 'todoImage', 'todoType', 'createdDate'],
                where: { mbId },
            });
            await queryRunner.commitTransaction();
            return characters;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}