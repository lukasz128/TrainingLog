import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';
import { StrengthActivityExercise } from './strength-activity-exercise.entity';

@Entity('strength_set')
export class StrengthSet {
  @PrimaryColumn()
  id!: string;

  @Column()
  activityExerciseId!: string;

  @Column()
  orderIndex!: number;

  @Column({ default: false })
  done!: boolean;

  @Column()
  weight!: string;

  @Column()
  reps!: string;

  @ManyToOne(
    () => StrengthActivityExercise,
    (activityExercise) => activityExercise.sets,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'activityExerciseId' })
  activityExercise!: StrengthActivityExercise;

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
