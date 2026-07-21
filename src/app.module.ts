import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SchoolYearModule } from './school-year/school-year.module';
import { SubjectModule } from './subject/subject.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { SectionsModule } from './sections/sections.module';
import { TeachersModule } from './teachers/teachers.module';
import { TeacherAssignmentModule } from './teacher-assignment/teacher-assignment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    SchoolYearModule,
    SubjectModule,
    CurriculumModule,
    SectionsModule,
    TeachersModule,
    TeacherAssignmentModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
