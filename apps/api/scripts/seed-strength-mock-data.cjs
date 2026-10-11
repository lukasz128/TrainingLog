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
const {
  WorkoutTemplate,
} = require('../../../libs/api/activities/strength/src/lib/entities/workout-template.entity');
const {
  TemplateExercise,
} = require('../../../libs/api/activities/strength/src/lib/entities/template-exercise.entity');
const {
  TemplateAlternativeGroup,
} = require('../../../libs/api/activities/strength/src/lib/entities/template-alternative-group.entity');
const {
  ActivityAlternativeGroup,
} = require('../../../libs/api/activities/strength/src/lib/entities/activity-alternative-group.entity');
const { User } = require('../src/app/features/auth/auth.entity');

// `--reset` drops strength + template tables before seeding (dev only).
const shouldReset = process.argv.includes('--reset');

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
    id: 'exercise-dumbbell-bench-press',
    name: 'Wyciskanie hantli na ławce płaskiej',
    description: 'Dumbbell bench press performed on a flat bench.',
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

// Dev-only credentials (auth compares plain passwords for now).
const devUser = {
  id: 'dev-user',
  email: 'dev@traininglog.local',
  password: 'dev',
  isActive: true,
};

const template = {
  id: 'workout-template-fbw-a',
  name: 'FBW A (dominacja klata)',
  description: 'Full body workout A – chest focus.',
};

// 4 slots; the first one is an alternative group with 2 members.
const templateAlternativeGroups = [
  {
    id: 'template-group-horizontal-press',
    templateId: template.id,
    name: 'Horizontal press',
  },
];

const templateExercises = [
  {
    id: 'template-exercise-bench-press',
    templateId: template.id,
    exerciseId: 'exercise-bench-press',
    alternativeGroupId: 'template-group-horizontal-press',
    sets: 3,
    reps: '4-6',
    tempo: '1/0/1/0',
    note: 'Target 80 kg',
    orderIndex: 0,
  },
  {
    id: 'template-exercise-dumbbell-bench-press',
    templateId: template.id,
    exerciseId: 'exercise-dumbbell-bench-press',
    alternativeGroupId: 'template-group-horizontal-press',
    sets: 3,
    reps: '6-8',
    tempo: '2/0/1/0',
    note: 'If the bench is taken',
    orderIndex: 1,
  },
  {
    id: 'template-exercise-chin-up',
    templateId: template.id,
    exerciseId: 'exercise-chin-up',
    alternativeGroupId: null,
    sets: 3,
    reps: '4-6',
    tempo: '1/0/1/0',
    note: null,
    orderIndex: 2,
  },
  {
    id: 'template-exercise-hack-squat',
    templateId: template.id,
    exerciseId: 'exercise-hack-squat',
    alternativeGroupId: null,
    sets: 3,
    reps: '4-6',
    tempo: '1/0/1/0',
    note: null,
    orderIndex: 3,
  },
  {
    id: 'template-exercise-seated-dumbbell-press',
    templateId: template.id,
    exerciseId: 'exercise-seated-dumbbell-press',
    alternativeGroupId: null,
    sets: 2,
    reps: 'ALL',
    tempo: null,
    note: 'Last set to failure',
    orderIndex: 4,
  },
];

// The only active activity of the dev user (unique index allows one).
const activity = {
  id: 'strength-activity-fbw-a',
  templateId: template.id,
  name: template.name,
  status: 'active',
  startedAt: new Date(),
  finishedAt: null,
};

const activityExercises = [
  {
    id: 'activity-exercise-bench-press',
    activityId: activity.id,
    exerciseId: 'exercise-bench-press',
    templateExerciseId: 'template-exercise-bench-press',
    alternativeGroupId: null,
    targetSets: 3,
    reps: '4-6',
    tempo: '1/0/1/0',
    note: 'Target 80 kg',
    orderIndex: 0,
  },
  {
    id: 'activity-exercise-chin-up',
    activityId: activity.id,
    exerciseId: 'exercise-chin-up',
    templateExerciseId: 'template-exercise-chin-up',
    alternativeGroupId: null,
    targetSets: 3,
    reps: '4-6',
    tempo: '1/0/1/0',
    note: null,
    orderIndex: 2,
  },
  {
    id: 'activity-exercise-hack-squat',
    activityId: activity.id,
    exerciseId: 'exercise-hack-squat',
    templateExerciseId: 'template-exercise-hack-squat',
    alternativeGroupId: null,
    targetSets: 3,
    reps: '4-6',
    tempo: '1/0/1/0',
    note: null,
    orderIndex: 3,
  },
];

