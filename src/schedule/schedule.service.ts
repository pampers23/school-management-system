import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateScheduleDto) {
    const section = await this.prisma.section.findUnique({
      where: {
        id: dto.sectionId,
      },
    });

    if (!section) {
      throw new NotFoundException('Section not found.');
    }

    const sectionSubject = await this.prisma.sectionSubject.findUnique({
      where: {
        id: dto.sectionSubjectId,
      },
    });

    if (!sectionSubject) {
      throw new NotFoundException('Section subject not found.');
    }

    if (sectionSubject.sectionId !== dto.sectionId) {
      throw new BadRequestException(
        'The section subject does not belong to this section',
      );
    }

    const room = await this.prisma.room.findFirst({
      where: {
        id: dto.roomId,
        isActive: true,
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found.');
    }

    const sectionConflict = await this.prisma.schedule.findFirst({
      where: {
        sectionId: dto.sectionId,
        day: dto.day,
        startTime: {
          lt: dto.endTime,
        },
        endTime: {
          gt: dto.startTime,
        },
      },
    });

    if (sectionConflict) {
      throw new BadRequestException(
        'The section already schedule during this time.',
      );
    }

    return this.prisma.schedule.create({
      data: {
        sectionId: dto.sectionId,
        roomId: dto.roomId,
        sectionSubjectId: dto.sectionSubjectId,
        day: dto.day,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
      include: {
        section: true,
        room: true,
        sectionSubject: {
          include: {
            subject: true,
          },
        },
      },
    });
  }
}
