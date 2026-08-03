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
}
