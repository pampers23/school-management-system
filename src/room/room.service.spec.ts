import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { PrismaService } from '../prisma/prisma.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('RoomService', () => {
  let service: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        {
          provide: PrismaService,
          useValue: {
            room: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
