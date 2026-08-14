import { Test, TestingModule } from '@nestjs/testing';
import { ExcelService } from './excel.service';
import { PrismaService } from '../prisma/prisma.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('ExcelService', () => {
  let service: ExcelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExcelService,
        {
          provide: PrismaService,
          useValue: {
            sectionSubject: {
              findUnique: jest.fn(),
            },
            gradingPeriod: {
              findUnique: jest.fn(),
            },
            grade: {
              upsert: jest.fn(),
              findMany: jest.fn(),
            },
            enrollment: {
              findMany: jest.fn(),
            },
            student: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ExcelService>(ExcelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
