import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssessmentScoreDto } from './dto/create-student-assessment-score.dto';
import { UpdateStudentAssessmentScore } from './dto/update-student-assessment-score';

@Injectable()
export class StudentAssessmentScoreService {
  constructor(private prisma: PrismaService) {}

  async createAssessmentScore(userId: number, dto: CreateAssessmentScoreDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId,
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const assessmentItem = await this.prisma.assessmentItem.findUnique({
      where: {
        id: dto.assessmentItemId,
      },
      include: {
        sectionSubject: true,
      },
    });

    if (!assessmentItem) {
      throw new NotFoundException('Assessment item not found');
    }

    const assignment = await this.prisma.teacherAssignment.findFirst({
      where: {
        teacherId: teacher.id,
        sectionSubjectId: assessmentItem.sectionSubjectId,
      },
    });

    if (!assignment) {
      throw new ForbiddenException(
        'You are not assigned to this section subject',
      );
    }

    const student = await this.prisma.student.findUnique({
      where: {
        id: dto.studentId,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId: student.id,
        sectionId: assessmentItem.sectionSubject.sectionId,
        schoolYearId: assignment.schoolYearId,
        status: 'ENROLLED',
      },
    });

    if (!enrollment) {
      throw new BadRequestException('Student is not enrolled in this section');
    }

    const highestPossibleScore = Number(assessmentItem.highestPossibleScore);

    if (dto.score > highestPossibleScore) {
      throw new BadRequestException(
        `Score cannot exceed the highest possible score of ${highestPossibleScore}`,
      );
    }

    const existingScore = await this.prisma.studentAssessmentScore.findUnique({
      where: {
        assessmentItemId_studentId: {
          assessmentItemId: dto.assessmentItemId,
          studentId: dto.studentId,
        },
      },
    });

    if (existingScore) {
      throw new BadRequestException(
        'Score for this assessment already exists for this student. Please update the existing score instead of creating a new one.',
      );
    }

    return this.prisma.studentAssessmentScore.create({
      data: {
        assessmentItemId: dto.assessmentItemId,
        studentId: dto.studentId,
        score: dto.score,
      },
      include: {
        assessmentItem: {
          include: {
            gradingPeriod: true,
            sectionSubject: {
              include: {
                subject: true,
              },
            },
          },
        },
        student: true,
      },
    });
  }

  async updateAssessmentScore(
    userId: number,
    scoreId: number,
    dto: UpdateStudentAssessmentScore,
  ) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found.');
    }

    const assessmentscore = await this.prisma.studentAssessmentScore.findUnique(
      {
        where: { id: scoreId },
        include: {
          assessmentItem: {
            include: {
              sectionSubject: true,
            },
          },
        },
      },
    );

    if (!assessmentscore) {
      throw new NotFoundException('Assessment score not found');
    }

    const assignment = await this.prisma.teacherAssignment.findFirst({
      where: {
        teacherId: teacher.id,
        sectionSubjectId: assessmentscore.assessmentItem.sectionSubjectId,
      },
    });

    if (!assignment) {
      throw new ForbiddenException(
        'You are not assigned to this section subject',
      );
    }

    if (
      dto.score > Number(assessmentscore.assessmentItem.highestPossibleScore)
    ) {
      throw new BadRequestException(
        `Score cannot exceed the highest possible score of ${Number(assessmentscore.assessmentItem.highestPossibleScore)}`,
      );
    }

    return this.prisma.studentAssessmentScore.update({
      where: { id: scoreId },
      data: { score: dto.score },
      include: {
        assessmentItem: {
          include: {
            gradingPeriod: true,
            sectionSubject: {
              include: {
                subject: true,
              },
            },
          },
        },
        student: true,
      },
    });
  }

  async deleteAssessmentScore(userId: number, scoreId: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const assessmentScore = await this.prisma.studentAssessmentScore.findUnique(
      {
        where: { id: scoreId },
        include: {
          assessmentItem: {
            include: { sectionSubject: true },
          },
        },
      },
    );

    if (!assessmentScore) {
      throw new NotFoundException('Assessment score not found');
    }

    const assignment = await this.prisma.teacherAssignment.findFirst({
      where: {
        teacherId: teacher.id,
        sectionSubjectId: assessmentScore.assessmentItem.sectionSubjectId,
      },
    });

    if (!assignment) {
      throw new ForbiddenException(
        'You are not assigned to this section subject.',
      );
    }

    await this.prisma.studentAssessmentScore.delete({
      where: { id: scoreId },
    });

    return { message: 'Assessment score deleted successfully' };
  }
}
