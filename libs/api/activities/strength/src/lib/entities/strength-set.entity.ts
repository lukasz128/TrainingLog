import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';
import { randomUUID } from 'crypto';
import { StrengthActivityExercise } from './strength-activity-exercise.entity';

/** Postgres returns `numeric` as a string – map it to a number (null stays null). */
export const numericColumnTransformer: ValueTransformer = {
  to: (value: number | null | undefined) => value,
  from: (value: string | number | null) =>
    value === null || value === undefined ? null : Number(value),
};

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

  /** Kilograms, max 2 decimals (supports 1.25 kg plates). Null until entered. */
  @Column({
    type: 'numeric',
    precision: 6,
    scale: 2,
    nullable: true,
    transformer: numericColumnTransformer,
  })
  weight!: number | null;

  /** Performed reps – always an exact number. Null until entered. */
  @Column({ type: 'int', nullable: true })
  reps!: number | null;

  @ManyToOne(
    () => StrengthActivityExercise,
    (activityExercise) => activityExercise.sets,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'activityExerciseId' })
  activityExercise!: StrengthActivityExercise;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @BeforeInsert()
  generateUuid(): void {
    if (!this.id) {
      this.id = randomUUID();
    }
  }
}
