import { Entity, Column, PrimaryColumn, Index, OneToMany } from 'typeorm';
import { Character } from './character.entity';
import { TodoPer } from './todo.per.entity';

@Entity({ name: 'member' })
@Index(['mbId'], { unique: true })
export class Member {
  @PrimaryColumn({ name: 'mb_id' })
  mbId: string;

  @Column({ name: 'mb_pw', nullable: true })
  mbPw: string | null;

  @Column({ name: 'login_refresh_token', nullable: true })
  loginRefreshToken: string | null;

  @Column({ name: 'cnt_login_date', default: () => 'CURRENT_TIMESTAMP' })
  cntLoginDate: Date;

  @Column({ name: 'created_date', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @OneToMany(() => Character, (character) => character.member, { cascade: true })
  characters: Character[];

  @OneToMany(() => TodoPer, (todoPer) => todoPer.member, { cascade: true })
  todoPers: TodoPer[];
}
