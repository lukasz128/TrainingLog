import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  StrengthActivity,
  StrengthActivityExercise,
  StrengthExerciseDictionary,
  StrengthModule,
  StrengthSet,
} from 'strength-service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './features/auth/auth.entity';
import { AuthModule } from './features/auth/auth.module';

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
