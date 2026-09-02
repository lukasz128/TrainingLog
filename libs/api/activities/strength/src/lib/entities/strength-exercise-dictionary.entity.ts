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

@Entity('strength_exercise_dictionary')
export class StrengthExerciseDictionary {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @OneToMany(
    () => StrengthActivityExercise,
    (activityExercise) => activityExercise.exercise,
  )
  activityExercises!: StrengthActivityExercise[];

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
