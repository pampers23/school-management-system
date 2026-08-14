import { Test, TestingModule } from '@nestjs/testing';
import { GradingPeriodsService } from './grading-periods.service';
import { PrismaService } from '../prisma/prisma.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('GradingPeriodsService', () => {
  let service: GradingPeriodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GradingPeriodsService,
        {
          provide: PrismaService,
          useValue: {
            schoolYear: {
              findUnique: jest.fn(),
            },
            gradingPeriod: {
              findUnique: jest.fn(),
              updateMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<GradingPeriodsService>(GradingPeriodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
