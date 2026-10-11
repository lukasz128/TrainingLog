import { randomUUID } from 'crypto';
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
import { StrengthActivityExercise } from './strength-activity-exercise.entity';
import { StrengthExerciseDictionary } from './strength-exercise-dictionary.entity';
import { TemplateAlternativeGroup } from './template-alternative-group.entity';
import { WorkoutTemplate } from './workout-template.entity';

@Entity('template_exercise')
export class TemplateExercise {
  @PrimaryColumn()
  id!: string;

  @Column()
  templateId!: string;

  @Column()
  exerciseId!: string;

  @Column({ type: 'varchar', nullable: true })
  alternativeGroupId!: string | null;

  /** Position in the whole template (flat, one by one). */
  @Column()
  orderIndex!: number;

  /** Prescribed number of working sets, e.g. 3. */
  @Column({ type: 'int' })
  sets!: number;

  /** Prescribed reps – see REPS_PATTERN, e.g. "5", "4-6", "ALL", "~". */
  @Column()
  reps!: string;

  /** Tempo – see TEMPO_PATTERN, e.g. "1/0/1/0". */
  @Column({ type: 'varchar', nullable: true })
  tempo!: string | null;

  /** Free text, e.g. target weight, cues. */
  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @ManyToOne(() => WorkoutTemplate, (template) => template.exercises, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'templateId' })
  template!: WorkoutTemplate;

  @ManyToOne(
    () => StrengthExerciseDictionary,
    (exercise) => exercise.templateExercises,
    { onDelete: 'RESTRICT' },
  )
  @JoinColumn({ name: 'exerciseId' })
  exercise!: StrengthExerciseDictionary;

  @ManyToOne(() => TemplateAlternativeGroup, (group) => group.exercises, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'alternativeGroupId' })
  alternativeGroup!: TemplateAlternativeGroup | null;

  @OneToMany(
    () => StrengthActivityExercise,
    (activityExercise) => activityExercise.templateExercise,
  )
  activityExercises!: StrengthActivityExercise[];

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
