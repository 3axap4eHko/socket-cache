const { strict: assert } = require('node:assert');
const { cache, intercept } = require('../../build/index.cjs');

assert(typeof cache === 'function');
assert(typeof intercept === 'function');

console.log('CJS import test passed');
