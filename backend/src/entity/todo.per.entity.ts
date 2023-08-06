import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Member } from './member.entity';
import { Character } from './character.entity';
import { Todo } from './todo.entity';

@Entity({ name: 'todo_per' })
@Index(['mbId', 'chName', 'todoName'], { unique: true })
export class TodoPer {
  @PrimaryGeneratedColumn({ name: 'todo_id' })
  todoId: number;

  @Column({ name: 'mb_id' })
  mbId: string;

  @Column({ name: 'ch_name' })
  chName: string;

  @Column({ name: 'todo_name' })
  todoName: string;

  @Column({ name: 'todo_image', nullable: true, type: 'text' })
  todoImage: string | null;

  @Column({ name: 'todo_type', nullable: true })
  todoType: string | null;

  @Column({ name: 'created_date', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @ManyToOne(() => Member, (member) => member.todoPers, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'mb_id' })
  member: Member;

  @ManyToOne(() => Character, (character) => character.todoPers, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'ch_name' })
  character: Character;

  @ManyToOne(() => Todo, (todo) => todo.todoId, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'todo_id' })
  todo: Todo;
}
