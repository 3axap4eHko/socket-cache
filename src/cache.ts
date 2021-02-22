import { IncomingMessage, OutgoingMessage } from 'http';
import intercept from './intercept';

export interface CacheOptions {
  mapToKey: (req: IncomingMessage) => Promise<string> | string;
  get: (key: string) => Promise<Buffer[]> | Promise<null>;
  set: (key: string, value: Buffer[]) => Promise<void> | void;
}

export default function cache(options: CacheOptions) {
  return async (req: IncomingMessage, res: OutgoingMessage) => {
    const key = await options.mapToKey(req);

    const chunks: Buffer[] | null = await options.get(key);
    if (chunks) {
      for (const chunk of chunks.slice(0, -1)) {
        await new Promise(resolve => res.socket.write(chunk, resolve))
      }
      const chunk = chunks[chunks.length - 1];
      await new Promise<void>(resolve => res.socket.end(chunk, resolve));
      return true;
    }

    const interceptor = intercept(req, res);
    interceptor.on(async (chunks: Buffer[]) => {
      await options.set(key, chunks);
    });

    return false;
  }
}
