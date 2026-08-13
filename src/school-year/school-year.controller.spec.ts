import { Test, TestingModule } from '@nestjs/testing';
import { SchoolYearController } from './school-year.controller';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('SchoolYearController', () => {
  let controller: SchoolYearController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolYearController],
    }).compile();

    controller = module.get<SchoolYearController>(SchoolYearController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
