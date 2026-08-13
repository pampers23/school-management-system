import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('RoomController', () => {
  let controller: RoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
    }).compile();

    controller = module.get<RoomController>(RoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