const sets = [
  ['activity-exercise-bench-press', [[true, 60, 6], [true, 70, 6], [false, 80, 6]]],
  ['activity-exercise-chin-up', [[true, 0, 6], [false, 5, 5], [false, null, null]]],
  ['activity-exercise-hack-squat', [[false, 120, 6], [false, null, null], [false, null, null]]],
].flatMap(([activityExerciseId, values]) =>
  values.map(([done, weight, reps], orderIndex) => ({
    id: `${activityExerciseId}-set-${orderIndex + 1}`,
    activityExerciseId,
    orderIndex,
    done,
    weight,
    reps,
  })),
);

const strengthTables = [
  'strength_set',
  'strength_activity_exercise',
  'activity_alternative_group',
  'strength_activity',
  'template_set', // dropped from the model – removed on reset
  'template_exercise',
  'template_alternative_group',
  'workout_template',
];

const strengthEnumTypes = ['strength_activity_status'];

const dataSource = new DataSource({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User,
    StrengthActivity,
    StrengthActivityExercise,
    StrengthExerciseDictionary,
    StrengthSet,
    WorkoutTemplate,
    TemplateExercise,
    TemplateAlternativeGroup,
    ActivityAlternativeGroup,
  ],
  // Synchronized manually below, after an optional reset.
  synchronize: false,
});

async function resolveDevUserId(entityManager) {
  const existing = await entityManager.findOne(User, {
    where: { email: devUser.email },
  });
  if (existing) {
    return existing.id;
  }
  await entityManager.insert(User, devUser);
  return devUser.id;
}

async function seed() {
  await dataSource.initialize();

  try {
    if (shouldReset) {
      await dataSource.query(
        `DROP TABLE IF EXISTS ${strengthTables
          .map((table) => `"${table}"`)
          .join(', ')} CASCADE`,
      );
      await dataSource.query(
        `DROP TYPE IF EXISTS ${strengthEnumTypes
          .map((type) => `"${type}"`)
          .join(', ')} CASCADE`,
      );
      console.log(`Dropped tables: ${strengthTables.join(', ')}`);
    }

    await dataSource.synchronize();

    await dataSource.transaction(async (entityManager) => {
      const userId = await resolveDevUserId(entityManager);

      await entityManager.upsert(
        StrengthExerciseDictionary,
        dictionaryExercises,
        ['id'],
      );

      await entityManager.upsert(
        WorkoutTemplate,
        { ...template, userId },
        ['id'],
      );
      await entityManager.upsert(
        TemplateAlternativeGroup,
        templateAlternativeGroups,
        ['id'],
      );
      await entityManager.upsert(TemplateExercise, templateExercises, ['id']);

      // Keep the "one active activity per user" rule when re-seeding.
      await entityManager
        .createQueryBuilder()
        .update(StrengthActivity)
        .set({ status: 'finished', finishedAt: () => 'now()' })
        .where('"userId" = :userId AND "status" = :status AND id <> :id', {
          userId,
          status: 'active',
          id: activity.id,
        })
        .execute();

      await entityManager.upsert(StrengthActivity, { ...activity, userId }, [
        'id',
      ]);
      await entityManager.upsert(
        StrengthActivityExercise,
        activityExercises,
        ['id'],
      );
      await entityManager.upsert(StrengthSet, sets, ['id']);
    });

    console.log('Seeded strength mock data via TypeORM.');
    console.log(`Dev user: ${devUser.email} / ${devUser.password}`);
    console.log(`Exercises: ${dictionaryExercises.length}`);
    console.log('Templates: 1');
    console.log(`Template alternative groups: ${templateAlternativeGroups.length}`);
    console.log(`Template exercises: ${templateExercises.length}`);
    console.log('Activities: 1');
    console.log(`Activity exercises: ${activityExercises.length}`);
    console.log(`Sets: ${sets.length}`);
  } finally {
    await dataSource.destroy();
  }
}

seed().catch((error) => {
  console.error(error);
  if (!shouldReset) {
    console.error(
      'Hint: if the schema changed (e.g. new NOT NULL userId), run with --reset.',
    );
  }
  process.exit(1);
});
