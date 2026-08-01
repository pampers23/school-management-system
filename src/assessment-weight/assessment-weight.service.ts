import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssessmentWeightDto } from './dto/create-assessment-weight.dto';

@Injectable()
export class AssessmentWeightService {
  constructor(private prisma: PrismaService) {}

  async createAssessmentWeight(dto: CreateAssessmentWeightDto) {
    const sectionSubject = await this.prisma.sectionSubject.findUnique({
      where: {
        id: dto.sectionSubjectId,
      },
    });

    if (!sectionSubject) {
      throw new NotFoundException('Section subject not found.');
    }

    const gradingPeriod = await this.prisma.gradingPeriod.findUnique({
      where: {
        id: dto.gradingPeriodId,
      },
    });

    if (!gradingPeriod) {
      throw new NotFoundException('Grading period not found.');
    }

    const total =
      dto.writtenWorkWeight +
      dto.performanceTaskWeight +
      dto.quarterlyAssessmentWeight;

    if (total !== 100) {
      throw new Error('Assessment weights must total exactly 100.');
    }

    const existing = await this.prisma.assessmentWeight.findUnique({
      where: {
        sectionSubjectId_gradingPeriodId: {
          sectionSubjectId: dto.sectionSubjectId,
          gradingPeriodId: dto.gradingPeriodId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Assessment weight for this section subject and grading period already exists.',
      );
    }

    return this.prisma.assessmentWeight.create({
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
