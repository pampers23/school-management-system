import { Test, TestingModule } from '@nestjs/testing';
import { GradingPeriodsService } from './grading-periods.service';

describe('GradingPeriodsService', () => {
  let service: GradingPeriodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GradingPeriodsService],
    }).compile();

    service = module.get<GradingPeriodsService>(GradingPeriodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
