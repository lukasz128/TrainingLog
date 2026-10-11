import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, CurrentUserId } from 'api-auth';
import { StrengthService } from './strength.service';
import {
  StrengthActivityDto,
  StrengthActivityFinishDto,
  StrengthExerciseDictionaryDto,
  StrengthSetDto,
  StrengthSetUpdateDto,
} from './strength.types';

@UseGuards(AuthGuard)
@Controller('activities/strength')
export class StrengthController {
  constructor(private readonly strengthService: StrengthService) {}

  @Get()
  getActivities(
    @CurrentUserId() userId: string,
  ): Promise<StrengthActivityDto[]> {
    return this.strengthService.getActivities(userId);
  }

  @Get('active')
  getActiveActivity(
    @CurrentUserId() userId: string,
  ): Promise<StrengthActivityDto> {
    return this.strengthService.getActiveActivity(userId);
  }

  @Get('exercises')
  getExerciseDictionary(): Promise<StrengthExerciseDictionaryDto[]> {
    return this.strengthService.getExerciseDictionary();
  }

  @Put('exercises/:exerciseId/sets')
  saveExerciseSets(
    @CurrentUserId() userId: string,
    @Param('exerciseId') exerciseId: string,
    @Body() sets: StrengthSetUpdateDto[],
  ): Promise<StrengthSetDto[]> {
    return this.strengthService.saveExerciseSets(userId, exerciseId, sets);
  }

  @Post('exercises/:exerciseId/sets')
  saveExerciseSetsBeacon(
    @CurrentUserId() userId: string,
    @Param('exerciseId') exerciseId: string,
    @Body() sets: StrengthSetUpdateDto[],
  ): Promise<StrengthSetDto[]> {
    return this.strengthService.saveExerciseSets(userId, exerciseId, sets);
  }

  @Post(':activityId/finish')
  finishActivity(
    @CurrentUserId() userId: string,
    @Param('activityId') activityId: string,
  ): Promise<StrengthActivityFinishDto> {
    return this.strengthService.finishActivity(userId, activityId);
  }
}
