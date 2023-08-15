import { Entity, PrimaryColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'todo_public' })
@Index('todo_public_index', ['todoName'])
export class TodoPublic {
  @PrimaryColumn({ name: 'todo_id' })
  todoId: string;

  @Column({ name: 'todo_name' })
  todoName: string;

  @Column({ name: 'todo_image', type: "text", nullable: true })
  todoImage: string | null;

  @Column({ name: 'todo_type', nullable: true })
  todoType: string | null;

  @CreateDateColumn({ name: 'created_date' })
  createdDate: Date;
}
