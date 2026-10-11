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
import { ActivityAlternativeGroup } from './activity-alternative-group.entity';
import { StrengthActivity } from './strength-activity.entity';
import { StrengthExerciseDictionary } from './strength-exercise-dictionary.entity';
import { StrengthSet } from './strength-set.entity';
import { TemplateExercise } from './template-exercise.entity';

@Entity('strength_activity_exercise')
export class StrengthActivityExercise {
  @PrimaryColumn()
  id!: string;

  @Column()
  activityId!: string;

  /** Needed for progress, ad-hoc exercises and the chosen alternative. */
  @Column()
  exerciseId!: string;

  /** Informational link only (e.g. "last time on this slot"), never read for display. */
  @Column({ type: 'varchar', nullable: true })
  templateExerciseId!: string | null;

  @Column({ type: 'varchar', nullable: true })
  alternativeGroupId!: string | null;

  /** Prescription snapshot copied from the template (null for ad-hoc exercises). */
  @Column({ type: 'int', nullable: true })
  targetSets!: number | null;

  @Column({ type: 'varchar', nullable: true })
  reps!: string | null;

  @Column({ type: 'varchar', nullable: true })
  tempo!: string | null;

  @Column({ type: 'text', nullable: true })
  note!: string | null;

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

  @ManyToOne(
    () => TemplateExercise,
    (templateExercise) => templateExercise.activityExercises,
    { nullable: true, onDelete: 'SET NULL' },
  )
  @JoinColumn({ name: 'templateExerciseId' })
  templateExercise!: TemplateExercise | null;

  @ManyToOne(() => ActivityAlternativeGroup, (group) => group.exercises, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'alternativeGroupId' })
  alternativeGroup!: ActivityAlternativeGroup | null;

  @OneToMany(() => StrengthSet, (set) => set.activityExercise)
  sets!: StrengthSet[];

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
