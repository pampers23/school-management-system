import { Test, TestingModule } from '@nestjs/testing';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('ExcelController', () => {
  let controller: ExcelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExcelController],
      providers: [
        {
          provide: ExcelService,
          useValue: {
            validateQuarterGrades: jest.fn(),
            importQuarterGrades: jest.fn(),
            debugEnrollment: jest.fn(),
            activateEnrollment: jest.fn(),
            getGrades: jest.fn(),
            getStudentQuarterlyAverage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ExcelController>(ExcelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
