import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
@Index(['todoName'], { unique: true })
export class Todo {
  @PrimaryGeneratedColumn({ name: 'todo_id' })
  todoId: number;

  @Column({ name: 'todo_name' })
  todoName: string;

  @Column({ name: 'todo_image' })
  todoImage: string;

  @Column({ name: 'todo_type', nullable: true })
  todoType: string | null;

  @Column({ name: 'created_date', type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date | null;
}
