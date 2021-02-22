import { createServer } from 'http';
import supertest from 'supertest';
import intercept from '../intercept';

function stringify(chunks: Buffer[]) {
  return chunks.map(chunk => chunk.toString('utf8'));
}

describe('Intercept test suite', () => {
  it('Should intercept empty response', async () => {
    const handler = jest.fn();
    const server = createServer((req, res) => {
      const intercepted = intercept(req, res);
      intercepted.on((chunks: Buffer[]) => handler(stringify(chunks)));
      res.end();
    });

    await supertest(server)
    .get('/');

    expect(handler).toHaveBeenCalledWith(expect.arrayContaining([
      expect.stringContaining('HTTP/1.1 200 OK'),
      expect.stringContaining('Content-Length: 0')
    ]));
  });

  it('Should intercept non empty response', async () => {
    const handler = jest.fn();
    const server = createServer((req, res) => {
      const intercepted = intercept(req, res);
      intercepted.on((chunks: Buffer[]) => handler(stringify(chunks)));
      res.end('test');
    });

    await supertest(server)
    .get('/');

    expect(handler).toHaveBeenCalledWith(expect.arrayContaining([
      expect.stringContaining('HTTP/1.1 200 OK'),
      expect.stringContaining('Content-Length: 4'),
      expect.stringContaining('\r\n\r\ntest'),
    ]));
  });

  it('Should intercept chunked non empty response', async () => {
    const handler = jest.fn();
    const server = createServer(async (req, res) => {
      const intercepted = intercept(req, res);
      intercepted.on((chunks: Buffer[]) => handler(stringify(chunks)));
      await new Promise(resolve => res.write('test', resolve));
      res.end();
    });

    await supertest(server)
    .get('/');

    expect(handler).toHaveBeenCalledWith(expect.arrayContaining([
      expect.stringContaining('HTTP/1.1 200 OK'),
      expect.stringContaining('Transfer-Encoding: chunked'),
      expect.stringContaining('test'),
    ]));
  });
});
