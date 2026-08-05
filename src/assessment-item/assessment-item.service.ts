import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssessmentItemDto } from './dto/create-assessment-item.dto';

@Injectable()
export class AssessmentItemService {
  constructor(private prisma: PrismaService) {}

  async createAssessmentItem(dto: CreateAssessmentItemDto) {
    const sectionSubject = await this.prisma.sectionSubject.findUnique({
      where: {
        id: dto.sectionSubjectId,
      },
    });

    if (!sectionSubject) {
      throw new NotFoundException('Section subject not found');
    }

    const gradingPeriod = await this.prisma.gradingPeriod.findUnique({
      where: {
        id: dto.gradingPeriodId,
      },
    });

    if (!gradingPeriod) {
      throw new NotFoundException('Grading period not found');
    }

    const assessmentWeight = await this.prisma.assessmentWeight.findUnique({
      where: {
        sectionSubjectId_gradingPeriodId: {
          sectionSubjectId: dto.sectionSubjectId,
          gradingPeriodId: dto.gradingPeriodId,
        },
      },
    });

    if (!assessmentWeight) {
      throw new BadRequestException(
        'Assessment weight must be configured first.',
      );
    }

    const existing = await this.prisma.assessmentItem.findFirst({
      where: {
        sectionSubjectId: dto.sectionSubjectId,
        gradingPeriodId: dto.gradingPeriodId,
        name: dto.name,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'An assessment item with the same name already exists for this section subject and grading period.',
      );
    }

    return this.prisma.assessmentItem.create({
      data: dto,
      include: {
        sectionSubject: {
          include: {
            subject: true,
            section: true,
          },
        },
        gradingPeriod: true,
      },
    });
  }

  async deleteAssessmentItem(userId: number, assessmentItemId: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const assessmentItem = await this.prisma.assessmentItem.findUnique({
      where: { id: assessmentItemId },
      include: { sectionSubject: true },
    });

    if (!assessmentItem) {
      throw new NotFoundException('Assessment item not found.');
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

    const scoreCount = await this.prisma.studentAssessmentScore.count({
      where: { assessmentItemId },
    });

    if (scoreCount > 0) {
      throw new BadRequestException(
        'Cannot delete assessment item because student scores already exisit.',
      );
    }

    await this.prisma.assessmentItem.delete({
      where: { id: assessmentItemId },
    });

    return { message: 'Assessment Item deleted successfully.' };
  }
}
