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
import { TemplateExercise } from './template-exercise.entity';
import { WorkoutTemplate } from './workout-template.entity';

/**
 * Named set of interchangeable exercises in a template, e.g. "Horizontal press".
 * Has no position of its own – members occupy consecutive orderIndex values.
 */
@Entity('template_alternative_group')
export class TemplateAlternativeGroup {
  @PrimaryColumn()
  id!: string;

  @Column()
  templateId!: string;

  @Column()
  name!: string;

  @ManyToOne(() => WorkoutTemplate, (template) => template.alternativeGroups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'templateId' })
  template!: WorkoutTemplate;

  @OneToMany(
    () => TemplateExercise,
    (templateExercise) => templateExercise.alternativeGroup,
  )
  exercises!: TemplateExercise[];

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
