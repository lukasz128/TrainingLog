import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { In } from 'typeorm';
import { StrengthActivityExercise } from './entities/strength-activity-exercise.entity';
import { StrengthActivity } from './entities/strength-activity.entity';
import { findUnusedAlternatives, StrengthService } from './strength.service';

describe(StrengthService.name, () => {
  const userId = 'user-id';
  const manager = {
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const activityRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    manager: {
      transaction: jest.fn((work: (m: typeof manager) => unknown) => work(manager)),
    },
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

  const activityEntity = {
    id: 'activity-id',
    name: 'FBW A',
    alternativeGroups: [{ id: 'group-id', name: 'Horizontal press' }],
    exercises: [
      {
        id: 'activity-exercise-id',
        exerciseId: 'exercise-id',
        alternativeGroupId: 'group-id',
        targetSets: 3,
        reps: '4-6',
        tempo: null,
        note: '80 kg',
        orderIndex: 0,
        exercise: {
          name: 'Bench press',
          description: 'Barbell bench press.',
        },
        sets: [{ id: 'set-id', orderIndex: 0, done: true, weight: 60, reps: 6 }],
      },
    ],
  };

  const activityDto = {
    id: 'activity-id',
    name: 'FBW A',
    alternativeGroups: [{ id: 'group-id', name: 'Horizontal press' }],
    items: [
      {
        id: 'activity-exercise-id',
        exerciseId: 'exercise-id',
        title: 'Bench press',
        description: 'Barbell bench press.',
        alternativeGroupId: 'group-id',
        targetSets: 3,
        reps: '4-6',
        tempo: null,
        note: '80 kg',
        sets: [{ id: 'set-id', done: true, weight: 60, reps: 6 }],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    activityRepository.find.mockReset();
    activityRepository.findOne.mockReset();
    manager.findOne.mockReset();
    manager.update.mockReset();
    manager.delete.mockReset();
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
    activityRepository.find.mockResolvedValue([activityEntity]);

    await expect(service.getActivities(userId)).resolves.toEqual([activityDto]);

    expect(activityRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId } }),
    );
  });

  it('returns empty strength activities when repository is empty', async () => {
    activityRepository.find.mockResolvedValue([]);

    await expect(service.getActivities(userId)).resolves.toEqual([]);
  });

  it('returns active strength activity with null prescription for ad-hoc exercises', async () => {
    activityRepository.findOne.mockResolvedValue({
      id: 'activity-id',
      name: 'Ad-hoc',
      alternativeGroups: [],
      exercises: [
        {
          id: 'activity-exercise-id',
          exerciseId: 'exercise-id',
          alternativeGroupId: null,
          targetSets: null,
          reps: null,
          tempo: null,
          note: null,
          orderIndex: 0,
          exercise: { name: 'Bench press', description: 'Barbell bench press.' },
          sets: [{ id: 'set-id', orderIndex: 0, done: false, weight: null, reps: null }],
        },
      ],
    });

    await expect(service.getActiveActivity(userId)).resolves.toEqual({
      id: 'activity-id',
      name: 'Ad-hoc',
      alternativeGroups: [],
      items: [
        {
          id: 'activity-exercise-id',
          exerciseId: 'exercise-id',
          title: 'Bench press',
          description: 'Barbell bench press.',
          alternativeGroupId: null,
          targetSets: null,
          reps: null,
          tempo: null,
          note: null,
          sets: [{ id: 'set-id', done: false, weight: null, reps: null }],
        },
      ],
    });

    expect(activityRepository.findOne).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId, status: 'active' } }),
    );
  });

  it('throws when active activity does not exist', async () => {
    activityRepository.findOne.mockResolvedValue(null);

    await expect(service.getActiveActivity(userId)).rejects.toBeInstanceOf(
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

  describe('saveExerciseSets', () => {
    it('saves numeric exercise sets in order', async () => {
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
          weight: null,
          reps: null,
        },
        {
          id: 'set-1',
          activityExerciseId: 'activity-exercise-id',
          orderIndex: 0,
          done: true,
          weight: 82.5,
          reps: 6,
        },
      ]);

      await expect(
        service.saveExerciseSets(userId, 'activity-exercise-id', [
          { id: 'set-1', done: true, weight: 82.5, reps: 6 },
          { id: 'set-2', done: false, weight: null, reps: null },
        ]),
      ).resolves.toEqual([
        { id: 'set-1', done: true, weight: 82.5, reps: 6 },
        { id: 'set-2', done: false, weight: null, reps: null },
      ]);

      expect(activityExerciseRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'activity-exercise-id', activity: { userId } },
      });
      expect(setRepository.delete).toHaveBeenCalledWith({
        activityExerciseId: 'activity-exercise-id',
      });
      expect(setRepository.save).toHaveBeenCalledWith([
        {
          id: 'set-1',
          activityExerciseId: 'activity-exercise-id',
          orderIndex: 0,
          done: true,
          weight: 82.5,
          reps: 6,
        },
        {
          id: 'set-2',
          activityExerciseId: 'activity-exercise-id',
          orderIndex: 1,
          done: false,
          weight: null,
          reps: null,
        },
      ]);
    });

    it('rejects invalid set values with 400 before touching the database', async () => {
      await expect(
        service.saveExerciseSets(userId, 'activity-exercise-id', [
          { done: true, weight: -5, reps: 2.5 },
        ]),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(activityExerciseRepository.findOne).not.toHaveBeenCalled();
      expect(setRepository.delete).not.toHaveBeenCalled();
    });

    it('throws when saving sets for missing activity exercise', async () => {
      activityExerciseRepository.findOne.mockResolvedValue(null);

      await expect(
        service.saveExerciseSets(userId, 'missing-id', []),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('finishActivity', () => {
    it('finishes an active activity of the user', async () => {
      manager.findOne.mockResolvedValue({
        id: 'activity-id',
        userId,
        status: 'active',
        exercises: [],
      });
      manager.update.mockResolvedValue({ affected: 1 });

      const result = await service.finishActivity(userId, 'activity-id');

      expect(result).toEqual({
        id: 'activity-id',
        status: 'finished',
        finishedAt: expect.any(String),
      });
      expect(manager.findOne).toHaveBeenCalledWith(
        StrengthActivity,
        expect.objectContaining({ where: { id: 'activity-id', userId } }),
      );
      expect(manager.update).toHaveBeenCalledWith(
        StrengthActivity,
        { id: 'activity-id', userId },
        { status: 'finished', finishedAt: expect.any(Date) },
      );
      expect(manager.delete).not.toHaveBeenCalled();
    });

    it('removes unused alternatives of a group where one member was done', async () => {
      const done = [{ done: true }];
      const notDone = [{ done: false }];
      manager.findOne.mockResolvedValue({
        id: 'activity-id',
        userId,
        status: 'active',
        exercises: [
          { id: 'regular', alternativeGroupId: null, sets: notDone },
          { id: 'bench', alternativeGroupId: 'press', sets: done },
          { id: 'db-press', alternativeGroupId: 'press', sets: notDone },
          { id: 'machine-press', alternativeGroupId: 'press', sets: [] },
          { id: 'squat', alternativeGroupId: 'legs', sets: notDone },
          { id: 'leg-press', alternativeGroupId: 'legs', sets: notDone },
        ],
      });

      await service.finishActivity(userId, 'activity-id');

      expect(manager.delete).toHaveBeenCalledWith(StrengthActivityExercise, {
        id: In(['db-press', 'machine-press']),
        activityId: 'activity-id',
      });
      expect(manager.update).toHaveBeenCalled();
    });

    it('throws 404 when finishing an activity of another user or missing one', async () => {
      manager.findOne.mockResolvedValue(null);

      await expect(
        service.finishActivity(userId, 'activity-id'),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(manager.update).not.toHaveBeenCalled();
    });

    it('throws 409 when finishing an already finished activity', async () => {
      manager.findOne.mockResolvedValue({
        id: 'activity-id',
        userId,
        status: 'finished',
        exercises: [],
      });

      await expect(
        service.finishActivity(userId, 'activity-id'),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(manager.update).not.toHaveBeenCalled();
    });
  });

  describe(findUnusedAlternatives.name, () => {
    it('keeps a group untouched when nothing was done', () => {
      expect(
        findUnusedAlternatives([
          { id: 'a', alternativeGroupId: 'g', sets: [] },
          { id: 'b', alternativeGroupId: 'g', sets: [] },
        ] as never),
      ).toEqual([]);
    });

    it('keeps every member that has done sets', () => {
      expect(
        findUnusedAlternatives([
          { id: 'a', alternativeGroupId: 'g', sets: [{ done: true }] },
          { id: 'b', alternativeGroupId: 'g', sets: [{ done: true }] },
          { id: 'c', alternativeGroupId: 'g', sets: [{ done: false }] },
        ] as never),
      ).toEqual(['c']);
    });
  });
});
