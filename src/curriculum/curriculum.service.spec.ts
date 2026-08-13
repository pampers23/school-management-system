import { Test, TestingModule } from '@nestjs/testing';
import { CurriculumService } from './curriculum.service';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('CurriculumService', () => {
  let service: CurriculumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurriculumService],
    }).compile();

    service = module.get<CurriculumService>(CurriculumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
