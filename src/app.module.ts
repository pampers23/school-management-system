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
import { ScheduleModule } from './schedule/schedule.module';
import { RoomModule } from './room/room.module';
import { EnrollmentsService } from './enrollments/enrollments.service';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { StudentsService } from './students/students.service';
import { StudentsModule } from './students/students.module';
import { EnrollmentApplicationModule } from './enrollment-application/enrollment-application.module';
import { AttendanceModule } from './attendance/attendance.module';
import { GradingPeriodsModule } from './grading-periods/grading-periods.module';

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
    ScheduleModule,
    RoomModule,
    EnrollmentsModule,
    StudentsModule,
    EnrollmentApplicationModule,
    AttendanceModule,
    GradingPeriodsModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, EnrollmentsService, StudentsService],
})
export class AppModule {}
