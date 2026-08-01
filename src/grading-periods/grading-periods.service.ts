import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGradingPeriodDto } from './dto/create-grading-period.dto';

@Injectable()
export class GradingPeriodsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGradingPeriodDto) {
    const schoolYear = await this.prisma.schoolYear.findUnique({
      where: {
        id: dto.schoolYearId,
      },
    });

    if (!schoolYear) {
      throw new NotFoundException('School year not found.');
    }

    const existing = await this.prisma.gradingPeriod.findUnique({
      where: {
        schoolYearId_quarter: {
          schoolYearId: dto.schoolYearId,
          quarter: dto.quarter,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Grading period already exists.');
    }

    if (dto.isCurrent) {
      await this.prisma.gradingPeriod.updateMany({
        where: {
          schoolYearId: dto.schoolYearId,
          isCurrent: true,
        },
        data: {
          isCurrent: false,
        },
      });
    }

    return this.prisma.gradingPeriod.create({
      data: {
        name: dto.name,
        quarter: dto.quarter,
        schoolYearId: dto.schoolYearId,
        isCurrent: dto.isCurrent ?? false,
        isOpen: dto.isOpen ?? true,
      },
      include: {
        schoolYear: true,
      },
    });
  }
}
