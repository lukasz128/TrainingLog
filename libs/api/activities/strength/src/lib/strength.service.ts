import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StrengthActivityExercise } from './entities/strength-activity-exercise.entity';
import { StrengthActivity } from './entities/strength-activity.entity';
import { StrengthExerciseDictionary } from './entities/strength-exercise-dictionary.entity';
import { StrengthSet } from './entities/strength-set.entity';
import { mapStrengthActivity } from './strength.mappers';
import {
  StrengthActivityDto,
  StrengthActivityFinishDto,
  StrengthExerciseDictionaryDto,
  StrengthSetDto,
  StrengthSetUpdateDto,
} from './strength.types';
import { validateSetsUpdate } from './strength.validation';

const ACTIVITY_RELATIONS = {
  exercises: {
    exercise: true,
    sets: true,
  },
  alternativeGroups: true,
} as const;

/**
 * Ids of alternative-group members to remove when a session is finished:
 * in each group, members with no done sets are removed if at least one other
 * member has done sets. Groups where nothing was done stay as they are.
 */
export function findUnusedAlternatives(
  exercises: Pick<StrengthActivityExercise, 'id' | 'alternativeGroupId' | 'sets'>[],
): string[] {
  const groups = new Map<string, typeof exercises>();
  for (const exercise of exercises) {
    if (!exercise.alternativeGroupId) {
      continue;
    }
    const members = groups.get(exercise.alternativeGroupId) ?? [];
    members.push(exercise);
    groups.set(exercise.alternativeGroupId, members);
  }

  const hasDoneSets = (exercise: (typeof exercises)[number]) =>
    (exercise.sets ?? []).some((set) => set.done);

  return [...groups.values()].flatMap((members) =>
    members.some(hasDoneSets)
      ? members.filter((member) => !hasDoneSets(member)).map((member) => member.id)
      : [],
  );
}

@Injectable()
export class StrengthService {
  constructor(
    @InjectRepository(StrengthActivity)
    private readonly strengthActivityRepository: Repository<StrengthActivity>,
    @InjectRepository(StrengthExerciseDictionary)
    private readonly strengthExerciseDictionaryRepository: Repository<StrengthExerciseDictionary>,
    @InjectRepository(StrengthActivityExercise)
    private readonly strengthActivityExerciseRepository: Repository<StrengthActivityExercise>,
    @InjectRepository(StrengthSet)
    private readonly strengthSetRepository: Repository<StrengthSet>,
  ) {}

  async getActivities(userId: string): Promise<StrengthActivityDto[]> {
    const activities = await this.strengthActivityRepository.find({
      where: { userId },
      relations: ACTIVITY_RELATIONS,
      order: {
        startedAt: 'DESC',
        createdAt: 'DESC',
        exercises: {
          orderIndex: 'ASC',
          sets: {
            orderIndex: 'ASC',
          },
        },
      },
    });

    return activities.map(mapStrengthActivity);
  }

  async getActiveActivity(userId: string): Promise<StrengthActivityDto> {
    const activity = await this.strengthActivityRepository.findOne({
      where: { userId, status: 'active' },
      relations: ACTIVITY_RELATIONS,
      order: {
        exercises: {
          orderIndex: 'ASC',
          sets: {
            orderIndex: 'ASC',
          },
        },
      },
    });

    if (activity === null) {
      throw new NotFoundException('Active strength activity not found');
    }

    return mapStrengthActivity(activity);
  }

  /**
   * Saves the workout to history: removes unused alternatives, then sets
   * `status = 'finished'` and `finishedAt = now()` (frees the active slot).
   */
  async finishActivity(
    userId: string,
    activityId: string,
  ): Promise<StrengthActivityFinishDto> {
    const finishedAt = new Date();

    await this.strengthActivityRepository.manager.transaction(async (manager) => {
      const activity = await manager.findOne(StrengthActivity, {
        where: { id: activityId, userId },
        relations: { exercises: { sets: true } },
      });

      if (activity === null) {
        throw new NotFoundException('Strength activity not found');
      }

      if (activity.status === 'finished') {
        throw new ConflictException('Strength activity is already finished');
      }

      const unusedAlternativeIds = findUnusedAlternatives(activity.exercises ?? []);
      if (unusedAlternativeIds.length > 0) {
        // strength_set rows are removed by ON DELETE CASCADE.
        await manager.delete(StrengthActivityExercise, {
          id: In(unusedAlternativeIds),
          activityId,
        });
      }

      await manager.update(
        StrengthActivity,
        { id: activityId, userId },
        { status: 'finished', finishedAt },
      );
    });

    return {
      id: activityId,
      status: 'finished',
      finishedAt: finishedAt.toISOString(),
    };
  }

  async getExerciseDictionary(): Promise<StrengthExerciseDictionaryDto[]> {
    const exercises = await this.strengthExerciseDictionaryRepository.find({
      order: { name: 'ASC' },
    });

    return exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      createdAt: exercise.createdAt.toISOString(),
      updatedAt: exercise.updatedAt.toISOString(),
    }));
  }

  async saveExerciseSets(
    userId: string,
    activityExerciseId: string,
    sets: StrengthSetUpdateDto[],
  ): Promise<StrengthSetDto[]> {
    const data = validateSetsUpdate(sets);

    const activityExercise =
      await this.strengthActivityExerciseRepository.findOne({
        where: { id: activityExerciseId, activity: { userId } },
      });

    if (activityExercise === null) {
      throw new NotFoundException('Strength activity exercise not found');
    }

    await this.strengthSetRepository.delete({ activityExerciseId });

    const savedSets = await this.strengthSetRepository.save(
      data.map((set, index) => ({
        id: set.id,
        activityExerciseId,
        orderIndex: index,
        done: set.done,
        weight: set.weight,
        reps: set.reps,
      })),
    );

    return savedSets
      .sort((first, second) => first.orderIndex - second.orderIndex)
      .map((set) => ({
        id: set.id,
        done: set.done,
        weight: set.weight ?? null,
        reps: set.reps ?? null,
      }));
  }
}
