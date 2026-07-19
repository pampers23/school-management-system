import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { AddSubjectDto } from './dto/add-subject.dto';

@Injectable()
export class CurriculumService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCurriculumDto) {
    const schoolYear = await this.prisma.schoolYear.findUnique({
      where: {
        id: dto.schoolYearId,
      },
    });

    if (!schoolYear) {
      throw new NotFoundException('School year not found');
    }

    if (dto.gradeLevel < 7 || dto.gradeLevel > 12) {
      throw new BadRequestException('Grade level must be between 7 and 12');
    }

    if (dto.gradeLevel <= 10) {
      dto.track = undefined;
      dto.strand = undefined;
    }

    if (dto.gradeLevel >= 11) {
      if (!dto.track || !dto.strand) {
        throw new BadRequestException('Track and Strand are required for SHS.');
      }
    }

    const existing = await this.prisma.curriculum.findFirst({
      where: {
        gradeLevel: dto.gradeLevel,
        schoolYearId: dto.schoolYearId,
        track: dto.track,
        strand: dto.strand,
      },
    });

    if (existing) {
      throw new BadRequestException('Curriculum already exists.');
    }

    return this.prisma.curriculum.create({ data: dto });
  }

  async findAll() {
    return this.prisma.curriculum.findMany({
      include: {
        schoolYear: true,
      },
      orderBy: [
        {
          gradeLevel: 'asc',
        },
        {
          curriculumName: 'asc',
        },
      ],
    });
  }

  async findOne(id: number) {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id },
      include: {
        schoolYear: true,
        curriculumSubjects: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!curriculum) {
      throw new NotFoundException('Curriculum not found.');
    }

    return curriculum;
  }

  async update(id: number, dto: UpdateCurriculumDto) {
    const curriculum = await this.prisma.curriculum.findUnique({
      where: { id },
    });

    if (!curriculum) {
      throw new NotFoundException('School year not found');
    }

    const data = {
      curriculumName: dto.curriculumName ?? curriculum.curriculumName,
      gradeLevel: dto.gradeLevel ?? curriculum.gradeLevel,
      schoolYearId: dto.schoolYearId ?? curriculum.schoolYearId,
      track: dto.track ?? curriculum.track,
      strand: dto.strand ?? curriculum.strand,
    };

    const schoolYear = await this.prisma.schoolYear.findUnique({
      where: { id: data.schoolYearId },
    });
    if (!schoolYear) {
      throw new NotFoundException('School year not found');
    }

    if (data.gradeLevel < 7 || data.gradeLevel > 12) {
      throw new BadRequestException('Grade level must be between 7 and 12');
    }

    if (data.gradeLevel <= 10) {
      dto.track = undefined;
      dto.strand = undefined;
    }

    if (data.gradeLevel >= 11) {
      if (!data.track || !data.strand) {
        throw new BadRequestException('Track and Strand are required for SHS.');
      }
    }

    const existing = await this.prisma.curriculum.findFirst({
      where: {
        id: {
          not: id,
        },
        gradeLevel: data.gradeLevel,
        schoolYearId: data.schoolYearId,
        track: data.track,
        strand: data.strand,
      },
    });

    if (existing) {
      throw new BadRequestException('Curriculum already exists.');
    }

    return this.prisma.curriculum.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.curriculum.delete({
      where: { id },
    });
  }

  async addSubjects(curriculumId: number, dto: AddSubjectDto) {
    await this.findOne(curriculumId);

    const subjects = await this.prisma.subject.findMany({
      where: {
        id: {
          in: dto.subjectIds,
        },
      },
    });

    if (subjects.length !== dto.subjectIds.length) {
      throw new NotFoundException('One or more subjects do not exists.');
    }

    await this.prisma.curriculumSubject.createMany({
      data: dto.subjectIds.map((subjectId) => ({
        curriculumId,
        subjectId,
      })),
      skipDuplicates: true,
    });

    return this.getSubjects(curriculumId);
  }

  async getSubjects(curriculumId: number) {
    return this.prisma.curriculum.findUnique({
      where: {
        id: curriculumId,
      },
      include: {
        curriculumSubjects: {
          include: {
            subject: true,
          },
        },
      },
    });
  }

  async removeSubject(curriculumId: number, subjectId: number) {
    await this.prisma.curriculumSubject.delete({
      where: {
        curriculumId_subjectId: {
          curriculumId,
          subjectId,
        },
      },
    });

    return { message: 'Subject moved successfully.' };
  }
}
