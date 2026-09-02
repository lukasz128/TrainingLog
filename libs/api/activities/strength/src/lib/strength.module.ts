import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrengthActivityExercise } from './entities/strength-activity-exercise.entity';
import { StrengthActivity } from './entities/strength-activity.entity';
import { StrengthExerciseDictionary } from './entities/strength-exercise-dictionary.entity';
import { StrengthSet } from './entities/strength-set.entity';
import { StrengthController } from './strength.controller';
import { StrengthService } from './strength.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StrengthActivity,
      StrengthActivityExercise,
      StrengthExerciseDictionary,
      StrengthSet,
    ]),
  ],
  controllers: [StrengthController],
  providers: [StrengthService],
})
export class StrengthModule {}
