import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';

@Injectable()
export class SchoolYearService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSchoolYearDto) {
    if (dto.startYear >= dto.endYear) {
      throw new BadRequestException('Start year must be less that end year.');
    }

    const existing = await this.prisma.schoolYear.findUnique({
      where: {
        startYear_endYear: {
          startYear: dto.startYear,
          endYear: dto.endYear,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('School year already exists.');
    }

    if (dto.isCurrent) {
      await this.prisma.schoolYear.updateMany({
        data: {
          isCurrent: false,
        },
      });
    }

    return this.prisma.schoolYear.create({ data: dto });
  }

  findAll() {
    return this.prisma.schoolYear.findMany({
      orderBy: {
        startYear: 'desc',
      },
    });
  }

  async findCurrent() {
    return this.prisma.schoolYear.findFirst({
      where: {
        isCurrent: true,
      },
    });
  }

  async findOne(id: number) {
    const schoolYear = await this.prisma.schoolYear.findUnique({
      where: { id },
    });

    if (!schoolYear) {
      throw new NotFoundException('School year not found.');
    }

    return schoolYear;
  }

  async update(id: number, dto: UpdateSchoolYearDto) {
    await this.findOne(id);

    if (dto.startYear && dto.endYear && dto.startYear >= dto.endYear) {
      await this.prisma.schoolYear.updateMany({
        data: {
          isCurrent: false,
        },
      });
    }

    return this.prisma.schoolYear.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    const schoolYear = await this.findOne(id);

    if (schoolYear.isCurrent) {
      throw new BadRequestException('Cannot delete the current school year.');
    }

    await this.prisma.schoolYear.delete({
      where: { id },
    });

    return { message: 'School year deleted successfully.' };
  }
}
