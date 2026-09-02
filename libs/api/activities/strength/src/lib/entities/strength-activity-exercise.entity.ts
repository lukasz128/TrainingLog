import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';
import { StrengthActivity } from './strength-activity.entity';
import { StrengthExerciseDictionary } from './strength-exercise-dictionary.entity';
import { StrengthSet } from './strength-set.entity';

@Entity('strength_activity_exercise')
export class StrengthActivityExercise {
  @PrimaryColumn()
  id!: string;

  @Column()
  activityId!: string;

  @Column()
  exerciseId!: string;

  @Column()
  phase!: string;

  @Column()
  details!: string;

  @Column()
  orderIndex!: number;

  @ManyToOne(() => StrengthActivity, (activity) => activity.exercises, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'activityId' })
  activity!: StrengthActivity;

  @ManyToOne(
    () => StrengthExerciseDictionary,
    (exercise) => exercise.activityExercises,
    { onDelete: 'RESTRICT' },
  )
  @JoinColumn({ name: 'exerciseId' })
  exercise!: StrengthExerciseDictionary;

  @OneToMany(() => StrengthSet, (set) => set.activityExercise)
  sets!: StrengthSet[];

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
