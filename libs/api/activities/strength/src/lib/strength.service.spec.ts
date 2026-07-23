import { NotFoundException } from '@nestjs/common';
import { StrengthService } from './strength.service';

describe(StrengthService.name, () => {
  const activityRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };
  const dictionaryRepository = {
    find: jest.fn(),
  };
  const activityExerciseRepository = {
    findOne: jest.fn(),
  };
  const setRepository = {
    delete: jest.fn(),
    save: jest.fn(),
  };
  let service: StrengthService;

  beforeEach(() => {
    activityRepository.find.mockReset();
    activityRepository.findOne.mockReset();
    dictionaryRepository.find.mockReset();
    activityExerciseRepository.findOne.mockReset();
    setRepository.delete.mockReset();
    setRepository.save.mockReset();
    service = new StrengthService(
      activityRepository as never,
      dictionaryRepository as never,
      activityExerciseRepository as never,
      setRepository as never,
    );
  });

  it('returns strength activities from repository data', async () => {
    // NOTE (łukasz) created shared mocks for BE and FE
    activityRepository.find.mockResolvedValue([
      {
        id: 'activity-id',
        name: 'FBW A',
        subtitle: 'Training Session',
        exercises: [
          {
            id: 'activity-exercise-id',
            exerciseId: 'exercise-id',
            phase: 'progress',
            details: '3×4-6',
            exercise: {
              name: 'Bench press',
              description: 'Barbell bench press.',
            },
            sets: [{ id: 'set-id', done: true, weight: '60', reps: '6' }],
          },
        ],
      },
    ]);

    await expect(service.getActivities()).resolves.toEqual([
      {
        id: 'activity-id',
        name: 'FBW A',
        subtitle: 'Training Session',
        items: [
          {
            id: 'activity-exercise-id',
            exerciseId: 'exercise-id',
            title: 'Bench press',
            description: 'Barbell bench press.',
            phase: 'progress',
            details: '3×4-6',
            sets: [{ id: 'set-id', done: true, weight: '60', reps: '6' }],
          },
        ],
      },
    ]);
  });

  it('returns empty strength activities when repository is empty', async () => {
    activityRepository.find.mockResolvedValue([]);

    await expect(service.getActivities()).resolves.toEqual([]);
  });

  it('returns active strength activity from repository data', async () => {
    activityRepository.findOne.mockResolvedValue({
      id: 'activity-id',
      name: 'FBW A',
      subtitle: 'Training Session',
      exercises: [
        {
          id: 'activity-exercise-id',
          exerciseId: 'exercise-id',
          phase: 'progress',
          details: '3×4-6',
          exercise: {
            name: 'Bench press',
            description: 'Barbell bench press.',
          },
          sets: [{ id: 'set-id', done: true, weight: '60', reps: '6' }],
        },
      ],
    });

    await expect(service.getActiveActivity()).resolves.toEqual({
      id: 'activity-id',
      name: 'FBW A',
      subtitle: 'Training Session',
      items: [
        {
          id: 'activity-exercise-id',
          exerciseId: 'exercise-id',
          title: 'Bench press',
          description: 'Barbell bench press.',
          phase: 'progress',
          details: '3×4-6',
          sets: [{ id: 'set-id', done: true, weight: '60', reps: '6' }],
        },
      ],
    });
  });

  it('throws when active activity does not exist', async () => {
    activityRepository.findOne.mockResolvedValue(null);

    await expect(service.getActiveActivity()).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('returns exercise dictionary ordered by name', async () => {
    const createdAt = new Date('2026-06-10T10:00:00.000Z');
    const updatedAt = new Date('2026-06-10T10:30:00.000Z');
    dictionaryRepository.find.mockResolvedValue([
      {
        id: 'exercise-id',
        name: 'Bench press',
        description: 'Barbell bench press.',
        createdAt,
        updatedAt,
      },
    ]);

    await expect(service.getExerciseDictionary()).resolves.toEqual([
      {
        id: 'exercise-id',
        name: 'Bench press',
        description: 'Barbell bench press.',
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      },
    ]);

    expect(dictionaryRepository.find).toHaveBeenCalledWith({
      order: { name: 'ASC' },
    });
  });

  it('saves exercise sets in order', async () => {
    activityExerciseRepository.findOne.mockResolvedValue({
      id: 'activity-exercise-id',
    });
    setRepository.delete.mockResolvedValue({ affected: 2 });
    setRepository.save.mockResolvedValue([
      {
        id: 'set-2',
        activityExerciseId: 'activity-exercise-id',
        orderIndex: 1,
        done: false,
        weight: '70',
        reps: '5',
      },
      {
        id: 'set-1',
        activityExerciseId: 'activity-exercise-id',
        orderIndex: 0,
        done: true,
        weight: '60',
        reps: '6',
      },
    ]);

    await expect(
      service.saveExerciseSets('activity-exercise-id', [
        { id: 'set-1', done: true, weight: '60', reps: '6' },
        { id: 'set-2', done: false, weight: '70', reps: '5' },
      ]),
    ).resolves.toEqual([
      { id: 'set-1', done: true, weight: '60', reps: '6' },
      { id: 'set-2', done: false, weight: '70', reps: '5' },
    ]);

    expect(setRepository.delete).toHaveBeenCalledWith({
      activityExerciseId: 'activity-exercise-id',
    });
    expect(setRepository.save).toHaveBeenCalledWith([
      {
        id: 'set-1',
        activityExerciseId: 'activity-exercise-id',
        orderIndex: 0,
        done: true,
        weight: '60',
        reps: '6',
      },
      {
        id: 'set-2',
        activityExerciseId: 'activity-exercise-id',
        orderIndex: 1,
        done: false,
        weight: '70',
        reps: '5',
      },
    ]);
  });

  it('throws when saving sets for missing activity exercise', async () => {
    activityExerciseRepository.findOne.mockResolvedValue(null);

    await expect(
      service.saveExerciseSets('missing-id', []),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
