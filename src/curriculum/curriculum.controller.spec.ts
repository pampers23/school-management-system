import { Test, TestingModule } from '@nestjs/testing';
import { CurriculumController } from './curriculum.controller';
import { CurriculumService } from './curriculum.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

describe('CurriculumController', () => {
  let controller: CurriculumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurriculumController],
      providers: [
        {
          provide: CurriculumService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            addSubjects: jest.fn(),
            getSubjects: jest.fn(),
            removeSubject: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CurriculumController>(CurriculumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
