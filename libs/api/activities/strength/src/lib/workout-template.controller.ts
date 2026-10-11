import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, CurrentUserId } from 'api-auth';
import {
  StrengthActivityDto,
  WorkoutTemplateDto,
  WorkoutTemplateSummaryDto,
  WorkoutTemplateUpsertDto,
} from './strength.types';
import { WorkoutTemplateService } from './workout-template.service';

@UseGuards(AuthGuard)
@Controller('activities/strength/templates')
export class WorkoutTemplateController {
  constructor(
    private readonly workoutTemplateService: WorkoutTemplateService,
  ) {}

  @Get()
  getTemplates(
    @CurrentUserId() userId: string,
  ): Promise<WorkoutTemplateSummaryDto[]> {
    return this.workoutTemplateService.getTemplates(userId);
  }

  @Get(':templateId')
  getTemplate(
    @CurrentUserId() userId: string,
    @Param('templateId') templateId: string,
  ): Promise<WorkoutTemplateDto> {
    return this.workoutTemplateService.getTemplate(userId, templateId);
  }

  @Post()
  createTemplate(
    @CurrentUserId() userId: string,
    @Body() payload: WorkoutTemplateUpsertDto,
  ): Promise<WorkoutTemplateDto> {
    return this.workoutTemplateService.createTemplate(userId, payload);
  }

  @Put(':templateId')
  updateTemplate(
    @CurrentUserId() userId: string,
    @Param('templateId') templateId: string,
    @Body() payload: WorkoutTemplateUpsertDto,
  ): Promise<WorkoutTemplateDto> {
    return this.workoutTemplateService.updateTemplate(
      userId,
      templateId,
      payload,
    );
  }

  @Delete(':templateId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTemplate(
    @CurrentUserId() userId: string,
    @Param('templateId') templateId: string,
  ): Promise<void> {
    return this.workoutTemplateService.deleteTemplate(userId, templateId);
  }

  @Post(':templateId/start')
  startFromTemplate(
    @CurrentUserId() userId: string,
    @Param('templateId') templateId: string,
  ): Promise<StrengthActivityDto> {
    return this.workoutTemplateService.startFromTemplate(userId, templateId);
  }
}
