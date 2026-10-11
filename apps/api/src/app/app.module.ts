import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule, User } from 'api-auth';
import {
  ActivityAlternativeGroup,
  StrengthActivity,
  StrengthActivityExercise,
  StrengthExerciseDictionary,
  StrengthModule,
  StrengthSet,
  TemplateAlternativeGroup,
  TemplateExercise,
  WorkoutTemplate,
} from 'strength-service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'postgres',
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
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    StrengthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
