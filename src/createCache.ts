import { IncomingMessage, OutgoingMessage } from 'http';
import intercept from './intercept.js';

export interface CacheOptions<T> {
  mapToKey: (req: IncomingMessage) => Promise<T> | T;
  get: (key: T) => Promise<null | Buffer[]> | null | Buffer[];
  set: (key: T, value: Buffer[]) => Promise<void> | void;
}

export default function createCache<T>(options: CacheOptions<T>) {
  return async (req: IncomingMessage, res: OutgoingMessage) => {
    const key = await options.mapToKey(req);

    const chunks: (string | Uint8Array)[] | null = await options.get(key);
    if (chunks) {
      for (const chunk of chunks.slice(0, -1)) {
        await new Promise(resolve => res.socket?.write(chunk, resolve))
      }
      const chunk = chunks[chunks.length - 1];
      await new Promise<void>(resolve => res.socket?.end(chunk, resolve));
      return true;
    }

    const interceptor = intercept(req, res);
    interceptor.on(async (chunks: Buffer[]) => {
      await options.set(key, chunks);
    });

    return false;
  }
}
