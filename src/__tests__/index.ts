import * as index from '../index';
import createCache from '../createCache';
import intercept from '../intercept';

describe('Module test suite', () => {
  it('Should export modules', () => {
    expect(index.intercept).toBe(intercept);
    expect(index.cache).toBe(createCache);
  });
});
