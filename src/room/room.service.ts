import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRoomDto) {
    const existing = await this.prisma.room.findFirst({
      where: {
        name: dto.name,
        building: dto.building,
        isActive: true,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'A room with this name already exists in this building.',
      );
    }

    return this.prisma.room.create({
      data: {
        name: dto.name,
        building: dto.building,
      },
    });
  }

  async findAll() {
    return this.prisma.room.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        {
          building: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    });
  }

  async findOne(id: number) {
    const room = await this.prisma.room.findFirst({
      where: {
        id,
        isActive: true,
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.room.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    return { message: 'Room deleted successfully.' };
  }
}
