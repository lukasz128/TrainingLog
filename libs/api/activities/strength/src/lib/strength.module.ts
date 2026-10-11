import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityAlternativeGroup } from './entities/activity-alternative-group.entity';
import { StrengthActivityExercise } from './entities/strength-activity-exercise.entity';
import { StrengthActivity } from './entities/strength-activity.entity';
import { StrengthExerciseDictionary } from './entities/strength-exercise-dictionary.entity';
import { StrengthSet } from './entities/strength-set.entity';
import { TemplateExercise } from './entities/template-exercise.entity';
import { TemplateAlternativeGroup } from './entities/template-alternative-group.entity';
import { WorkoutTemplate } from './entities/workout-template.entity';
import { StrengthController } from './strength.controller';
import { StrengthService } from './strength.service';
import { WorkoutTemplateController } from './workout-template.controller';
import { WorkoutTemplateService } from './workout-template.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StrengthActivity,
      StrengthActivityExercise,
      StrengthExerciseDictionary,
      StrengthSet,
      WorkoutTemplate,
      TemplateExercise,
      TemplateAlternativeGroup,
      ActivityAlternativeGroup,
    ]),
  ],
  // WorkoutTemplateController first so "templates/..." routes are registered
  // before the generic ":activityId/..." routes of StrengthController.
  controllers: [WorkoutTemplateController, StrengthController],
  providers: [StrengthService, WorkoutTemplateService],
})
export class StrengthModule {}
