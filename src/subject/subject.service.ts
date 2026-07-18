import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSubjectDto) {
    const existing = await this.prisma.subject.findFirst({
      where: {
        OR: [{ code: dto.code }, { name: dto.name }],
      },
    });

    if (existing) {
      throw new BadRequestException('Subject code or name is already exists.');
    }

    return this.prisma.subject.create({ data: dto });
  }

  async findAll() {
    return this.prisma.subject.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return subject;
  }

  async update(id: number, dto: UpdateSubjectDto) {
    await this.findOne(id);

    if (dto.code || dto.name) {
      const existing = await this.prisma.subject.findFirst({
        where: {
          id: {
            not: id,
          },
          OR: [
            dto.code ? { code: dto.code } : {},
            dto.name ? { name: dto.name } : {},
          ],
        },
      });

      if (existing) {
        throw new BadRequestException('Subject code or name already exists.');
      }
    }

    return this.prisma.subject.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.subject.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Subject deleted successfully' };
  }
}
