import { Entity, PrimaryColumn, Column, OneToMany, Index } from 'typeorm';
import { Character } from './character.entity';
import { TodoComplete } from './todo.complete.entity';
import { TodoPrivate } from './todo.private.entity';

@Entity({ name: 'member' })
@Index('member_index', ['mbId'])
export class Member {
  @PrimaryColumn({ name: 'mb_id' })
  mbId: string;

  @Column({ name: 'mb_pw', nullable: true })
  mbPw: string;

  @Column({ name: 'login_refresh_token', nullable: true })
  loginRefreshToken: string;

  @Column({ name: 'cnt_login_date', default: () => 'CURRENT_TIMESTAMP' })
  cntLoginDate: Date;

  @Column({ name: 'created_date', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @OneToMany(() => Character, (character) => character.member)
  characters: Character[];

  @OneToMany(() => TodoPrivate, (todoPrivate) => todoPrivate.member)
  todoPrivates: TodoPrivate[];

  @OneToMany(() => TodoComplete, (todoComplete) => todoComplete.member)
  todoCompletes: TodoComplete[];
}
