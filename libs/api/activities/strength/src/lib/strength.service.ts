import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StrengthActivityExercise } from './entities/strength-activity-exercise.entity';
import { StrengthActivity } from './entities/strength-activity.entity';
import { StrengthExerciseDictionary } from './entities/strength-exercise-dictionary.entity';
import { StrengthSet } from './entities/strength-set.entity';
import {
  StrengthActivityDto,
  StrengthExerciseDictionaryDto,
  StrengthSetDto,
  StrengthSetUpdateDto,
} from './strength.types';

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

  async getActivities(): Promise<StrengthActivityDto[]> {
    const activities = await this.strengthActivityRepository.find({
      relations: {
        exercises: {
          exercise: true,
          sets: true,
        },
      },
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

    return activities.map((activity) => this.mapActivity(activity));
  }

  async getActiveActivity(): Promise<StrengthActivityDto> {
    const activity = await this.strengthActivityRepository.findOne({
      where: { status: 'active' },
      relations: {
        exercises: {
          exercise: true,
          sets: true,
        },
      },
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

    return this.mapActivity(activity);
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
    activityExerciseId: string,
    sets: StrengthSetUpdateDto[],
  ): Promise<StrengthSetDto[]> {
    const activityExercise =
      await this.strengthActivityExerciseRepository.findOne({
        where: { id: activityExerciseId },
      });

    if (activityExercise === null) {
      throw new NotFoundException('Strength activity exercise not found');
    }

    await this.strengthSetRepository.delete({ activityExerciseId });

    const savedSets = await this.strengthSetRepository.save(
      sets.map((set, index) => ({
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
        weight: set.weight,
        reps: set.reps,
      }));
  }

  getTemplateActivity(): StrengthActivityDto {
    return {
      id: 'fbw-a',
      name: 'FBW A (dominacja klata)',
      subtitle: 'Training Session',
      items: [
        {
          id: 'bench-press',
          exerciseId: 'bench-press-dictionary',
          title: 'Wyciskanie sztangi na ławce płaskiej',
          description: 'Barbell bench press.',
          phase: 'progress',
          details: '3×4-6 | 1/0/1/0',
          sets: [
            { id: 'bench-press-1', done: true, weight: '60', reps: '6' },
            { id: 'bench-press-2', done: true, weight: '70', reps: '6' },
            { id: 'bench-press-3', done: false, weight: '80', reps: '6' },
            { id: 'bench-press-4', done: false, weight: '90', reps: '4' },
            { id: 'bench-press-5', done: false, weight: '85', reps: '6' },
          ],
        },
        {
          id: 'chin-up',
          exerciseId: 'chin-up-dictionary',
          title: 'Podciąganie podchwytem',
          description: 'Underhand chin-up.',
          phase: 'progress',
          details: '3×4-6 | 1/0/1/0',
          sets: [
            { id: 'chin-up-1', done: true, weight: '0', reps: '6' },
            { id: 'chin-up-2', done: false, weight: '5', reps: '5' },
          ],
        },
        {
          id: 'hack-squat',
          exerciseId: 'hack-squat-dictionary',
          title: 'Hack Squat',
          description: 'Machine hack squat.',
          phase: 'progress',
          details: '3×4-6 | 1/0/1/0',
          sets: [{ id: 'hack-squat-1', done: false, weight: '120', reps: '6' }],
        },
      ],
    };
  }

  private mapActivity(activity: StrengthActivity): StrengthActivityDto {
    return {
      id: activity.id,
      name: activity.name,
      subtitle: activity.subtitle,
      items: activity.exercises.map((activityExercise) => ({
        id: activityExercise.id,
        exerciseId: activityExercise.exerciseId,
        title: activityExercise.exercise.name,
        description: activityExercise.exercise.description,
        phase: activityExercise.phase,
        details: activityExercise.details,
        sets: activityExercise.sets.map((set) => ({
          id: set.id,
          done: set.done,
          weight: set.weight,
          reps: set.reps,
        })),
      })),
    };
  }
}
