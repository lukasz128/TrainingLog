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
import { StrengthActivity } from './strength-activity.entity';

/** Snapshot of a template_alternative_group taken when a session starts. */
@Entity('activity_alternative_group')
export class ActivityAlternativeGroup {
  @PrimaryColumn()
  id!: string;

  @Column()
  activityId!: string;

  @Column()
  name!: string;

  @ManyToOne(() => StrengthActivity, (activity) => activity.alternativeGroups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'activityId' })
  activity!: StrengthActivity;

  @OneToMany(
    () => StrengthActivityExercise,
    (activityExercise) => activityExercise.alternativeGroup,
  )
  exercises!: StrengthActivityExercise[];

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
