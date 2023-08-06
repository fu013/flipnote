import { Entity, Column, PrimaryColumn, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Member } from './member.entity';
import { TodoPer } from './todo.per.entity';

@Entity({ name: 'character' })
@Index(['chName', 'mbId'])
export class Character {
  @PrimaryColumn({ name: 'mb_id' })
  mbId: string;

  @PrimaryColumn({ name: 'ch_name' })
  chName: string;

  @Column({ name: 'ch_image', nullable: true, type: 'text' })
  chImage: string | null;

  @Column({ name: 'ch_level', nullable: true })
  chLevel: string | null;

  @Column({ name: 'ch_murung', nullable: true })
  chMurung: string | null;

  @Column({ name: 'daily_count', default: 0 })
  dailyCount: number;

  @Column({ name: 'weekly_count', default: 0 })
  weeklyCount: number;

  @Column({ name: 'monthly_count', default: 0 })
  monthlyCount: number;

  @Column({ name: 'weekly_meso', default: 0 })
  weeklyMeso: number;

  @Column({ name: 'created_date', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @ManyToOne(() => Member, (member) => member.characters, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'mb_id' })
  member: Member;

  @OneToMany(() => TodoPer, (todoPer) => todoPer.character, { cascade: true })
  todoPers: TodoPer[];
}
