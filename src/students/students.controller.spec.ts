import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('StudentsController', () => {
  let controller: StudentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
