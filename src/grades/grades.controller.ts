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
  getWrittenWorksPercentage(
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

  @Get('performance-tasks/:sectionSubjectId/:gradingPeriodId/:studentId')
  getPerformanceTasksPercentage(
    @Param('sectionSubjectId', ParseIntPipe)
    sectionSubjectId: number,

    @Param('gradingPeriodId', ParseIntPipe)
    gradingPeriodId: number,

    @Param('studentId', ParseIntPipe)
    studentId: number,
  ) {
    return this.gradesService.getPerformanceTasksPercentage(
      sectionSubjectId,
      gradingPeriodId,
      studentId,
    );
  }

  @Get('quarterly-assessment/:sectionSubjectId/:gradingPeriodId/:studentId')
  getQuarterlyAssessmentPercentage(
    @Param('sectionSubjectId', ParseIntPipe)
    sectionSubjectId: number,

    @Param('gradingPeriodId', ParseIntPipe)
    gradingPeriodId: number,

    @Param('studentId', ParseIntPipe)
    studentId: number,
  ) {
    return this.gradesService.getQuarterlyAssessmentPercentage(
      sectionSubjectId,
      gradingPeriodId,
      studentId,
    );
  }

  @Get('initial-grade/:sectionSubjectId/:gradingPeriodId/:studentId')
  getInitialGrade(
    @Param('sectionSubjectId', ParseIntPipe) sectionSubjectId: number,
    @Param('gradingPeriodId', ParseIntPipe) gradingPeriodId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.gradesService.getInitialGrades(
      sectionSubjectId,
      gradingPeriodId,
      studentId,
    );
  }

  @Get('transmuted-grade/:sectionSubjectId/:gradingPeriodId/:studentId')
  getQuarterGrade(
    @Param('sectionSubjectId', ParseIntPipe) sectionSubjectId: number,
    @Param('gradingPeriodId', ParseIntPipe) gradingPeriodId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.gradesService.getQuarterGrade(
      sectionSubjectId,
      gradingPeriodId,
      studentId,
    );
  }
}
