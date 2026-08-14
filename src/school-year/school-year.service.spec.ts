import { Test, TestingModule } from '@nestjs/testing';
import { SchoolYearService } from './school-year.service';
import { PrismaService } from '../prisma/prisma.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('SchoolYearService', () => {
  let service: SchoolYearService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolYearService,
        {
          provide: PrismaService,
          useValue: {
            schoolYear: {
              findUnique: jest.fn(),
              updateMany: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SchoolYearService>(SchoolYearService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
