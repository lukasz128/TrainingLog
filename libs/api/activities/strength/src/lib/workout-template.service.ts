import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, QueryFailedError } from 'typeorm';
import { ActivityAlternativeGroup } from './entities/activity-alternative-group.entity';
import { StrengthActivityExercise } from './entities/strength-activity-exercise.entity';
import {
  ACTIVE_ACTIVITY_UNIQUE_INDEX,
  StrengthActivity,
} from './entities/strength-activity.entity';
import { StrengthExerciseDictionary } from './entities/strength-exercise-dictionary.entity';
import { StrengthSet } from './entities/strength-set.entity';
import { TemplateAlternativeGroup } from './entities/template-alternative-group.entity';
import { TemplateExercise } from './entities/template-exercise.entity';
import { WorkoutTemplate } from './entities/workout-template.entity';
import {
  mapStrengthActivity,
  mapWorkoutTemplate,
  mapWorkoutTemplateSummary,
} from './strength.mappers';
import {
  StrengthActivityDto,
  WorkoutTemplateDto,
  WorkoutTemplateSummaryDto,
  WorkoutTemplateUpsertDto,
} from './strength.types';
import { validateTemplateUpsert } from './strength.validation';

export const ACTIVE_ACTIVITY_EXISTS_MESSAGE =
  'Active strength activity already exists';

const POSTGRES_UNIQUE_VIOLATION = '23505';

@Injectable()
export class WorkoutTemplateService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getTemplates(userId: string): Promise<WorkoutTemplateSummaryDto[]> {
    const templates = await this.dataSource.getRepository(WorkoutTemplate).find({
      where: { userId },
      relations: { exercises: true },
      order: { updatedAt: 'DESC' },
    });

