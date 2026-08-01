import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentItemService } from './assessment-item.service';

describe('AssessmentItemService', () => {
  let service: AssessmentItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssessmentItemService],
    }).compile();

    service = module.get<AssessmentItemService>(AssessmentItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
