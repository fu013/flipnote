import { Injectable } from '@nestjs/common';
import { TodoComplete } from 'src/entity/todo.complete.entity';
import { TodoPrivate } from 'src/entity/todo.private.entity';
import { ChangeListItemInfo, ListItemInfo } from 'src/interface/todo';
import {
  DataSource,
  EntityRepository,
  EntityTarget,
  Repository,
} from 'typeorm';

@Injectable()
@EntityRepository(TodoPrivate)
export class TodoRepository extends Repository<TodoPrivate> {
  constructor(private dataSource: DataSource) {
    super(TodoPrivate, dataSource.createEntityManager());
  }

  // 완료된 투두를 제외하고 투두리스트 가져오기
  async getFilteredTodoList(mbId: string): Promise<TodoPrivate[]> {
    return this.createQueryBuilder('tp')
      .select([
        'tp.orderNo',
        'tp.todoId',
        'tp.mbId',
        'tp.chName',
        'tp.todoName',
        'tp.todoImage',
        'tp.todoType',
        'tp.createdDate',
      ])
      .leftJoinAndSelect(
        TodoComplete,
        'tc',
        `
                tp.mbId = tc.member.mbId 
                AND tp.chName = tc.character.chName 
                AND tp.todoId = tc.todo_id
            `,
      )
      .where('tp.mbId = :mbId', { mbId })
      .andWhere(this.getFilterConditions())
      .orderBy('tp.orderNo', 'ASC')
      .getMany();
  }

  // 완료된 투두리스트만 불러오기
  async getCompletedTodoList(mbId: string): Promise<TodoPrivate[]> {
    return this.createQueryBuilder('tp')
      .select([
        'tp.orderNo',
        'tp.todoId',
        'tp.mbId',
        'tp.chName',
        'tp.todoName',
        'tp.todoImage',
        'tp.todoType',
        'tp.createdDate',
      ])
      .leftJoinAndSelect(
        TodoComplete,
        'tc',
        `
                tp.mbId = tc.member.mbId 
                AND tp.chName = tc.character.chName 
                AND tp.todoId = tc.todo_id
            `,
      )
      .where('tp.mbId = :mbId', { mbId })
      .andWhere(this.getCompletedConditions())
      .orderBy('tc.orderNo', 'ASC')
      .getMany();
  }

