import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
}