    return templates.map(mapWorkoutTemplateSummary);
  }

  async getTemplate(
    userId: string,
    templateId: string,
  ): Promise<WorkoutTemplateDto> {
    const template = await this.findTemplate(
      this.dataSource.manager,
      userId,
      templateId,
    );

    return mapWorkoutTemplate(template);
  }

  async createTemplate(
    userId: string,
    payload: WorkoutTemplateUpsertDto,
  ): Promise<WorkoutTemplateDto> {
    const data = validateTemplateUpsert(payload);
    assertNoIds(data);

    const templateId = await this.dataSource.transaction(async (manager) => {
      await this.assertExercisesExist(manager, data);

      const template = await manager.save(
        manager.create(WorkoutTemplate, {
          userId,
          name: data.name,
          description: data.description ?? null,
        }),
      );

      await this.upsertTemplateContent(manager, template.id, data, {
        exerciseIds: [],
        groupIds: [],
      });

      return template.id;
    });

    return this.getTemplate(userId, templateId);
  }

  /**
   * Full replace, upserting by `id`: items/groups with an id of this template are
   * updated, items/groups without id are inserted, rows missing from the payload
   * are deleted. Ids stay stable so strength_activity_exercise.templateExerciseId
   * keeps pointing at the same slot.
   */
  async updateTemplate(
    userId: string,
    templateId: string,
    payload: WorkoutTemplateUpsertDto,
  ): Promise<WorkoutTemplateDto> {
    const data = validateTemplateUpsert(payload);

    await this.dataSource.transaction(async (manager) => {
      const exists = await manager.exists(WorkoutTemplate, {
        where: { id: templateId, userId },
      });
      if (!exists) {
        throw new NotFoundException('Workout template not found');
      }

      const [existingExercises, existingGroups] = await Promise.all([
        manager.find(TemplateExercise, {
          select: { id: true },
          where: { templateId },
        }),
        manager.find(TemplateAlternativeGroup, {
          select: { id: true },
          where: { templateId },
        }),
      ]);
      const existing = {
        exerciseIds: existingExercises.map((exercise) => exercise.id),
        groupIds: existingGroups.map((group) => group.id),
      };

      assertIdsBelongToTemplate(data, existing);
      await this.assertExercisesExist(manager, data);

      await manager.update(
        WorkoutTemplate,
        { id: templateId, userId },
        { name: data.name, description: data.description ?? null },
      );

      await this.upsertTemplateContent(manager, templateId, data, existing);
    });

    return this.getTemplate(userId, templateId);
  }

  async deleteTemplate(userId: string, templateId: string): Promise<void> {
    // Past activities keep their data; strength_activity.templateId → NULL (ON DELETE SET NULL).
    const result = await this.dataSource
      .getRepository(WorkoutTemplate)
      .delete({ id: templateId, userId });

    if (!result.affected) {
      throw new NotFoundException('Workout template not found');
    }
  }

  /**
   * Creates a new active strength activity as a snapshot of the template.
   * Throws 409 when the user already has an active activity – checked up front
   * and guaranteed by the partial unique index for concurrent requests.
   */
  async startFromTemplate(
    userId: string,
    templateId: string,
  ): Promise<StrengthActivityDto> {
    try {
      const activityId = await this.dataSource.transaction(async (manager) => {
        const template = await this.findTemplate(manager, userId, templateId);

        const hasActiveActivity = await manager.exists(StrengthActivity, {
          where: { userId, status: 'active' },
        });
        if (hasActiveActivity) {
          throw new ConflictException(ACTIVE_ACTIVITY_EXISTS_MESSAGE);
        }

        const activity = await manager.save(
          manager.create(StrengthActivity, {
            userId,
            templateId: template.id,
            name: template.name,
            status: 'active',
            startedAt: new Date(),
            finishedAt: null,
          }),
        );

        // template group id → activity group id
        const groupIds = new Map<string, string>();
        for (const templateGroup of template.alternativeGroups ?? []) {
          const activityGroup = await manager.save(
            manager.create(ActivityAlternativeGroup, {
              activityId: activity.id,
              name: templateGroup.name,
            }),
          );
          groupIds.set(templateGroup.id, activityGroup.id);
        }

        for (const templateExercise of template.exercises) {
          const activityExercise = await manager.save(
            manager.create(StrengthActivityExercise, {
              activityId: activity.id,
              exerciseId: templateExercise.exerciseId,
              templateExerciseId: templateExercise.id,
              alternativeGroupId: templateExercise.alternativeGroupId
                ? (groupIds.get(templateExercise.alternativeGroupId) ?? null)
                : null,
              targetSets: templateExercise.sets,
              reps: templateExercise.reps,
              tempo: templateExercise.tempo ?? null,
              note: templateExercise.note ?? null,
              orderIndex: templateExercise.orderIndex,
            }),
          );

          if (templateExercise.sets > 0) {
            await manager.save(
              Array.from({ length: templateExercise.sets }, (_, orderIndex) =>
                manager.create(StrengthSet, {
                  activityExerciseId: activityExercise.id,
                  orderIndex,
                  done: false,
                  weight: null,
                  reps: null,
                }),
              ),
            );
          }
        }

        return activity.id;
      });

      return await this.getActivity(userId, activityId);
    } catch (error) {
      if (isActiveActivityUniqueViolation(error)) {
        throw new ConflictException(ACTIVE_ACTIVITY_EXISTS_MESSAGE);
      }
      throw error;
    }
  }

  private async getActivity(
    userId: string,
    activityId: string,
  ): Promise<StrengthActivityDto> {
    const activity = await this.dataSource
      .getRepository(StrengthActivity)
      .findOne({
        where: { id: activityId, userId },
        relations: {
          exercises: { exercise: true, sets: true },
          alternativeGroups: true,
        },
        order: {
          exercises: { orderIndex: 'ASC', sets: { orderIndex: 'ASC' } },
        },
      });

    if (activity === null) {
      throw new NotFoundException('Strength activity not found');
    }

    return mapStrengthActivity(activity);
  }

  private async findTemplate(
    manager: EntityManager,
    userId: string,
    templateId: string,
  ): Promise<WorkoutTemplate> {
    const template = await manager.findOne(WorkoutTemplate, {
      where: { id: templateId, userId },
      relations: { exercises: { exercise: true }, alternativeGroups: true },
      order: { exercises: { orderIndex: 'ASC' } },
    });

    if (template === null) {
      throw new NotFoundException('Workout template not found');
    }

    return template;
  }

  private async assertExercisesExist(
    manager: EntityManager,
    data: WorkoutTemplateUpsertDto,
  ): Promise<void> {
    const exerciseIds = [...new Set(data.items.map((item) => item.exerciseId))];
    if (exerciseIds.length === 0) {
      return;
    }

    const found = await manager.find(StrengthExerciseDictionary, {
      select: { id: true },
      where: { id: In(exerciseIds) },
    });
    const foundIds = new Set(found.map((exercise) => exercise.id));
    const missing = exerciseIds.filter((id) => !foundIds.has(id));

    if (missing.length > 0) {
      throw new BadRequestException(
        missing.map((id) => `Unknown exerciseId "${id}"`),
      );
    }
  }

  /** Upserts groups first (so items can reference them), then items, then deletes leftovers. */
  private async upsertTemplateContent(
    manager: EntityManager,
    templateId: string,
    data: WorkoutTemplateUpsertDto,
    existing: ExistingTemplateIds,
  ): Promise<void> {
    // clientKey → persisted group id
    const groupIdByKey = new Map<string, string>();
    for (const group of data.alternativeGroups) {
      if (group.id) {
        await manager.update(
          TemplateAlternativeGroup,
          { id: group.id, templateId },
          { name: group.name },
        );
        groupIdByKey.set(group.clientKey, group.id);
      } else {
        const created = await manager.save(
          manager.create(TemplateAlternativeGroup, {
            templateId,
            name: group.name,
          }),
        );
        groupIdByKey.set(group.clientKey, created.id);
      }
    }

    for (const [orderIndex, item] of data.items.entries()) {
      const values = {
        exerciseId: item.exerciseId,
        alternativeGroupId: item.alternativeGroupKey
          ? (groupIdByKey.get(item.alternativeGroupKey) ?? null)
          : null,
        sets: item.sets,
        reps: item.reps,
        tempo: item.tempo ?? null,
        note: item.note ?? null,
        orderIndex,
      };

      if (item.id) {
        await manager.update(TemplateExercise, { id: item.id, templateId }, values);
      } else {
        await manager.save(manager.create(TemplateExercise, { templateId, ...values }));
      }
    }

    const keptExerciseIds = new Set(data.items.map((item) => item.id));
    const removedExerciseIds = existing.exerciseIds.filter(
      (id) => !keptExerciseIds.has(id),
    );
    if (removedExerciseIds.length > 0) {
      await manager.delete(TemplateExercise, {
        templateId,
        id: In(removedExerciseIds),
      });
    }

    const keptGroupIds = new Set(data.alternativeGroups.map((group) => group.id));
    const removedGroupIds = existing.groupIds.filter((id) => !keptGroupIds.has(id));
    if (removedGroupIds.length > 0) {
      await manager.delete(TemplateAlternativeGroup, {
        templateId,
        id: In(removedGroupIds),
      });
    }
  }
}

