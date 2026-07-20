import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSectionDto) {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: {
        id: dto.curriculumId,
      },
      include: {
        curriculumSubjects: true,
      },
    });

    if (!curriculum) {
      throw new NotFoundException('Curriculum not found');
    }

    const existing = await this.prisma.section.findFirst({
      where: {
        name: dto.name,
        curriculumId: dto.curriculumId,
      },
    });

    if (existing) {
      throw new BadRequestException('Section already exists.');
    }

    return this.prisma.$transaction(async (tx) => {
      const section = await tx.section.create({
        data: {
          name: dto.name,
          curriculumId: dto.curriculumId,
          capacity: dto.capacity ?? 40,
        },
      });

      await tx.sectionSubject.createMany({
        data: curriculum.curriculumSubjects.map((item) => ({
          sectionId: section.id,
          subjectId: item.subjectId,
        })),
      });

      return tx.section.findUnique({
        where: {
          id: section.id,
        },
        include: {
          curriculum: true,
          sectionSubjects: {
            include: {
              subject: true,
            },
          },
        },
      });
    });
  }

  async findAll() {
    return this.prisma.section.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const section = await this.prisma.section.findUnique({
      where: { id },
      include: {
        curriculum: true,
        sectionSubjects: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!section || !section.isActive) {
      throw new NotFoundException('Section not found');
    }

    return section;
  }

  async update(id: number, dto: UpdateSectionDto) {
    await this.findOne(id);

    if (dto.curriculumId) {
      const existing = await this.prisma.section.findFirst({
        where: { id },
      });

      if (existing) {
        throw new BadRequestException('Section is not found.');
      }

      return this.prisma.section.update({
        where: { id },
        data: dto,
      });
    }
  }

  async remove(id: number) {
    const section = await this.findOne(id);

    if (!section.isActive) {
      throw new BadRequestException('Section is already deleted.');
    }

    await this.prisma.section.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Section deleted successfully.' };
  }
}
