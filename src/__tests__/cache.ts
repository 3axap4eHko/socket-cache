import { createServer } from 'http';
import supertest from 'supertest';
import cache from '../cache';

const storage = new Map();

const caching = cache({
  mapToKey: req => req.url,
  get: key => storage.has(key) ? storage.get(key) : null,
  set: (key, value) => { storage.set(key, value) },
});

describe('Cache test suite', () => {
  it('Should intercept empty response', async () => {
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
});
