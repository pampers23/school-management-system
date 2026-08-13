import { AuthGuard } from './auth.guard';
import { describe, expect, it } from '@jest/globals';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new AuthGuard()).toBeDefined();
  });
});
