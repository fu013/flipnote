import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'todo' })
@Index(['todoName'], { unique: true })
export class Todo {
  @PrimaryGeneratedColumn({ name: 'todo_id' })
  todoId: number;

  @Column({ name: 'todo_name' })
  todoName: string;

  @Column({ name: 'todo_image', nullable: true, type: 'text' })
  todoImage: string | null;

  @Column({ name: 'todo_type', nullable: true })
  todoType: string | null;

  @Column({ name: 'created_date', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;
}
