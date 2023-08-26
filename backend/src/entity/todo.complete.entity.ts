import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from 'typeorm';
import { Member } from './member.entity';
import { TodoPrivate } from './todo.private.entity';
import { Character } from './character.entity';

@Entity({ name: 'todo_complete' })
export class TodoComplete {
  @Column({ name: 'order_no', default: 0, nullable: true })
  orderNo: number;

  @PrimaryColumn({ name: 'mb_id' })
  mbId: string;

  @PrimaryColumn({ name: 'ch_name' })
  chName: string;

  @PrimaryColumn({ name: 'todo_id' })
  todoId: string;

  @Column({ name: 'todo_name' })
  todoName: string;

  @Column({ name: 'todo_image', type: "text", nullable: true })
  todoImage: string | null;

  @Column({ name: 'todo_type', nullable: true })
  todoType: string | null;

  @Column({ name: 'completed_date', default: () => 'CURRENT_TIMESTAMP' })
  completedDate: Date;

  @CreateDateColumn({ name: 'created_date', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @ManyToOne(() => Character, (character) => character.todoCompletes)
  @JoinColumn({ name: 'ch_name', referencedColumnName: 'chName' })
  character: Character;

  @ManyToOne(() => Member, (member) => member.todoCompletes)
  @JoinColumn({ name: 'mb_id', referencedColumnName: 'mbId' })
  member: Member;

  @ManyToOne(() => TodoPrivate, (todoPrivate) => todoPrivate.todoCompletes)
  @JoinColumn({ name: 'todo_id', referencedColumnName: 'todoId' })
  todoPrivate: TodoPrivate;
}
