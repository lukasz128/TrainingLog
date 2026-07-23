require('reflect-metadata');

const fs = require('fs');
const path = require('path');
const { DataSource } = require('typeorm');
const workspaceRoot = path.resolve(__dirname, '../../..');

require('ts-node').register({
  project: path.join(workspaceRoot, 'apps/api/tsconfig.app.json'),
  transpileOnly: true,
});

const {
  StrengthActivityExercise,
} = require('../../../libs/api/activities/strength/src/lib/entities/strength-activity-exercise.entity');
const {
  StrengthActivity,
} = require('../../../libs/api/activities/strength/src/lib/entities/strength-activity.entity');
const {
  StrengthExerciseDictionary,
} = require('../../../libs/api/activities/strength/src/lib/entities/strength-exercise-dictionary.entity');
const {
  StrengthSet,
} = require('../../../libs/api/activities/strength/src/lib/entities/strength-set.entity');

const envPath = path.join(workspaceRoot, 'apps/api/.env');

function loadEnv(filePath) {
  const env = Object.fromEntries(
    fs
      .readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .filter((line) => line.trim() && !line.trim().startsWith('#'))
      .map((line) => {
        const index = line.indexOf('=');
        return [line.slice(0, index), line.slice(index + 1)];
      }),
  );

  for (const [key, value] of Object.entries(env)) {
    process.env[key] = process.env[key] ?? value;
  }

  return env;
}

loadEnv(envPath);

const dictionaryExercises = [
  {
    id: 'exercise-bench-press',
    name: 'Wyciskanie sztangi na ławce płaskiej',
    description: 'Barbell bench press performed on a flat bench.',
  },
  {
    id: 'exercise-chin-up',
    name: 'Podciąganie podchwytem',
    description: 'Underhand chin-up focused on back and biceps.',
  },
  {
    id: 'exercise-hack-squat',
    name: 'Hack Squat',
    description: 'Machine squat variation with guided movement path.',
  },
  {
    id: 'exercise-seated-dumbbell-press',
    name: 'Wyciskanie hantli siedząc',
    description: 'Seated dumbbell shoulder press with back support.',
  },
];

const activity = {
  id: 'strength-activity-fbw-a',
  name: 'FBW A (dominacja klata)',
  subtitle: 'Training Session',
  status: 'active',
  startedAt: new Date(),
  finishedAt: null,
};

const activityExercises = [
  {
    id: 'activity-exercise-bench-press',
    activityId: activity.id,
    exerciseId: 'exercise-bench-press',
    phase: 'progress',
    details: '3×4-6 | 1/0/1/0',
    orderIndex: 0,
  },
  {
    id: 'activity-exercise-chin-up',
    activityId: activity.id,
    exerciseId: 'exercise-chin-up',
    phase: 'progress',
    details: '3×4-6 | 1/0/1/0',
    orderIndex: 1,
  },
  {
    id: 'activity-exercise-hack-squat',
    activityId: activity.id,
    exerciseId: 'exercise-hack-squat',
    phase: 'progress',
    details: '3×4-6 | 1/0/1/0',
    orderIndex: 2,
  },
];

const sets = [
  {
    id: 'set-bench-press-1',
    activityExerciseId: 'activity-exercise-bench-press',
    orderIndex: 0,
    done: true,
    weight: '60',
    reps: '6',
  },
  {
    id: 'set-bench-press-2',
    activityExerciseId: 'activity-exercise-bench-press',
    orderIndex: 1,
    done: true,
    weight: '70',
    reps: '6',
  },
  {
    id: 'set-bench-press-3',
    activityExerciseId: 'activity-exercise-bench-press',
    orderIndex: 2,
    done: false,
    weight: '80',
    reps: '6',
  },
  {
    id: 'set-chin-up-1',
    activityExerciseId: 'activity-exercise-chin-up',
    orderIndex: 0,
    done: true,
    weight: '0',
    reps: '6',
  },
  {
    id: 'set-chin-up-2',
    activityExerciseId: 'activity-exercise-chin-up',
    orderIndex: 1,
    done: false,
    weight: '5',
    reps: '5',
  },
  {
    id: 'set-hack-squat-1',
    activityExerciseId: 'activity-exercise-hack-squat',
    orderIndex: 0,
    done: false,
    weight: '120',
    reps: '6',
  },
];

const dataSource = new DataSource({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    StrengthActivity,
    StrengthActivityExercise,
    StrengthExerciseDictionary,
    StrengthSet,
  ],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();

  try {
    await dataSource.transaction(async (entityManager) => {
      await entityManager.upsert(
        StrengthExerciseDictionary,
        dictionaryExercises,
        ['id'],
      );
      await entityManager.upsert(StrengthActivity, activity, ['id']);
      await entityManager.upsert(
        StrengthActivityExercise,
        activityExercises,
        ['id'],
      );
      await entityManager.upsert(StrengthSet, sets, ['id']);
    });

    console.log('Seeded strength mock data via TypeORM.');
    console.log(`Exercises: ${dictionaryExercises.length}`);
    console.log('Activities: 1');
    console.log(`Activity exercises: ${activityExercises.length}`);
    console.log(`Sets: ${sets.length}`);
  } finally {
    await dataSource.destroy();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
