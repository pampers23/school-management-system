import { Test, TestingModule } from '@nestjs/testing';
import { GradesController } from './grades.controller';
import { GradesService } from './grades.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('GradesController', () => {
  let controller: GradesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GradesController],
      providers: [
        {
          provide: GradesService,
          useValue: {
            getPercentageScore: jest.fn(),
            getWrittenWorkPercentage: jest.fn(),
            getPerformanceTasksPercentage: jest.fn(),
            getQuarterlyAssessmentPercentage: jest.fn(),
            getInitialGrades: jest.fn(),
            getQuarterGrade: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GradesController>(GradesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
