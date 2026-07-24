import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateScheduleDto) {
    // 1. Validate Section
    const section = await this.prisma.section.findUnique({
      where: {
        id: dto.sectionId,
      },
    });

    if (!section) {
      throw new NotFoundException('Section not found.');
    }

    // 2. Validate Section Subject
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
        'The section subject does not belong to this section.',
      );
    }

    // 3. Validate Room
    const room = await this.prisma.room.findFirst({
      where: {
        id: dto.roomId,
        isActive: true,
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found.');
    }

    // 4. Room Conflict
    const roomConflict = await this.prisma.schedule.findFirst({
      where: {
        roomId: dto.roomId,
        day: dto.day,
        startTime: {
          lt: dto.endTime,
        },
        endTime: {
          gt: dto.startTime,
        },
      },
    });

    if (roomConflict) {
      throw new BadRequestException(
        'The room already has a schedule during this time.',
      );
    }

    // 5. Section Conflict
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
        'The section already has a schedule during this time.',
      );
    }

    // 6. Teacher Conflict
    const teacherAssignment = await this.prisma.teacherAssignment.findUnique({
      where: {
        sectionSubjectId: dto.sectionSubjectId,
      },
    });

    if (teacherAssignment) {
      const teacherConflict = await this.prisma.schedule.findFirst({
        where: {
          day: dto.day,
          startTime: {
            lt: dto.endTime,
          },
          endTime: {
            gt: dto.startTime,
          },
          sectionSubject: {
            teacherAssignment: {
              teacherId: teacherAssignment.teacherId,
            },
          },
        },
      });

      if (teacherConflict) {
        throw new BadRequestException(
          'The teacher already has a schedule during this time.',
        );
      }
    }

    // 7. Create Schedule
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

  async findAll() {
    return this.prisma.schedule.findMany({
      orderBy: [
        {
          day: 'asc',
        },
        {
          startTime: 'asc',
        },
      ],
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

  async findOne(id: number) {
    const schedule = await this.prisma.schedule.findUnique({
      where: {
        id,
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

    if (!schedule) {
      throw new NotFoundException('Schedule not found.');
    }

    return schedule;
  }

  async update(id: number, dto: UpdateScheduleDto) {
    const existingSchedule = await this.findOne(id);

    const sectionId = dto.sectionId ?? existingSchedule.sectionId;
    const roomId = dto.roomId ?? existingSchedule.roomId;
    const sectionSubjectId =
      dto.sectionSubjectId ?? existingSchedule.sectionSubjectId;
    const day = dto.day ?? existingSchedule.day;

    const startTime = dto.startTime ?? existingSchedule.startTime;

    const endTime = dto.endTime ?? existingSchedule.endTime;

    const section = await this.prisma.section.findUnique({
      where: {
        id: sectionId,
      },
    });

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    const room = await this.prisma.room.findUnique({
      where: {
        id: roomId,
        isActive: true,
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found.');
    }

    const sectionSubject = await this.prisma.sectionSubject.findUnique({
      where: {
        id: sectionSubjectId,
      },
    });

    if (!sectionSubject) {
      throw new NotFoundException('Section subject not found.');
    }

    if (sectionSubject.sectionId !== sectionId) {
      throw new BadRequestException(
        'The section subject does not belong to this section',
      );
    }

    const teacherAssignment = await this.prisma.teacherAssignment.findUnique({
      where: {
        sectionSubjectId: dto.sectionSubjectId,
      },
    });

    if (teacherAssignment) {
      const teacherConflict = await this.prisma.schedule.findFirst({
        where: {
          day: dto.day,
          startTime: {
            lt: dto.endTime,
          },
          endTime: {
            gt: dto.startTime,
          },
          sectionSubject: {
            teacherAssignment: {
              teacherId: teacherAssignment.teacherId,
            },
          },
        },
      });

      if (teacherConflict) {
        throw new BadRequestException(
          'The teacher already has a schedule during this time.',
        );
      }
    }

    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time.');
    }

    const roomConflict = await this.prisma.schedule.findFirst({
      where: {
        roomId: dto.roomId,
        day: dto.day,
        startTime: {
          lt: dto.endTime,
        },
        endTime: {
          gt: dto.startTime,
        },
      },
    });

    if (roomConflict) {
      throw new BadRequestException(
        'The room is already occupied during this time.',
      );
    }

    const sectionConflict = await this.prisma.schedule.findFirst({
      where: {
        id: {
          not: id,
        },
        sectionId,
        day,
        startTime: {
          lt: startTime,
        },
        endTime: {
          gt: endTime,
        },
      },
    });

    if (sectionConflict) {
      throw new BadRequestException(
        'The section already has a schedule during this time.',
      );
    }

    return this.prisma.schedule.update({
      where: {
        id,
      },
      data: {
        sectionId,
        roomId,
        sectionSubjectId,
        day,
        startTime,
        endTime,
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

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.schedule.delete({
      where: { id },
    });

    return { message: 'Schedule deleted successfully' };
  }
}
