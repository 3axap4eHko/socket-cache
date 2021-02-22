import { IncomingMessage, OutgoingMessage } from 'http';
import Event from 'evnty';

function toBuffer(data: any) {
  if (data instanceof Buffer) {
    return data;
  }
  if (data !== null && typeof data !== 'undefined') {
    return Buffer.from(data.toString());
  }
  return Buffer.from([]);
}

export default function intercept(req: IncomingMessage, res: OutgoingMessage): any {
  const chunks: Buffer[] = [];
  const done = Event();

  const _socketWrite = res.socket.write.bind(res.socket);
  res.socket.write = (...args: any[]) => {
    const buffer = toBuffer(args[0]);
    chunks.push(buffer);
    return _socketWrite(...args);
  };

  const _socketEnd = res.socket.end.bind(res.socket);
  res.socket.end = (...args: any[]) => {
    const buffer = toBuffer(args[0]);
    chunks.push(buffer);
    return _socketEnd(...args);
  };

  req.once('close', () => done(chunks));

  return done;
}
