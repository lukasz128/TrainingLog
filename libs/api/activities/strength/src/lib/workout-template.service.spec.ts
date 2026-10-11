import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { In, QueryFailedError } from 'typeorm';
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
import { WorkoutTemplateUpsertDto } from './strength.types';
import {
  isActiveActivityUniqueViolation,
  WorkoutTemplateService,
} from './workout-template.service';

type Saved = { entity: unknown; data: Record<string, unknown> };

describe(WorkoutTemplateService.name, () => {
  const userId = 'user-id';
  const createdAt = new Date('2026-09-27T10:00:00.000Z');

  const buildTemplateEntity = () => ({
    id: 'template-id',
    userId,
    name: 'FBW A',
    description: null,
    createdAt,
    updatedAt: createdAt,
    alternativeGroups: [{ id: 'template-group-press', name: 'Horizontal press' }],
    exercises: [
      {
        id: 'template-exercise-bench',
        exerciseId: 'exercise-bench-press',
        alternativeGroupId: 'template-group-press',
        orderIndex: 0,
        sets: 3,
        reps: '4-6',
        tempo: '1/0/1/0',
        note: '80 kg',
        exercise: { name: 'Bench press', description: 'Barbell bench press.' },
      },
      {
        id: 'template-exercise-db-press',
        exerciseId: 'exercise-db-press',
        alternativeGroupId: 'template-group-press',
        orderIndex: 1,
        sets: 3,
        reps: '6-8',
        tempo: null,
        note: null,
        exercise: { name: 'Dumbbell press', description: 'Dumbbell bench press.' },
      },
      {
        id: 'template-exercise-chin-up',
        exerciseId: 'exercise-chin-up',
        alternativeGroupId: null,
        orderIndex: 2,
        sets: 2,
        reps: 'ALL',
        tempo: null,
        note: null,
        exercise: { name: 'Chin-up', description: 'Underhand chin-up.' },
      },
    ],
  });

  let templateEntity: ReturnType<typeof buildTemplateEntity>;
  let saved: Saved[];
  let idCounter: number;
  let manager: {
    findOne: jest.Mock;
    find: jest.Mock;
    exists: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  let activityRepository: { findOne: jest.Mock };
  let templateRepository: { find: jest.Mock; delete: jest.Mock };
  let dataSource: {
    manager: typeof manager;
    transaction: jest.Mock;
    getRepository: jest.Mock;
  };
  let service: WorkoutTemplateService;

  beforeEach(() => {
    templateEntity = buildTemplateEntity();
    saved = [];
    idCounter = 0;
    manager = {
      findOne: jest.fn(),
      find: jest.fn(),
      exists: jest.fn(),
      create: jest.fn((entity, data) => ({ __entity: entity, ...data })),
      save: jest.fn(async (input) => {
        const list = Array.isArray(input) ? input : [input];
        const result = list.map(({ __entity, ...data }) => {
          const withId = { id: data.id ?? `generated-${++idCounter}`, ...data };
          saved.push({ entity: __entity, data: withId });
          return withId;
        });
        return Array.isArray(input) ? result : result[0];
      }),
      update: jest.fn(),
      delete: jest.fn(),
    };
    activityRepository = { findOne: jest.fn() };
    templateRepository = { find: jest.fn(), delete: jest.fn() };
    dataSource = {
      manager,
      transaction: jest.fn((work) => work(manager)),
      getRepository: jest.fn((entity) =>
        entity === StrengthActivity ? activityRepository : templateRepository,
      ),
    };
    service = new WorkoutTemplateService(dataSource as never);
  });

  const savedOf = (entity: unknown) =>
    saved.filter((entry) => entry.entity === entity).map((entry) => entry.data);

  describe('startFromTemplate', () => {
    beforeEach(() => {
      manager.findOne.mockResolvedValue(templateEntity);
      manager.exists.mockResolvedValue(false);
      activityRepository.findOne.mockResolvedValue({
        id: 'generated-1',
        name: 'FBW A',
        alternativeGroups: [],
        exercises: [],
      });
    });

    it('copies template into a new active activity keeping order, prescription, note and groups', async () => {
      const result = await service.startFromTemplate(userId, 'template-id');

      expect(manager.findOne).toHaveBeenCalledWith(
        WorkoutTemplate,
        expect.objectContaining({ where: { id: 'template-id', userId } }),
      );
      expect(manager.exists).toHaveBeenCalledWith(StrengthActivity, {
        where: { userId, status: 'active' },
      });

      expect(savedOf(StrengthActivity)).toEqual([
        {
          id: 'generated-1',
          userId,
          templateId: 'template-id',
          name: 'FBW A',
          status: 'active',
          startedAt: expect.any(Date),
          finishedAt: null,
        },
      ]);

      expect(savedOf(ActivityAlternativeGroup)).toEqual([
        { id: 'generated-2', activityId: 'generated-1', name: 'Horizontal press' },
      ]);

      expect(savedOf(StrengthActivityExercise)).toEqual([
        expect.objectContaining({
          activityId: 'generated-1',
          exerciseId: 'exercise-bench-press',
          templateExerciseId: 'template-exercise-bench',
          alternativeGroupId: 'generated-2',
          targetSets: 3,
          reps: '4-6',
          tempo: '1/0/1/0',
          note: '80 kg',
          orderIndex: 0,
        }),
        expect.objectContaining({
          exerciseId: 'exercise-db-press',
          templateExerciseId: 'template-exercise-db-press',
          alternativeGroupId: 'generated-2',
          orderIndex: 1,
        }),
        expect.objectContaining({
          exerciseId: 'exercise-chin-up',
          templateExerciseId: 'template-exercise-chin-up',
          alternativeGroupId: null,
          targetSets: 2,
          reps: 'ALL',
          tempo: null,
          note: null,
          orderIndex: 2,
        }),
      ]);

      // `targetSets` empty sets per exercise: 3 + 3 + 2.
      const sets = savedOf(StrengthSet);
      expect(sets).toHaveLength(8);
      const benchExerciseId = savedOf(StrengthActivityExercise)[0].id;
      expect(sets.filter((set) => set.activityExerciseId === benchExerciseId)).toEqual(
        [0, 1, 2].map((orderIndex) =>
          expect.objectContaining({ orderIndex, done: false, weight: null, reps: null }),
        ),
      );

      expect(activityRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'generated-1', userId } }),
      );
      expect(result.id).toBe('generated-1');
    });

    it('keeps the snapshot unaffected by a later template edit (tempo, note, name)', async () => {
      await service.startFromTemplate(userId, 'template-id');
      const snapshot = JSON.parse(
        JSON.stringify(savedOf(StrengthActivityExercise)),
      );
      const activitySnapshot = JSON.parse(
        JSON.stringify(savedOf(StrengthActivity)),
      );

      // Edit the template: rename, change tempo and note of the first slot.
      manager.exists.mockResolvedValue(true);
      manager.find.mockImplementation(async (entity) => {
        if (entity === TemplateExercise) {
          return templateEntity.exercises.map(({ id }) => ({ id }));
        }
        if (entity === TemplateAlternativeGroup) {
          return templateEntity.alternativeGroups.map(({ id }) => ({ id }));
        }
        return [
          { id: 'exercise-bench-press' },
          { id: 'exercise-db-press' },
          { id: 'exercise-chin-up' },
        ];
      });
      await service.updateTemplate(userId, 'template-id', {
        name: 'FBW A v2',
        alternativeGroups: [
          { id: 'template-group-press', clientKey: 'press', name: 'Horizontal press' },
        ],
        items: [
          {
            id: 'template-exercise-bench',
            exerciseId: 'exercise-bench-press',
            alternativeGroupKey: 'press',
            sets: 4,
            reps: '3-5',
            tempo: '3/1/X/0',
            note: '85 kg',
          },
          {
            id: 'template-exercise-db-press',
            exerciseId: 'exercise-db-press',
            alternativeGroupKey: 'press',
            sets: 3,
            reps: '6-8',
          },
          {
            id: 'template-exercise-chin-up',
            exerciseId: 'exercise-chin-up',
            sets: 2,
            reps: 'ALL',
          },
        ],
      });

      // Updates only touch template tables; the activity snapshot stays as it was.
      for (const [entity] of manager.update.mock.calls) {
        expect([WorkoutTemplate, TemplateExercise, TemplateAlternativeGroup]).toContain(entity);
      }
      for (const [entity] of manager.delete.mock.calls) {
        expect([TemplateExercise, TemplateAlternativeGroup]).toContain(entity);
      }
      expect(JSON.parse(JSON.stringify(savedOf(StrengthActivityExercise)))).toEqual(snapshot);
      expect(JSON.parse(JSON.stringify(savedOf(StrengthActivity)))).toEqual(activitySnapshot);
      expect(snapshot[0]).toEqual(
        expect.objectContaining({ tempo: '1/0/1/0', note: '80 kg', targetSets: 3 }),
      );
      expect(activitySnapshot[0].name).toBe('FBW A');
    });

    it('throws 404 when template does not belong to the user', async () => {
      manager.findOne.mockResolvedValue(null);

      await expect(
        service.startFromTemplate(userId, 'template-id'),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(manager.save).not.toHaveBeenCalled();
    });

    it('throws 409 when the user already has an active activity', async () => {
      manager.exists.mockResolvedValue(true);

      await expect(
        service.startFromTemplate(userId, 'template-id'),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(manager.save).not.toHaveBeenCalled();
    });

    it('maps a concurrent unique index violation to 409', async () => {
      manager.save.mockRejectedValueOnce(
        new QueryFailedError('INSERT', [], {
          code: '23505',
          constraint: ACTIVE_ACTIVITY_UNIQUE_INDEX,
        } as never),
      );

      await expect(
        service.startFromTemplate(userId, 'template-id'),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('createTemplate', () => {
    const payload: WorkoutTemplateUpsertDto = {
      name: 'FBW A',
      alternativeGroups: [{ clientKey: 'press', name: 'Horizontal press' }],
      items: [
        {
          exerciseId: 'exercise-bench-press',
          alternativeGroupKey: 'press',
          sets: 3,
          reps: '4-6',
          tempo: '1/0/1/0',
          note: '80 kg',
        },
        {
          exerciseId: 'exercise-db-press',
          alternativeGroupKey: 'press',
          sets: 3,
          reps: '6-8',
        },
        {
          exerciseId: 'exercise-chin-up',
          sets: 2,
          reps: 'ALL',
        },
      ],
    };

    it('saves template, a new group and its new members in one request (clientKey)', async () => {
      manager.find.mockResolvedValue([
        { id: 'exercise-bench-press' },
        { id: 'exercise-db-press' },
        { id: 'exercise-chin-up' },
      ]);
      manager.findOne.mockResolvedValue(templateEntity);

      await service.createTemplate(userId, payload);

      expect(savedOf(WorkoutTemplate)).toEqual([
        expect.objectContaining({ userId, name: 'FBW A', description: null }),
      ]);
      const templateId = savedOf(WorkoutTemplate)[0].id;
      expect(savedOf(TemplateAlternativeGroup)).toEqual([
        expect.objectContaining({ templateId, name: 'Horizontal press' }),
      ]);
      const groupId = savedOf(TemplateAlternativeGroup)[0].id;
      expect(savedOf(TemplateExercise)).toEqual([
        expect.objectContaining({
          templateId,
          exerciseId: 'exercise-bench-press',
          alternativeGroupId: groupId,
          sets: 3,
          reps: '4-6',
          tempo: '1/0/1/0',
          note: '80 kg',
          orderIndex: 0,
        }),
        expect.objectContaining({
          exerciseId: 'exercise-db-press',
          alternativeGroupId: groupId,
          tempo: null,
          note: null,
          orderIndex: 1,
        }),
        expect.objectContaining({
          exerciseId: 'exercise-chin-up',
          alternativeGroupId: null,
          orderIndex: 2,
        }),
      ]);
      expect(manager.delete).not.toHaveBeenCalled();
    });

    it('rejects unknown exercises with 400', async () => {
      manager.find.mockResolvedValue([]);

      await expect(
        service.createTemplate(userId, payload),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(manager.find).toHaveBeenCalledWith(
        StrengthExerciseDictionary,
        expect.anything(),
      );
      expect(manager.save).not.toHaveBeenCalled();
    });

    it('rejects invalid reps with 400 before touching the database', async () => {
      await expect(
        service.createTemplate(userId, {
          ...payload,
          items: [{ ...payload.items[2], reps: '6-4' }],
          alternativeGroups: [],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(dataSource.transaction).not.toHaveBeenCalled();
    });

    it('rejects a non-consecutive group with 400 before touching the database', async () => {
      await expect(
        service.createTemplate(userId, {
          ...payload,
          items: [payload.items[0], payload.items[2], payload.items[1]],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(dataSource.transaction).not.toHaveBeenCalled();
    });

    it('rejects ids on create', async () => {
      await expect(
        service.createTemplate(userId, {
          ...payload,
          items: payload.items.map((item, index) =>
            index === 2 ? { ...item, id: 'template-exercise-x' } : item,
          ),
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(dataSource.transaction).not.toHaveBeenCalled();
    });
  });

  describe('updateTemplate', () => {
    beforeEach(() => {
      manager.exists.mockResolvedValue(true);
      manager.findOne.mockResolvedValue(templateEntity);
      manager.find.mockImplementation(async (entity) => {
        if (entity === TemplateExercise) {
          return templateEntity.exercises.map(({ id }) => ({ id }));
        }
        if (entity === TemplateAlternativeGroup) {
          return templateEntity.alternativeGroups.map(({ id }) => ({ id }));
        }
        return [
          { id: 'exercise-bench-press' },
          { id: 'exercise-db-press' },
          { id: 'exercise-chin-up' },
          { id: 'exercise-hack-squat' },
          { id: 'exercise-leg-press' },
        ];
      });
    });

    it('upserts by id: keeps ids, inserts new rows and deletes missing ones', async () => {
      await service.updateTemplate(userId, 'template-id', {
        name: 'FBW B',
        alternativeGroups: [{ clientKey: 'legs', name: 'Squat pattern' }],
        items: [
          {
            id: 'template-exercise-chin-up',
            exerciseId: 'exercise-chin-up',
            sets: 3,
            reps: '~',
          },
          {
            id: 'template-exercise-bench',
            exerciseId: 'exercise-bench-press',
            sets: 3,
            reps: '4-6',
            tempo: '3/1/X/0',
            note: 'pause',
          },
          {
            exerciseId: 'exercise-hack-squat',
            alternativeGroupKey: 'legs',
            sets: 3,
            reps: '8-10',
          },
          {
            exerciseId: 'exercise-leg-press',
            alternativeGroupKey: 'legs',
            sets: 3,
            reps: '10-12',
          },
        ],
      });

      expect(manager.update).toHaveBeenCalledWith(
        WorkoutTemplate,
        { id: 'template-id', userId },
        { name: 'FBW B', description: null },
      );

      // Existing items are updated in place (same id) with their new position.
      expect(manager.update).toHaveBeenCalledWith(
        TemplateExercise,
        { id: 'template-exercise-chin-up', templateId: 'template-id' },
        expect.objectContaining({ reps: '~', orderIndex: 0, alternativeGroupId: null }),
      );
      expect(manager.update).toHaveBeenCalledWith(
        TemplateExercise,
        { id: 'template-exercise-bench', templateId: 'template-id' },
        expect.objectContaining({
          tempo: '3/1/X/0',
          note: 'pause',
          orderIndex: 1,
          alternativeGroupId: null,
        }),
      );

      // New group and its new members are inserted.
      const groupId = savedOf(TemplateAlternativeGroup)[0].id;
      expect(savedOf(TemplateAlternativeGroup)).toEqual([
        expect.objectContaining({ templateId: 'template-id', name: 'Squat pattern' }),
      ]);
      expect(savedOf(TemplateExercise)).toEqual([
        expect.objectContaining({ exerciseId: 'exercise-hack-squat', alternativeGroupId: groupId, orderIndex: 2 }),
        expect.objectContaining({ exerciseId: 'exercise-leg-press', alternativeGroupId: groupId, orderIndex: 3 }),
      ]);

      // Rows missing from the payload are deleted – nothing else.
      expect(manager.delete).toHaveBeenCalledWith(TemplateExercise, {
        templateId: 'template-id',
        id: In(['template-exercise-db-press']),
      });
      expect(manager.delete).toHaveBeenCalledWith(TemplateAlternativeGroup, {
        templateId: 'template-id',
        id: In(['template-group-press']),
      });
      expect(manager.delete).toHaveBeenCalledTimes(2);

      // Snapshot principle: past activities are never touched.
      expect(savedOf(StrengthActivity)).toEqual([]);
      expect(savedOf(StrengthActivityExercise)).toEqual([]);
    });

    it('renames an existing group without changing its id', async () => {
      await service.updateTemplate(userId, 'template-id', {
        name: 'FBW A',
        alternativeGroups: [
          { id: 'template-group-press', clientKey: 'g1', name: 'Chest press' },
        ],
        items: templateEntity.exercises.map((exercise) => ({
          id: exercise.id,
          exerciseId: exercise.exerciseId,
          alternativeGroupKey: exercise.alternativeGroupId ? 'g1' : null,
          sets: exercise.sets,
          reps: exercise.reps,
        })),
      });

      expect(manager.update).toHaveBeenCalledWith(
        TemplateAlternativeGroup,
        { id: 'template-group-press', templateId: 'template-id' },
        { name: 'Chest press' },
      );
      expect(manager.update).toHaveBeenCalledWith(
        TemplateExercise,
        { id: 'template-exercise-bench', templateId: 'template-id' },
        expect.objectContaining({ alternativeGroupId: 'template-group-press' }),
      );
      expect(savedOf(TemplateAlternativeGroup)).toEqual([]);
      expect(savedOf(TemplateExercise)).toEqual([]);
      expect(manager.delete).not.toHaveBeenCalled();
    });

    it('rejects ids of another template with 400', async () => {
      await expect(
        service.updateTemplate(userId, 'template-id', {
          name: 'FBW B',
          alternativeGroups: [
            { id: 'foreign-group', clientKey: 'g', name: 'Foreign' },
          ],
          items: [
            { id: 'foreign-exercise', exerciseId: 'exercise-chin-up', alternativeGroupKey: 'g', sets: 3, reps: '5' },
            { exerciseId: 'exercise-bench-press', alternativeGroupKey: 'g', sets: 3, reps: '5' },
          ],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(manager.update).not.toHaveBeenCalled();
      expect(manager.save).not.toHaveBeenCalled();
      expect(manager.delete).not.toHaveBeenCalled();
    });

    it('throws 404 for a template of another user', async () => {
      manager.exists.mockResolvedValue(false);

      await expect(
        service.updateTemplate(userId, 'template-id', {
          name: 'FBW B',
          alternativeGroups: [],
          items: [],
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(manager.delete).not.toHaveBeenCalled();
    });
  });

  describe('deleteTemplate', () => {
    it('deletes an owned template', async () => {
      templateRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteTemplate(userId, 'template-id');

      expect(templateRepository.delete).toHaveBeenCalledWith({
        id: 'template-id',
        userId,
      });
    });

    it('throws 404 when nothing was deleted', async () => {
      templateRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(
        service.deleteTemplate(userId, 'template-id'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  it('maps templates to DTO', async () => {
    manager.findOne.mockResolvedValue(templateEntity);

    await expect(service.getTemplate(userId, 'template-id')).resolves.toEqual({
      id: 'template-id',
      name: 'FBW A',
      description: null,
      alternativeGroups: [{ id: 'template-group-press', name: 'Horizontal press' }],
      items: [
        {
          id: 'template-exercise-bench',
          exerciseId: 'exercise-bench-press',
          title: 'Bench press',
          description: 'Barbell bench press.',
          alternativeGroupId: 'template-group-press',
          sets: 3,
          reps: '4-6',
          tempo: '1/0/1/0',
          note: '80 kg',
        },
        {
          id: 'template-exercise-db-press',
          exerciseId: 'exercise-db-press',
          title: 'Dumbbell press',
          description: 'Dumbbell bench press.',
          alternativeGroupId: 'template-group-press',
          sets: 3,
          reps: '6-8',
          tempo: null,
          note: null,
        },
        {
          id: 'template-exercise-chin-up',
          exerciseId: 'exercise-chin-up',
          title: 'Chin-up',
          description: 'Underhand chin-up.',
          alternativeGroupId: null,
          sets: 2,
          reps: 'ALL',
          tempo: null,
          note: null,
        },
      ],
    });
  });

  it('recognizes only the active-activity unique violation', () => {
    const violation = (code: string, constraint: string) =>
      new QueryFailedError('INSERT', [], { code, constraint } as never);

    expect(
      isActiveActivityUniqueViolation(
        violation('23505', ACTIVE_ACTIVITY_UNIQUE_INDEX),
      ),
    ).toBe(true);
    expect(isActiveActivityUniqueViolation(violation('23505', 'other'))).toBe(
      false,
    );
    expect(isActiveActivityUniqueViolation(new Error('boom'))).toBe(false);
  });
});
