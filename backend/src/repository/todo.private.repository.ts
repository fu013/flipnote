import { Injectable } from '@nestjs/common';
import { TodoComplete } from 'src/entity/todo.complete.entity';
import { TodoPrivate } from 'src/entity/todo.private.entity';
import { DataSource, EntityRepository, Repository } from 'typeorm';

@Injectable()
@EntityRepository(TodoPrivate)
export class TodoPrivateRepository extends Repository<TodoPrivate> {
    constructor(
        private dataSource: DataSource,
    ) {
        super(TodoPrivate, dataSource.createEntityManager());
    }

    async getFilteredTodoList(mbId: string): Promise<TodoPrivate[]> {
        const queryRunner = this.dataSource.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const result = await queryRunner.manager
                .createQueryBuilder(TodoPrivate, 'tp')
                .leftJoinAndSelect(TodoComplete, 'tc', `
                    tp.mbId = tc.mbId 
                    AND tp.chName = tc.chName 
                    AND tp.todoId = tc.todoId
                `)
                .where('tp.mbId = :mbId', { mbId })
                .andWhere(`
                    (
                        (tp.todoType = 0 AND (tc.todoId IS NULL OR (tc.todoId IS NOT NULL AND DATE(tc.completedDate) != CURRENT_DATE)))
                        OR
                        (tp.todoType = 1 AND (tc.todoId IS NULL OR (tc.todoId IS NOT NULL AND DATE(tc.completedDate) < CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY)))
                        OR 
                        (tp.todoType = 2 AND (tc.todoId IS NULL OR (tc.todoId IS NOT NULL AND (DATE(tc.completedDate) < CURDATE() - INTERVAL WEEKDAY(CURDATE()) + 4 DAY))))
                        OR
                        (tp.todoType = 3 AND (tc.todoId IS NULL OR (tc.todoId IS NOT NULL AND (DATE(tc.completedDate) < DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') OR DATE(tc.completedDate) > CURRENT_DATE))))
                    )`,
                )
                .getMany();

            await queryRunner.commitTransaction();

            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
