import { randomUUID } from 'crypto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StrengthActivity } from './strength-activity.entity';
import { TemplateAlternativeGroup } from './template-alternative-group.entity';
import { TemplateExercise } from './template-exercise.entity';

@Entity('workout_template')
export class WorkoutTemplate {
  @PrimaryColumn()
  id!: string;

  @Index()
  @Column()
  userId!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  // 'User' by entity name – the User entity lives in apps/api.
  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: unknown;

  @OneToMany(
    () => TemplateExercise,
    (templateExercise) => templateExercise.template,
  )
  exercises!: TemplateExercise[];

  @OneToMany(() => TemplateAlternativeGroup, (group) => group.template)
  alternativeGroups!: TemplateAlternativeGroup[];

  @OneToMany(() => StrengthActivity, (activity) => activity.template)
  activities!: StrengthActivity[];

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
