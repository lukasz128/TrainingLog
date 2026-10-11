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
import { ActivityAlternativeGroup } from './activity-alternative-group.entity';
import { StrengthActivityExercise } from './strength-activity-exercise.entity';
import { WorkoutTemplate } from './workout-template.entity';

export const STRENGTH_ACTIVITY_STATUSES = ['active', 'finished'] as const;

export type StrengthActivityStatus = (typeof STRENGTH_ACTIVITY_STATUSES)[number];

export const ACTIVE_ACTIVITY_UNIQUE_INDEX = 'uq_strength_activity_user_active';

/** At most one active session per user – enforced by the database. */
@Index(ACTIVE_ACTIVITY_UNIQUE_INDEX, ['userId'], {
  unique: true,
  where: `"status" = 'active'`,
})
@Entity('strength_activity')
export class StrengthActivity {
  @PrimaryColumn()
  id!: string;

  @Index()
  @Column()
  userId!: string;

  /** Origin of the session; null for ad-hoc sessions or deleted templates. */
  @Column({ type: 'varchar', nullable: true })
  templateId!: string | null;

  /** Snapshot of template.name (kept if the template is renamed/deleted). */
  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: STRENGTH_ACTIVITY_STATUSES,
    enumName: 'strength_activity_status',
    default: 'active',
  })
  status!: StrengthActivityStatus;

  @Column({ type: 'timestamp', nullable: true })
  startedAt!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  finishedAt!: Date | null;

  // 'User' by entity name – the User entity lives in apps/api.
  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: unknown;

  @ManyToOne(() => WorkoutTemplate, (template) => template.activities, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'templateId' })
  template!: WorkoutTemplate | null;

  @OneToMany(
    () => StrengthActivityExercise,
    (activityExercise) => activityExercise.activity,
  )
  exercises!: StrengthActivityExercise[];

  @OneToMany(() => ActivityAlternativeGroup, (group) => group.activity)
  alternativeGroups!: ActivityAlternativeGroup[];

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
