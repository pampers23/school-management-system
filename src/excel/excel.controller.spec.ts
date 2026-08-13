import { Test, TestingModule } from '@nestjs/testing';
import { ExcelController } from './excel.controller';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('ExcelController', () => {
  let controller: ExcelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExcelController],
    }).compile();

    controller = module.get<ExcelController>(ExcelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
