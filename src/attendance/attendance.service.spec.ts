import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { PrismaService } from '../prisma/prisma.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('AttendanceService', () => {
  let service: AttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: PrismaService,
          useValue: {
            teacher: {
              findUnique: jest.fn(),
            },
            sectionSubject: {
              findUnique: jest.fn(),
            },
            schoolYear: {
              findUnique: jest.fn(),
            },
            teacherAssignment: {
              findFirst: jest.fn(),
            },
            attendanceSession: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
            },
            enrollment: {
              findMany: jest.fn(),
            },
            attendance: {
              findMany: jest.fn(),
              create: jest.fn(),
            },
            student: {
              findUnique: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
