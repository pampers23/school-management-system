import { Test, TestingModule } from '@nestjs/testing';
import { ExcelService } from './excel.service';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('ExcelService', () => {
  let service: ExcelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExcelService],
    }).compile();

    service = module.get<ExcelService>(ExcelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
