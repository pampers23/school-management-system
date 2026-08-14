import { Test, TestingModule } from '@nestjs/testing';
import { SchoolYearController } from './school-year.controller';
import { SchoolYearService } from './school-year.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('SchoolYearController', () => {
  let controller: SchoolYearController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolYearController],
      providers: [
        {
          provide: SchoolYearService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findCurrent: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SchoolYearController>(SchoolYearController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
