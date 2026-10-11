import { BadRequestException } from '@nestjs/common';
import { WorkoutTemplateUpsertDto } from './strength.types';
import {
  isValidReps,
  isValidTempo,
  validateSetsUpdate,
  validateTemplateUpsert,
} from './strength.validation';

function messagesOf(run: () => unknown): string[] {
  try {
    run();
  } catch (error) {
    expect(error).toBeInstanceOf(BadRequestException);
    return ((error as BadRequestException).getResponse() as { message: string[] })
      .message;
  }
  throw new Error('Expected BadRequestException');
}

describe('strength validation', () => {
  describe(isValidReps.name, () => {
    it.each(['5', '12', '4-6', '8-8', 'ALL', '~'])('accepts "%s"', (value) => {
      expect(isValidReps(value)).toBe(true);
    });

    it.each(['', '6-4', 'abc', 'all', '4-', '-6', '4 - 6', '1234', '5x', '~5'])(
      'rejects "%s"',
      (value) => {
        expect(isValidReps(value)).toBe(false);
      },
    );
  });

  describe(isValidTempo.name, () => {
    it.each(['1/0/1/0', '3/1/X/0', 'X/X/X/X'])('accepts "%s"', (value) => {
      expect(isValidTempo(value)).toBe(true);
    });

    it.each(['', '1/0/1', '1/0/1/0/1', '10/0/1/0', 'x/0/1/0', '1-0-1-0'])(
      'rejects "%s"',
      (value) => {
        expect(isValidTempo(value)).toBe(false);
      },
    );
  });

  describe(validateTemplateUpsert.name, () => {
    const validItem = {
      exerciseId: 'exercise-bench-press',
      sets: 3,
      reps: '4-6',
      tempo: '1/0/1/0',
      note: ' 80 kg ',
    };

    const payloadWithGroup = (
      items: WorkoutTemplateUpsertDto['items'],
    ): WorkoutTemplateUpsertDto => ({
      name: 'FBW A',
      alternativeGroups: [{ clientKey: 'press', name: 'Horizontal press' }],
      items,
    });

    it('normalizes a valid payload', () => {
      expect(
        validateTemplateUpsert({
          name: '  FBW A  ',
          description: '',
          alternativeGroups: [],
          items: [{ ...validItem, id: 'template-exercise-1' }],
        }),
      ).toEqual({
        name: 'FBW A',
        description: null,
        alternativeGroups: [],
        items: [
          {
            id: 'template-exercise-1',
            exerciseId: 'exercise-bench-press',
            alternativeGroupKey: null,
            sets: 3,
            reps: '4-6',
            tempo: '1/0/1/0',
            note: '80 kg',
          },
        ],
      });
    });

    it('treats missing alternativeGroups as empty', () => {
      const result = validateTemplateUpsert({
        name: 'FBW A',
        items: [validItem],
      } as never);

      expect(result.alternativeGroups).toEqual([]);
    });

    it('accepts an empty tempo and note as null', () => {
      const result = validateTemplateUpsert({
        name: 'FBW A',
        alternativeGroups: [],
        items: [{ ...validItem, tempo: '', note: '  ' }],
      });

      expect(result.items[0].tempo).toBeNull();
      expect(result.items[0].note).toBeNull();
    });

    it('collects all errors', () => {
      expect(
        messagesOf(() =>
          validateTemplateUpsert({
            name: '',
            alternativeGroups: [],
            items: [{ ...validItem, sets: 0, reps: '6-4', tempo: '1/0' }],
          }),
        ),
      ).toEqual([
        'name is required',
        'items[0].sets must be an integer between 1 and 50',
        'items[0].reps "6-4" is invalid (allowed: "5", "4-6", "ALL", "~")',
        'items[0].tempo "1/0" is invalid (e.g. "1/0/1/0", "3/1/X/0")',
      ]);
    });

    it('rejects missing items array', () => {
      expect(() =>
        validateTemplateUpsert({ name: 'FBW A' } as never),
      ).toThrow(BadRequestException);
    });

    describe('alternative groups', () => {
      it('accepts a group with consecutive members', () => {
        const result = validateTemplateUpsert(
          payloadWithGroup([
            { ...validItem, exerciseId: 'exercise-chin-up' },
            { ...validItem, alternativeGroupKey: 'press' },
            { ...validItem, exerciseId: 'exercise-db-press', alternativeGroupKey: 'press' },
            { ...validItem, exerciseId: 'exercise-hack-squat' },
          ]),
        );

        expect(result.alternativeGroups).toEqual([
          { clientKey: 'press', name: 'Horizontal press' },
        ]);
        expect(result.items.map((item) => item.alternativeGroupKey)).toEqual([
          null,
          'press',
          'press',
          null,
        ]);
      });

      it('rejects a group with fewer than 2 members', () => {
        expect(
          messagesOf(() =>
            validateTemplateUpsert(
              payloadWithGroup([{ ...validItem, alternativeGroupKey: 'press' }]),
            ),
          ),
        ).toEqual(['alternative group "press" must have at least 2 members']);
      });

      it('rejects a group without members', () => {
        expect(
          messagesOf(() => validateTemplateUpsert(payloadWithGroup([validItem]))),
        ).toEqual(['alternative group "press" must have at least 2 members']);
      });

      it('rejects a foreign exercise between group members', () => {
        expect(
          messagesOf(() =>
            validateTemplateUpsert(
              payloadWithGroup([
                { ...validItem, alternativeGroupKey: 'press' },
                { ...validItem, exerciseId: 'exercise-chin-up' },
                { ...validItem, alternativeGroupKey: 'press' },
              ]),
            ),
          ),
        ).toEqual(['members of alternative group "press" must be consecutive']);
      });

      it('rejects an unknown group key', () => {
        expect(
          messagesOf(() =>
            validateTemplateUpsert({
              name: 'FBW A',
              alternativeGroups: [],
              items: [{ ...validItem, alternativeGroupKey: 'nope' }],
            }),
          ),
        ).toEqual([
          'items[0].alternativeGroupKey "nope" does not match any alternativeGroups[].clientKey',
        ]);
      });

      it('rejects duplicated client keys, empty names and duplicated ids', () => {
        expect(
          messagesOf(() =>
            validateTemplateUpsert({
              name: 'FBW A',
              alternativeGroups: [
                { clientKey: 'press', name: 'Press' },
                { clientKey: 'press', name: '' },
              ],
              items: [
                { ...validItem, id: 'same', alternativeGroupKey: 'press' },
                { ...validItem, id: 'same', alternativeGroupKey: 'press' },
              ],
            }),
          ),
        ).toEqual([
          'alternativeGroups[1].clientKey "press" is duplicated',
          'alternativeGroups[1].name is required',
          'items: id "same" is duplicated',
        ]);
      });
    });
  });

  describe(validateSetsUpdate.name, () => {
    it('accepts numbers, nulls and numeric strings', () => {
      expect(
        validateSetsUpdate([
          { id: 'set-1', done: true, weight: 82.5, reps: 6 },
          { done: false, weight: null, reps: null },
          { done: true, weight: '1.25', reps: '8' } as never,
          { done: false, weight: '82,5', reps: '' } as never,
        ]),
      ).toEqual([
        { id: 'set-1', done: true, weight: 82.5, reps: 6 },
        { done: false, weight: null, reps: null },
        { done: true, weight: 1.25, reps: 8 },
        { done: false, weight: 82.5, reps: null },
      ]);
    });

    it('rejects negative, too precise or non-numeric weight and non-integer reps', () => {
      expect(
        messagesOf(() =>
          validateSetsUpdate([
            { done: true, weight: -1, reps: 5 },
            { done: true, weight: 82.499, reps: 5 },
            { done: true, weight: 'abc', reps: 5 } as never,
            { done: true, weight: 10000, reps: 5 },
            { done: true, weight: 60, reps: 5.5 },
            { done: true, weight: 60, reps: -1 },
            { done: 'yes', weight: 60, reps: 5 } as never,
          ]),
        ),
      ).toEqual([
        '[0].weight must be a number between 0 and 9999.99 with at most 2 decimals',
        '[1].weight must be a number between 0 and 9999.99 with at most 2 decimals',
        '[2].weight must be a number between 0 and 9999.99 with at most 2 decimals',
        '[3].weight must be a number between 0 and 9999.99 with at most 2 decimals',
        '[4].reps must be an integer between 0 and 999',
        '[5].reps must be an integer between 0 and 999',
        '[6].done must be a boolean',
      ]);
    });

    it('rejects a non-array payload', () => {
      expect(() => validateSetsUpdate({} as never)).toThrow(BadRequestException);
    });
  });
});
