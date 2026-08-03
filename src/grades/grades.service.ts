import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssessmentBreakdownItem } from '../type';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async getPercentageScore(assessmentItemId: number, studentId: number) {
    const assessmentItem = await this.prisma.assessmentItem.findUnique({
      where: {
        id: assessmentItemId,
      },
    });

    if (!assessmentItem) {
      throw new NotFoundException('Assessment item not found');
    }

    const studentScore = await this.prisma.studentAssessmentScore.findUnique({
      where: {
        assessmentItemId_studentId: {
          assessmentItemId,
          studentId,
        },
      },
      include: {
        student: true,
      },
    });

    if (!studentScore) {
      throw new NotFoundException('Student score not found.');
    }

    const score = Number(studentScore.score);

    const highestPossibleScore = Number(assessmentItem.highestPossibleScore);

    const percentageScore = (score / highestPossibleScore) * 100;

    return {
      assessmentItem: assessmentItem.name,
      student: `${studentScore.student.firstName} ${studentScore.student.lastName}`,
      studentScore: score,
      highestPossibleScore,
      percentageScore,
    };
  }

  async getWrittenWorkPercentage(
    sectionSubjectId: number,
    gradingPeriodId: number,
    studentId: number,
  ) {
    const assessmentItems = await this.prisma.assessmentItem.findMany({
      where: {
        sectionSubjectId,
        gradingPeriodId,
        assessmentType: 'WRITTEN_WORK',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!assessmentItems.length) {
      throw new NotFoundException('No written works found.');
    }

    let totalStudentScore = 0;

    let totalHighestPossibleScore = 0;

    const breakdown: AssessmentBreakdownItem[] = [];

    for (const item of assessmentItems) {
      const score = await this.prisma.studentAssessmentScore.findUnique({
        where: {
          assessmentItemId_studentId: {
            assessmentItemId: item.id,
            studentId,
          },
        },
      });

      const studentScore = Number(score?.score ?? 0);

      const highestPossibleScore = Number(item.highestPossibleScore);

      totalStudentScore = studentScore;

      totalHighestPossibleScore = highestPossibleScore;

      breakdown.push({
        assessment: item.name,
        score: studentScore,
        highestPossibleScore,
      });
    }

    const percentageScore =
      totalHighestPossibleScore === 0
        ? 0
        : (totalStudentScore / totalHighestPossibleScore) * 100;

    return {
      category: 'Written Work',
      totalStudentScore,
      totalHighestPossibleScore,
      percentageScore,
      breakdown,
    };
  }

  async getPerformanceTasksPercentage(
    sectionSubjectId: number,
    gradingPeriodId: number,
    studentId: number,
  ) {
    const assessmentItems = await this.prisma.assessmentItem.findMany({
      where: {
        sectionSubjectId,
        gradingPeriodId,
        assessmentType: 'PERFORMANCE_TASK',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!assessmentItems.length) {
      throw new NotFoundException('No Perfomance tasks works found.');
    }

    let totalStudentScore = 0;

    let totalHighestPossibleScore = 0;

    const breakdown: AssessmentBreakdownItem[] = [];

    for (const item of assessmentItems) {
      const score = await this.prisma.studentAssessmentScore.findUnique({
        where: {
          assessmentItemId_studentId: {
            assessmentItemId: item.id,
            studentId,
          },
        },
      });

      const studentScore = Number(score?.score ?? 0);

      const highestPossibleScore = Number(item.highestPossibleScore);

      totalStudentScore = studentScore;

      totalHighestPossibleScore = highestPossibleScore;

      breakdown.push({
        assessment: item.name,
        score: studentScore,
        highestPossibleScore,
      });
    }

    const percentageScore =
      totalHighestPossibleScore === 0
        ? 0
        : (totalStudentScore / totalHighestPossibleScore) * 100;

    return {
      category: 'Performance Tasks',
      totalStudentScore,
      totalHighestPossibleScore,
      percentageScore,
      breakdown,
    };
  }

  async getQuarterlyAssessmentPercentage(
    sectionSubjectId: number,
    gradingPeriodId: number,
    studentId: number,
  ) {
    const assessmentItems = await this.prisma.assessmentItem.findMany({
      where: {
        sectionSubjectId,
        gradingPeriodId,
        assessmentType: 'QUARTERLY_ASSESSMENT',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!assessmentItems.length) {
      throw new NotFoundException('No Quarterly assessmnet works found.');
    }

    let totalStudentScore = 0;

    let totalHighestPossibleScore = 0;

    const breakdown: AssessmentBreakdownItem[] = [];

    for (const item of assessmentItems) {
      const score = await this.prisma.studentAssessmentScore.findUnique({
        where: {
          assessmentItemId_studentId: {
            assessmentItemId: item.id,
            studentId,
          },
        },
      });

      const studentScore = Number(score?.score ?? 0);

      const highestPossibleScore = Number(item.highestPossibleScore);

      totalStudentScore = studentScore;

      totalHighestPossibleScore = highestPossibleScore;

      breakdown.push({
        assessment: item.name,
        score: studentScore,
        highestPossibleScore,
      });
    }

    const percentageScore =
      totalHighestPossibleScore === 0
        ? 0
        : (totalStudentScore / totalHighestPossibleScore) * 100;

    return {
      category: 'Quarterly Assessment',
      totalStudentScore,
      totalHighestPossibleScore,
      percentageScore,
      breakdown,
    };
  }

  async getInitialGrades(
    sectionSubjectId: number,
    gradingPeriodId: number,
    studentId: number,
  ) {
    const weight = await this.prisma.assessmentWeight.findUnique({
      where: {
        sectionSubjectId_gradingPeriodId: {
          sectionSubjectId,
          gradingPeriodId,
        },
      },
    });

    if (!weight) {
      throw new NotFoundException('Assessment weight not found.');
    }

    const writtenWorks = await this.getWrittenWorkPercentage(
      sectionSubjectId,
      gradingPeriodId,
      studentId,
    );

    const perfomanceTasks = await this.getPerformanceTasksPercentage(
      sectionSubjectId,
      gradingPeriodId,
      studentId,
    );

    const quarterlyAssessment = await this.getQuarterlyAssessmentPercentage(
      sectionSubjectId,
      gradingPeriodId,
      studentId,
    );

    const writtenWorkWeight = Number(weight.writtenWorkWeight);

    const performanceTaskWeight = Number(weight.performanceTaskWeight);

    const quarterlyAssessmentWeight = Number(weight.quarterlyAssessmentWeight);

    const writtenWorkWeighted =
      (writtenWorks.percentageScore * writtenWorkWeight) / 100;

    const performanceTaskWeighted =
      (perfomanceTasks.percentageScore * performanceTaskWeight) / 100;

    const quarterlyAssessmentWeighted =
      (quarterlyAssessment.percentageScore * quarterlyAssessmentWeight) / 100;

    const initialGrade =
      writtenWorkWeighted +
      performanceTaskWeighted +
      quarterlyAssessmentWeighted;

    return {
      writtenWorksPercentage: writtenWorks.percentageScore,
      writtenWorkWeight,
      writtenWorkWeighted: Number(writtenWorkWeighted.toFixed(2)),

      perfomanceTasksPercentage: perfomanceTasks.percentageScore,
      performanceTaskWeight,
      performanceTaskWeighted: Number(performanceTaskWeighted.toFixed(2)),

      quarterlyAssessmentPercentage: quarterlyAssessment.percentageScore,
      quarterlyAssessmentWeight,
      quarterlyAssessmentWeighted: Number(
        quarterlyAssessmentWeighted.toFixed(2),
      ),

      initialGrade: Number(initialGrade.toFixed(2)),
    };
  }
}
