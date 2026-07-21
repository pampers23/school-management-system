import { Module } from '@nestjs/common';
import { TeacherAssignmentService } from './teacher-assignment.service';
import { TeacherAssignmentController } from './teacher-assignment.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TeacherAssignmentService],
  controllers: [TeacherAssignmentController],
})
export class TeacherAssignmentModule {}