  // 투두리스트 저장/동기화(완료 ===> 프리셋으로 이동시 완료 목록 삭제, 프리셋 ===> 완료 목록으로 이동시 완료 목록 생성)
  async setTodoSync(
    mbId: string,
    todoPrivate: ListItemInfo[],
    todoComplete: ListItemInfo[],
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      for (const todoData of todoPrivate) {
        const existingTodo = await queryRunner.manager.findOne(TodoPrivate, {
          where: { todoId: todoData.todoId },
        });
        if (existingTodo) {
          await queryRunner.manager.update(
            TodoPrivate,
            { todoId: todoData.todoId },
            todoData,
          );
          const deleteConditions = this.getDeleteConditions(todoData.todoType);

          // todoData가 있다는 건 Private 요청이 왔다는 의미로 미완료 목록에 담아야 한다는 의미이기에, complete 배열에 겹치는 날짜 조건의 컬럼이 있다면 삭제
          await this.deleteByConditions(
            TodoComplete,
            mbId,
            deleteConditions,
            todoData.todoId,
            todoData.chName,
          );
        } else {
          await queryRunner.manager.save(TodoPrivate, todoData);
        }
      }
      for (const todoData of todoComplete) {
        const existingTodo = await queryRunner.manager.findOne(TodoComplete, {
          where: { todoId: todoData.todoId },
        });
        if (existingTodo) {
          const currentDate = new Date();
          const updatedTodoData = {
            ...todoData,
            completedDate: currentDate,
          };
          await queryRunner.manager.update(
            TodoComplete,
            { mbId: mbId, todoId: todoData.todoId },
            updatedTodoData,
          );
        } else {
          await queryRunner.manager.save(TodoComplete, todoData);
        }
        await queryRunner.manager.update(
          TodoPrivate,
          { mbId: mbId, todoId: todoData.todoId },
          { orderNo: null },
        );
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // 새로운 프리셋 등록
  async setNewPreset(
    mbId: string,
    todoPrivate: ChangeListItemInfo[],
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      for (const todoData of todoPrivate) {
        if (!todoData.isDelete) {
          delete todoData.isDelete;
          const existingTodo = await queryRunner.manager.findOne(TodoPrivate, {
            where: { todoId: todoData.todoId },
          });
          if (existingTodo) {
            await queryRunner.manager.update(
              TodoPrivate,
              { mbId: mbId, todoId: todoData.todoId },
              todoData,
            );
          } else {
            await queryRunner.manager.save(TodoPrivate, todoData);
          }
        } else {
          await this.deleteTodoItem(
            TodoPrivate,
            mbId,
            todoData.todoId,
            todoData.chName,
          );
        }
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // 공통 삭제 로직 (멤버아이디, 투두아이디, 캐릭터명)
  private async deleteTodoItem(
    entity,
    mbId: string,
    todoId: string,
    chName: string,
  ) {
    await this.createQueryBuilder()
      .delete()
      .from(entity)
      .where(`mb_id = :mbId AND todo_id = :todoId AND ch_name = :chName`, {
        mbId,
        todoId,
        chName,
      })
      .execute();
  }

  // 공통 삭제 로직 (멤버아이디, 투두아이디, 캐릭터명) + 날짜 조건
  private async deleteByConditions(
    entity: EntityTarget<any>,
    mbId: string,
    conditions: string,
    todoId: string,
    chName: string,
  ): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .from(entity)
      .where(
        `mb_id = :mbId AND todo_id = :todoId AND ch_name = :chName AND ${conditions}`,
        { mbId, todoId, chName },
      )
      .execute();
  }

  /**
   * todoType
   * @todoType Varchar(255) 0: 하루 초기화
   * @todoType Varchar(255) 1: 주간(월 초기화)
   * @todoType Varchar(255) 2: 주간(목 초기화)
   * @todoType Varchar(255) 3: 월간(1일 초기화)
   */

  // 투두 타입별 완료된 프리셋이 있는지 검사 조건
  private getFilterConditions(): string {
    return `
            (
                (tp.todoType = 0 AND (tc.todoId IS NULL OR (tc.todoId IS NOT NULL AND DATE(tc.completedDate) != CURRENT_DATE)))
                OR
                (tp.todoType = 1 AND (tc.todoId IS NULL OR (tc.todoId IS NOT NULL AND DATE(tc.completedDate) < CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY)))
                OR 
                (
                    tp.todoType = 2 AND (
                        tc.todoId IS NULL OR (
                            tc.todoId IS NOT NULL AND (
                                DATE(tc.completedDate) < 
                                CURDATE() - INTERVAL CASE WHEN WEEKDAY(CURDATE()) >= 4 THEN WEEKDAY(CURDATE()) - 3 ELSE WEEKDAY(CURDATE()) + 4 END DAY
                            )
                        )
                    )
                )
                OR
                (tp.todoType = 3 AND (tc.todoId IS NULL OR (tc.todoId IS NOT NULL AND (DATE(tc.completedDate) < DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') OR DATE(tc.completedDate) > CURRENT_DATE))))
            )`;
  }

  // 투두 타입별 완료 충족 조건
  private getCompletedConditions(): string {
    return `
            (
                (tp.todo_type = 0 AND (tc.todo_id IS NOT NULL AND DATE(tc.completed_date) = CURDATE()))
                OR
                (tp.todo_type = 1 AND (tc.todo_id IS NOT NULL AND DATE(tc.completed_date) >= CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY))
                OR 
                (
                    tp.todo_type = 2 AND (
                        tc.todo_id IS NOT NULL AND (
                            DATE(tc.completed_date) >= 
                            CURDATE() - INTERVAL CASE WHEN WEEKDAY(CURDATE()) >= 4 THEN WEEKDAY(CURDATE()) - 3 ELSE WEEKDAY(CURDATE()) + 4 END DAY
                        )
                    )
                )
                OR
                (tp.todo_type = 3 AND (tc.todo_id IS NOT NULL AND (DATE(tc.completed_date) >= DATE_FORMAT(CURDATE(), '%Y-%m-01') AND DATE(tc.completed_date) <= CURDATE())))
            )`;
  }

  // 투두 타입별 완료 충족 조건2(위와 동일한 로직이나, todoType을 인자로 하여금 동적으로 설정)
  private getDeleteConditions(todoType: string): string {
    if (todoType === '0') {
      return `(todo_id IS NOT NULL AND DATE(completed_date) = CURDATE())`;
    }
    if (todoType === '1') {
      return `(todo_id IS NOT NULL AND DATE(completed_date) >= CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY)`;
    }
    if (todoType === '2') {
      return `(
                    todo_id IS NOT NULL AND (
                        DATE(completed_date) >= 
                        CURDATE() - INTERVAL CASE WHEN WEEKDAY(CURDATE()) >= 4 THEN WEEKDAY(CURDATE()) - 3 ELSE WEEKDAY(CURDATE()) + 4 END DAY
                    )
                )`;
    }
    if (todoType === '3') {
      return `(todo_id IS NOT NULL AND (DATE(completed_date) >= DATE_FORMAT(CURDATE(), '%Y-%m-01') AND DATE(completed_date) <= CURDATE()))`;
    }
    return '';
  }
}
