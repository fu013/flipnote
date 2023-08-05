import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import { Character } from './character.entity';

@Entity()
@Index(['mbId'], { unique: true })
export class Member {
  @PrimaryGeneratedColumn({ name: 'mb_no' })
  mbNo: number;

  @Column({ name: 'mb_id' })
  mbId: string;

  @Column({ name: 'mb_pw', nullable: true })
  mbPw: string | null;

  @Column({ name: 'login_refresh_token', nullable: true })
  loginRefreshToken: string | null;

  @Column({ name: 'cnt_login_date', type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  cntLoginDate: Date | null;

  @Column({ name: 'created_date', type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date | null;

  @OneToMany(() => Character, (character) => character.member)
  characters: Character[];
}
