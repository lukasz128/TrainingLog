import {
  StrengthActivity,
  StrengthExerciseDictionaryItem,
} from '../lib/strength.types';

export const strengthActivities: StrengthActivity[] = [
  {
    id: '4def98d7-98c6-4156-908d-3567f570476e',
    name: 'Upper A',
    subtitle: 'Minicut & masa cd. 2026',
    items: [
      {
        id: '1',
        exerciseId: '4def98d7-98c6-4156-908d-3567f570476e',
        phase: 'progress',
        details: '3×4-6',
        title: 'Wyciskanie sztangli lezac',
        description: 'Barbell bench press',
        sets: [{ id: 'set-id', done: false, weight: '60', reps: '6' }],
      },
      {
        id: '2',
        exerciseId: '4def98d7-98c6-4156-908d-3567f570476e',
        phase: 'progress',
        details: '3x5-10',
        title: 'Podciąganie neutralne',
        description: 'Barbell bench press',
        sets: [{ id: 'set-id', done: false, weight: '60', reps: '6' }],
      },
      {
        id: '3',
        exerciseId: '4def98d7-98c6-4156-908d-3567f570476e',
        phase: 'progress',
        details: '2x8-12',
        title: 'Wyciskanie hantli lekki skos dodatni',
        description: 'Barbell bench press',
        sets: [{ id: 'set-id', done: false, weight: '60', reps: '6' }],
      },
      {
        id: '4',
        exerciseId: '4def98d7-98c6-4156-908d-3567f570476e',
        phase: 'progress',
        details: '3×8-12',
        title: 'Wiosłowanie sztangą nadchwytem',
        description: 'Barbell bench press',
        sets: [{ id: 'set-id', done: false, weight: '60', reps: '6' }],
      },
      {
        id: '5',
        exerciseId: '4def98d7-98c6-4156-908d-3567f570476e',
        phase: 'progress',
        details: '3×6-10',
        title: 'OHP sztangą',
        description: 'Barbell bench press',
        sets: [{ id: 'set-id', done: false, weight: '60', reps: '6' }],
      },
      {
        id: '6',
        exerciseId: '4def98d7-98c6-4156-908d-3567f570476e',
        phase: 'progress',
        details: '2xMAX',
        title: 'Wznosy hantli bokiem',
        description: 'Barbell bench press',
        sets: [{ id: 'set-id', done: false, weight: '60', reps: '6' }],
      },
      {
        id: '7',
        exerciseId: '4def98d7-98c6-4156-908d-3567f570476e',
        phase: 'progress',
        details: '3×MAX',
        title: 'Tricpes',
        description: 'Barbell bench press',
        sets: [{ id: 'set-id', done: false, weight: '60', reps: '6' }],
      },
      {
        id: '8',
        exerciseId: '4def98d7-98c6-4156-908d-3567f570476e',
        phase: 'progress',
        details: '3×MAX',
        title: 'Biceps modlitwenik',
        description: 'Barbell bench press',
        sets: [{ id: 'set-id', done: false, weight: '60', reps: '6' }],
      },
    ],
  },
  {
    id: '4def98d7-98c6-4156-908d-3567f570476e',
    name: 'Lower A',
    subtitle: 'Minicut & masa cd. 2026',
    items: [],
  },
  {
    id: '4def98d7-98c6-4156-908d-3567f570476g',
    name: 'Upper B',
    subtitle: 'Minicut & masa cd. 2026',
    items: [],
  },
  {
    id: '4def98d7-98c6-4156-908d-3567f5704760',
    name: 'Upper C',
    subtitle: 'Minicut & masa cd. 2026',
    items: [],
  },
  {
    id: '4def98d7-98c6-4156-908d-3567f570476e',
    name: 'Lower A',
    subtitle: 'Minicut & masa cd. 2026',
    items: [],
  },
  {
    id: '4def98d7-98c6-4156-908d-3567f570476g',
    name: 'Upper B',
    subtitle: 'Minicut & masa cd. 2026',
    items: [],
  },
  {
    id: '4def98d7-98c6-4156-908d-3567f5704760',
    name: 'Upper C',
    subtitle: 'Minicut & masa cd. 2026',
    items: [],
  },
  {
    id: '4def98d7-98c6-4156-908d-3567f570476e',
    name: 'Lower A',
    subtitle: 'Minicut & masa cd. 2026',
    items: [],
  },
  {
    id: '4def98d7-98c6-4156-908d-3567f570476g',
    name: 'Upper B',
    subtitle: 'Minicut & masa cd. 2026',
    items: [],
  },
  {
    id: '4def98d7-98c6-4156-908d-3567f5704760',
    name: 'Upper C',
    subtitle: 'Minicut & masa cd. 2026',
    items: [],
  },
];

export const strengthActivity: StrengthActivity = strengthActivities[0];

export const strengthExerciseDictionaryItems: StrengthExerciseDictionaryItem[] =
  [
    {
      id: 'exercise-id',
      name: 'Bench press',
      description: 'Barbell bench press.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
