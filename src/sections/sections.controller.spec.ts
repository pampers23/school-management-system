import { Test, TestingModule } from '@nestjs/testing';
import { SectionsController } from './sections.controller';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('SectionsController', () => {
  let controller: SectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SectionsController],
    }).compile();

    controller = module.get<SectionsController>(SectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
