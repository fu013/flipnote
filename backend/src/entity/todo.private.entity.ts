import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index, OneToMany } from 'typeorm';
import { Member } from './member.entity';
import { Character } from './character.entity';
import { TodoComplete } from './todo.complete.entity';

@Entity({ name: 'todo_private' })
@Index('todo_private_index', ['mbId', 'chName', 'todoName'])
export class TodoPrivate {
  @PrimaryGeneratedColumn({ name: 'todo_id' })
  todoId: number;

  @Column({ name: 'mb_id' })
  mbId: string;

  @Column({ name: 'ch_name' })
  chName: string;

  @Column({ name: 'todo_name' })
  todoName: string;

  @Column({ name: 'todo_image', type: "text", nullable: true })
  todoImage: string | null;

  @Column({ name: 'todo_type', nullable: true })
  todoType: string | null;

  @CreateDateColumn({ name: 'created_date' })
  createdDate: Date;

  @ManyToOne(() => Member, (member) => member.todoPrivates)
  @JoinColumn({ name: 'mb_id', referencedColumnName: 'mbId' })
  member: Member;

  @ManyToOne(() => Character, (character) => character.todoPrivates)
  @JoinColumn({ name: 'ch_name', referencedColumnName: 'chName' })
  character: Character;

  @OneToMany(() => TodoComplete, (todoComplete) => todoComplete.character)
  todoCompletes: TodoComplete[];
}
