import { Socket } from 'net';
import { IncomingMessage, OutgoingMessage } from 'http';
import Event from 'evnty';

function toBuffer(data: unknown) {
  if (data instanceof Buffer) {
    return data;
  }
  if (ArrayBuffer.isView(data)) {
    return Buffer.from(data.buffer);
  }
  if (data !== null && typeof data !== 'undefined') {
    return Buffer.from(data.toString());
  }
  return Buffer.from([]);
}

export default function intercept(req: IncomingMessage, res: OutgoingMessage) {
  const chunks: Buffer[] = [];
  const done = Event<[Buffer[]]>();

  if (res.socket) {
    const _socketWrite = res.socket.write.bind(res.socket) as (...args: unknown[]) => boolean;
    res.socket.write = (...args: unknown[]) => {
      const buffer = toBuffer(args[0]);
      chunks.push(buffer);
      return _socketWrite(...args);
    };

    const _socketEnd = res.socket.end.bind(res.socket) as (...args: unknown[]) => Socket;
    res.socket.end = (...args: unknown[]) => {
      const buffer = toBuffer(args[0]);
      chunks.push(buffer);
      return _socketEnd(...args);
    };
  }

  req.once('close', () => done(chunks));

  return done;
}
