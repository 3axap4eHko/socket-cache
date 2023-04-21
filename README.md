# Socket Cache

Blazing fast HTTP network socket caching library for NodeJS

[![Coverage Status][codecov-image]][codecov-url]
[![Github Build Status][github-image]][github-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Snyk][snyk-image]][snyk-url]

## Usage

Create inmemory cache
```typescript
// cache.js
import { cache } from 'socket-cache';

interface CacheKey {
  id: string | undefined;
  expiresIn: number;
}

interface CacheValue {
  value: Buffer[];
  expiresAt: number;
}

const storage = new Map<string, CacheValue>();

export default createCache<CacheKey>({
  mapToKey: ({ url }) => ({ id: url, expiresIn: 1000 }),
  set(key, value) {
    if (key.id) {
      const expiresAt = Date.now() + key.expiresIn;
      storage.set(key.id, { value, expiresAt });
    }
  },
  get(key) {
    if (key.id && storage.has(key.id)) {
      const { value, expiresAt } = storage.get(key.id);
      if (expiresAt > Date.now()) {
        return value;
      }
      storage.delete(key.id);
    }
    return null;
  }
});
```

Cached server
```typescript
import http from 'http';
import cache from './cache';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  const isCached = await cache(req, res);
  if (!isCached) {
    next();
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Hello World ${new Date()}`);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

## License
License [The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2023 Ivan Zakharchanka

[npm-url]: https://www.npmjs.com/package/socket-cache
[downloads-image]: https://img.shields.io/npm/dw/socket-cache.svg?maxAge=43200
[npm-image]: https://img.shields.io/npm/v/socket-cache.svg?maxAge=43200
[github-url]: https://github.com/3axap4eHko/socket-cache/actions/workflows/build.yml
[github-image]: https://github.com/3axap4eHko/socket-cache/actions/workflows/build.yml/badge.svg?branch=master
[codecov-url]: https://codecov.io/gh/3axap4eHko/socket-cache
[codecov-image]: https://codecov.io/gh/3axap4eHko/socket-cache/branch/master/graph/badge.svg?maxAge=43200
[snyk-url]: https://snyk.io/test/npm/socket-cache/latest
[snyk-image]: https://img.shields.io/snyk/vulnerabilities/github/3axap4eHko/socket-cache.svg?maxAge=43200
