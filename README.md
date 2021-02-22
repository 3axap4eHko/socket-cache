# Socket Cache

Blazing fast socket caching library

[![Coverage Status][codecov-image]][codecov-url]
[![Github Build Status][github-image]][github-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Snyk][snyk-image]][snyk-url]

## Usage

Create a cache
```typescript
// cache.js
import { cache } from 'socket-cache';

const storage = new Map();

export default cache({
  mapToKey: (req) => req.url,
  get: (key) => storage.has(key) ? storage.get(key) : null,
  set: (key, value) => storage.set(key, value),
});
```

Caching middleware
```typescript
import cache from './cache';

export default async function (req, res, next) {
  const isCached = await cache(req, res);
  if (!isCached) {
    next();
  }
}
```

## License
License [The MIT License](http://opensource.org/licenses/MIT)
Copyright (c) 2021 Ivan Zakharchanka

[npm-url]: https://www.npmjs.com/package/socket-cache
[downloads-image]: https://img.shields.io/npm/dw/socket-cache.svg?maxAge=43200
[npm-image]: https://img.shields.io/npm/v/socket-cache.svg?maxAge=43200
[github-url]: https://github.com/3axap4eHko/socket-cache/actions
[github-image]: https://github.com/3axap4eHko/socket-cache/workflows/Build%20Package/badge.svg?branch=master
[codecov-url]: https://codecov.io/gh/3axap4eHko/socket-cache
[codecov-image]: https://codecov.io/gh/3axap4eHko/socket-cache/branch/master/graph/badge.svg?maxAge=43200
[snyk-url]: https://snyk.io/test/npm/socket-cache/latest
[snyk-image]: https://img.shields.io/snyk/vulnerabilities/github/3axap4eHko/socket-cache.svg?maxAge=43200
