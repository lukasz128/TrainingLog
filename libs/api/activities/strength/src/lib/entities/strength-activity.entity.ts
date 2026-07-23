import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';
import { StrengthActivityExercise } from './strength-activity-exercise.entity';

export type StrengthActivityStatus = 'active' | 'finished';

@Entity('strength_activity')
export class StrengthActivity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  subtitle!: string;

  @Column({ default: 'active' })
  status!: StrengthActivityStatus;

  @Column({ type: 'timestamp', nullable: true })
  startedAt!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  finishedAt!: Date | null;

  @OneToMany(
    () => StrengthActivityExercise,
    (activityExercise) => activityExercise.activity,
  )
  exercises!: StrengthActivityExercise[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  generateUuid(): void {
    if (!this.id) {
      this.id = randomUUID();
    }
  }
}
