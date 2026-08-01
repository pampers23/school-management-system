import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentWeightService } from './assessment-weight.service';

describe('AssessmentWeightService', () => {
  let service: AssessmentWeightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssessmentWeightService],
    }).compile();

    service = module.get<AssessmentWeightService>(AssessmentWeightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
