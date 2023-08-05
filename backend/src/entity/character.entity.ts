import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Member } from './member.entity';

@Entity()
@Index(['mbId', 'chName'])
export class Character {
  @PrimaryColumn({ name: 'mb_id' })
  mbId: string;

  @PrimaryColumn({ name: 'ch_name' })
  chName: string;

  @Column({ name: 'ch_image', type: 'text', nullable: true })
  chImage: string | null;

  @Column({ name: 'ch_level', nullable: true })
  chLevel: string | null;

  @Column({ name: 'ch_murung', nullable: true })
  chMurung: string | null;

  @Column({ name: 'daily_count', type: 'int', nullable: true })
  dailyCount: number | 0;

  @Column({ name: 'weekly_count', type: 'int', nullable: true })
  weeklyCount: number | 0;

  @Column({ name: 'monthly_count', type: 'int', nullable: true })
  monthlyCount: number | 0;
  0
  @Column({ name: 'weekly_meso', type: 'bigint', nullable: true })
  weeklyMeso: number | 0;

  @Column({ name: 'todo_list', type: 'text', nullable: true })
  todoList: string | null;

  @Column({ name: 'created_date', type: 'datetime', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date | null;

  @ManyToOne(() => Member, (member) => member.characters, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'mb_id', referencedColumnName: 'mbId' })
  member: Member;
}
