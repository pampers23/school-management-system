import { Test, TestingModule } from '@nestjs/testing';
import { GradingPeriodsController } from './grading-periods.controller';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('GradingPeriodsController', () => {
  let controller: GradingPeriodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GradingPeriodsController],
    }).compile();

    controller = module.get<GradingPeriodsController>(GradingPeriodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
