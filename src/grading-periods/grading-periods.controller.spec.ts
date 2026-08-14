import { Test, TestingModule } from '@nestjs/testing';
import { GradingPeriodsController } from './grading-periods.controller';
import { GradingPeriodsService } from './grading-periods.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('GradingPeriodsController', () => {
  let controller: GradingPeriodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GradingPeriodsController],
      providers: [
        {
          provide: GradingPeriodsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GradingPeriodsController>(GradingPeriodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
