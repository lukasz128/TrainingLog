import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { StrengthService } from './strength.service';
import {
  StrengthActivityDto,
  StrengthExerciseDictionaryDto,
  StrengthSetDto,
  StrengthSetUpdateDto,
} from './strength.types';

@Controller('activities/strength')
export class StrengthController {
  constructor(private readonly strengthService: StrengthService) {}

  @Get()
  getActivities(): Promise<StrengthActivityDto[]> {
    return this.strengthService.getActivities();
  }

  @Get('active')
  getActiveActivity(): Promise<StrengthActivityDto> {
    return this.strengthService.getActiveActivity();
  }

  @Get('exercises')
  getExerciseDictionary(): Promise<StrengthExerciseDictionaryDto[]> {
    return this.strengthService.getExerciseDictionary();
  }

  @Put('exercises/:exerciseId/sets')
  saveExerciseSets(
    @Param('exerciseId') exerciseId: string,
    @Body() sets: StrengthSetUpdateDto[],
  ): Promise<StrengthSetDto[]> {
    return this.strengthService.saveExerciseSets(exerciseId, sets);
  }

  @Post('exercises/:exerciseId/sets')
  saveExerciseSetsBeacon(
    @Param('exerciseId') exerciseId: string,
    @Body() sets: StrengthSetUpdateDto[],
  ): Promise<StrengthSetDto[]> {
    return this.strengthService.saveExerciseSets(exerciseId, sets);
  }
}