interface ExistingTemplateIds {
  exerciseIds: string[];
  groupIds: string[];
}

function assertNoIds(data: WorkoutTemplateUpsertDto): void {
  const errors = [
    ...data.items
      .map((item, index) => (item.id ? `items[${index}].id is not allowed when creating a template` : null))
      .filter((error): error is string => error !== null),
    ...data.alternativeGroups
      .map((group, index) =>
        group.id ? `alternativeGroups[${index}].id is not allowed when creating a template` : null,
      )
      .filter((error): error is string => error !== null),
  ];

  if (errors.length > 0) {
    throw new BadRequestException(errors);
  }
}

/** "A group belongs to the same template as its members" – and so does every item. */
function assertIdsBelongToTemplate(
  data: WorkoutTemplateUpsertDto,
  existing: ExistingTemplateIds,
): void {
  const exerciseIds = new Set(existing.exerciseIds);
  const groupIds = new Set(existing.groupIds);
  const errors = [
    ...data.items
      .map((item, index) =>
        item.id && !exerciseIds.has(item.id)
          ? `items[${index}].id "${item.id}" does not belong to this template`
          : null,
      )
      .filter((error): error is string => error !== null),
    ...data.alternativeGroups
      .map((group, index) =>
        group.id && !groupIds.has(group.id)
          ? `alternativeGroups[${index}].id "${group.id}" does not belong to this template`
          : null,
      )
      .filter((error): error is string => error !== null),
  ];

  if (errors.length > 0) {
    throw new BadRequestException(errors);
  }
}

export function isActiveActivityUniqueViolation(error: unknown): boolean {
  if (!(error instanceof QueryFailedError)) {
    return false;
  }

  const driverError = (error as QueryFailedError & {
    driverError?: { code?: string; constraint?: string };
  }).driverError;

  return (
    driverError?.code === POSTGRES_UNIQUE_VIOLATION &&
    driverError?.constraint === ACTIVE_ACTIVITY_UNIQUE_INDEX
  );
}
