import { StrengthActivity } from './entities/strength-activity.entity';
import { WorkoutTemplate } from './entities/workout-template.entity';
import {
  AlternativeGroupDto,
  StrengthActivityDto,
  WorkoutTemplateDto,
  WorkoutTemplateSummaryDto,
} from './strength.types';

interface OrderedMember {
  alternativeGroupId: string | null;
  orderIndex: number;
}

/**
 * Groups have no position of their own – their position is the lowest
 * orderIndex of their members. Groups without members go last.
 */
export function sortAlternativeGroups(
  groups: { id: string; name: string }[] | undefined,
  members: OrderedMember[],
): AlternativeGroupDto[] {
  const position = new Map<string, number>();
  for (const member of members) {
    if (member.alternativeGroupId === null) {
      continue;
    }
    const current = position.get(member.alternativeGroupId);
    if (current === undefined || member.orderIndex < current) {
      position.set(member.alternativeGroupId, member.orderIndex);
    }
  }

  return [...(groups ?? [])]
    .sort(
      (first, second) =>
        (position.get(first.id) ?? Number.MAX_SAFE_INTEGER) -
        (position.get(second.id) ?? Number.MAX_SAFE_INTEGER),
    )
    .map((group) => ({ id: group.id, name: group.name }));
}

export function mapStrengthActivity(
  activity: StrengthActivity,
): StrengthActivityDto {
  const exercises = [...activity.exercises].sort(
    (first, second) => first.orderIndex - second.orderIndex,
  );

  return {
    id: activity.id,
    name: activity.name,
    items: exercises.map((activityExercise) => ({
      id: activityExercise.id,
      exerciseId: activityExercise.exerciseId,
      title: activityExercise.exercise.name,
      description: activityExercise.exercise.description,
      alternativeGroupId: activityExercise.alternativeGroupId ?? null,
      targetSets: activityExercise.targetSets ?? null,
      reps: activityExercise.reps ?? null,
      tempo: activityExercise.tempo ?? null,
      note: activityExercise.note ?? null,
      sets: [...(activityExercise.sets ?? [])]
        .sort((first, second) => first.orderIndex - second.orderIndex)
        .map((set) => ({
          id: set.id,
          done: set.done,
          weight: set.weight ?? null,
          reps: set.reps ?? null,
        })),
    })),
    alternativeGroups: sortAlternativeGroups(
      activity.alternativeGroups,
      exercises.map((exercise) => ({
        alternativeGroupId: exercise.alternativeGroupId ?? null,
        orderIndex: exercise.orderIndex,
      })),
    ),
  };
}

export function mapWorkoutTemplate(template: WorkoutTemplate): WorkoutTemplateDto {
  const exercises = [...template.exercises].sort(
    (first, second) => first.orderIndex - second.orderIndex,
  );

  return {
    id: template.id,
    name: template.name,
    description: template.description,
    items: exercises.map((templateExercise) => ({
      id: templateExercise.id,
      exerciseId: templateExercise.exerciseId,
      title: templateExercise.exercise.name,
      description: templateExercise.exercise.description,
      alternativeGroupId: templateExercise.alternativeGroupId ?? null,
      sets: templateExercise.sets,
      reps: templateExercise.reps,
      tempo: templateExercise.tempo ?? null,
      note: templateExercise.note ?? null,
    })),
    alternativeGroups: sortAlternativeGroups(
      template.alternativeGroups,
      exercises.map((exercise) => ({
        alternativeGroupId: exercise.alternativeGroupId ?? null,
        orderIndex: exercise.orderIndex,
      })),
    ),
  };
}

export function mapWorkoutTemplateSummary(
  template: WorkoutTemplate,
): WorkoutTemplateSummaryDto {
  return {
    id: template.id,
    name: template.name,
    description: template.description,
    exerciseCount: template.exercises?.length ?? 0,
    updatedAt: template.updatedAt.toISOString(),
  };
}
