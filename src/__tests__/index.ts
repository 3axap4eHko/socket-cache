import * as index from '../index';
import cache from '../cache';
import intercept from '../intercept';

describe('Module test suite', () => {
  it('Should export modules', () => {
    expect(index.intercept).toBe(intercept);
    expect(index.cache).toBe(cache);
  });
});
