import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GradesService } from './grades.service';

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get('percentage-score/:assessmentItemId/:studentId')
  getPercentageScore(
    @Param('assessmentItemId', ParseIntPipe) assessmentItemId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.gradesService.getPercentageScore(assessmentItemId, studentId);
  }

  @Get('written-works/:sectionSubjectId/:gradingPeriodId/:studentId')
  getWrittenWorks(
    @Param('sectionSubjectId', ParseIntPipe)
    sectionSubjectId: number,

    @Param('gradingPeriodId', ParseIntPipe)
    gradingPeriodId: number,

    @Param('studentId', ParseIntPipe)
    studentId: number,
  ) {
    return this.gradesService.getWrittenWorkPercentage(
      sectionSubjectId,
      gradingPeriodId,
      studentId,
    );
  }
}
