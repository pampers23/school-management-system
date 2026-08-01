import { Module } from '@nestjs/common';
import { StudentAssessmentScoreService } from './student-assessment-score.service';
import { StudentAssessmentScoreController } from './student-assessment-score.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [StudentAssessmentScoreService],
  controllers: [StudentAssessmentScoreController],
})
export class StudentAssessmentScoreModule {}
