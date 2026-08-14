import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { PrismaService } from '../prisma/prisma.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('ScheduleService', () => {
  let service: ScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: PrismaService,
          useValue: {
            section: {
              findUnique: jest.fn(),
            },
            sectionSubject: {
              findUnique: jest.fn(),
            },
            room: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
            },
            schedule: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            teacherAssignment: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
