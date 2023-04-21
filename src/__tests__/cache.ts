import { createServer } from 'http';
import supertest from 'supertest';
import createCache from '../createCache';

describe('Cache test suite', () => {
  it('Should intercept empty response', async () => {
    const storage = new Map();

    const caching = createCache({
      mapToKey: req => req.url || 'test',
      get: key => storage.has(key) ? storage.get(key) : null,
      set: (key, value) => { storage.set(key, value) },
    });


    storage.clear();
    const router = jest.fn((res) => res.end('test'));
    const server = createServer(async (req, res) => {
      const cached = await caching(req, res);
      if (!cached) {
        router(res);
      }
    });

    await supertest(server)
    .get('/');

    await supertest(server)
    .get('/');

    expect(router).toHaveBeenCalledTimes(1);
  });

  it('Should create cache with expiration', async () => {
    interface CacheKey {
      id: string | undefined;
      expiresIn: number;
    }

    interface CacheValue {
      value: Buffer[];
      expiresAt: number;
    }

    const storage = new Map<string, CacheValue>();

    const caching = createCache<CacheKey>({
      mapToKey: ({ url }) => ({
        id: url,
        expiresIn: 1000,
      }),
      set(key, value) {
        if (key.id) {
          storage.set(key.id, {
            value,
            expiresAt: Date.now() + key.expiresIn
          });
        }
      },
      get(key) {
        if (key.id && storage.has(key.id)) {
          const { value, expiresAt } = storage.get(key.id) as CacheValue;
          if (expiresAt > Date.now()) {
            return value;
          }
          storage.delete(key.id);
        }
        return null;
      }
    });

    const router = jest.fn((res) => res.end('test'));
    const server = createServer(async (req, res) => {
      const cached = await caching(req, res);
      if (!cached) {
        router(res);
      }
    });

    await supertest(server)
    .get('/');

    await supertest(server)
    .get('/');

    expect(router).toHaveBeenCalledTimes(1);

  });
});
