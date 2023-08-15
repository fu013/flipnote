import { Entity, PrimaryColumn, Column, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Member } from './member.entity';
import { TodoComplete } from './todo.complete.entity';
import { TodoPrivate } from './todo.private.entity';

@Entity({ name: 'character' })
@Index('char_index', ['chName', 'mbId'])
export class Character {
  @PrimaryColumn({ name: 'mb_id' })
  mbId: string;

  @PrimaryColumn({ name: 'ch_name' })
  chName: string;

  @Column({ name: 'ch_image', type: "text", nullable: false })
  chImage: string;

  @Column({ name: 'ch_level', nullable: true })
  chLevel: string;

  @Column({ name: 'ch_murung', nullable: true })
  chMurung: string;

  @Column({ name: 'daily_count', nullable: true, default: 0 })
  dailyCount: number;

  @Column({ name: 'weekly_count', nullable: true, default: 0 })
  weeklyCount: number;

  @Column({ name: 'monthly_count', nullable: true, default: 0 })
  monthlyCount: number;

  @Column({ name: 'weekly_meso', nullable: true, default: 0 })
  weeklyMeso: number;

  @Column({ name: 'created_date', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @ManyToOne(() => Member, (member) => member.characters)
  @JoinColumn({ name: 'mb_id', referencedColumnName: 'mbId' })
  member: Member;

  @OneToMany(() => TodoPrivate, (todoPrivate) => todoPrivate.character)
  todoPrivates: TodoPrivate[];

  @OneToMany(() => TodoComplete, (todoComplete) => todoComplete.character)
  todoCompletes: TodoComplete[];
}
